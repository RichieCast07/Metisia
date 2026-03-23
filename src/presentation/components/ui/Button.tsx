import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const base = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

const variants: Record<string, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg focus-visible:ring-primary',
  secondary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg focus-visible:ring-slate-900',
  danger: 'bg-error text-white hover:bg-error-dark shadow-md hover:shadow-lg focus-visible:ring-error',
  ghost: 'hover:bg-slate-100 text-slate-600 hover:text-slate-900',
  outline: 'border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-700 shadow-sm',
};

const sizes: Record<string, string> = {
  sm: 'h-9 px-3.5 text-xs gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-7 text-[15px] gap-2.5',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, className = '', children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
);

Button.displayName = 'Button';
export default Button;
