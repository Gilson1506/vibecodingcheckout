import axios from 'axios';
import { API_URL } from './supabase';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Payment API
export const paymentAPI = {
    createExpressPayment: async (data: {
        customerName: string;
        customerEmail: string;
        customerPhone?: string;
        amountCents: number;
    }) => {
        const response = await api.post('/api/payments/express', data);
        return response.data;
    },

    createReferencePayment: async (data: {
        customerName: string;
        customerEmail: string;
        customerPhone?: string;
        amountCents: number;
    }) => {
        const response = await api.post('/api/payments/reference', data);
        return response.data;
    },

    getPaymentStatus: async (paymentId: string) => {
        const response = await api.get(`/api/payments/${paymentId}/status`);
        return response.data;
    }
};

export default api;
