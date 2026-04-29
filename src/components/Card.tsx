import React from 'react';

interface CardProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    linkText?: string;
    href?: string;
    className?: string;
}

const Card: React.FC<CardProps> = ({
    title,
    description,
    icon,
    linkText = "Learn More",
    href = "#",
    className = ""
}) => {
    return (
        <a
            href={href}
            className={`group block bg-[#141414] border border-[#222222] rounded-[8px] p-[32px] transition-all duration-300 ease-in-out hover:border-[#FF4D00] hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(255,77,0,0.15)] ${className}`}
        >
            {icon && (
                <div className="mb-6 text-[#FF4D00]">
                    {icon}
                </div>
            )}

            <h4 className="font-[SpaceGrotesk] font-medium text-[22px] text-[#F0F0F0] mb-3 group-hover:text-white transition-colors duration-200">
                {title}
            </h4>

            <p className="font-[Inter] font-normal text-[16px] leading-[1.7] text-[#A0A0A0] mb-6 line-clamp-3">
                {description}
            </p>

            <div className="flex items-center text-[#FF4D00] font-[Inter] font-medium text-[14px] uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-200">
                {linkText}
                <svg
                    className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
            </div>
        </a>
    );
};

export default Card;
