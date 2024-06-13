import { Product } from '@/lib/types/product';
import { Demo } from '@/types';

export const ProductService = {
    getProductsSmall() {
        return fetch('/demo/data/products-small.json', {
            headers: { 'Cache-Control': 'no-cache' },
            cache: 'no-store'
        })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    },

    getProducts() {
        return fetch('/api/product', {
            headers: { 'Cache-Control': 'no-cache' },
            cache: 'no-store'
        })
            .then((res) => res.json())
            .then((d) => d as Product[]);
    },

    getProductsWithOrdersSmall() {
        return fetch('/demo/data/products-orders-small.json', {
            headers: { 'Cache-Control': 'no-cache' },
            cache: 'no-store'
        })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    }
};
