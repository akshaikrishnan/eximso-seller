import { NextRequest, NextResponse } from 'next/server';
import api from '@/lib/utils/api.interceptor';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const phone = typeof body.phone === 'string' ? body.phone.replace(/\s+/g, '') : '';
        const recaptchaToken = body.recaptchaToken;

        if (!phone) {
            return NextResponse.json({ message: 'Phone number is required' }, { status: 400 });
        }

        const payload: Record<string, any> = { phone };
        if (recaptchaToken) {
            payload.recaptchaToken = recaptchaToken;
        }

        const response = await api.post('/send-otp', payload);
        return NextResponse.json(response.data);
    } catch (error: any) {
        const message = error?.response?.data?.message || error?.message || 'Failed to send OTP';
        const status = error?.response?.status || 500;
        return NextResponse.json({ message }, { status });
    }
}
