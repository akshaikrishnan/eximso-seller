import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export const getDataFromRequest = (request: NextRequest) => {
    try {
        // Retrieve the token from the cookies
        const token = request.cookies.get('access_token')?.value || '';

        // Verify and decode the token using the secret key
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);

        // Return the user ID from the decoded token
        return decodedToken;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const getDataFromToken = (token: string) => {
    try {
        // Verify and decode the token using the secret key
        const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET!);

        // Return the user ID from the decoded token
        return decodedToken;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const decodeJWT = async (token: string) => {
    return jwt.decode(token);
};
