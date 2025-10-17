// hooks/useRecentSales.ts
import { ProductService } from '@/demo/service/ProductService';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { RecentSalesParams, RecentSalesEnvelope } from '../types/sales';

export function useRecentSales(
    params: RecentSalesParams,
    options?: UseQueryOptions<RecentSalesEnvelope, Error>
) {
    return useQuery<RecentSalesEnvelope, Error>({
        queryKey: ['recent-sales', params],
        queryFn: () => ProductService.getRecentSales(params),
        staleTime: 30_000, // tweak as you like
        ...options
    });
}
