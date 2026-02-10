import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest, res: NextResponse) {
    //get query params
    const searchParams = req.nextUrl.searchParams;
    const showToast = searchParams.get('showToast') === 'true';
    const userType = searchParams.get('userType') ?? 'buyer';
    (await cookies()).delete('access_token');

    // If a buyer triggered this logout, redirect back to the buyer domain
    if (userType === 'buyer') {
        const buyerDomain = process.env.NEXT_PUBLIC_BUYER_DOMAIN || 'http://localhost:3000/';
        return NextResponse.redirect(new URL('/?from=logout', buyerDomain));
    }

    if (showToast) {
        return NextResponse.redirect(
            new URL(`/?showToast=true&userType=${userType}`, req.url)
        );
    }
    return NextResponse.redirect(new URL(`/?userType=${userType}`, req.url));
}
