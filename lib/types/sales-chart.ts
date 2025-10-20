export type SalesChartDataset = {
    productId: string;
    label: string; // product name
    data: number[]; // per month values
    sumQty: number;
    sumRevenue: number;
};
export type SalesChartSeries = {
    labels: string[]; // month labels
    datasets: SalesChartDataset[];
};
export type SalesChartMeta = {
    months: number;
    limitProducts: number;
    metric: 'quantity' | 'revenue';
    statuses: string[];
    startISO: string;
    endISO: string;
    productIds?: string[];
};
export type SalesChartEnvelope = {
    result: SalesChartSeries;
    meta: SalesChartMeta;
    success: boolean;
    errorCode: number;
    message: string;
};
