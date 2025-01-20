/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Catalogue',
            items: [
                { label: 'Profile', icon: 'pi pi-fw pi-id-card', to: '/seller/profile' },
                {
                    label: 'Add Product',
                    icon: 'pi pi-fw pi-plus',
                    to: '/seller/manage-product'
                },
                {
                    label: 'All Products',
                    icon: 'pi pi-fw pi-bookmark',
                    to: '/seller/products'
                }
            ]
        },
        {
            label: 'Enquiries',
            items: [
                {
                    label: 'Post Requirements',
                    icon: 'pi pi-fw pi-eye',
                    to: '/seller/post-requirements',
                    badge: 'NEW'
                },
                {
                    label: 'Eximso Buyer',
                    icon: 'pi pi-fw pi-globe',
                    url: 'https://eximso.com',
                    target: '_blank'
                }
            ]
        },
        {
            label: 'Inbox',
            items: [
                {
                    label: 'Notifications',
                    icon: 'pi pi-fw pi-bell',
                    to: '/seller/notifications'
                }
            ]
        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? (
                        <AppMenuitem item={item} root={true} index={i} key={item.label} />
                    ) : (
                        <li className="menu-separator"></li>
                    );
                })}

                
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
