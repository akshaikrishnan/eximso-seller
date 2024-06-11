import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        //api to return bank details from ifsc code
        const { searchParams } = new URL(req.url);
        const ifsc = searchParams.get('ifsc');
        const url = `https://bank-apis.justinclicks.com/API/V1/IFSC/${ifsc?.toUpperCase()}`;
        const response = await fetch(url);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            error: e
        });
    }
}
