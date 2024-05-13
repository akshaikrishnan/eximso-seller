import { NextRequest, NextResponse } from 'next/server';

export function POST(req: NextRequest, res: NextResponse) {
    return Response.json({ name: 'hello' });
}
