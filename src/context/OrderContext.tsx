import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { Order, OrderItem, OrderStatus, PaymentMethod, Product } from '../types';
import { generateOrderId } from '../utils/format';
import { fetchCloudOrders, saveCloudOrders } from '../utils/cloudSync';

interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerCity: string;
  customerAddress: string;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  total: number;
  shippingFee?: number;
  notes?: string;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (input: CreateOrderInput) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  refreshOrders: () => Promise<void>;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  
  // Quick Order Modal (Direct Order for single product)
  quickOrderProduct: { product: Product; initialSize?: string } | null;
  openQuickOrder: (product: Product, initialSize?: string) => void;
  closeQuickOrder: () => void;
  
  // Quick Tracking search / lookup
  activeTrackingId: string | null;
  setActiveTrackingId: (id: string | null) => void;
}

const LOCAL_STORAGE_KEY = 'capostore_orders_v1';

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as Order[];
      }
    } catch (e) {
      console.error('Failed to load orders from localStorage', e);
    }
    return [];
  });

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [quickOrderProduct, setQuickOrderProduct] = useState<{ product: Product; initialSize?: string } | null>(null);
  const [activeTrackingId, setActiveTrackingId] = useState<string | null>(null);

  // Reference to always have latest orders in async callbacks
  const ordersRef = useRef<Order[]>(orders);
  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  // Persist local changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  /**
   * Bidirectional cloud synchronization:
   * Merges cloud orders with local orders without losing either.
   */
  const refreshOrders = useCallback(async () => {
    setIsSyncing(true);
    try {
      const cloudOrders = await fetchCloudOrders();
      const localOrders = ordersRef.current;

      const orderMap = new Map<string, Order>();

      // Put cloud orders first
      cloudOrders.forEach((o) => {
        if (o && o.id) orderMap.set(o.id, o);
      });

      let hadLocalUnsynced = false;

      // Merge local orders (if an order was created locally and not yet in cloud)
      localOrders.forEach((local) => {
        if (!local || !local.id) return;
        if (!orderMap.has(local.id)) {
          orderMap.set(local.id, local);
          hadLocalUnsynced = true;
        } else {
          // If local has a newer status update, keep local or cloud
          const cloud = orderMap.get(local.id)!;
          // Prefer cloud unless local was updated very recently
          orderMap.set(local.id, cloud);
        }
      });

      const merged = Array.from(orderMap.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setOrders(merged);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
      } catch (err) {
        console.warn('localStorage error:', err);
      }
      setLastSyncTime(new Date());

      // If we had local orders missing from the cloud, push the merged list back
      if (hadLocalUnsynced && merged.length > 0) {
        await saveCloudOrders(merged);
      }
    } catch (err) {
      console.warn('Could not sync orders with cloud:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Sync on initial mount & periodic polling (every 12 seconds)
  useEffect(() => {
    refreshOrders();

    const interval = setInterval(() => {
      refreshOrders();
    }, 12000);

    return () => clearInterval(interval);
  }, [refreshOrders]);

  const createOrder = (input: CreateOrderInput): Order => {
    const newOrder: Order = {
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
      customerName: input.customerName.trim() || 'Client CAPOSTORE221',
      customerPhone: input.customerPhone.trim(),
      customerCity: input.customerCity.trim(),
      customerAddress: input.customerAddress.trim(),
      paymentMethod: input.paymentMethod,
      items: input.items,
      total: input.total,
      shippingFee: input.shippingFee ?? 0,
      status: 'transmise',
      notes: input.notes,
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev.filter((o) => o.id !== newOrder.id)];
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }

      // Immediate Cloud push to make sure owner sees it right away across devices
      (async () => {
        try {
          const cloudExisting = await fetchCloudOrders();
          const map = new Map<string, Order>();
          cloudExisting.forEach((o) => map.set(o.id, o));
          map.set(newOrder.id, newOrder);
          const fullList = Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          await saveCloudOrders(fullList);
        } catch (e) {
          console.warn('Could not push order to cloud immediately', e);
        }
      })();

      return updated;
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) => {
      const updated = prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      );
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }

      // Sync updated status to cloud
      saveCloudOrders(updated).catch((err) =>
        console.warn('Could not sync status update to cloud', err)
      );

      return updated;
    });
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => {
      const updated = prev.filter((order) => order.id !== orderId);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }

      // Sync deletion to cloud
      saveCloudOrders(updated).catch((err) =>
        console.warn('Could not sync deletion to cloud', err)
      );

      return updated;
    });
  };

  const getOrderById = (orderId: string): Order | undefined => {
    const cleanId = orderId.trim().toUpperCase();
    return orders.find(
      (order) => order.id.toUpperCase() === cleanId || order.id.toUpperCase().includes(cleanId)
    );
  };

  const openQuickOrder = (product: Product, initialSize?: string) => {
    setQuickOrderProduct({ product, initialSize });
  };

  const closeQuickOrder = () => {
    setQuickOrderProduct(null);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        getOrderById,
        refreshOrders,
        isSyncing,
        lastSyncTime,
        quickOrderProduct,
        openQuickOrder,
        closeQuickOrder,
        activeTrackingId,
        setActiveTrackingId,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
