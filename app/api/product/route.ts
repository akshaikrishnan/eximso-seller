import { create, findAll, update } from '@/lib/products/service';
import { getDataFromRequest } from '@/lib/utils/getDataFromToken';
import { NextRequest, NextResponse } from 'next/server';
import api from '@/lib/utils/api.interceptor';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const { id } = getDataFromRequest(req);
        const product = await findAll({ seller: id });
        return NextResponse.json(product);
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            error: e
        });
    }
}
export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const { id } = getDataFromRequest(req);
        const data = await req.json();
        const product = await create({ ...data, seller: id });
        api.post('/push/notify/admins', {
            title: 'New Product Added',
            body: `A new product "${data.name}" has been added and is pending approval.`,
            icon: product.thumbnail || '',
            clickAction: `/products`,
            data: {
                type: 'product_approval_add',
                productId: product._id
            }
        });
        return NextResponse.json(product);
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

//update
export async function PUT(req: NextRequest, res: NextResponse) {
    try {
        const data = await req.json();
        const product = await update(data._id, { ...data, isApproved: false });
        api.post('/push/notify/admins', {
            title: 'Product Updated',
            body: `A product "${data.name}" has been updated and is pending approval.`,
            icon: product ? product.thumbnail : '',
            clickAction: `/products`,
            data: {
                type: 'product_approval_update',
                productId: product ? product._id : ''
            }
        });
        console.log('Updated product:', product);
        return NextResponse.json(product);
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
