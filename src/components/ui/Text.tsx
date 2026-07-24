'use client';

import React from 'react';

export type TextVariant =
  | 'display'
  | 'title-lg'
  | 'title-md'
  | 'title-sm'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'caption';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?: TextVariant;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'main' | 'muted' | 'inverse' | 'accent';
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  as,
  variant = 'body-md',
  weight,
  color = 'main',
  children,
  className = '',
  ...props
}) => {
  const variantMap: Record<TextVariant, { tag: React.ElementType; defaultWeight: string; style: string }> = {
    display: {
      tag: 'h1',
      defaultWeight: 'font-bold',
      style: 'text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-none',
    },
    'title-lg': {
      tag: 'h2',
      defaultWeight: 'font-bold',
      style: 'text-2xl sm:text-3xl lg:text-4xl tracking-tight leading-tight',
    },
    'title-md': {
      tag: 'h3',
      defaultWeight: 'font-semibold',
      style: 'text-xl sm:text-2xl tracking-snug leading-snug',
    },
    'title-sm': {
      tag: 'h4',
      defaultWeight: 'font-semibold',
      style: 'text-base sm:text-lg tracking-normal leading-snug',
    },
    'body-lg': {
      tag: 'p',
      defaultWeight: 'font-normal',
      style: 'text-lg leading-relaxed',
    },
    'body-md': {
      tag: 'p',
      defaultWeight: 'font-normal',
      style: 'text-sm sm:text-base leading-relaxed',
    },
    'body-sm': {
      tag: 'p',
      defaultWeight: 'font-normal',
      style: 'text-xs sm:text-sm leading-normal',
    },
    caption: {
      tag: 'span',
      defaultWeight: 'font-medium',
      style: 'text-[11px] tracking-wider uppercase',
    },
  };

  const selectedVariant = variantMap[variant];
  const Component = as || selectedVariant.tag;

  const colorStyles = {
    main: 'text-slate-900',
    muted: 'text-slate-500',
    inverse: 'text-white',
    accent: 'text-blue-600',
  };

  const weightStyles = weight
    ? {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      }[weight]
    : selectedVariant.defaultWeight;

  return (
    <Component
      className={`${selectedVariant.style} ${weightStyles} ${colorStyles[color]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};
