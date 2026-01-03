/**
 * Orders API Service
 * 
 * Handles all order-related API calls
 * This demonstrates DATABASE STATEFULNESS - orders are stored in PostgreSQL
 */

import { apiClient } from './api';

export interface OrderItem {
  product_id: string;
  quantity: number;
  price?: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  items: OrderItem[];
  created_at: string;
}

/**
 * Get all orders (demonstrates database state)
 */
export const getOrders = async () => {
  return apiClient.get<Order[]>('/orders');
};

/**
 * Get single order by ID
 */
export const getOrder = async (id: string) => {
  return apiClient.get<Order>(`/orders/${id}`);
};

/**
 * Create new order
 */
export const createOrder = async (orderData: {
  customer_name: string;
  customer_email: string;
  items: OrderItem[];
}) => {
  return apiClient.post<Order>('/orders', orderData);
};
