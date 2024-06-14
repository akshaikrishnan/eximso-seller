'use server';

import { error } from 'console';
import { cookies } from 'next/headers';
import { getDataFromToken } from '../utils/getDataFromToken';
import { findById } from '../user/service';
import bcrypt from 'bcrypt';

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
        return { success: 'success' };
    } catch (error) {
        return { error: 'something went wrong' };
    }
}
