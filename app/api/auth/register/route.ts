import { create, findOne } from '@/lib/user/service';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { sendWelcomeEmail } from '@/lib/email/send-mail';
import { getFirebaseAdminAuth } from '@/lib/firebase/admin';

export async function POST(req: NextRequest, res: NextResponse) {
    const body = await req.json();
    const { email, password, userType, phone, firebaseIdToken } = body;

    if (!email || !phone || !password) {
        return NextResponse.json({ message: 'Email, phone, and password are required' }, { status: 400 });
    }

    const sanitizedPhone = typeof phone === 'string' ? phone.replace(/\s+/g, '') : '';

    const existingUser = (await findOne({ email })) || (await findOne({ phone: sanitizedPhone }));
    if (existingUser) {
        return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    let isPhoneVerified = false;

    if (firebaseIdToken) {
        try {
            const adminAuth = getFirebaseAdminAuth();
            const decodedToken = await adminAuth.verifyIdToken(firebaseIdToken);
            if (decodedToken.phone_number !== sanitizedPhone) {
                return NextResponse.json(
                    { message: 'Phone number verification failed' },
                    { status: 400 }
                );
            }
            isPhoneVerified = true;
        } catch (error: any) {
            return NextResponse.json(
                { message: error?.message || 'Failed to verify phone number' },
                { status: 400 }
            );
        }
    }

    // Create a new user
    const { firebaseIdToken: _omitToken, ...userPayload } = body;

    const newUser = await create({
        ...userPayload,
        phone: sanitizedPhone,
        password: hashedPassword,
        isPhoneVerified,
        isEmailVerified: false
    });

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
    await sendWelcomeEmail(newUser);
    return NextResponse.json(
        { message: 'User registered successfully', token: token },
        { status: 200 }
    );
}
