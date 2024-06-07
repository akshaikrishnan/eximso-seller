import { create, findOne } from '@/lib/user/service';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        const { email } = body;

        const user = await findOne({ email });

        if (user) {
            const token = jwt.sign({ id: user._id.toString(), email: email }, process.env.JWT_SECRET!, { expiresIn: '7d' });
            cookies().set('access_token', token);
            return NextResponse.json({
                message: `Welcome Back ${user.name || user.email}!`,
                user,
                token,
                newUser: false
            });
        }
        const password = crypto.randomUUID().slice(0, 8);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await create({ ...body, password: hashedPassword });
        const token = jwt.sign({ id: newUser._id.toString(), email: email }, process.env.JWT_SECRET!, { expiresIn: '7d' });
        cookies().set('access_token', token);
        return NextResponse.json({
            message: `Welcome ${newUser.name || newUser.email}!`,
            user: newUser,
            newUser: true,
            token
        });
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            error: e
        });
    }
}
