import { Demo } from '@/types';

export const CountryService = {
    getCountries() {
        return fetch('/api/categories', { headers: { 'Cache-Control': 'no-cache' } })
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
