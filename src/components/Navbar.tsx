import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Button from './Button';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    // Prevent scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-[100] h-[72px] bg-[#0C0C0C]/85 backdrop-blur-[12px] border-b border-[#1C1C1C]">
                <div className="container h-full flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-3 group">
                        <img src="/logo.svg" alt="Fraimiix Logo" className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-[18px] sm:text-[20px] md:text-[24px] font-[SpaceGrotesk] font-bold text-white tracking-widest uppercase truncate max-w-[200px] sm:max-w-none">
                            FRAIMIIX <span className="hidden sm:inline">STUDIOS</span>
                        </span>
                    </Link>

                    {/* Desktop Nav Links */}
                    <ul className="hidden xl:flex items-center space-x-8">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className={`text-[14px] font-medium font-[Inter] transition-colors duration-200 ${isActive ? 'text-[#FF4D00]' : 'text-[#A0A0A0] hover:text-[#FF4D00]'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>

                    {/* CTA */}
                    <div className="hidden xl:block">
                        <Button variant="ghost" as="a" href="/contact">Get a Free Quote</Button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="xl:hidden text-[#F0F0F0] z-[110] relative p-2"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-[#0C0C0C] z-[90] xl:hidden transition-all duration-500 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'
                    }`}
            >
                <div className="flex flex-col h-full items-center justify-center space-y-8 p-12">
                    {navLinks.map((link, i) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-[32px] font-[SpaceGrotesk] font-bold uppercase tracking-widest transition-all duration-300 transform ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                } ${location.pathname === link.path ? 'text-[#FF4D00]' : 'text-[#F0F0F0]'}`}
                            style={{ transitionDelay: `${i * 100}ms` }}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className={`pt-8 w-full max-w-[200px] transition-all duration-500 delay-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                        <Button variant="primary" as="a" href="/contact" className="w-full text-center py-4">Get a Quote</Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
