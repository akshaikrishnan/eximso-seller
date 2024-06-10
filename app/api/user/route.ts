import { findById, findOne, update } from '@/lib/user/service';
import { getDataFromRequest } from '@/lib/utils/getDataFromToken';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const { id } = getDataFromRequest(req);
        const user = await findById(id);
        return NextResponse.json(user);
    } catch (e) {
        console.log(e);
        return NextResponse.json(
            {
                error: e
            },
            { status: 403 }
        );
    }
}

export async function PUT(req: NextRequest, res: NextResponse) {
    try {
        const { id } = getDataFromRequest(req);
        const data = await req.json();
        const user = await findOne({ _id: id });
        const updated = await update(user._id, data);
        return NextResponse.json(updated);
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            error: e
        });
    }
}
