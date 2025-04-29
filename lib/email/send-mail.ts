import axios from 'axios';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const sqs = new SQSClient({ region: process.env.REGION });

export const sendWelcomeEmail = async (newUser: any) => {
    try {
        const payload = {
            type: 'USER_ONBOARD',
            user: {
                id: newUser._id.toString(),
                email: newUser.email,
                name: newUser.name
            }
        };
        await sqs.send(
            new SendMessageCommand({
                QueueUrl: process.env.SQS_QUEUE_URL,
                MessageBody: JSON.stringify(payload)
            })
        );
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
