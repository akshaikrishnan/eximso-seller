import axios from 'axios';

export const sendWelcomeEmail = async (newUser: any) => {
    try {
        const userPayload = {
            subject: 'welcome',
            to: newUser.email,
            templateName: 'welcome',
            props: { name: newUser.name || newUser.email }
        };

        const notifyPayload = {
            subject: newUser.name,
            to: 'vendoronboarding.notification@eximso.com',
            templateName: 'notify-seller-onboarding',
            props: {
                name: newUser.name || newUser.email,
                email: newUser.email,
                id: newUser._id
            }
        };

        const userEmail = axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}email/send`,
            userPayload
        );

        const notifyEmail = axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}email/send`,
            notifyPayload
        );
        const responses = await Promise.all([userEmail, notifyEmail]);
        console.log('Email sent:', responses);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
