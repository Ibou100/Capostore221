import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Order, OrderItem, OrderStatus, PaymentMethod, Product } from '../types';
import { generateOrderId } from '../utils/format';

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

  const [quickOrderProduct, setQuickOrderProduct] = useState<{ product: Product; initialSize?: string } | null>(null);
  const [activeTrackingId, setActiveTrackingId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

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

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
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
