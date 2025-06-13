/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { Menu } from 'primereact/menu';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Chip } from 'primereact/chip';
const items = [
    {
        label: 'Logged In',
        items: [
            {
                label: 'My Profile',
                icon: 'pi pi-user',
                url: '/seller/profile'
            },
            {
                label: 'Reset Password',
                icon: 'pi pi-lock',
                url: '/reset-password'
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out',
                url: '/api/auth/logout'
            }
        ]
    }
];

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
        useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const menu = useRef<Menu>(null);
    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            return axios.get('/api/user').then((res) => res.data);
        }
    });

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img
                    src={`/layout/images/logo-${
                        layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'
                    }.png`}
                    width="50px"
                    height={'25px'}
                    alt="logo"
                />
                {/* <span>SAKAI</span> */}
            </Link>

            <button
                ref={menubuttonRef}
                type="button"
                className="p-link layout-menu-button layout-topbar-button"
                onClick={onMenuToggle}
            >
                <i className="pi pi-bars" />
            </button>

            <button
                ref={topbarmenubuttonRef}
                type="button"
                className="p-link layout-topbar-menu-button layout-topbar-button"
                onClick={showProfileSidebar}
            >
                <i className="pi pi-ellipsis-v" />
            </button>
            <Menu model={items} popup ref={menu} id="popup_menu_left" />
            <div
                ref={topbarmenuRef}
                className={classNames('layout-topbar-menu', {
                    'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible
                })}
            >
                <Chip label={profile?.name} image={profile?.logo} />
                <button
                    onClick={(event) => {
                        if (menu) menu.current?.toggle(event);
                    }}
                    type="button"
                    className="p-link layout-topbar-button"
                >
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button>
                <Link href="/documentation">
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-question"></i>
                        <span>Settings</span>
                    </button>
                </Link>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
