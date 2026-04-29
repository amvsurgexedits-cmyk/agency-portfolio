import React, { useState, useEffect } from 'react';
import Button from '../components/Button';
import { Target, Zap, Shield, Figma, PenTool, Monitor, Video, Code, Box, Linkedin, Instagram, Wrench } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const About: React.FC = () => {
    const [team, setTeam] = useState<any[]>([]);
    const [tools, setTools] = useState<any[]>([]);
    // Keeping stats static as requested to remove from admin
    const stats = [
        { value: "400+", label: "Projects Completed" },
        { value: "50+", label: "Active Brands" },
        { value: "24h", label: "Support Response" },
        { value: "100%", label: "Creation Focus" }
    ];

    useEffect(() => {
        const fetchData = async () => {
            // Fetch Team
            const { data: teamData } = await supabase.from('team_members').select('*').order('display_order', { ascending: true });
            if (teamData && teamData.length > 0) setTeam(teamData);
            else setTeam([
                { name: "Alex Mercer", role: "Creative Director" },
                { name: "Jordan Lee", role: "Lead UI/UX" },
                { name: "Sarah Chen", role: "Motion / Video" },
                { name: "Marcus Webb", role: "Brand Strategist" }
            ]);

            // Fetch Tools
            const { data: toolsData } = await supabase.from('tools').select('*').order('display_order', { ascending: true });
            if (toolsData && toolsData.length > 0) setTools(toolsData);
        };
        fetchData();
    }, []);

    return (
        <div className="pt-[72px]">

            {/* Hero */}
            <section className="bg-[#0C0C0C] py-[128px] border-b border-[#1C1C1C]">
                <div className="container text-center max-w-4xl">
                    <h1 className="font-[SpaceGrotesk] font-bold text-[48px] md:text-[72px] lg:text-[96px] text-[#F0F0F0] uppercase tracking-wide leading-[1.05] mb-8">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D00] to-[#FF7A3D]">Studio</span><br /> Behind the Work
                    </h1>
                    <p className="font-[Inter] text-[20px] text-[#A0A0A0] leading-[1.8] mx-auto max-w-3xl">
                        We're a collective of designers, editors, and engineers obsessed with visual metrics. We don't just make things look pretty—we architect digital assets strategically engineered to grab attention, build trust, and drive conversions.
                    </p>
                </div>
            </section>

            {/* Experience / Stats Section */}
            <section className="py-[128px] bg-[#0C0C0C] border-b border-[#1C1C1C]">
                <div className="container grid grid-cols-2 lg:grid-cols-4 gap-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center group">
                            <div className="font-[SpaceGrotesk] font-bold text-[48px] md:text-[64px] text-white group-hover:text-[#FF4D00] transition-colors duration-300 mb-2">
                                {stat.value}
                            </div>
                            <div className="font-[Inter] text-[#A0A0A0] uppercase tracking-widest text-[12px] font-bold">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Team */}
            <section className="py-[128px] bg-[#141414]">
                <div className="container">
                    <div className="text-left mb-16">
                        <h2 className="font-[SpaceGrotesk] font-bold text-[40px] md:text-[52px] text-[#F0F0F0]">The Core Team</h2>
                        <div className="w-[80px] h-[4px] bg-[#FF4D00] mt-6"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, i) => (
                            <div key={i} className="group">
                                <div className="w-full aspect-square bg-[#1C1C1C] rounded-[8px] mb-6 overflow-hidden border border-[#222] relative group-hover:border-[#FF4D00] transition-colors duration-300 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] to-transparent opacity-60"></div>
                                    <div className="absolute inset-0 flex items-center justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20 bg-black/40 backdrop-blur-sm">
                                        <div className="flex space-x-4">
                                            {member.linkedin_url && (
                                                <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 hover:bg-[#FF4D00] text-white rounded-full transition-colors">
                                                    <Linkedin size={20} />
                                                </a>
                                            )}
                                            {member.instagram_url && (
                                                <a href={member.instagram_url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 hover:bg-[#FF4D00] text-white rounded-full transition-colors">
                                                    <Instagram size={20} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    {member.image_url ? (
                                        <img src={member.image_url} className="w-full h-full object-cover" />
                                    ) : (
                                        /* Avatar Placeholder */
                                        <div className="w-24 h-24 rounded-full border-2 border-[#333] border-dashed font-[SpaceGrotesk] text-[32px] font-bold text-[#444] flex items-center justify-center">
                                            {member.name.split(' ').map((n: string) => n[0]).join('')}
                                        </div>
                                    )}
                                </div>
                                <h4 className="font-[SpaceGrotesk] font-bold text-[24px] text-white group-hover:text-[#FF4D00] transition-colors">{member.name}</h4>
                                <p className="font-[Inter] text-[#A0A0A0] uppercase tracking-wider text-[12px] mt-2">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-[128px] bg-[#0C0C0C]">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { icon: <Target size={40} />, title: "Strategic", desc: "Every pixel has a purpose. We don't do 'art for art's sake'—we design for business outcomes and measurable KPIs." },
                            { icon: <Zap size={40} />, title: "Creative", desc: "Standing out requires bold choices. We push visual boundaries to ensure your brand cuts through the noise of safe, boring competitors." },
                            { icon: <Shield size={40} />, title: "Reliable", desc: "Speed and consistency are our backbone. We integrate seamlessly into your workflow like an in-house partner." }
                        ].map((val, i) => (
                            <div key={i} className="bg-[#141414] p-10 border border-[#222] rounded-[8px] hover:-translate-y-2 transition-transform duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                                <div className="text-[#FF4D00] mb-8 bg-[#1C1C1C] w-16 h-16 rounded-full flex items-center justify-center border border-[#333]">{val.icon}</div>
                                <h3 className="font-[SpaceGrotesk] font-bold text-[28px] text-white mb-4">{val.title}</h3>
                                <p className="font-[Inter] text-[#A0A0A0] leading-[1.7]">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tools / Tech Stack */}
            <section className="py-[64px] bg-[#141414] border-t border-[#1C1C1C] overflow-hidden">
                <div className="container text-center mb-12">
                    <p className="font-[Inter] text-[#555] uppercase tracking-[0.2em] text-[14px] font-bold">The tools we use to build</p>
                </div>
                <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-90 transition-all duration-500">
                    {tools.length > 0 ? (
                        tools.map((tool) => (
                            <div key={tool.id} className="group flex flex-col items-center space-y-3">
                                <div className="w-20 h-20 flex items-center justify-center p-3 rounded-[12px] bg-[#1C1C1C] border border-[#333] group-hover:border-[#FF4D00] group-hover:bg-[#222] transition-all duration-300 shadow-lg">
                                    {tool.image_url ? (
                                        <img src={tool.image_url} alt={tool.name} className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,77,0,0.2)]" />
                                    ) : (
                                        <Wrench className="text-[#FF4D00]" size={32} />
                                    )}
                                </div>
                                <span className="font-[Inter] text-[12px] text-[#A0A0A0] group-hover:text-white uppercase tracking-[0.2em] font-bold transition-colors">{tool.name}</span>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-wrap justify-center gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                            <Figma size={48} className="text-[#A0A0A0] hover:text-[#FF4D00] transition-colors" />
                            <PenTool size={48} className="text-[#A0A0A0] hover:text-[#FF4D00] transition-colors" />
                            <Video size={48} className="text-[#A0A0A0] hover:text-[#FF4D00] transition-colors" />
                            <Monitor size={48} className="text-[#A0A0A0] hover:text-[#FF4D00] transition-colors" />
                            <Code size={48} className="text-[#A0A0A0] hover:text-[#FF4D00] transition-colors" />
                            <Box size={48} className="text-[#A0A0A0] hover:text-[#FF4D00] transition-colors" />
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Box */}
            <section className="py-[128px] bg-[#0C0C0C]">
                <div className="container">
                    <div className="bg-gradient-to-br from-[#1A110D] to-[#0A0705] border border-[#FF4D00]/20 rounded-[24px] p-12 md:p-24 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] bg-[#FF4D00] opacity-10 blur-[100px] rounded-full"></div>
                        <h2 className="font-[SpaceGrotesk] font-bold text-[40px] md:text-[56px] text-white relative z-10 mb-6">Let's build something iconic.</h2>
                        <Button as="a" href="/contact" className="relative z-10 shadow-[0_0_40px_rgba(255,77,0,0.3)]">Work With Us</Button>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default About;
