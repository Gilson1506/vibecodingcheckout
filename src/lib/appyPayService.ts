import axios from 'axios';

// Get API URL from env or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface AppyPayResponse {
    paymentId: string;
    merchantTransactionId: string;
    appyResponse: {
        responseStatus: {
            status: 'success' | 'pending' | 'error';
            message: string;
            reference?: {
                reference?: string;
                entity?: string;
                amount?: number;
                currency?: string;
                status?: string;
                dueDate?: string;
            };
        };
        [key: string]: any;
    };
}

export interface CreatePaymentPayload {
    userId?: string; // Optional if we handle it via token in future
    courseId?: string;
    amount: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    paymentMethod: 'multicaixa' | 'referencia';
    multicaixaPhone?: string;
}

export async function createAppyPayCharge(payload: CreatePaymentPayload): Promise<AppyPayResponse> {
    try {
        const response = await axios.post(`${API_URL}/api/payments/create`, payload);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Erro ao criar pagamento');
        }
        throw error;
    }
}

export async function getPaymentStatus(paymentId: string): Promise<any> {
    try {
        const response = await axios.get(`${API_URL}/api/payments/status/${paymentId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching payment status:', error);
        return null;
    }
}

export function formatPaymentReference(reference: any) {
    if (!reference || !reference.reference) return '';
    // Format: 123 456 789
    const ref = reference.reference.toString();
    return ref.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
}

export function formatDueDate(dateString?: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-AO', { day: 'numeric', month: 'long', year: 'numeric' });
}
