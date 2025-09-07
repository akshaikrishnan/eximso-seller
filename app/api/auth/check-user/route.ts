import { create, findOne } from '@/lib/user/service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    const reqBody = await req.json();
    const email = reqBody.email;
    const phone = reqBody.phone;

    if (!email && !phone) {
        return NextResponse.json(
            { errorCode: 1, message: 'Invalid email or phone', isNewUser: false },
            { status: 400 }
        );
    }

    // const user = await findOne({ email: email });
    console.log(reqBody);
    const user = await findOne(reqBody);
    console.log(user);

    if (!user) {
        return NextResponse.json({
            errorCode: 1,
            message: 'New user, please sign up',
            isNewUser: true,
            isPhone: phone ? true : false
        });
    }

    return NextResponse.json({
        errorCode: 0,
        user,
        message: `Welcome back ${user.name || user.email} please enter your password`,
        isNewUser: false,
        isPhone: phone ? true : false
    });
}
