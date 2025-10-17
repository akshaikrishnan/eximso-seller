import { Product } from '@/lib/types/product';
import { Demo } from '@/types';
import { RecentSalesEnvelope, RecentSalesParams } from '@/lib/types/sales';
import api from '@/lib/utils/api.interceptor';
import { BestSellingResponse } from '@/lib/types/best-selling';
import { SalesChartEnvelope } from '@/lib/types/sales-chart';

export const ProductService = {
    getRecentSales(params: RecentSalesParams = {}) {
        return api
            .get<RecentSalesEnvelope>('/sales/seller/recent', {
                params,
                headers: { 'Cache-Control': 'no-cache' } // optional
            })
            .then((res) => res.data);
    },
    getBestSelling(params: {
        metric?: 'revenue' | 'quantity';
        startDate?: string;
        endDate?: string;
        statuses?: string; // CSV
        limit?: number;
    }) {
        return api
            .get<BestSellingResponse>('/sales/seller/best', { params })
            .then((r) => r.data);
    },
    getSalesChart(params: {
        months?: number; // default 6
        products?: number; // default 5
        metric?: 'quantity' | 'revenue';
        statuses?: string; // CSV
        productIds?: string; // CSV
    }) {
        return api
            .get<SalesChartEnvelope>('/sales/seller/chart', { params })
            .then((r) => r.data);
    },
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
            .then((d) => d as Product[])
            .catch((e) => e);
    },

    getProductsWithOrdersSmall() {
        return fetch('/demo/data/products-orders-small.json', {
            headers: { 'Cache-Control': 'no-cache' },
            cache: 'no-store'
        })
            .then((res) => res.json())
            .then((d) => d.data as Demo.Product[]);
    },
    deleteProduct(id: string) {
        return fetch(`/api/product/${id}`, {
            method: 'DELETE',
            headers: { 'Cache-Control': 'no-cache' },
            cache: 'no-store'
        });
    }
};
