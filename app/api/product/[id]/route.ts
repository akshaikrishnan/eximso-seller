import { findById, findOne } from '@/lib/products/service';
import { getDataFromRequest } from '@/lib/utils/getDataFromToken';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } },
    res: NextResponse
) {
    console.log(params.id);
    try {
        const product = await findById(params.id);
        console.log(product);
        return NextResponse.json(product);
    } catch (e) {
        console.log(e);
        return NextResponse.json(
            {
                error: e
            },
            { status: 404 }
        );
    }
}
