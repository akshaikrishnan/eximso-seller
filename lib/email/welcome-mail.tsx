import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text
} from '@react-email/components';
import * as React from 'react';

interface KoalaWelcomeEmailProps {
    userFirstname: string;
    url: string;
}

const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';

export const KoalaWelcomeEmail = ({ userFirstname, url }: KoalaWelcomeEmailProps) => (
    <Html>
        <Head />
        <Preview>
            The sales intelligence platform that helps you uncover qualified leads.
        </Preview>
        <Body style={main}>
            <Container style={container}>
                <Img
                    src={`${baseUrl}/layout/images/logo-dark.png`}
                    width="170"
                    height="50"
                    alt="Eximso Logo"
                    style={logo}
                />
                <Text style={paragraph}>Hi {userFirstname},</Text>
                <Text style={paragraph}>
                    <Text>
                        Welcome to Eximso! We're thrilled to have you on board and excited
                        to help you navigate the world of exporting.
                    </Text>
                    <Text>
                        Eximso simplifies the export process, making it easier than ever
                        to get your products to international markets. Whether you're a
                        seasoned exporter or just starting out, we offer a range of tools
                        and resources to streamline your journey.
                    </Text>
                </Text>

                <Section style={btnContainer}>
                    <Button style={button} href={url}>
                        Get started
                    </Button>
                </Section>
                <Text style={paragraph}>
                    Best,
                    <br />
                    The Koala team
                </Text>
                <Hr style={hr} />
                <Text style={footer}>
                    © 2025 Eximso, All Rights Reserved <br />
                    602030, Kakkanad, Kerala, India
                </Text>
            </Container>
        </Body>
    </Html>
);

KoalaWelcomeEmail.PreviewProps = {
    userFirstname: 'User'
} as KoalaWelcomeEmailProps;

export default KoalaWelcomeEmail;

const main = {
    backgroundColor: '#ffffff',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px'
};

const logo = {
    margin: '0 auto'
};

const paragraph = {
    fontSize: '16px',
    lineHeight: '26px'
};

const btnContainer = {
    textAlign: 'center' as const
};

const button = {
    backgroundColor: '#5F51E8',
    borderRadius: '3px',
    color: '#fff',
    fontSize: '16px',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '12px'
};

const hr = {
    borderColor: '#cccccc',
    margin: '20px 0'
};

const footer = {
    color: '#8898aa',
    fontSize: '12px'
};
