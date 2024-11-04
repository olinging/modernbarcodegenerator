import React, { useEffect, useRef } from 'react';

export const DynamicBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = container.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      const hue1 = (x * 60) + 240; // Range from blue to purple
      const hue2 = (y * 60) + 280; // Range from purple to pink
      
      container.style.setProperty('--x-pos', `${x * 100}%`);
      container.style.setProperty('--y-pos', `${y * 100}%`);
      container.style.setProperty('--hue-1', `${hue1}`);
      container.style.setProperty('--hue-2', `${hue2}`);
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative transition-colors duration-300 ease-out
        bg-[radial-gradient(circle_at_var(--x-pos,_50%)_var(--y-pos,_50%),_hsl(var(--hue-1,_240),_70%,_20%)_0%,_hsl(var(--hue-2,_280),_70%,_10%)_50%,_hsl(260,_70%,_5%)_100%)]"
    >
      {children}
    </div>
  );
};