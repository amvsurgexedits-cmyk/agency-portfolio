import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#0C0C0C] pt-24 pb-8 border-t border-[#1C1C1C]">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Column 1: Brand */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center group">
                            <img src="/Nav%20logo.png" alt="Fraimiix Logo" className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
                        </Link>
                        <p className="text-[#A0A0A0] text-[16px] leading-[1.7] max-w-[280px]">
                            We build visual identities and digital experiences that sell. Premium design for modern brands.
                        </p>
                    </div>

                    {/* Column 2: Links */}
                    <div>
                        <h4 className="text-white font-[SpaceGrotesk] font-medium text-[20px] mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            {['Home', 'Portfolio', 'About', 'Contact'].map(link => (
                                <li key={link}>
                                    <Link to={`/${link.toLowerCase()}`} className="text-[#A0A0A0] hover:text-[#FF4D00] transition-colors duration-200">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Services */}
                    <div>
                        <h4 className="text-white font-[SpaceGrotesk] font-medium text-[20px] mb-6">Services</h4>
                        <ul className="space-y-4 text-[#A0A0A0]">
                            {['Graphic Design', 'Logo Design', 'Video Editing', 'Website Design'].map(service => (
                                <li key={service} className="hover:text-[#FF4D00] cursor-pointer transition-colors duration-200">
                                    {service}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h4 className="text-white font-[SpaceGrotesk] font-medium text-[20px] mb-6">Contact Us</h4>
                        <ul className="space-y-4 text-[#A0A0A0]">
                            <li><a href="mailto:fraimiixstudios@gmail.com" className="hover:text-[#FF4D00] transition-colors">fraimiixstudios@gmail.com</a></li>
                            <li><a href="https://wa.me/919599325629?text=Hi%20Fraimiix%20Studios%21%20I%20am%20interested%20in%20starting%20a%20project." target="_blank" rel="noopener noreferrer" className="hover:text-[#FF4D00] transition-colors">WhatsApp: +91 95993 25629</a></li>
                            <li><a href="https://wa.me/918076904698?text=Hi%20Fraimiix%20Studios%21%20I%20am%20interested%20in%20starting%20a%20project." target="_blank" rel="noopener noreferrer" className="hover:text-[#FF4D00] transition-colors">WhatsApp: +91 80769 04698</a></li>
                            <li><a href="https://www.instagram.com/fraimiix.studios_" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF4D00] transition-colors">IG: @fraimiix.studios_</a></li>
                            <li>New Delhi,<br />India</li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[#1C1C1C] flex flex-col md:flex-row items-center justify-between">
                    <p className="text-[#555555] text-[14px]">
                        © {new Date().getFullYear()} FRAIMIIX Agency. All rights reserved.
                    </p>
                    <div className="flex space-x-4 mt-4 md:mt-0 text-[#555555]">
                        {/* Abstract social icons */}
                        {['IN', 'TW', 'BE', 'IG'].map(social => (
                            <a key={social} href="#" className="hover:text-[#FF4D00] transition-colors">{social}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
