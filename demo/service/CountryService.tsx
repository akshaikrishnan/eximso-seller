import { Demo } from '@/types';

export const CountryService = {
    getCountries() {
        return fetch('/api/categories', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d as Demo.Country[]);
    }
};
