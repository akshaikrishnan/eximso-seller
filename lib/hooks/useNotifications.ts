import { useQuery } from '@tanstack/react-query';
import api from '../utils/api.interceptor';
import { endpoints } from '../constants/endpoints';

export function useNotification() {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['notifications'],
        queryFn: async () => {
            const res = await api.get(endpoints.notifications, {
                params: {
                    page: 1,
                    limit: 10,
                    audience: 'seller'
                }
            });
            return res.data;
        }
    });
    // group data by date wiith today, yesterday and date

    const groupedData = data?.data?.reduce((acc: any, item: any) => {
        const itemDate = new Date(item.createdAt);
        const dateStr = itemDate.toISOString().split('T')[0];

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let key = dateStr;
        if (dateStr === todayStr) {
            key = 'Today';
        } else if (dateStr === yesterdayStr) {
            key = 'Yesterday';
        }

        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);

        return acc;
    }, {});
    return { groupedData, isLoading, error, refetch };
}
