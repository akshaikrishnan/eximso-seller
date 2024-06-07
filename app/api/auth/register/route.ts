import { create, findOne } from '@/lib/user/service';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();
    const { email, password } = body;
    const existingUser = await findOne({ email });
    if (existingUser) {
        return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await create({ ...body, password: hashedPassword });

    // Generate a JWT token
    const token = jwt.sign({ id: newUser._id.toString(), email: newUser.email }, process.env.JWT_SECRET!, {
        expiresIn: '7d'
    });
    cookies().set('access_token', token);
    return NextResponse.json({ message: 'User registered successfully', token: token }, { status: 200 });
}
