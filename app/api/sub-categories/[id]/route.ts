import { NextRequest, NextResponse } from 'next/server';
import { find, findAll } from '@/lib/sub-categories/service';

export async function GET(req: NextRequest, { params }: { params: { id: string } }, res: NextResponse) {
    try {
        const categories = await find({ category: params.id });
        return NextResponse.json(categories);
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            error: e
        });
    }
}
