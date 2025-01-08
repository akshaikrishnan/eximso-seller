import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Example function to validate auth
    const token = request.cookies.get('access_token')?.value;

    if (request.nextUrl.pathname.startsWith('/auth')) {
        const userType = request.nextUrl.searchParams.get('userType');

        if (token) {
            if (userType === 'Buyer') {
                const url = new URL(
                    `api/login?token=${token}`,
                    process.env.NEXT_PUBLIC_BUYER_DOMAIN
                );
                console.log(url);
                return NextResponse.redirect(url);
            }
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }
    if (token) {
        return NextResponse.next();
    }

    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    loginUrl.searchParams.set('userType', 'Seller');

    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ['/((?!api|static|policy|.*\\..*|_next|favicon.ico|robots.txt).*)']
};
