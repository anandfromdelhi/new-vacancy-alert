import React, { useEffect, useRef } from 'react';

interface AdsterraBannerProps {
  className?: string;
}

export default function AdsterraBanner({ className = '' }: AdsterraBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear element to avoid duplicate scripts on re-renders
    containerRef.current.innerHTML = '';

    const containerDiv = document.createElement('div');
    containerDiv.id = 'container-0a47d096a2b86f6ada5830ffedbf86ff';

    const script = document.createElement('script');
    script.src = 'https://mittengulped.com/0a47d096a2b86f6ada5830ffedbf86ff/invoke.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');

    containerRef.current.appendChild(script);
    containerRef.current.appendChild(containerDiv);
  }, []);

  return (
    <div className={`w-full flex flex-col items-center justify-center my-4 overflow-hidden min-h-[90px] ${className}`}>
      <div ref={containerRef} className="max-w-full flex justify-center items-center" />
    </div>
  );
}
