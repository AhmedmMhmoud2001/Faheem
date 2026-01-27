import React, { useState } from 'react';
import { Globe, LogIn, LogOut, Menu, X, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png'
import Container from './Container';

const Navbar = () => {
    const navigate = useNavigate();
    const { isLoggedIn, user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [lang, setLang] = useState('ar');

    const toggleLang = () => {
        setLang(prev => prev === 'ar' ? 'en' : 'ar');
    };

    const navLinks = [
        { name: 'الرئيسية', path: '/' },
        { name: 'الاشتراكات', path: '/subscriptions' },
        { name: 'المراحل', path: '/#stages' },
        { name: 'عن الفهيم', path: '/#about' },
        { name: 'تواصل معنا', path: '/#contact' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <nav className='fixed top-0 left-0 w-full z-[500] bg-white border-b border-slate-100' dir="rtl">
                <Container>
                    <div className="flex items-center justify-between py-3">

                        {/* Right side: Logo & Nav Links */}
                        <div className="flex items-center gap-12">
                            {/* Logo */}
                            <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2 group">
                                <img src={logo} alt="logo" className="h-14 w-auto object-contain" />
                            </Link>

                            {/* Desktop Nav Links */}
                            <div className="hidden lg:flex items-center gap-10">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className="text-slate-700 hover:text-[#FFD131] transition-colors font-bold text-lg"
                                    >
                                        {link.name}
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
                                            className="flex items-center gap-3 bg-[#FFD131] hover:bg-slate-900 hover:text-white px-6 py-2.5 rounded-xl font-black text-lg transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-yellow-200/50"
                                        >
                                            <LogOut size={20} />
                                            <span>تسجيل الخروج</span>
                                        </button>
                                        <Link to="/profile" className="w-12 h-12 rounded-full border-2 border-[#FFD131] p-0.5 overflow-hidden transition-transform hover:scale-105 active:scale-95 block">
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
                                        className="flex items-center gap-3 bg-[#FFD131] hover:bg-slate-900 hover:text-white px-6 py-2.5 rounded-xl font-black text-lg transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-yellow-200/50"
                                    >
                                        <LogIn size={20} />
                                        <span>تسجيل الدخول</span>
                                    </button>
                                )}
                                <button
                                    onClick={toggleLang}
                                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors border-l border-slate-200 pl-6 group"
                                >
                                    <Globe size={18} className="group-hover:text-[#FFD131]" />
                                    <span className="font-bold uppercase">{lang === 'ar' ? 'En' : 'عربي'}</span>
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
                dir="rtl"
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
                                <Link to="/profile" className="w-12 h-12 rounded-full border-2 border-[#FFD131] p-0.5 overflow-hidden transition-transform hover:scale-105 active:scale-95 block">
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
                                key={link.name}
                                to={link.path}
                                className="block text-2xl font-black text-slate-700 hover:text-[#FFD131] transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="p-8 border-t border-slate-50 space-y-6">
                        {isLoggedIn ? (
                            <button
                                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                className="w-full flex items-center justify-center gap-4 bg-[#FFD131] hover:bg-slate-900 hover:text-white py-5 rounded-3xl font-black text-xl transition-all shadow-xl shadow-yellow-100"
                            >
                                <span>تسجيل الخروج</span>
                                <LogOut size={24} />
                            </button>
                        ) : (
                            <button
                                onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                                className="w-full flex items-center justify-center gap-4 bg-[#FFD131] hover:bg-slate-900 hover:text-white py-5 rounded-3xl font-black text-xl transition-all shadow-xl shadow-yellow-100"
                            >
                                <span>تسجيل الدخول</span>
                                <LogIn size={24} />
                            </button>
                        )}
                        <button
                            onClick={toggleLang}
                            className="w-full flex items-center justify-center gap-3 text-slate-500 hover:text-slate-900 font-black text-lg p-3 rounded-2xl bg-slate-50 transition-colors"
                        >
                            <Globe size={20} />
                            <span>{lang === 'ar' ? 'In English' : 'باللغة العربية'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};


export default Navbar;





