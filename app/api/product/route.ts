import { create, findAll, update } from '@/lib/products/service';
import { getDataFromRequest } from '@/lib/utils/getDataFromToken';
import { NextRequest, NextResponse } from 'next/server';

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
        const product = await update(data._id, data);
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
