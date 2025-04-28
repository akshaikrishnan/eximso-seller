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

        const pushPayload = {
            title: 'New User Onboarding',
            icon: 'https://seller.eximso.com/img/welcome.png',
            body: `A New user ${
                newUser.name || newUser.email
            } has been onboarded to Eximso.com`,
            click_action: '/users'
        };

        const userEmail = axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}email/send`,
            userPayload
        );

        const notifyEmail = axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}email/send`,
            notifyPayload
        );
        const pushNotification = axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}push/notify/admins`,
            pushPayload
        );
        const responses = await Promise.all([userEmail, notifyEmail, pushNotification]);
        console.log('Email sent:', responses);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
