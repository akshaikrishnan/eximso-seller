import { create, findOne } from '@/lib/user/service';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import KoalaWelcomeEmail from '@/lib/email/welcome-mail';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import axios from 'axios';

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();
    const { email, password, userType } = body;
    const existingUser = await findOne({ email });
    if (existingUser) {
        return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await create({ ...body, password: hashedPassword });

    // Generate a JWT token
    const token = jwt.sign(
        { id: newUser._id.toString(), email: newUser.email },
        process.env.JWT_SECRET!,
        {
            expiresIn: '7d'
        }
    );
    cookies().set('access_token', token);

    // const transporter = nodemailer.createTransport({
    //     service: 'Gmail',
    //     auth: {
    //         user: process.env.GMAIL_USER,
    //         pass: process.env.GMAIL_PASS
    //     }
    // });
    const url: string =
        userType === 'Buyer'
            ? process.env.NEXT_PUBLIC_BUYER_DOMAIN!
            : req.url || 'https://eximso.com';

    // const emailHtml = render(
    //     KoalaWelcomeEmail({
    //         userFirstname: newUser.email,
    //         url
    //     })
    // );
    // const { data, error } = await resend.emails.send({
    //     from: 'Eximso <onboarding@resend.dev>',
    //     to: [email],
    //     subject: 'Reset Password',
    //     react: TwitchResetPasswordEmail({
    //         username: user.name,
    //         updatedDate: new Date(),
    //         url
    //     })
    // });

    // const info = await transporter.sendMail({
    //     from: 'Eximso <eximsodev@gmail.com>',
    //     to: email,
    //     bcc: 'vinod@eximso.com',
    //     subject: 'Welcome to Eximso!',
    //     html: emailHtml
    // });
    // console.log(info);

    const userPayload = {
        subject: 'welcome',
        to: email,
        templateName: 'welcome',
        props: { name: newUser.name }
    };

    const notifyPayload = {
        subject: newUser.name,
        to: 'vendoronboarding.notification@eximso.com',
        templateName: 'notify-seller-onboarding',
        props: {
            name: newUser.name,
            email: newUser.email,
            id: newUser._id
        }
    };

    const userEmail = axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/email/send`,
        userPayload
    );

    const notifyEmail = axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/email/send`,
        notifyPayload
    );
    const responses = await Promise.all([userEmail, notifyEmail]);
    console.log('Email sent:', responses);

    return NextResponse.json(
        { message: 'User registered successfully', token: token },
        { status: 200 }
    );
}
