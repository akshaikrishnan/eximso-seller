import { NextRequest, NextResponse } from 'next/server';
import { findDetail } from '@/lib/user/service';
import { getDataFromRequest } from '@/lib/utils/getDataFromToken';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const { id } = getDataFromRequest(req);
        const user = await findDetail(id);
        console.log(user);
        const categories = user.categories;
        return NextResponse.json(categories);
    } catch (e) {
        console.log(e);
        return NextResponse.json([]);
    }
}
