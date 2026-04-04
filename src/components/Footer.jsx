import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo.png';
const Footer = () => {
    const { t, i18n } = useTranslation();
    return (
        <footer className="bg-[#37395C] text-white pt-16 pb-8 px-6 md:px-12" dir={i18n.dir()}>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                {/* Column 1: Logo and About */}
                <div className="flex flex-col gap-6">
                    <img src={logo} className="w-24 h-auto" alt="" />
                    <p className="text-slate-300 leading-relaxed text-sm">
                        {t('footer.about')}
                    </p>
                    <div className="flex gap-4">
                        <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" className="h-6 opacity-80" />
                        <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" className="h-6 opacity-80" />
                        <img src="https://img.icons8.com/color/48/maestro.png" alt="Maestro" className="h-6 opacity-80" />
                        <img src="https://img.icons8.com/color/48/amex.png" alt="Amex" className="h-6 opacity-80" />
                    </div>
                </div>

                {/* Column 2: My Account */}
                <div>
                    <h3 className="text-xl font-bold mb-6 relative inline-block">
                        {t('footer.myAccount')}

                    </h3>
                    <ul className="flex flex-col gap-4 text-slate-300">
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">{t('footer.links.account')}</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">{t('footer.links.returns')}</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">{t('footer.links.orders')}</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">{t('footer.links.tickets')}</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">{t('footer.links.track')}</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">{t('footer.links.supportCenter')}</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">{t('footer.links.payment')}</a></li>
                    </ul>
                </div>

                {/* Column 3: The Company */}
                <div>
                    <h3 className="text-xl font-bold mb-6 relative inline-block">
                        {t('footer.company')}
                        
                    </h3>
                    <ul className="flex flex-col gap-4 text-slate-300">
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">{t('footer.links.aboutUs')}</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">{t('footer.links.delivery')}</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">{t('footer.links.privacy')}</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">{t('footer.links.terms')}</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">{t('footer.links.contact')}</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">{t('footer.links.supportCenter')}</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">{t('footer.links.careers')}</a></li>
                    </ul>
                </div>

                {/* Column 4: Contact Us */}
                <div>
                    <h3 className="text-xl font-bold mb-6 relative inline-block">
                        {t('footer.contactUs')}
                        
                    </h3>
                    <ul className="flex flex-col gap-3 text-slate-300">
                        <li className="flex items-start gap-3">
                            <MapPin size={20} className="text-yellow-400 shrink-0 mt-1" />
                            <span>{t('footer.address')}</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone size={20} className="text-yellow-400 shrink-0" />
                            <span dir="ltr">(+01) 123-456-789</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail size={20} className="text-yellow-400 shrink-0" />
                            <span>contact@ecom-market.com</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Clock size={20} className="text-yellow-400 shrink-0 mt-1" />
                            <span>{t('footer.hours')}</span>
                        </li>
                    </ul>
                    <div className="flex gap-4 mt-8">
                        <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-yellow-400 hover:text-slate-800 transition-all">
                            <Facebook size={20} />
                        </a>
                        <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-yellow-400 hover:text-slate-800 transition-all">
                            <Instagram size={20} />
                        </a>
                        <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-yellow-400 hover:text-slate-800 transition-all">
                            <Twitter size={20} />
                        </a>
                        <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-yellow-400 hover:text-slate-800 transition-all">
                            <Linkedin size={20} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
                <p>{t('footer.copyright', { brand: 'QEEMATECH' })}</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-white transition-colors">{t('footer.links.privacy')}</a>
                    <a href="#" className="hover:text-white transition-colors">{t('footer.links.terms')}</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
