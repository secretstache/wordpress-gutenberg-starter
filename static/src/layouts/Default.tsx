import React from 'react';
import { SiteHeader } from '@global/site-header/SiteHeader';
import { SiteFooter } from '@global/site-footer/SiteFooter';
import { Offcanvas } from '@global/offcanvas/Offcanvas';

export interface DefaultProps {
    children?: React.ReactNode;
}

export const Default = ({ children }: DefaultProps) => {
    return (
        <>
            <SiteHeader />
            <Offcanvas />
            <main>{children}</main>
            <SiteFooter />
        </>
    );
};

export default Default;
