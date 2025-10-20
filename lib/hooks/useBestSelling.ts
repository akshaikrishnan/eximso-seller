import { useQuery } from '@tanstack/react-query';
import { BestSellingResponse } from '../types/best-selling';
import { ProductService } from '@/demo/service/ProductService';

export function useBestSelling(params: {
    metric?: 'revenue' | 'quantity';
    startDate?: string;
    endDate?: string;
    statuses?: string;
    limit?: number;
}) {
    return useQuery<BestSellingResponse, Error>({
        queryKey: ['best-selling', params],
        queryFn: () => ProductService.getBestSelling(params),
        staleTime: 30_000
    });
}
