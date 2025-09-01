import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export function AnimatedBackground() {
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (blobRef.current) {
        blobRef.current.style.transform = `translate(${e.clientX - 100}px, ${e.clientY - 100}px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Mouse-following gradient blob */}
      <div
        ref={blobRef}
        className="absolute w-[200px] h-[200px] rounded-full opacity-30 dark:opacity-20 transition-transform duration-300 ease-out blur-3xl bg-gradient-to-r from-blue-400 via-purple-500 to-teal-400 dark:from-blue-600 dark:via-purple-700 dark:to-teal-600"
        style={{ transition: 'transform 0.3s ease-out' }}
      />

      {/* Large ambient gradient sphere */}
      <motion.div
        className="absolute -top-40 -right-40 w-[800px] h-[800px] rounded-full opacity-20 dark:opacity-10 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(147,51,234,0.3) 50%, rgba(20,184,166,0.2) 100%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-30 dark:opacity-20 blur-2xl bg-gradient-to-br from-purple-400 to-pink-400 dark:from-purple-600 dark:to-pink-600"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full opacity-25 dark:opacity-15 blur-2xl bg-gradient-to-br from-blue-400 to-teal-400 dark:from-blue-600 dark:to-teal-600"
        animate={{
          x: [0, -40, 0],
          y: [0, 40, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      <motion.div
        className="absolute top-2/3 left-1/6 w-24 h-24 rounded-full opacity-35 dark:opacity-25 blur-xl bg-gradient-to-br from-indigo-400 to-cyan-400 dark:from-indigo-600 dark:to-cyan-600"
        animate={{
          x: [0, 30, 0],
          y: [0, -50, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 4,
        }}
      />

      {/* Geometric glass shapes */}
      <motion.div
        className="absolute top-1/2 right-1/4 w-16 h-16 opacity-15 dark:opacity-10 blur-sm"
        style={{
          background: 'linear-gradient(45deg, rgba(0,0,0,0.1), rgba(0,0,0,0.05))',
          border: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '8px',
        }}
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/2 w-12 h-12 opacity-20 dark:opacity-15 blur-sm"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.08), rgba(0,0,0,0.03))',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: '50%',
        }}
        animate={{
          rotate: [360, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
      }} />
    </div>
  );
}