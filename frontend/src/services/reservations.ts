/**
 * Reservations API Service
 * 
 * Handles table reservation API calls
 */

import { apiClient } from './api';

export interface Reservation {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  status?: string;
  created_at?: string;
}

/**
 * Get all reservations
 */
export const getReservations = async () => {
  return apiClient.get<Reservation[]>('/reservations');
};

/**
 * Create new reservation
 */
export const createReservation = async (reservationData: Reservation) => {
  return apiClient.post<Reservation>('/reservations', reservationData);
};
