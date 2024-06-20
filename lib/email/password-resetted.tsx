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
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://eximso-seller.vercel.app';

export const EximsoResetDone = ({
    username,
    updatedDate
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
                            {formattedDate}. If this was you, then no further action is
                            required.
                        </Text>

                        <Text style={paragraph}>
                            However if you did NOT perform this password change, please
                            contact{' '}
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
                            602030, Kakkanad, Kerala, India
                        </Text>
                    </Row>
                </Section>
            </Body>
        </Html>
    );
};

EximsoResetDone.PreviewProps = {
    username: 'alanturing',
    updatedDate: new Date('June 23, 2022 4:06:00 pm UTC')
} as EximsoResetPasswordEmailProps;

export default EximsoResetDone;

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
