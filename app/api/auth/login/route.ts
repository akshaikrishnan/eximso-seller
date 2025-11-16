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

    const { email, password, phone } = await req.json();
    const sanitizedPhone = typeof phone === 'string' ? phone.replace(/\s+/g, '') : undefined;

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
