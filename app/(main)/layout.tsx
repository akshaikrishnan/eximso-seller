import { Metadata } from 'next';
import Layout from '../../layout/layout';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'Eximso | Seller Panel',
    description: 'Seller dashboard of Eximso b2b ecommerce',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    metadataBase: new URL('https://eximso-seller.vercel.app'),
    openGraph: {
        type: 'website',
        title: 'Eximso | Seller Panel',
        url: 'https://sakai.primereact.org/',
        description: 'Seller dashboard of Eximso b2b ecommerce',
        images: ['/layout/images/banner-dark.jpeg'],
        ttl: 604800
    },
    icons: {
        icon: '/favicon.ico'
    }
};

export default function AppLayout({ children }: AppLayoutProps) {
    return <Layout>{children}</Layout>;
}
