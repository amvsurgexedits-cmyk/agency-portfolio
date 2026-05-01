import React, { useState } from 'react';
import Button from '../components/Button';
import { Mail, Instagram, MapPin, Phone } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { supabase } from '../lib/supabaseClient';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: 'graphic-design',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'duplicate'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            // 0. Check for duplicate phone number
            const { data: existingContact } = await supabase
                .from('contacts')
                .select('id')
                .eq('phone', formData.phone)
                .single();

            if (existingContact) {
                setSubmitStatus('duplicate');
                setIsSubmitting(false);
                return;
            }

            // 1. Save to Supabase
            const { error: dbError } = await supabase
                .from('contacts')
                .insert([
                    {
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        service: formData.service,
                        message: formData.message
                    }
                ]);

            if (dbError) throw dbError;

            // 2. Trigger Emails (Lead Notification + Auto-Reply)
            try {
                // CALL A: Send Lead Notification to YOU
                // Make sure this Template in EmailJS has "To Email" set to fraimiixstudios@gmail.com
                await emailjs.send(
                    'service_ittmfgq',
                    'template_ig5htbk', // <--- Create a second template for leads and put ID here
                    {
                        from_name: formData.name,
                        from_email: formData.email,
                        phone: formData.phone,
                        service: formData.service,
                        message: formData.message,
                    },
                    'zWLtcqDl7ZpO_Ldxu'
                );

                // CALL B: Send "Thank You" Auto-Reply to CUSTOMER
                // This is your 'template_hs75m39' which has "To Email" set to {{from_email}}
                await emailjs.send(
                    'service_ittmfgq',
                    'template_hs75m39',
                    {
                        from_name: formData.name,
                        from_email: formData.email,
                        phone: formData.phone,
                        service: formData.service,
                        message: formData.message,
                        to_name: 'Fraimiix',
                    },
                    'zWLtcqDl7ZpO_Ldxu'
                );
            } catch (emailErr) {
                console.warn("Email delivery issues, but data was saved:", emailErr);
            }

            setSubmitStatus('success');
            setFormData({ name: '', email: '', phone: '', service: 'graphic-design', message: '' });
        } catch (error) {
            console.error('Submission failed:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pt-[72px] min-h-screen bg-[#0C0C0C]">

            <div className="container py-[96px] md:py-[128px]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

                    {/* Left: Contact Info */}
                    <div className="space-y-12">
                        <div>
                            <h1 className="font-[SpaceGrotesk] font-bold text-[48px] md:text-[72px] text-[#F0F0F0] uppercase tracking-wide leading-[1.05] mb-6">
                                Let's Talk
                            </h1>
                            <p className="font-[Inter] text-[20px] text-[#A0A0A0] leading-[1.7] max-w-md">
                                Have a project in mind? We'd love to hear about it. Drop us a message and we'll get back to you within 24 hours.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start space-x-6">
                                <div className="w-12 h-12 rounded-full bg-[#1C1C1C] border border-[#333] flex items-center justify-center text-[#FF4D00] shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="font-[SpaceGrotesk] font-bold text-[20px] text-white mb-1">Email Us</h4>
                                    <p className="font-[Inter] text-[#A0A0A0] hover:text-[#FF4D00] transition-colors"><a href="mailto:fraimiixstudios@gmail.com">fraimiixstudios@gmail.com</a></p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-6">
                                <div className="w-12 h-12 rounded-full bg-[#1C1C1C] border border-[#333] flex items-center justify-center text-[#FF4D00] shrink-0">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="font-[SpaceGrotesk] font-bold text-[20px] text-white mb-1">WhatsApp Us</h4>
                                    <p className="font-[Inter] text-[#A0A0A0] hover:text-[#FF4D00] transition-colors"><a href="https://wa.me/919599325629?text=Hi%20Fraimiix%20Studios%21%20I%20am%20interested%20in%20starting%20a%20project." target="_blank" rel="noopener noreferrer">+91 95993 25629</a></p>
                                    <p className="font-[Inter] text-[#A0A0A0] hover:text-[#FF4D00] transition-colors mt-1"><a href="https://wa.me/918076904698?text=Hi%20Fraimiix%20Studios%21%20I%20am%20interested%20in%20starting%20a%20project." target="_blank" rel="noopener noreferrer">+91 80769 04698</a></p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-6">
                                <div className="w-12 h-12 rounded-full bg-[#1C1C1C] border border-[#333] flex items-center justify-center text-[#FF4D00] shrink-0">
                                    <Instagram size={24} />
                                </div>
                                <div>
                                    <h4 className="font-[SpaceGrotesk] font-bold text-[20px] text-white mb-1">Socials</h4>
                                    <p className="font-[Inter] text-[#A0A0A0] hover:text-[#FF4D00] transition-colors"><a href="https://www.instagram.com/fraimiix.studios_">@fraimiix.studios_</a></p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-6">
                                <div className="w-12 h-12 rounded-full bg-[#1C1C1C] border border-[#333] flex items-center justify-center text-[#FF4D00] shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="font-[SpaceGrotesk] font-bold text-[20px] text-white mb-1">Office</h4>
                                    <p className="font-[Inter] text-[#A0A0A0] leading-[1.6]">New Delhi,<br />India</p>
                                </div>
                            </div>
                        </div>

                        {/* Real Map (Google Maps Embed) */}
                        <div className="w-full h-[300px] bg-[#141414] border border-[#222] rounded-[8px] overflow-hidden grayscale invert opacity-80 hover:opacity-100 transition-opacity duration-500">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224345.8392319277!2d77.0688975472!3d28.5272131413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x37205b71db2095ef!2sNew%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="bg-[#141414] border border-[#222] rounded-[16px] p-8 md:p-12 shadow-[0_16px_48px_rgba(0,0,0,0.5)] h-max">
                        <h3 className="font-[SpaceGrotesk] font-bold text-[32px] text-white mb-8">Start a Project</h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block font-[Inter] text-[12px] font-medium text-[#A0A0A0] uppercase tracking-wider mb-2">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[#0C0C0C] border border-[#333] rounded-[4px] px-4 py-3 text-white font-[Inter] focus:outline-none focus:border-[#FF4D00] transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block font-[Inter] text-[12px] font-medium text-[#A0A0A0] uppercase tracking-wider mb-2">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-[#0C0C0C] border border-[#333] rounded-[4px] px-4 py-3 text-white font-[Inter] focus:outline-none focus:border-[#FF4D00] transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block font-[Inter] text-[12px] font-medium text-[#A0A0A0] uppercase tracking-wider mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full bg-[#0C0C0C] border border-[#333] rounded-[4px] px-4 py-3 text-white font-[Inter] focus:outline-none focus:border-[#FF4D00] transition-colors"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>

                            <div>
                                <label className="block font-[Inter] text-[12px] font-medium text-[#A0A0A0] uppercase tracking-wider mb-2">Service Required</label>
                                <select
                                    value={formData.service}
                                    onChange={e => setFormData({ ...formData, service: e.target.value })}
                                    className="w-full bg-[#0C0C0C] border border-[#333] rounded-[4px] px-4 py-3 text-white font-[Inter] focus:outline-none focus:border-[#FF4D00] transition-colors appearance-none"
                                >
                                    <option value="graphic-design">Graphic Design</option>
                                    <option value="logo-design">Logo Design</option>
                                    <option value="thumbnail-design">Thumbnail Design</option>
                                    <option value="video-editing">Video Editing</option>
                                    <option value="web-design">Website Design</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-[Inter] text-[12px] font-medium text-[#A0A0A0] uppercase tracking-wider mb-2">Project Details</label>
                                <textarea
                                    required
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    rows={5}
                                    className="w-full bg-[#0C0C0C] border border-[#333] rounded-[4px] px-4 py-3 text-white font-[Inter] focus:outline-none focus:border-[#FF4D00] transition-colors resize-none"
                                    placeholder="Tell us about your goals, timeline, and budget..."
                                ></textarea>
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
                                {isSubmitting ? 'Sending Request...' : 'Send Request'}
                            </Button>

                            {submitStatus === 'success' && (
                                <div className="mt-4 p-4 bg-[#1C2F19] border border-[#2D5A27] text-[#8BEA7E] rounded-[4px] font-[Inter] text-[14px] animate-fade-in">
                                    Thank you! Your request has been sent successfully. We will get back to you shortly.
                                </div>
                            )}
                            {submitStatus === 'error' && (
                                <div className="mt-4 p-4 bg-[#331111] border border-[#662222] text-[#FF6B6B] rounded-[4px] font-[Inter] text-[14px]">
                                    We encountered an error. Please try again or contact us directly via email.
                                </div>
                            )}
                            {submitStatus === 'duplicate' && (
                                <div className="mt-4 p-4 bg-[#331111] border border-[#662222] text-[#FF6B6B] rounded-[4px] font-[Inter] text-[14px]">
                                    This phone number is already registered with a request. We will contact you soon!
                                </div>
                            )}
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
