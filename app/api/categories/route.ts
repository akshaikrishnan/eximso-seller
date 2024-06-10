import { NextRequest, NextResponse } from 'next/server';
import { findAll } from '@/lib/categories/service';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const categories = await findAll();
        return NextResponse.json(categories);
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            error: e
        });
    }
}
