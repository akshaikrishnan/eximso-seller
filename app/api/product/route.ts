import { create } from '@/lib/products/service';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            error: e
        });
    }
}
export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const data = await req.json();
        const product = create(data);
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            error: e
        });
    }
}
