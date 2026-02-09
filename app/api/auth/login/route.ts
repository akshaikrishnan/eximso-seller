import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/utils/db';
import { findOne } from '@/lib/user/service';
import bcrypt from 'bcrypt';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const url = req.nextUrl;
        const token = url.searchParams.get('token');
        const toPath = url.searchParams.get('from') || '/';

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/098409a4-79d1-497e-aef5-5cf4170f450b', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: `log_${Date.now()}_${Math.random().toString(16).slice(2)}`,
                runId: 'pre-fix',
                hypothesisId: 'H2',
                location: 'app/api/auth/login/route.ts:GET',
                message: 'Login GET called',
                data: { hasToken: !!token, toPath },
                timestamp: Date.now()
            })
        }).catch(() => {});
        // #endregion

        if (!token) {
            return NextResponse.redirect(new URL('/auth/login', req.url));
        }
        // const user = await findOne({ email: email });
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);
        console.log(decodedToken);

        if (!decodedToken) {
            return NextResponse.redirect(new URL('/auth/error', req.url));
        }

        cookies().set({
            name: 'access_token',
            value: token,
            httpOnly: true,
            path: '/',
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production'
        });

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/098409a4-79d1-497e-aef5-5cf4170f450b', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: `log_${Date.now()}_${Math.random().toString(16).slice(2)}`,
                runId: 'pre-fix',
                hypothesisId: 'H1',
                location: 'app/api/auth/login/route.ts:GET',
                message: 'Login GET setting cookie and redirecting',
                data: { redirectTo: toPath },
                timestamp: Date.now()
            })
        }).catch(() => {});
        // #endregion

        return NextResponse.redirect(new URL(toPath, req.url));
    } catch (e) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/098409a4-79d1-497e-aef5-5cf4170f450b', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: `log_${Date.now()}_${Math.random().toString(16).slice(2)}`,
                runId: 'pre-fix',
                hypothesisId: 'H3',
                location: 'app/api/auth/login/route.ts:GET',
                message: 'Login GET error',
                data: { error: (e as Error).message },
                timestamp: Date.now()
            })
        }).catch(() => {});
        // #endregion

        return NextResponse.redirect(new URL('/auth/error', req.url));
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    await connectDB();

    const { email, password, phone } = await req.json();

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/098409a4-79d1-497e-aef5-5cf4170f450b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: `log_${Date.now()}_${Math.random().toString(16).slice(2)}`,
            runId: 'pre-fix',
            hypothesisId: 'H2',
            location: 'app/api/auth/login/route.ts:POST',
            message: 'Login POST received',
            data: { hasEmail: !!email, hasPhone: !!phone },
            timestamp: Date.now()
        })
    }).catch(() => {});
    // #endregion

    if ((!email && !phone) || !password) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    const body = email ? { email: email } : { phone: phone };
    const user = await findOne(body);
    if (!user) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    const token = jwt.sign(
        { id: user._id.toString(), email: email },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
    );
    const url = new URL('/api/auth/login', req.url);
    url.searchParams.set('token', token);
    url.searchParams.set('userType', 'Seller');

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/098409a4-79d1-497e-aef5-5cf4170f450b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: `log_${Date.now()}_${Math.random().toString(16).slice(2)}`,
            runId: 'pre-fix',
            hypothesisId: 'H2',
            location: 'app/api/auth/login/route.ts:POST',
            message: 'Login POST success',
            data: { hasRedirect: true },
            timestamp: Date.now()
        })
    }).catch(() => {});
    // #endregion

    return NextResponse.json(
        {
            message: `Welcome back ${user.name || user.email}!`,
            redirectUrl: url,
            token: token
        },
        { status: 200 }
    );
}
