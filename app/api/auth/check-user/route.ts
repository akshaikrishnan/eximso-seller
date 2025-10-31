import { findOne } from '@/lib/user/service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    const reqBody = await req.json();
    const email = reqBody.email;
    const phone = typeof reqBody.phone === 'string' ? reqBody.phone.replace(/\s+/g, '') : undefined;

    if (!email && !phone) {
        return NextResponse.json(
            { errorCode: 1, message: 'Invalid email or phone', isNewUser: false },
            { status: 400 }
        );
    }

    const user = await findOne(email ? { email } : { phone });

    if (!user) {
        return NextResponse.json({
            errorCode: 1,
            message: 'New user, please sign up',
            isNewUser: true,
            isPhone: Boolean(phone)
        });
    }

    return NextResponse.json({
        errorCode: 0,
        user,
        message: `Welcome back ${user.name || user.email} please enter your password`,
        isNewUser: false,
        isPhone: Boolean(phone),
        isPhoneVerified: user.isPhoneVerified,
        isEmailVerified: user.isEmailVerified
    });
}
