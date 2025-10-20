import { useQuery } from '@tanstack/react-query';
import { SalesChartEnvelope } from '../types/sales-chart';
import { ProductService } from '@/demo/service/ProductService';

export function useSalesChart(params: {
    months?: number;
    products?: number;
    metric?: 'quantity' | 'revenue';
    statuses?: string;
    productIds?: string;
}) {
    return useQuery<SalesChartEnvelope, Error>({
        queryKey: ['sales-chart', params],
        queryFn: () => ProductService.getSalesChart(params),
        staleTime: 30_000
    });
}
