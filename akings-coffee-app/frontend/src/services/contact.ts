/**
 * Contact API Service
 * 
 * Handles contact form submissions
 */

import { apiClient } from './api';

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: string;
  created_at?: string;
}

/**
 * Get all contact messages
 */
export const getContactMessages = async () => {
  return apiClient.get<ContactMessage[]>('/contact');
};

/**
 * Send contact message
 */
export const sendContactMessage = async (messageData: ContactMessage) => {
  return apiClient.post<ContactMessage>('/contact', messageData);
};
