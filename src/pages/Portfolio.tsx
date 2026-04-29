import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const categories = ["All", "Graphic Design", "Logo", "Thumbnails", "Video", "Web"];

const Portfolio: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeFilter, setActiveFilter] = useState("All");
    const [modalData, setModalData] = useState<any | null>(null);
    const [portfolioData, setPortfolioData] = useState<any[]>([]);

    useEffect(() => {
        const fetchPortfolio = async () => {
            const { data } = await supabase.from('portfolio_items').select('*').or('display_location.eq.portfolio,display_location.eq.both,display_location.is.null').order('display_order', { ascending: true });
            if (data && data.length > 0) {
                setPortfolioData(data);

                // Check for project in URL after data is loaded
                const projectId = searchParams.get('project');
                if (projectId) {
                    const item = data.find(p => p.id === projectId || p.id.toString() === projectId);
                    if (item) setModalData(item);
                }
            } else {
                // Mock data if DB is empty
                const mocks = Array.from({ length: 12 }).map((_, i) => ({
                    id: i.toString(),
                    title: `Project ${i + 1}`,
                    category: categories[(i % (categories.length - 1)) + 1],
                    client: "Fraimiix Client",
                    year: "2024",
                    image_url: null
                }));
                setPortfolioData(mocks);

                const projectId = searchParams.get('project');
                if (projectId) {
                    const item = mocks.find(p => p.id === projectId);
                    if (item) setModalData(item);
                }
            }
        };
        fetchPortfolio();
    }, [searchParams]);

    const handleCloseModal = () => {
        setModalData(null);
        setSearchParams({}); // Clear the project param from URL
    };

    const handleOpenModal = (item: any) => {
        setModalData(item);
        setSearchParams({ project: item.id });
    };

    const filteredData = portfolioData.filter(item =>
        activeFilter === "All" || item.category === activeFilter
    );

    return (
        <div className="pt-[72px] min-h-screen bg-[#0C0C0C]">

            {/* Header & Filters */}
            <section className="py-[64px] border-b border-[#1C1C1C]">
                <div className="container">
                    <h1 className="font-[SpaceGrotesk] font-bold text-[48px] md:text-[72px] text-[#F0F0F0] uppercase tracking-wide leading-[1.1] mb-12">
                        Selected Works
                    </h1>

                    <div className="flex flex-wrap gap-4">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`px-6 py-2 rounded-full font-[Inter] text-[14px] uppercase tracking-wider transition-all duration-300 ${activeFilter === cat
                                    ? 'bg-[#FF4D00] text-black font-bold border border-[#FF4D00]'
                                    : 'bg-[#141414] text-[#A0A0A0] border border-[#333] hover:border-[#FF4D00] hover:text-[#F0F0F0]'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className="py-[64px]">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                        {filteredData.map(item => (
                            <div
                                key={item.id}
                                className={`${item.span} relative group cursor-pointer bg-[#141414] rounded-[8px] overflow-hidden border border-[#222]`}
                                onClick={() => handleOpenModal(item)}
                            >
                                {/* Image Pattern or Real Image */}
                                <div className="absolute inset-0 bg-[#1C1C1C] flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                    {item.image_url ? (
                                        item.image_url.toLowerCase().match(/\.(mp4|webm|ogg)$/) ? (
                                            <video
                                                src={item.image_url}
                                                className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                                                muted
                                                loop
                                                autoPlay
                                                playsInline
                                            />
                                        ) : (
                                            <img src={item.image_url} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                        )
                                    ) : (
                                        <div className="text-[#333] font-[SpaceGrotesk] font-bold text-[64px] mix-blend-overlay uppercase">
                                            {item.category.slice(0, 4)}
                                        </div>
                                    )}
                                </div>

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-8 flex flex-col justify-end">
                                    <span className="text-[#FF4D00] font-[Inter] text-[12px] uppercase tracking-wider mb-2">{item.category}</span>
                                    <h3 className="text-white font-[SpaceGrotesk] font-bold text-[28px] mb-2">{item.title}</h3>
                                    <p className="text-[#A0A0A0] font-[Inter] flex items-center">View Project <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            {modalData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={handleCloseModal}></div>

                    {/* Modal Content */}
                    <div className="relative w-full max-w-6xl bg-[#0C0C0C] border border-[#222] rounded-[16px] shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300 h-[92vh] md:h-[85vh] overflow-y-auto md:overflow-hidden">

                        {/* Close Button */}
                        <button
                            onClick={handleCloseModal}
                            className="fixed md:absolute top-4 right-4 z-[120] p-2 bg-black/60 backdrop-blur-md rounded-full text-white/70 hover:text-white transition-colors border border-white/10"
                        >
                            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>

                        {/* Visual Side */}
                        <div className="w-full md:w-3/4 bg-[#141414] border-b md:border-b-0 md:border-r border-[#222] relative flex flex-col p-6 md:p-12 space-y-8 md:overflow-y-auto custom-scrollbar h-auto md:h-full shrink-0 md:shrink">
                            {modalData.gallery_urls && modalData.gallery_urls.length > 0 ? (
                                modalData.gallery_urls.map((url: string, index: number) => {
                                    const isVideo = url.toLowerCase().match(/\.(mp4|webm|ogg)$/);
                                    return (
                                        <div key={index} className="w-full shrink-0 bg-[#0C0C0C] border border-[#222] rounded-[8px] overflow-hidden flex items-center justify-center text-[#555] font-[SpaceGrotesk]">
                                            {isVideo ? (
                                                <video src={url} controls className="w-full h-auto max-h-[80vh]" />
                                            ) : (
                                                <img src={url} alt={`Gallery ${index}`} className="w-full h-auto object-contain max-h-[80vh]" />
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 rounded-full bg-[#222] flex items-center justify-center">
                                        <svg className="w-10 h-10 text-[#444]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    </div>
                                    <p className="text-[#555] font-[SpaceGrotesk] text-[20px]">No Showcase Images Found</p>
                                </div>
                            )}
                        </div>

                        {/* Details Side */}
                        <div className="w-full md:w-1/4 p-8 md:p-12 bg-[#0C0C0C] flex flex-col md:h-full md:overflow-y-auto">
                            <div className="space-y-8">
                                <div>
                                    <span className="text-[#FF4D00] font-[Inter] text-[12px] uppercase tracking-widest font-bold mb-2 block">{modalData.category}</span>
                                    <h2 className="font-[SpaceGrotesk] font-bold text-[32px] text-white leading-tight mb-4">{modalData.title}</h2>
                                    <p className="text-[#888] text-[15px] leading-[1.6] font-[Inter]">
                                        {modalData.description || "A comprehensive creative project focusing on brand elevation and high-performance visual storytelling."}
                                    </p>
                                </div>

                                <div className="space-y-6 py-8 border-t border-[#1a1a1a]">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-[#444] font-[Inter] text-[11px] uppercase tracking-widest font-bold">Client</h4>
                                        <p className="text-[#F0F0F0] font-[Inter] text-[14px]">{modalData.client || "Confidential Client"}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-[#444] font-[Inter] text-[11px] uppercase tracking-widest font-bold">Year</h4>
                                        <p className="text-[#F0F0F0] font-[Inter] text-[14px]">{modalData.year || "2024"}</p>
                                    </div>
                                </div>

                                <div className="pt-6 pb-12 md:pb-0">
                                    <a href="#" className="w-full inline-flex items-center justify-center p-4 bg-[#141414] hover:bg-[#1a1a1a] text-[#F0F0F0] rounded-[4px] border border-[#222] hover:border-[#FF4D00] transition-all text-[13px] font-bold uppercase tracking-widest gap-3 group">
                                        View Live Project
                                        <svg className="w-4 h-4 text-[#FF4D00] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Portfolio;
