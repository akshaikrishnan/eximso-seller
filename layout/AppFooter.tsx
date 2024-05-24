/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            © {new Date().getFullYear()} All rights reserved |<span className="font-medium ml-2">Eximso</span>
        </div>
    );
};

export default AppFooter;
