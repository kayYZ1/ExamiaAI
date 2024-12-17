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
  ...props
}: ButtonProps) {
  const baseStyles =
    'px-6 py-3 rounded-lg font-medium transition-colors duration-200';

  const variants = {
    primary: `${colors.primary.main} text-white`,
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-200',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
