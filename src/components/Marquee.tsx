import React from 'react';

const Marquee: React.FC = () => {
    const items = [
        "GRAPHIC DESIGN", "LOGO DESIGN", "THUMBNAIL DESIGN",
        "VIDEO EDITING", "WEBSITE DESIGN", "BRANDING", "MOTION GRAPHICS"
    ];

    // Double the items for seamless scrolling
    const scrollItems = [...items, ...items, ...items];

    return (
        <div className="w-full bg-[#141414] py-4 overflow-hidden border-y border-[#1C1C1C]">
            <div className="flex whitespace-nowrap animate-marquee">
                {scrollItems.map((item, index) => (
                    <div key={index} className="flex items-center text-[#555555] font-[Inter] font-medium text-[14px] uppercase tracking-wider">
                        <span className="mx-6 hover:text-[#A0A0A0] transition-colors">{item}</span>
                        <span className="text-[#FF4D00] mx-2">·</span>
                    </div>
                ))}
            </div>

            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
          width: max-content;
        }
      `}</style>
        </div>
    );
};

export default Marquee;
