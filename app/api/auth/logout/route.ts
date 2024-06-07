import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest, res: NextResponse) {
    cookies().delete('access_token');
    return NextResponse.redirect(new URL('/', req.url));
}
