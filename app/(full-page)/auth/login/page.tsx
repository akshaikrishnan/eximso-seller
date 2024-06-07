/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { SelectButton } from 'primereact/selectbutton';

import './login.scss';
import { GoogleLogin } from '@react-oauth/google';
import { Divider } from 'primereact/divider';

const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const [isNewUser, setIsNewUser] = useState(true);
    const { layoutConfig } = useContext(LayoutContext);
    const options = ['Buyer', 'Seller'];
    const [value, setValue] = useState(options[0]);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const checkUser = () => {
        if (isNewUser) {
            router.push('/auth/register');
        }
    };
    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.png`} alt="Sakai logo" className="mb-5 w-12rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <form className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Welcome Guest!</div>
                            <span className="text-600 font-medium">Continue with your email</span>
                        </div>
                        <div className="mb-3">
                            <SelectButton className="buyer-seller" value={value} onChange={(e) => setValue(e.value)} options={options} />
                        </div>
                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-1">
                                Email
                            </label>
                            <InputText id="email1" type="text" placeholder="Email address" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />
                            {!isNewUser && (
                                <>
                                    <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                        Password
                                    </label>
                                    <Password inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

                                    <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                        <div className="flex align-items-center">
                                            <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                            <label htmlFor="rememberme1">Remember me</label>
                                        </div>
                                        <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                            Forgot password?
                                        </a>
                                    </div>
                                    <Button label="Sign In" className="w-full p-3 text-xl" onClick={() => router.push('/')}></Button>
                                </>
                            )}

                            <div className="pt-3">
                                {isNewUser && <Button label="Continue" className="w-full p-3 text-xl" onClick={checkUser}></Button>}

                                <Divider align="center">
                                    <span className="p-tag">OR</span>
                                </Divider>
                                <GoogleLogin
                                    onSuccess={(credentialResponse) => {
                                        console.log(credentialResponse);
                                    }}
                                    onError={() => {
                                        console.log('Login Failed');
                                    }}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
