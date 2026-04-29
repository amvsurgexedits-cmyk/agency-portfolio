import React from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'dark';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  className?: string;
  as?: 'button' | 'a';
  href?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  as = 'button',
  href,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-[SpaceGrotesk] font-bold text-[14px] uppercase tracking-[0.08em] px-[32px] py-[14px] rounded-[4px] transition-all duration-200 ease-in-out whitespace-nowrap';
  
  const variants = {
    primary: 'bg-[#FF4D00] text-white hover:bg-[#FF7A3D]',
    ghost: 'bg-transparent border border-[#FF4D00] text-[#FF4D00] hover:bg-[#FF4D00] hover:text-white',
    dark: 'bg-[#1C1C1C] border border-[#333333] text-[#F0F0F0] hover:border-[#FF4D00]'
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`;

  if (as === 'a' && href) {
    return (
      <a href={href} className={combinedClassName}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
