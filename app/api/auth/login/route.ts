import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/utils/db';
import { findOne, update } from '@/lib/user/service';
import bcrypt from 'bcrypt';
import { getFirebaseAdminAuth } from '@/lib/firebase/admin';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const url = req.nextUrl;
        const token = url.searchParams.get('token');
        const toPath = url.searchParams.get('from') || '/';
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
            path: '/'
        });
        return NextResponse.redirect(new URL(toPath, req.url));
    } catch (e) {
        return NextResponse.redirect(new URL('/auth/error', req.url));
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    await connectDB();

    const { email, password, phone, firebaseIdToken } = await req.json();
    const sanitizedPhone = typeof phone === 'string' ? phone.replace(/\s+/g, '') : undefined;

    if (firebaseIdToken) {
        try {
            const adminAuth = getFirebaseAdminAuth();
            const decodedToken = await adminAuth.verifyIdToken(firebaseIdToken);
            const firebasePhone = decodedToken.phone_number;
            const phoneToUse = sanitizedPhone || firebasePhone;

            if (!phoneToUse || firebasePhone !== phoneToUse) {
                return NextResponse.json({ message: 'Phone verification failed' }, { status: 401 });
            }

            const user = await findOne({ phone: phoneToUse });
            if (!user) {
                return NextResponse.json({ message: 'Account not found' }, { status: 404 });
            }

            if (!user.isPhoneVerified) {
                await update(user._id.toString(), { isPhoneVerified: true });
            }

            const token = jwt.sign(
                { id: user._id.toString(), email: user.email },
                process.env.JWT_SECRET!,
                { expiresIn: '7d' }
            );

            const url = new URL('/api/auth/login', req.url);
            url.searchParams.set('token', token);
            url.searchParams.set('userType', 'Seller');
            return NextResponse.json(
                {
                    message: `Welcome back ${user.name || user.email}!`,
                    redirectUrl: url,
                    token: token
                },
                { status: 200 }
            );
        } catch (error: any) {
            return NextResponse.json(
                { message: error?.message || 'Unable to verify phone number' },
                { status: 401 }
            );
        }
    }

    if ((!email && !sanitizedPhone) || !password) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    const body = email ? { email } : { phone: sanitizedPhone };
    const user = await findOne(body);
    if (!user) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    const token = jwt.sign(
        { id: user._id.toString(), email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
    );
    const url = new URL('/api/auth/login', req.url);
    url.searchParams.set('token', token);
    url.searchParams.set('userType', 'Seller');
    return NextResponse.json(
        {
            message: `Welcome back ${user.name || user.email}!`,
            redirectUrl: url,
            token: token
        },
        { status: 200 }
    );
}
