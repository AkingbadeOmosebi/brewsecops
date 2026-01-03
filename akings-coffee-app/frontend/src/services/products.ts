/**
 * Products API Service
 * 
 * Handles all product-related API calls
 */

import { apiClient } from './api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  available: boolean;
  created_at: string;
}

/**
 * Get all products
 */
export const getProducts = async (category?: string) => {
  const endpoint = category ? `/products?category=${category}` : '/products';
  return apiClient.get<Product[]>(endpoint);
};

/**
 * Get single product by ID
 */
export const getProduct = async (id: string) => {
  return apiClient.get<Product>(`/products/${id}`);
};
