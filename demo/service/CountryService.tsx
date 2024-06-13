import { Demo } from '@/types';

export const CountryService = {
    getCountries() {
        return fetch('/demo/data/countries.json', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d as Demo.Country[]);
    }
};

export const CountryNameService = {
    getCountries() {
        return fetch('/demo/data/countries.json', {
            headers: { 'Cache-Control': 'no-cache' }
        })
            .then((res) => res.json())
            .then((d) => d.data.map((country: Demo.Country) => country.name));
    }
};

export const CategoryService = {
    getCategories() {
        return fetch('/api/categories', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d as Demo.Country[]);
    },
    getUserCategories() {
        return fetch('/api/user-categories', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json())
            .then((d) => d as any);
    },
    getSubCategories(category: string | undefined) {
        try {
            if (!category) return [];
            return fetch(`/api/sub-categories/${category}`, {
                headers: { 'Cache-Control': 'no-cache' }
            })
                .then((res) => res.json())
                .then((d) => d as any)
                .catch(() => []);
        } catch (e) {
            return [];
        }
    }
};
