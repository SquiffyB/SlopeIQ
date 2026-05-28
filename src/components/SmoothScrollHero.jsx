import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function SmoothScrollHero({
  scrollHeight = 1500,
  initialClipPercentage = 25,
  imageSrc = '/ski-hero.avif',
}) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const clipLeft = useTransform(scrollYProgress, [0, 1], [initialClipPercentage, 0]);
  const clipRight = useTransform(scrollYProgress, [0, 1], [100 - initialClipPercentage, 100]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.7, 1]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.35], ['0%', '-12%']);

  const clipPath = useMotionTemplate`polygon(${clipLeft}% 0%, ${clipRight}% 0%, 100% 50%, ${clipRight}% 100%, ${clipLeft}% 100%, 0% 50%)`;

  return (
    <div ref={containerRef} style={{ height: `calc(${scrollHeight}px + 100vh)` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background image with clip + zoom */}
        <motion.div className="absolute inset-0" style={{ clipPath }}>
          <motion.img
            src={imageSrc}
            alt="Skier on mountain"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ scale }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </motion.div>

        {/* Hero text */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10"
          style={{ opacity: textOpacity, y: textY }}
        >
          <p className="text-white/60 text-[12px] font-semibold tracking-[0.2em] uppercase mb-5">
            AI Coaching for Skiers
          </p>
          <h1 className="text-[56px] sm:text-[80px] lg:text-[96px] font-semibold leading-none tracking-tight text-white">
            Your ski data,<br />finally useful.
          </h1>
          <p className="mt-7 text-white/70 text-[18px] sm:text-[20px] max-w-[480px] leading-relaxed">
            Upload your Slopes session. Get coaching grounded in your own numbers — not generic tips.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-9 py-4 bg-white text-ink font-semibold text-[16px] rounded-full hover:bg-white/90 transition-colors"
            >
              Get started free
            </Link>
            <Link
              to="/how-it-works"
              className="px-9 py-4 bg-white/15 backdrop-blur-sm text-white font-semibold text-[16px] rounded-full hover:bg-white/25 transition-colors border border-white/20"
            >
              How it works
            </Link>
          </div>
          <p className="mt-5 text-white/40 text-[13px]">One free session. No credit card required.</p>
        </motion.div>
      </div>
    </div>
  );
}
