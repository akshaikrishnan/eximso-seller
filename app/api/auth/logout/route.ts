import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest, res: NextResponse) {
    //get query params
    const searchParams = req.nextUrl.searchParams;
    const showToast = searchParams.get('showToast') ?? false;
    const userType = searchParams.get('userType') ?? 'buyer';
    cookies().delete('access_token');
    if (showToast) {
        return NextResponse.redirect(
            new URL(`/?showToast=true&userType=${userType}`, req.url)
        );
    }
    return NextResponse.redirect(new URL(`/?userType=${userType}`, req.url));
}
