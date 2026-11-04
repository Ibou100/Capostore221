import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  orders: Order[]; // Complete list (for Admin)
  myOrders: Order[]; // Confidential list for the current client device ONLY
  myOrderIds: string[];
  addOrderToMyOrders: (orderId: string) => void;
  isMyOrder: (orderId: string) => boolean;

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
const MY_ORDER_IDS_KEY = 'capostore_my_order_ids_v1';

export function sanitizeOrder(raw: any): Order | null {
  if (!raw || typeof raw !== 'object' || !raw.id) return null;

  const validStatuses: OrderStatus[] = ['transmise', 'confirmee', 'en_preparation', 'en_livraison', 'livree'];
  const status: OrderStatus = validStatuses.includes(raw.status) ? raw.status : 'transmise';

  const validPayments: PaymentMethod[] = ['wave', 'orange_money', 'especes', 'free_money'];
  const paymentMethod: PaymentMethod = validPayments.includes(raw.paymentMethod) ? raw.paymentMethod : 'wave';

  const rawItems = Array.isArray(raw.items) ? raw.items : [];
  const items: OrderItem[] = rawItems.map((item: any) => ({
    productId: String(item?.productId || ''),
    name: String(item?.name || 'Article CAPOSTORE221'),
    price: typeof item?.price === 'number' && !isNaN(item.price) ? item.price : 5000,
    quantity: typeof item?.quantity === 'number' && item.quantity > 0 ? item.quantity : 1,
    size: item?.size ? String(item.size) : undefined,
    color: item?.color ? String(item.color) : undefined,
    image: String(item?.image || '/products/pantalon-prince-galles.jpg'),
  }));

  return {
    id: String(raw.id),
    createdAt: typeof raw.createdAt === 'string' && raw.createdAt ? raw.createdAt : new Date().toISOString(),
    customerName: String(raw.customerName || raw.customer || 'Client CAPOSTORE221'),
    customerPhone: String(raw.customerPhone || raw.phone || ''),
    customerCity: String(raw.customerCity || raw.city || 'Dakar'),
    customerAddress: String(raw.customerAddress || raw.address || ''),
    paymentMethod,
    items,
    total: typeof raw.total === 'number' && !isNaN(raw.total) ? raw.total : 0,
    shippingFee: typeof raw.shippingFee === 'number' ? raw.shippingFee : 0,
    status,
    notes: raw.notes ? String(raw.notes) : undefined,
  };
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.map(sanitizeOrder).filter((o): o is Order => o !== null);
        }
      }
    } catch (e) {
      console.error('Failed to load orders from localStorage', e);
    }
    return [];
  });

  // Client's private list of order IDs placed on THIS device
  const [myOrderIds, setMyOrderIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(MY_ORDER_IDS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Persist client's private order IDs
  useEffect(() => {
    try {
      localStorage.setItem(MY_ORDER_IDS_KEY, JSON.stringify(myOrderIds));
    } catch (e) {
      console.error(e);
    }
  }, [myOrderIds]);

  const addOrderToMyOrders = useCallback((orderId: string) => {
    const clean = orderId.trim().toUpperCase();
    if (!clean) return;
    setMyOrderIds((prev) => (prev.includes(clean) ? prev : [clean, ...prev]));
  }, []);

  const isMyOrder = useCallback((orderId: string) => {
    const clean = orderId.trim().toUpperCase();
    return myOrderIds.map((id) => id.toUpperCase()).includes(clean);
  }, [myOrderIds]);

  // Confidential orders for the customer on this device
  const myOrders = useMemo(() => {
    return orders.filter((o) => myOrderIds.map((id) => id.toUpperCase()).includes(o.id.toUpperCase()));
  }, [orders, myOrderIds]);

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
   * Bidirectional cloud synchronization
   */
  const refreshOrders = useCallback(async () => {
    setIsSyncing(true);
    try {
      const rawCloudOrders = await fetchCloudOrders();
      const cloudOrders = Array.isArray(rawCloudOrders)
        ? rawCloudOrders.map(sanitizeOrder).filter((o): o is Order => o !== null)
        : [];

      const localOrders = ordersRef.current;
      const orderMap = new Map<string, Order>();

      // Cloud orders
      cloudOrders.forEach((o) => {
        if (o && o.id) orderMap.set(o.id, o);
      });

      let hadLocalUnsynced = false;

      // Local orders
      localOrders.forEach((local) => {
        if (!local || !local.id) return;
        if (!orderMap.has(local.id)) {
          orderMap.set(local.id, local);
          hadLocalUnsynced = true;
        } else {
          const cloud = orderMap.get(local.id)!;
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

    // Immediately record in this client's confidential device order history
    setMyOrderIds((prev) => (prev.includes(newOrder.id) ? prev : [newOrder.id, ...prev]));

    setOrders((prev) => {
      const updated = [newOrder, ...prev.filter((o) => o.id !== newOrder.id)];
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }

      // Immediate Cloud push
      (async () => {
        try {
          const rawCloud = await fetchCloudOrders();
          const cloudExisting = Array.isArray(rawCloud)
            ? rawCloud.map(sanitizeOrder).filter((o): o is Order => o !== null)
            : [];
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
        myOrders,
        myOrderIds,
        addOrderToMyOrders,
        isMyOrder,
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
