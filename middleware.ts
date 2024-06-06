import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Example function to validate auth
    const token = request.cookies.get('access_token')?.value;
    if (token) {
        return NextResponse.next();
    }

    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
}

export const config = {
    matcher: ['/((?!api|static|auth|.*\\..*|_next|favicon.ico|robots.txt).*)']
};
