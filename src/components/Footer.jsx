import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Phone, Mail, MapPin, Clock } from 'lucide-react';
import logo from '../assets/logo.png';
const Footer = () => {
    return (
        <footer className="bg-[#37395C] text-white pt-16 pb-8 px-6 md:px-12" dir="rtl">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                {/* Column 1: Logo and About */}
                <div className="flex flex-col gap-6">
                    <img src={logo} className="w-24 h-auto" alt="" />
                    <p className="text-slate-300 leading-relaxed text-sm">
                        هي المنصة الرائدة للوساطة التجارية بين المصانع والتجار، حيث يمكنك عرض منتجاتك بالجملة، التفاوض مباشرة مع المشترين، وإتمام الصفقات بأمان وسهولة، مع ضمان متابعة الشحن وحماية المدفوعات في كل خطوة.
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
                        حسابي

                    </h3>
                    <ul className="flex flex-col gap-4 text-slate-300">
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">حسابي</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">مركز الإرجاع</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">المشتريات والطلبات</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">تذاكر الدعم</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">تتبع الطلب</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">مركز الدعم</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">طريقة الدفع</a></li>
                    </ul>
                </div>

                {/* Column 3: The Company */}
                <div>
                    <h3 className="text-xl font-bold mb-6 relative inline-block">
                        الشركة
                        
                    </h3>
                    <ul className="flex flex-col gap-4 text-slate-300">
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">عنا</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">معلومات التوصيل</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">سياسة الخصوصية</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">الشروط والأحكام</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">اتصل بنا</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">مركز الدعم</a></li>
                        <li><a href="#" className="hover:text-yellow-400 transition-colors">الوظائف</a></li>
                    </ul>
                </div>

                {/* Column 4: Contact Us */}
                <div>
                    <h3 className="text-xl font-bold mb-6 relative inline-block">
                        اتصل بنا
                        
                    </h3>
                    <ul className="flex flex-col gap-3 text-slate-300">
                        <li className="flex items-start gap-3">
                            <MapPin size={20} className="text-yellow-400 shrink-0 mt-1" />
                            <span>العنوان: 502 شارع التصميم الجديد، ميلبورن، سان فرانسيسكو، CA 94110، الولايات المتحدة</span>
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
                            <span>ساعات العمل: من 8:00 صباحاً إلى 5:00 مساءً من الاثنين إلى السبت</span>
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
                <p>Copyright © 2025 <span className="text-white font-bold">QEEMATECH</span> | All Rights Reserved</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a>
                    <a href="#" className="hover:text-white transition-colors">الشروط والأحكام</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
