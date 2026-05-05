import { useState, useEffect, useRef } from 'react';

export function Reveal({
  children,
  as = 'div',
  variant = 'up',
  delay = 0,
  afterLoad = 0,
  className = '',
  ...rest
}: any) {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (afterLoad > 0) {
      const t = setTimeout(() => setSeen(true), afterLoad);
      return () => clearTimeout(t);
    }
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [afterLoad]);

  const Tag: any = as;
  const cls = `reveal reveal-${variant} ${seen ? 'in' : ''} ${className}`.trim();
  return (
    <Tag ref={ref} className={cls} data-delay={delay || undefined} {...rest}>
      {children}
    </Tag>
  );
}
