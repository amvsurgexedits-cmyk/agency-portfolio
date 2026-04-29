import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { Palette, PenTool, Layout, Video, MonitorPlay } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Services: React.FC = () => {
    const [mockups, setMockups] = useState<{ [key: string]: string }>({});

    const servicesData = [
        {
            id: "graphic-design",
            icon: <Palette size={40} />,
            title: "Graphic Design",
            desc: "High-converting visual assets tailored for social media, ad campaigns, and comprehensive digital marketing materials. We blend strategy with cutting-edge aesthetics.",
            deliverables: ["Social Media Kits", "Ad Creatives", "Pitch Decks", "Digital Billboards"],
            align: "left"
        },
        {
            id: "logo-design",
            icon: <PenTool size={40} />,
            title: "Logo & Identity",
            desc: "Memorable, versatile, and strategic brand marks that define your company's core identity. Scalable from app icons to massive display screens.",
            deliverables: ["Prime Logo & Variations", "Brand Guidelines", "Typography Selection", "Color Palettes"],
            align: "right"
        },
        {
            id: "thumbnail-design",
            icon: <MonitorPlay size={40} />,
            title: "Thumbnail Engine",
            desc: "Click-worthy YouTube thumbnails designed to maximize CTR and viewer engagement. Built strictly around data and attention psychology.",
            deliverables: ["YouTube Thumbnails", "A/B Testing Variants", "Podcast Covers", "Custom Typography overlays"],
            align: "left"
        },
        {
            id: "video-editing",
            icon: <Video size={40} />,
            title: "Video Editing",
            desc: "Cinematic, fast-paced editing for YouTube, TikTok, and commercial video content. We turn raw footage into retaining, shareable experiences.",
            deliverables: ["YouTube Long-form", "TikTok / Shorts", "Color Grading", "Motion Graphics Integration"],
            align: "right"
        },
        {
            id: "web-design",
            icon: <Layout size={40} />,
            title: "Website Design",
            desc: "Premium, performance-focused landing pages and full websites built strictly to convert visitors into loyal clients and customers.",
            deliverables: ["UI/UX Design", "Wireframing", "Landing Pages", "Webflow/React Handoffs"],
            align: "left"
        }
    ];

    useEffect(() => {
        const fetchMockups = async () => {
            const { data } = await supabase.from('services').select('id, image_url');
            if (data) {
                const map: { [key: string]: string } = {};
                data.forEach((item: any) => {
                    if (item.image_url) map[item.id] = item.image_url;
                });
                setMockups(map);
            }
        };
        fetchMockups();
    }, []);

    return (
        <div className="pt-[72px]">
            {/* Sub-page Hero */}
            <section className="bg-[#0C0C0C] py-[96px] border-b border-[#1C1C1C]">
                <div className="container text-center max-w-4xl">
                    <div className="inline-flex items-center space-x-2 text-[#A0A0A0] font-[Inter] text-[14px] uppercase tracking-wider mb-6">
                        <span className="hover:text-white transition-colors cursor-pointer">Home</span>
                        <span>/</span>
                        <span className="text-[#FF4D00]">Services</span>
                    </div>
                    <h1 className="font-[SpaceGrotesk] font-bold text-[48px] md:text-[72px] text-[#F0F0F0] uppercase tracking-wide leading-[1.1] mb-6">
                        What We Offer
                    </h1>
                    <p className="font-[Inter] text-[18px] text-[#A0A0A0] leading-[1.7] mx-auto max-w-2xl">
                        We provide an end-to-end creative arsenal. From the first click on a thumbnail to the final conversion on a highly engineered website, we design every touchpoint carefully.
                    </p>
                </div>
            </section>

            {/* Alternating Service Sections */}
            {servicesData.map((service, idx) => (
                <section key={service.id} id={service.id} className={`py-[128px] ${idx % 2 === 0 ? 'bg-[#141414]' : 'bg-[#0C0C0C]'}`}>
                    <div className={`container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${service.align === 'right' ? 'lg:flex-row-reverse' : ''}`}>

                        {/* Content side */}
                        <div className={`space-y-8 ${service.align === 'right' ? 'lg:order-2' : 'lg:order-1'}`}>
                            <div className="text-[#FF4D00]">{service.icon}</div>
                            <h2 className="font-[SpaceGrotesk] font-bold text-[40px] text-[#F0F0F0]">{service.title}</h2>
                            <p className="font-[Inter] text-[18px] text-[#A0A0A0] leading-[1.7] lg:max-w-md">{service.desc}</p>

                            <ul className="space-y-4 font-[Inter] text-[#F0F0F0]">
                                {service.deliverables.map((item, i) => (
                                    <li key={i} className="flex items-center space-x-3">
                                        <svg className="w-5 h-5 text-[#FF4D00]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="pt-4">
                                <Button as="a" href="/contact">Request This Service</Button>
                            </div>
                        </div>

                        {/* Mockup Side */}
                        <div className={`${service.align === 'right' ? 'lg:order-1' : 'lg:order-2'} aspect-square bg-[#1C1C1C] rounded-[16px] border border-[#222] relative overflow-hidden group`}>
                            {mockups[service.id] ? (
                                <div className="w-full h-full">
                                    <img src={mockups[service.id]} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                </div>
                            ) : (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#2A2A2A] to-[#111] opacity-50"></div>
                                    <div className="absolute inset-0 flex items-center justify-center p-12">
                                        <div className="w-full h-full border border-[#444] rounded-[8px] transform group-hover:scale-105 transition-transform duration-700 bg-[#141414] shadow-2xl flex items-center justify-center overflow-hidden">
                                            <div className="w-[80%] h-[80%] border-2 border-[#333] border-dashed rounded flex items-center justify-center opacity-30 text-[#A0A0A0] font-[SpaceGrotesk] uppercase tracking-widest text-[24px]">
                                                {service.title.split(' ')[0]} MOCKUP
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </section>
            ))}
        </div>
    );
};

export default Services;
