import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    const { i18n } = useTranslation();
    const dir = i18n.dir();
    return (
        <div className="min-h-screen flex flex-col font-sans selection:bg-yellow-200 selection:text-slate-900 overflow-x-hidden" dir={dir}>
            <Navbar />
            <main className="flex-grow pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
