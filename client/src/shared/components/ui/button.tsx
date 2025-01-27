import { ButtonHTMLAttributes, ReactNode } from 'react';
import { colors } from '@/styles/theme';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  disabled = false,
  ...props
}: ButtonProps) {
  const variants = {
    primary: `${colors.primary.main} text-white`,
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-200',
  };

  return (
    <button
      className={`rounded-lg px-6 py-3 font-medium transition-colors duration-200 ${variants[variant]} ${className} ${
        disabled && 'cursor-not-allowed opacity-50'
      }`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
