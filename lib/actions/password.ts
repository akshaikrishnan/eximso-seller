'use server';

import { error } from 'console';
import { cookies } from 'next/headers';
import { getDataFromToken } from '../utils/getDataFromToken';
import { findById } from '../user/service';
import bcrypt from 'bcrypt';
import EximsoResetDone from '../email/password-resetted';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';

export async function passwordReset(formData: FormData) {
    try {
        console.log(formData.get('password'));
        const token = cookies().get('access_token')?.value || '';
        if (!token) throw error('Unauthorized');
        const { id } = await getDataFromToken(token);
        const user = await findById(id);
        if (!user) throw error('User not found');
        const hashPassword = await bcrypt.hash(formData.get('password') as string, 10);
        user.password = hashPassword;
        await user.save();
        sendMail(user.name, user.email);
        return { success: 'success' };
    } catch (error) {
        return { error: 'something went wrong' };
    }
}

const sendMail = async (name: string, email: string) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const emailHtml = render(
        EximsoResetDone({
            username: name,
            updatedDate: new Date()
        })
    );

    const info = await transporter.sendMail({
        from: 'Eximso <eximsodev@gmail.com>',
        to: email,
        subject: 'Reset Password',
        html: emailHtml
    });
    return info;
};
