import { NextRequest, NextResponse } from 'next/server';
import { find, findAll } from '@/lib/categories/service';

export async function GET(req: NextRequest, { params }: { params: { id: string } }, res: NextResponse) {
    try {
        const categories = await find({ _id: params.id });
        return NextResponse.json(categories);
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            error: e
        });
    }
}
