import axios from 'axios';
const isServer = typeof window === 'undefined';

const baseURL = isServer ? process.env.NEXT_PUBLIC_API_URL : '/backend';

const api = axios.create({
    baseURL
});

api.interceptors.request.use(async (config) => {
    config.headers['Accept'] = 'application/json';
    config.headers['language'] = `en`;

    if (isServer) {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value,
            deviceToken = cookieStore.get('device_token')?.value,
            language = cookieStore.get('Next-Locale')?.value,
            country = cookieStore.get('country')?.value;

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        if (deviceToken) {
            config.headers['DeviceToken'] = deviceToken;
        }
        if (language) {
            config.headers['language'] = language;
        }
        if (country) {
            config.headers['country'] = country;
        }
    } else {
        const token = document?.cookie.replace(
                /(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,
                '$1'
            ),
            deviceToken = document?.cookie.replace(
                /(?:(?:^|.*;\s*)device_token\s*=\s*([^;]*).*$)|^.*$/,
                '$1'
            ),
            language = document?.cookie.replace(
                /(?:(?:^|.*;\s*)Next-Locale\s*=\s*([^;]*).*$)|^.*$/,
                '$1'
            ),
            country = document?.cookie.replace(
                /(?:(?:^|.*;\s*)country\s*=\s*([^;]*).*$)|^.*$/,
                '$1'
            );

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        if (deviceToken) {
            config.headers['DeviceToken'] = deviceToken;
        }
        if (language) {
            config.headers['language'] = language;
        }
        if (country) {
            config.headers['country'] = country;
        }
    }

    return config;
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response?.status === 401) {
            if (isServer) {
                const { cookies } = await import('next/headers');
                const cookieStore = await cookies();
                cookieStore.delete('access_token');
            } else {
                document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
