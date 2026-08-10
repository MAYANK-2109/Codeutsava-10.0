import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    const checkHover = () => {
      const element = document.elementFromPoint(position.x, position.y);
      if (!element) {
        setIsHovering(false);
        return;
      }
      
      const isInteractive = 
        element.tagName.toLowerCase() === 'a' ||
        element.tagName.toLowerCase() === 'button' ||
        element.closest('a') !== null ||
        element.closest('button') !== null ||
        window.getComputedStyle(element).cursor === 'pointer';
        
      setIsHovering(isInteractive);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    checkHover();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [position.x, position.y]);

  if (typeof window === 'undefined' || window.innerWidth < 768) return null; // Hide on mobile

  return (
    <>
      {/* Outer glow ring */}
      <motion.div
        className={cn(
          "fixed top-0 left-0 w-8 h-8 rounded-full border border-neon-cyan/50 pointer-events-none z-[9999] mix-blend-screen transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        animate={{
          x: position.x - 16,
          y: position.y - 16,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? "rgba(0, 240, 255, 0.1)" : "rgba(0, 0, 0, 0)",
          borderColor: isHovering ? "rgba(0, 240, 255, 0.8)" : "rgba(0, 240, 255, 0.5)",
          boxShadow: isHovering ? "0 0 20px rgba(0, 240, 255, 0.6)" : "0 0 0px rgba(0, 240, 255, 0)",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 28,
          mass: 0.5,
        }}
      />
      {/* Inner dot */}
      <motion.div
        className={cn(
          "fixed top-0 left-0 w-2 h-2 rounded-full bg-neon-cyan pointer-events-none z-[10000] mix-blend-screen transition-opacity duration-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          scale: isHovering ? 0 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 800,
          damping: 20,
        }}
      />
    </>
  );
}
