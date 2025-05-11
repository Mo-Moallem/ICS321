import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  bordered?: boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  footer,
  bordered = false,
  hoverable = false,
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg overflow-hidden 
        ${bordered ? 'border border-gray-200' : 'shadow-md'} 
        ${hoverable ? 'transition-shadow duration-300 hover:shadow-lg' : ''}
        ${className}
      `}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-200">
          {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">{footer}</div>}
    </div>
  );
};