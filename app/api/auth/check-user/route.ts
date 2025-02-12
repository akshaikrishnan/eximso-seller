import { create, findOne } from '@/lib/user/service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    const reqBody = await req.json();
    const email = reqBody.email;

    // const user = await findOne({ email: email });
    const user = await findOne({ email: email });
    console.log(user);

    if (!user) {
        return NextResponse.json({
            errorCode: 1,
            message: 'email not found',
            isNewUser: true
        });
    }

    return NextResponse.json({
        errorCode: 0,
        user,
        message: `Welcome back ${user.name || user.email} please enter your password`,
        isNewUser: false
    });
}
