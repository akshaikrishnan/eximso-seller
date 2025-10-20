// types/best-selling.ts
export type BestItem = {
    productId: string;
    productName: string;
    categoryName: string | null;
    sumRevenue: number;
    sumQty: number;
    percentage: number; // 0-100
};

export type BestMeta = {
    metric: 'revenue' | 'quantity';
    totalRevenue: number;
    totalQty: number;
    totalProducts: number;
    limit: number;
    statuses: string[];
    startDate: string | null;
    endDate: string | null;
};

export type BestSellingResponse = {
    result: BestItem[]; // after deliverResponse normalization
    meta: BestMeta;
    success: boolean;
    errorCode: number;
    message: string;
};
