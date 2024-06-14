import {
    Body,
    Container,
    Column,
    Head,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text
} from '@react-email/components';
import * as React from 'react';

interface EximsoResetPasswordEmailProps {
    username?: string;
    updatedDate?: Date;
    url: string;
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://eximso-seller.vercel.app';

export const EximsoResetPasswordEmail = ({
    username,
    updatedDate,
    url
}: EximsoResetPasswordEmailProps) => {
    const formattedDate = new Intl.DateTimeFormat('en', {
        dateStyle: 'medium',
        timeStyle: 'medium'
    }).format(updatedDate);

    return (
        <Html>
            <Head />
            <Preview>You updated the password for your Eximso account</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={logo}>
                        <Img width={114} src={`${baseUrl}/layout/images/logo-dark.png`} />
                    </Section>
                    <Section style={sectionsBorders}>
                        <Row>
                            <Column style={sectionBorder} />
                            <Column style={sectionCenter} />
                            <Column style={sectionBorder} />
                        </Row>
                    </Section>
                    <Section style={content}>
                        <Text style={paragraph}>Hi {username},</Text>
                        <Text style={paragraph}>
                            You updated the password for your Eximso account on{' '}
                            {formattedDate}. If this was you, then please click the link
                            below.
                        </Text>
                        <Text style={paragraph}>
                            <Link href={url} style={link}>
                                reset your account password
                            </Link>{' '}
                        </Text>
                        <Text style={paragraph}>
                            Remember to use a password that is both strong and unique to
                            your Eximso account. To learn more about how to create a
                            strong and unique password,{' '}
                        </Text>
                        <Text style={paragraph}>
                            Still have questions? Please contact{' '}
                            <Link href="https://eximso.com/help" style={link}>
                                Eximso Support
                            </Link>
                        </Text>
                        <Text style={paragraph}>
                            Thanks,
                            <br />
                            Eximso Support Team
                        </Text>
                    </Section>
                </Container>

                <Section style={footer}>
                    <Row>
                        <Text style={{ textAlign: 'center', color: '#706a7b' }}>
                            © 2025 Eximso, All Rights Reserved <br />
                            350 Bush Street, 2nd Floor, San Francisco, CA, 94104 - USA
                        </Text>
                    </Row>
                </Section>
            </Body>
        </Html>
    );
};

EximsoResetPasswordEmail.PreviewProps = {
    username: 'alanturing',
    updatedDate: new Date('June 23, 2022 4:06:00 pm UTC')
} as EximsoResetPasswordEmailProps;

export default EximsoResetPasswordEmail;

const fontFamily = 'HelveticaNeue,Helvetica,Arial,sans-serif';

const main = {
    backgroundColor: '#efeef1',
    fontFamily
};

const paragraph = {
    lineHeight: 1.5,
    fontSize: 14
};

const container = {
    maxWidth: '580px',
    margin: '30px auto',
    backgroundColor: '#ffffff'
};

const footer = {
    maxWidth: '580px',
    margin: '0 auto'
};

const content = {
    padding: '5px 20px 10px 20px'
};

const logo = {
    display: 'flex',
    justifyContent: 'center',
    alingItems: 'center',
    padding: 30
};

const sectionsBorders = {
    width: '100%',
    display: 'flex'
};

const sectionBorder = {
    borderBottom: '1px solid rgb(238,238,238)',
    width: '249px'
};

const sectionCenter = {
    borderBottom: '1px solid rgb(145,71,255)',
    width: '102px'
};

const link = {
    textDecoration: 'underline'
};
