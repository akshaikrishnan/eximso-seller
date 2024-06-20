import TwitchResetPasswordEmail from '@/lib/email/reset-password';
import { findOne } from '@/lib/user/service';
import { sign, verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const { searchParams } = req.nextUrl;
        const token = searchParams.get('token');
        if (!token) {
            return NextResponse.json(
                {
                    error: 'Token not provided'
                },
                { status: 401 }
            );
        }
        const decoded = verify(token, process.env.JWT_SECRET!) as { email: string };
        if (!decoded) {
            return NextResponse.json(
                {
                    error: 'Invalid token'
                },
                { status: 401 }
            );
        }

        const user = await findOne({ email: decoded.email });
        if (!user) {
            return NextResponse.json(
                {
                    error: 'User not found'
                },
                { status: 404 }
            );
        }
        const accessToken = sign({ id: user._id }, process.env.JWT_SECRET!, {
            expiresIn: '7d'
        });
        cookies().set('access_token', accessToken, { httpOnly: true });
        const loginUrl = new URL('/reset-password', req.url);
        loginUrl.searchParams.set('forgotPassword', 'true');
        return NextResponse.redirect(loginUrl);
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            error: e
        });
    }
}

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const body = await req.json();
        const { email } = body;
        if (!email) {
            return NextResponse.json(
                {
                    message: 'Email not provided'
                },
                { status: 400 }
            );
        }
        const user = await findOne({ email });
        if (!user) {
            return NextResponse.json(
                {
                    message: 'User not found'
                },
                { status: 404 }
            );
        }
        const token = sign({ email }, process.env.JWT_SECRET!, { expiresIn: '5m' });
        const url = `${
            process.env.VERCEL_URL || 'http://localhost:3000'
        }/api/auth/forgot-password?token=${token}`;

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });

        const emailHtml = render(
            TwitchResetPasswordEmail({
                username: user.name,
                updatedDate: new Date(),
                url
            })
        );
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

        const info = await transporter.sendMail({
            from: 'Eximso <eximsodev@gmail.com>',
            to: email,
            subject: 'Reset Password',
            html: emailHtml
        });
        console.log(info);

        return NextResponse.json(
            {
                message: `Reset Password Email has sent to ${email}. Please check your inbox`
            },
            { status: 200 }
        );
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            error: e
        });
    }
}
