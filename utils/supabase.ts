import { supabase } from '@/utils/supabaseClient';
import { Product } from '@/types/types'; 

export async function fetchProducts(): Promise<Product[]> {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .returns<Product[]>(); 

    if (error) {
        console.error('Error fetching products:', error.message);
        throw new Error('Failed to fetch products');
    }

    return data as Product[]; 
}
