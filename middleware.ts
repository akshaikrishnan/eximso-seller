import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Example function to validate auth
    const token = request.cookies.get('access_token')?.value;

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/098409a4-79d1-497e-aef5-5cf4170f450b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: `log_${Date.now()}_${Math.random().toString(16).slice(2)}`,
            runId: 'pre-fix',
            hypothesisId: 'H4',
            location: 'middleware.ts',
            message: 'Middleware auth check',
            data: {
                path: request.nextUrl.pathname,
                hasToken: !!token
            },
            timestamp: Date.now()
        })
    }).catch(() => {});
    // #endregion

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
    matcher: ['/((?!api|backend|static|policy|.*\\..*|_next|favicon.ico|robots.txt).*)']
};
