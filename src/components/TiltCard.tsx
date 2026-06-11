import React, { useRef, useState } from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({ children, className = "" }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [glowStyle, setGlowStyle] = useState({ opacity: 0, x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const el = cardRef.current;
    const rect = el.getBoundingClientRect();

    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;  

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation angles (max 8 degrees for clean, premium feel)
    const rotateX = ((centerY - y) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTransformStyle(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`);
    setGlowStyle({ opacity: 0.12, x, y });
  };

  const handleMouseLeave = () => {
    setTransformStyle("perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlowStyle({ opacity: 0, x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden transition-all duration-300 ease-out ${className}`}
      style={{
        transform: transformStyle,
        transformStyle: "preserve-3d"
      }}
    >
      {/* 3D Reflection spotlight under the mouse cursor */}
      <div
        className="absolute pointer-events-none rounded-full w-[200px] h-[200px] bg-white blur-[60px]"
        style={{
          left: glowStyle.x - 100,
          top: glowStyle.y - 100,
          opacity: glowStyle.opacity,
          transition: "opacity 0.2s ease"
        }}
      />
      {children}
    </div>
  );
};

export default TiltCard;
