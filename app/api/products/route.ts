import { NextRequest, NextResponse } from 'next/server';
import { fetchProducts } from '@/utils/supabase';
import { Product } from '@/types/types';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get('q')?.toLowerCase() || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);

    try {
        const products: Product[] = await fetchProducts();

        const filteredProducts = searchTerm
            ? products.filter(product =>
                product.names.some(name => name.toLowerCase().startsWith(searchTerm))
              )
            : products;

        return NextResponse.json(filteredProducts.slice(0, limit));
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message || 'An unknown error occurred' }, { status: 500 });
    }
}
