"use client";
import React, { useState, useEffect } from 'react';
import { Product } from '../types/types';

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchProducts = async (query: string = '', limit: number = 10) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/products?q=${query}&limit=${limit}`);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchProducts(searchTerm);
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="p-4">
            <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.map(product => {
                        const primaryName = product.names[0];
                        const matchedName = searchTerm 
                            ? product.names.find(name => name.toLowerCase().startsWith(searchTerm.toLowerCase()))
                            : '';

                        const secondaryName = matchedName && matchedName !== primaryName
                            ? matchedName
                            : product.names[1] || '';

                        return (
                            <div key={product.id} className="flex border rounded-lg shadow-lg overflow-hidden bg-white">
                                {product.imageurl && product.imageurl.length > 0 ? (
                                    <img
                                        src={product.imageurl}
                                        alt={primaryName}
                                        className="w-1/3 h-32 object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-1/3 h-32 bg-gray-200 text-gray-600">
                                        <span>No Image Available</span>
                                    </div>
                                )}
                                <div className="p-4 w-2/3">
                                    <h3 className="text-lg font-semibold text-gray-800">{primaryName}</h3>
                                    {secondaryName && <p className="text-sm text-gray-500">({secondaryName})</p>}
                                    <div className="mt-2">
                                        {product.prices.map((price, index) => (
                                            <p key={index} className="text-sm text-gray-600">
                                                Price: <span className="font-bold text-blue-600">${price.amount.toFixed(2)}</span> <span className="font-semibold text-blue-600">{price.unit}</span>
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProductList;
