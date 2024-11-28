import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const urlss = new URL(`/api/login?token=${'token'}`, 'http://localhost:3000');
        NextResponse.redirect(urlss);
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            error: e
        });
    }
}
