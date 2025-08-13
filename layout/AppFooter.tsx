/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';
import Link from 'next/link';


const AppFooter = ({ isSeller }: { isSeller?: boolean }) => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            © {new Date().getFullYear()} All rights reserved |
            <span className="font-medium mx-2">Eximso</span> |{' '}
            <Link
                className="ml-2"
                href="//seller.eximso.com/policy/seller-terms-and-conditions"
                target="_blank"
            >
                Seller Agreement
            </Link>
        </div>
    );
};

export default AppFooter;
