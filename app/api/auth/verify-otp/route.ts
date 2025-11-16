import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import api from '@/lib/utils/api.interceptor';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const phone =
            typeof body.phone === 'string' ? body.phone.replace(/\s+/g, '') : '';
        const code = body.code;

        if (!phone || !code) {
            return NextResponse.json(
                { message: 'Phone number and OTP code are required' },
                { status: 400 }
            );
        }

        const response = await api.post('/auth/verify-otp', { phone, code });
        const data = response.data || {};

        if (data.token) {
            cookies().set({
                name: 'access_token',
                value: data.token,
                httpOnly: true,
                path: '/',
                sameSite: 'lax'
            });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        const message =
            error?.response?.data?.message || error?.message || 'Failed to verify OTP';
        const status = error?.response?.status || 400;
        return NextResponse.json({ message }, { status });
    }
}
