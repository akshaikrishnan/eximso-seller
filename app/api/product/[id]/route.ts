import { findById, update } from '@/lib/products/service';
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

//delete
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } },
    res: NextResponse
) {
    try {
        const product = await findById(params.id);
        const { id } = getDataFromRequest(req);

        if (!product) {
            return NextResponse.json(
                {
                    error: 'Product not found'
                },
                { status: 404 }
            );
        }
        console.log(product.seller, id);
        if (product.seller.toString() !== id) {
            return NextResponse.json(
                {
                    error: 'You are not authorized to delete this product'
                },
                { status: 401 }
            );
        }
        await update(params.id, { isDelete: true });
        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (e) {
        console.log(e);
        return NextResponse.json(
            {
                error: e
            },
            { status: 400 }
        );
    }
}
