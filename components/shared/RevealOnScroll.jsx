'use client';

import useScrollReveal from '@/hooks/useScrollReveal';

export default function RevealOnScroll({ children, className = '', as: Tag = 'div', ...props }) {
  const ref = useScrollReveal();
  return (
    <Tag ref={ref} className={`reveal ${className}`} {...props}>
      {children}
    </Tag>
  );
}
