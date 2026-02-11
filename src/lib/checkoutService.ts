import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PortfolioProject {
    title: string;
    description: string;
    image_url: string;
    project_url: string;
}

export interface Benefit {
    icon: string;
    title: string;
    description: string;
}

export interface CheckoutConfig {
    id: string;
    course_id: string;
    is_active: boolean;
    mux_playback_id?: string;
    mux_asset_id?: string;
    video_title?: string;
    instructor_name?: string;
    instructor_title?: string;
    instructor_bio?: string;
    instructor_image?: string;
    instructor_years_experience: number;
    instructor_students_count: number;
    instructor_projects_count: number;
    portfolio_projects: PortfolioProject[];
    benefits: Benefit[];
    lesson_covers: Record<string, string>;
    price_display?: string;
    price_subtitle?: string;
    price_features: string[];
    whatsapp_number?: string;
}

export interface Course {
    id: string;
    title: string;
    description?: string;
    price_cents: number;
    thumbnail_url?: string;
}

export interface Lesson {
    id: string;
    title: string;
    description?: string;
    duration_minutes: number;
    order_index: number;
    thumbnail_url?: string;
}

export interface CheckoutData {
    config: CheckoutConfig | null;
    course: Course | null;
    lessons: Lesson[];
}

/**
 * Fetch the active checkout configuration via RPC
 */
export async function getActiveCheckoutConfig(): Promise<CheckoutData | null> {
    try {
        const { data, error } = await supabase.rpc('get_active_checkout_config');

        if (error) {
            console.error('Error fetching checkout config:', error);
            return null;
        }

        if (!data) {
            return null;
        }

        return {
            config: data.config || null,
            course: data.course || null,
            lessons: data.lessons || [],
        };
    } catch (error) {
        console.error('Checkout service error:', error);
        return null;
    }
}

/**
 * Format price in Kwanza
 */
export function formatPrice(cents: number): string {
    const value = cents / 100;
    return new Intl.NumberFormat('pt-AO', {
        style: 'currency',
        currency: 'AOA',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value).replace('AOA', 'Kz');
}
