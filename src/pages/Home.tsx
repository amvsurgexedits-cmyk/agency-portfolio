import React from 'react';
import Button from '../components/Button';
import Marquee from '../components/Marquee';
import Card from '../components/Card';
import { Palette, PenTool, Layout, Video, MonitorPlay, Zap } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { supabase } from '../lib/supabaseClient';

const Home: React.FC = () => {
    const setRef = useScrollAnimation({ threshold: 0.1 });
    const [stats, setStats] = React.useState<any[]>([]);
    const [featuredWork, setFeaturedWork] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchData = async () => {
            // Fetch Stats
            const { data: statsData } = await supabase.from('stats').select('*').order('display_order', { ascending: true });
            if (statsData && statsData.length > 0) setStats(statsData);
            else setStats([
                { value: "120+", label: "Projects Delivered" },
                { value: "84%", label: "Client Satisfaction" },
                { value: "20+", label: "Global Clients" },
                { value: "4.5★", label: "Average Rating" }
            ]);

            // Fetch Featured Work (Top 3)
            const { data: portfolioData } = await supabase.from('portfolio_items').select('*').in('display_location', ['home', 'both']).order('created_at', { ascending: false }).limit(3);
            if (portfolioData && portfolioData.length > 0) setFeaturedWork(portfolioData);
        };
        fetchData();
    }, []);

    return (
        <div className="pt-[72px]">
            {/* 2. Hero Section */}
            <section className="relative min-h-[calc(100vh-72px)] flex items-center overflow-hidden">
                {/* Glow */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--glow-accent)] rounded-full blur-[100px] -z-10 pointer-events-none"></div>

                <div className="container grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-24">
                    <div className="lg:col-span-7 space-y-8 z-10">
                        <div className="inline-block bg-[#1C1C1C] border border-[#333] text-[#A0A0A0] font-[Inter] font-medium text-[12px] uppercase tracking-[0.1em] px-[14px] py-[6px] rounded-full">
                            Creative Agency · Est. 2020
                        </div>

                        <h1 className="font-[SpaceGrotesk] font-bold text-[48px] md:text-[72px] lg:text-[96px] leading-[1.05] uppercase tracking-[0.04em] text-[#F0F0F0]">
                            We Build Visuals That <span className="text-[#FF4D00]">Sell.</span>
                        </h1>

                        <p className="font-[Inter] text-[18px] md:text-[20px] text-[#A0A0A0] max-w-[600px] leading-[1.6]">
                            Graphic Design · Logo · Thumbnails · Video Editing · Web Design
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Button as="a" href="/portfolio">See Our Work</Button>
                            <Button variant="ghost" as="a" href="/services">View Services</Button>
                        </div>
                    </div>

                    <div className="lg:col-span-5 relative h-[500px] hidden lg:block">
                        {/* Abstract Floating UI Mockups */}
                        <div className="absolute top-[10%] left-[20%] w-full h-full">
                            {/* Fake Website Mockup */}
                            <div className="absolute top-0 right-0 w-[400px] h-[260px] bg-[#141414] border border-[#222] rounded-[8px] shadow-[0_32px_64px_rgba(0,0,0,0.8)] z-10 transform -rotate-2 hover:rotate-0 transition-transform duration-500 overflow-hidden">
                                <div className="w-full h-6 border-b border-[#222] bg-[#1C1C1C] flex items-center px-4 space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-[#555]"></div>
                                    <div className="w-2 h-2 rounded-full bg-[#555]"></div>
                                    <div className="w-2 h-2 rounded-full bg-[#555]"></div>
                                </div>
                                <div className="p-6">
                                    <div className="w-3/4 h-8 bg-[#222] rounded mb-4"></div>
                                    <div className="w-full h-4 bg-[#1C1C1C] rounded mb-2"></div>
                                    <div className="w-5/6 h-4 bg-[#1C1C1C] rounded mb-8"></div>
                                    <div className="w-32 h-10 bg-[#FF4D00] rounded"></div>
                                </div>
                            </div>

                            {/* Fake Mobile Mockup */}
                            <div className="absolute bottom-[20%] left-[-10%] w-[180px] h-[360px] bg-[#0C0C0C] border-2 border-[#333] rounded-[24px] shadow-[0_32px_64px_rgba(0,0,0,0.8)] z-20 transform rotate-6 hover:rotate-0 transition-transform duration-500 overflow-hidden">
                                <div className="p-4 flex flex-col h-full">
                                    <div className="w-1/2 h-4 bg-[#222] rounded-full mb-6 mx-auto"></div>
                                    <div className="flex-1 bg-[#1C1C1C] rounded-[12px] mb-4"></div>
                                    <div className="w-full h-12 bg-[#FF4D00] rounded-[8px]"></div>
                                </div>
                            </div>

                            {/* Fake Logo Card */}
                            <div className="absolute bottom-[10%] right-[10%] w-[200px] h-[200px] bg-[#FF4D00] rounded-[8px] shadow-[0_16px_48px_rgba(255,77,0,0.3)] z-30 transform -rotate-6 hover:rotate-0 transition-transform duration-500 flex items-center justify-center">
                                <div className="text-white font-[SpaceGrotesk] font-bold text-[30px] tracking-wide">FRAIMIIX</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A0A0A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <polyline points="19 12 12 19 5 12"></polyline>
                    </svg>
                </div>
            </section>

            {/* 3. Marquee Strip */}
            <div ref={setRef as any} className="animate-fade-up">
                <Marquee />
            </div>

            {/* 4. Stats Bar */}
            <section ref={setRef as any} className="border-b border-[#1C1C1C] animate-fade-up">
                <div className="container divide-y md:divide-y-0 md:divide-x divide-[#222] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="py-16 px-8 flex flex-col items-center justify-center text-center hover:bg-[#141414] transition-colors duration-300">
                            <div className="font-[SpaceGrotesk] font-bold text-[48px] md:text-[56px] text-[#FF4D00] leading-none mb-2">
                                {stat.value || stat.num}
                            </div>
                            <div className="font-[Inter] font-medium text-[14px] text-[#A0A0A0] uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. Services Preview */}
            <section ref={setRef as any} className="py-[96px] bg-[#0C0C0C] animate-fade-up">
                <div className="container">
                    <div className="mb-16 md:w-1/2">
                        <div className="inline-block bg-[#1C1C1C] border border-[#333] text-[#A0A0A0] font-[Inter] font-medium text-[12px] uppercase tracking-[0.1em] px-[14px] py-[6px] rounded-full mb-6">
                            WHAT WE DO
                        </div>
                        <h2 className="font-[SpaceGrotesk] font-semibold text-[40px] md:text-[52px] text-[#F0F0F0] leading-[1.1]">
                            Our Core Services
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card
                            icon={<Palette size={32} />}
                            title="Graphic Design"
                            description="High-converting visual assets for social media, ad campaigns, and digital marketing materials."
                            href="/services#graphic-design"
                        />
                        <Card
                            icon={<PenTool size={32} />}
                            title="Logo Design"
                            description="Memorable, versatile, and strategic brand marks that define your company's identity."
                            href="/services#logo-design"
                        />
                        <Card
                            icon={<MonitorPlay size={32} />}
                            title="Thumbnail Design"
                            description="Click-worthy YouTube thumbnails designed to maximize CTR and viewer engagement."
                            href="/services#thumbnail-design"
                        />
                        <Card
                            icon={<Video size={32} />}
                            title="Video Editing"
                            description="Cinematic, fast-paced editing for YouTube, TikTok, and commercial video content."
                            href="/services#video-editing"
                        />
                        <Card
                            icon={<Layout size={32} />}
                            title="Website Design"
                            description="Premium, performance-focused landing pages and full websites built to convert visitors."
                            href="/services#web-design"
                        />
                        <Card
                            icon={<Zap size={32} />}
                            title="View All Services"
                            description="Discover our full range of creative capabilities and custom packages."
                            linkText="See Pricing & Details"
                            href="/services"
                            className="border-[#FF4D00]/30"
                        />
                    </div>
                </div>
            </section>

            {/* 6. Featured Work (Portfolio Teaser Bento Grid) */}
            <section ref={setRef as any} className="py-[96px] bg-[#141414] border-y border-[#1C1C1C] animate-fade-up">
                <div className="container">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-6 md:space-y-0">
                        <div>
                            <h2 className="font-[SpaceGrotesk] font-semibold text-[40px] md:text-[52px] text-[#F0F0F0] leading-[1.1]">
                                Work That Speaks
                            </h2>
                        </div>
                        <Button variant="ghost" as="a" href="/portfolio">View Full Portfolio</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[800px]">
                        {/* Tile 1: Large (2x2 on desktop) */}
                        <a href={`/portfolio?project=${featuredWork[0]?.id}`} className="group relative col-span-1 md:col-span-2 md:row-span-2 rounded-[8px] overflow-hidden bg-[#1C1C1C] block h-[400px] md:h-full">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#222] to-[#111] opacity-50 group-hover:opacity-30 transition-opacity z-0"></div>
                            {featuredWork[0]?.image_url ? (
                                <img src={featuredWork[0].image_url} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="" />
                            ) : (
                                <div className="absolute inset-x-8 inset-y-8 border border-[#333] rounded overflow-hidden">
                                    <div className="w-full h-8 bg-[#2A2A2A] flex items-center px-4"><div className="w-16 h-2 bg-[#444] rounded"></div></div>
                                    <div className="w-full h-full bg-[#1A1A1A] p-8 flex flex-col gap-4">
                                        <div className="w-3/4 h-[120px] bg-[#222] rounded-xl"></div>
                                        <div className="w-1/2 h-[120px] bg-[#222] rounded-xl self-end"></div>
                                    </div>
                                </div>
                            )}
                            <div className="absolute top-6 left-6 z-10">
                                <span className="bg-[#1C1C1C] text-[#A0A0A0] border border-[#333] font-[Inter] font-medium text-[12px] uppercase px-[14px] py-[6px] rounded-full">
                                    {featuredWork[0]?.category || 'Creative'}
                                </span>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-[#0C0C0C] to-transparent transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="font-[SpaceGrotesk] font-bold text-[32px] text-white group-hover:text-[#FF4D00] transition-colors mb-2">
                                    {featuredWork[0]?.title || 'Featured Project'}
                                </h3>
                                <p className="text-[#A0A0A0] font-[Inter] flex items-center">View Project <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></p>
                            </div>
                        </a>

                        {/* Tile 2: Top Right (2x1) */}
                        <a href={`/portfolio?project=${featuredWork[1]?.id}`} className="group relative col-span-1 md:col-span-2 rounded-[8px] overflow-hidden bg-[#1C1C1C] block h-[300px] md:h-full border border-[#222]">
                            {featuredWork[1]?.image_url && (
                                <img src={featuredWork[1].image_url} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" alt="" />
                            )}
                            <div className="absolute top-6 left-6 z-10">
                                <span className="bg-[#1C1C1C] text-[#A0A0A0] border border-[#333] font-[Inter] font-medium text-[12px] uppercase px-[14px] py-[6px] rounded-full">
                                    {featuredWork[1]?.category || 'Branding'}
                                </span>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center p-12">
                                <div className="font-[SpaceGrotesk] font-bold text-[64px] text-[#333] tracking-tighter group-hover:text-[#FF4D00] transition-colors duration-500 uppercase overflow-hidden text-center leading-[1]">
                                    {featuredWork[1]?.title || 'Oasis'}
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#0C0C0C] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <h3 className="font-[SpaceGrotesk] font-bold text-[24px] text-white mb-1">{featuredWork[1]?.title || 'Identity Design'}</h3>
                            </div>
                        </a>

                        {/* Tile 3: Bottom Middle (1x1) */}
                        <a href={`/portfolio?project=${featuredWork[2]?.id}`} className="group relative col-span-1 rounded-[8px] overflow-hidden bg-[#1C1C1C] block h-[300px] md:h-full border border-[#222]">
                            {featuredWork[2]?.image_url && (
                                <img src={featuredWork[2].image_url} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="" />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                <Video className="w-16 h-16 text-[#333] group-hover:text-[#FF4D00] group-hover:scale-110 transition-all duration-300" />
                            </div>
                            <div className="absolute top-4 left-4 z-10">
                                <span className="bg-[#1C1C1C]/80 backdrop-blur-sm text-[#A0A0A0] border border-[#333] font-[Inter] font-medium text-[10px] uppercase px-3 py-1 rounded-full">
                                    {featuredWork[2]?.category || 'Video'}
                                </span>
                            </div>
                        </a>

                        {/* Tile 4: Bottom Right (1x1) */}
                        <a href="/portfolio" className="group relative col-span-1 border border-[#FF4D00]/50 rounded-[8px] overflow-hidden bg-[#FF4D00]/10 flex flex-col items-center justify-center h-[300px] md:h-full hover:bg-[#FF4D00] transition-colors duration-300">
                            <h3 className="font-[SpaceGrotesk] font-bold text-[24px] text-white text-center px-6 group-hover:text-black">
                                View All<br />Case Studies
                            </h3>
                            <div className="mt-4 w-10 h-10 rounded-full border border-white flex items-center justify-center group-hover:border-black group-hover:text-black text-white">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* 7. Why Choose Us */}
            <section ref={setRef as any} className="py-[128px] bg-[#0C0C0C] animate-fade-up">
                <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-12">
                        <h2 className="font-[SpaceGrotesk] font-semibold text-[40px] md:text-[52px] text-[#F0F0F0] leading-[1.1]">
                            Why Work With Us?
                        </h2>
                        <div className="space-y-8">
                            {[
                                { n: "01", t: "Fast Delivery", d: "We respect deadlines. Expect turnaround times that keep your marketing agile." },
                                { n: "02", t: "Unlimited Revisions", d: "We work until you're 100% satisfied. No hidden fees for making it perfect." },
                                { n: "03", t: "Dedicated Manager", d: "One point of contact. Clear communication via Slack, Email, or WhatsApp." },
                                { n: "04", t: "Multi-Service Studio", d: "From logos to video to web. Get all your creative needs met under one roof." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 group cursor-default">
                                    <div className="font-[SpaceGrotesk] font-bold text-[48px] text-[#1C1C1C] leading-none group-hover:text-[#FF4D00] transition-colors duration-300">
                                        {item.n}
                                    </div>
                                    <div>
                                        <h4 className="font-[SpaceGrotesk] font-semibold text-[22px] text-[#F0F0F0] mb-2">{item.t}</h4>
                                        <p className="font-[Inter] text-[#A0A0A0] leading-[1.6] max-w-[400px]">{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative rounded-[24px] overflow-hidden aspect-[4/5] bg-[#141414] border border-[#222] hidden lg:block">
                        {/* Abstract visual representation of workflow */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 gap-6">
                            <div className="w-full h-1/3 bg-[#1C1C1C] rounded-[16px] border border-[#333] transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500 flex items-center px-8 shadow-2xl">
                                <div className="w-12 h-12 bg-[#FF4D00] rounded-full"></div>
                                <div className="ml-6 flex-1"><div className="w-3/4 h-4 bg-[#333] rounded mb-3"></div><div className="w-1/2 h-3 bg-[#222] rounded"></div></div>
                            </div>
                            <div className="w-full h-1/3 bg-[#1C1C1C] rounded-[16px] border border-[#333] transform rotate-[3deg] hover:rotate-0 transition-transform duration-500 flex items-center px-8 shadow-2xl ml-12">
                                <div className="w-12 h-12 border-2 border-[#FF4D00] rounded flex items-center justify-center text-[#FF4D00] font-bold">✓</div>
                                <div className="ml-6 flex-1"><div className="w-2/3 h-4 bg-[#333] rounded mb-3"></div><div className="w-1/3 h-3 bg-[#222] rounded"></div></div>
                            </div>
                            <div className="w-[1px] h-full bg-gradient-to-b from-[#FF4D00] to-transparent absolute left-24 -z-10"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. CTA Banner */}
            <section ref={setRef as any} className="bg-[#FF4D00] py-[96px] animate-fade-up">
                <div className="container text-center flex flex-col items-center">
                    <h2 className="font-[SpaceGrotesk] font-bold text-[40px] md:text-[64px] text-[#0C0C0C] uppercase tracking-wide leading-[1.1] mb-6 max-w-[800px]">
                        Ready to Elevate Your Brand?
                    </h2>
                    <p className="font-[Inter] text-[20px] text-[#222] mb-12">
                        Let's create something remarkable together.
                    </p>
                    <Button variant="dark" as="a" href="/contact">Start a Project</Button>
                </div>
            </section>

        </div>
    );
};

export default Home;
