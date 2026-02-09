import { create, findOne } from '@/lib/user/service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    const reqBody = await req.json();
    const email = reqBody.email;
    const phone = reqBody.phone;

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/098409a4-79d1-497e-aef5-5cf4170f450b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: `log_${Date.now()}_${Math.random().toString(16).slice(2)}`,
            runId: 'pre-fix',
            hypothesisId: 'H2',
            location: 'app/api/auth/check-user/route.ts:POST',
            message: 'Check user called',
            data: { hasEmail: !!email, hasPhone: !!phone },
            timestamp: Date.now()
        })
    }).catch(() => {});
    // #endregion

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
