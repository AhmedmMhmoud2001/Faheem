import React, { useState } from 'react';
import { Globe, LogIn, LogOut, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png'
import Container from './Container';

const Navbar = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { isLoggedIn, user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const lang = i18n.language?.split('-')[0] || 'ar';

    const toggleLang = () => {
        const next = lang === 'ar' ? 'en' : 'ar';
        i18n.changeLanguage(next);
    };

    const navLinks = [
        { nameKey: 'nav.home', path: '/' },
        { nameKey: 'nav.subscriptions', path: '/subscriptions' },
        { nameKey: 'nav.about', path: '/#about' },
        { nameKey: 'nav.contact', path: '/#contact' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <nav className='fixed top-0 left-0 w-full z-[500] bg-white border-b border-slate-100' dir={i18n.dir()}>
                <Container>
                    <div className="flex items-center justify-between py-3">

                        {/* Right side: Logo & Nav Links */}
                        <div className="flex items-center gap-12">
                            {/* Logo */}
                            <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2 group">
                                <img src={logo} alt="logo" className="h-20 w-auto object-contain" />
                            </Link>

                            {/* Desktop Nav Links */}
                            <div className="hidden lg:flex items-center gap-10">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.nameKey}
                                        to={link.path}
                                        className="text-slate-700 hover:text-[#00A651] transition-colors font-bold text-lg"
                                    >
                                        {t(link.nameKey)}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Left side: Login/User Profile & Language */}
                        <div className="flex items-center gap-6">
                            <div className="hidden lg:flex items-center gap-6">


                                {isLoggedIn ? (
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 bg-[#00A651] hover:bg-slate-900 hover:text-white px-6 py-2.5 rounded-xl font-black text-lg transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-green-200/50"
                                        >
                                            <LogOut size={20} />
                                            <span>{t('nav.logout')}</span>
                                        </button>
                                        <Link to="/profile" className="w-12 h-12 rounded-full border-2 border-[#00A651] p-0.5 overflow-hidden transition-transform hover:scale-105 active:scale-95 block">
                                            <img
                                                src={user?.avatar || "https://i.pravatar.cc/150?u=faheem"}
                                                alt="profile"
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        </Link>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="flex items-center gap-3 bg-[#00A651] hover:bg-slate-900 hover:text-white px-6 py-2.5 rounded-xl font-black text-lg transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-green-200/50"
                                    >
                                        <LogIn size={20} />
                                        <span>{t('nav.login')}</span>
                                    </button>
                                )}
                                <button
                                    onClick={toggleLang}
                                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors border-s border-slate-200 ps-6 group"
                                >
                                    <Globe size={18} className="group-hover:text-[#00A651]" />
                                    <span className="font-bold uppercase">{lang === 'ar' ? t('nav.switchToEn') : t('nav.switchToAr')}</span>
                                </button>
                            </div>

                            {/* Mobile Toggle */}
                            <button
                                className="lg:hidden p-2 text-slate-600"
                                onClick={() => setIsMenuOpen(true)}
                            >
                                <Menu size={32} />
                            </button>
                        </div>
                    </div>
                </Container>
            </nav>

            {/* Sidebar Mobile Menu */}
            <div
                className={`fixed inset-0 z-[600] lg:hidden transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}
                dir={i18n.dir()}
            >
                <div
                    className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMenuOpen(false)}
                ></div>

                <div
                    className={`absolute top-0 right-0 h-full w-[320px] bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
                >
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between font-sans">
                        <div className="flex items-center gap-3">
                            {isLoggedIn ? (
                                <Link to="/profile" className="w-12 h-12 rounded-full border-2 border-[#00A651] p-0.5 overflow-hidden transition-transform hover:scale-105 active:scale-95 block">
                                    <img
                                        src={user?.avatar || "https://i.pravatar.cc/150?u=faheem"}
                                        alt="profile"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </Link>
                            ) : (
                                <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2 group">
                                    <img src={logo} alt="logo" className="h-14 w-auto object-contain" />
                                </Link>
                            )}

                        </div>
                        <button
                            className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-full"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto py-10 px-8 space-y-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.nameKey}
                                to={link.path}
                                className="block text-2xl font-black text-slate-700 hover:text-[#00A651] transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {t(link.nameKey)}
                            </Link>
                        ))}
                    </div>

                    <div className="p-8 border-t border-slate-50 space-y-6">
                        {isLoggedIn ? (
                            <button
                                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                className="w-full flex items-center justify-center gap-4 bg-[#00A651] hover:bg-slate-900 hover:text-white py-5 rounded-3xl font-black text-xl transition-all shadow-xl shadow-green-100"
                            >
                                <span>{t('nav.logout')}</span>
                                <LogOut size={24} />
                            </button>
                        ) : (
                            <button
                                onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                                className="w-full flex items-center justify-center gap-4 bg-[#00A651] hover:bg-slate-900 hover:text-white py-5 rounded-3xl font-black text-xl transition-all shadow-xl shadow-green-100"
                            >
                                <span>{t('nav.login')}</span>
                                <LogIn size={24} />
                            </button>
                        )}
                        <button
                            onClick={toggleLang}
                            className="w-full flex items-center justify-center gap-3 text-slate-500 hover:text-slate-900 font-black text-lg p-3 rounded-2xl bg-slate-50 transition-colors"
                        >
                            <Globe size={20} />
                            <span>{lang === 'ar' ? t('nav.inEnglish') : t('nav.inArabic')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};


export default Navbar;

