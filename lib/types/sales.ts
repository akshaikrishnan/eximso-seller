// types/sales.ts
import { Product } from '@/lib/types/product';

export type SaleRow = {
    orderId: string;
    orderNumber?: string;
    soldAt: string; // ISO date
    quantity: number;
    salePrice: number; // price at time of sale
    product: Product; // your Product type as sent by the API
};

export type RecentSalesMeta = {
    page: number;
    limit: number;
    totalDocs: number;
    totalPages: number;
    totalSalesAmount: number;
    statuses: string[];
    startDate: string | null;
    endDate: string | null;
};

export type RecentSalesEnvelope = {
    data: SaleRow[];
    meta: RecentSalesMeta;
    error_code: number;
    error_message: string;
    result: SaleRow[];
};

export type RecentSalesParams = {
    page?: number; // default 1
    limit?: number; // default 20
    startDate?: string; // ISO date e.g. "2025-10-01"
    endDate?: string; // ISO date
    status?: string; // csv e.g. "Paid,Shipped,Completed"
};
