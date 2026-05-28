import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function SmoothScrollHero({
  scrollHeight = 1500,
  initialClipPercentage = 25,
  imageSrc = '/ski-hero.avif',
}) {
  const { scrollY } = useScroll();

  const end = scrollHeight;
  const text1End = scrollHeight * 0.3;
  const text2Start = scrollHeight * 0.7;
  const text2End = scrollHeight * 0.92;

  const clipLeft = useTransform(scrollY, [0, end], [initialClipPercentage, 0]);
  const clipRight = useTransform(scrollY, [0, end], [100 - initialClipPercentage, 100]);
  const scale = useTransform(scrollY, [0, end], [1.7, 1]);

  // First text: fades out early
  const text1Opacity = useTransform(scrollY, [0, text1End], [1, 0]);
  const text1Y = useTransform(scrollY, [0, text1End], ['0%', '-16%']);

  // Second text: fades in when image is fully revealed
  const text2Opacity = useTransform(scrollY, [text2Start, text2End], [0, 1]);
  const text2Y = useTransform(scrollY, [text2Start, text2End], ['18%', '0%']);

  const clipPath = useMotionTemplate`polygon(${clipLeft}% 0%, ${clipRight}% 0%, 100% 50%, ${clipRight}% 100%, ${clipLeft}% 100%, 0% 50%)`;

  return (
    <div style={{ height: `calc(${scrollHeight}px + 100vh)` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background image with clip + zoom */}
        <motion.div className="absolute inset-0" style={{ clipPath }}>
          <motion.img
            src={imageSrc}
            alt="Skier on mountain"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ scale }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/65" />
        </motion.div>

        {/* Initial text — fades out as image expands */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 text-shadow"
          style={{ opacity: text1Opacity, y: text1Y }}
        >
          <p className="text-white/70 text-[12px] font-semibold tracking-[0.2em] uppercase mb-5">
            Data-Driven Coaching
          </p>
          <h1 className="text-[56px] sm:text-[80px] lg:text-[96px] font-semibold leading-none tracking-tight text-white">
            Every run<br />tells a story.
          </h1>
          <p className="mt-7 text-white/80 text-[18px] sm:text-[20px] max-w-[480px] leading-relaxed">
            SlopeIQ reads the numbers your sessions collect and turns them into something you can actually use.
          </p>
        </motion.div>

        {/* Revealed text — fades in when image is fully open */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 text-shadow"
          style={{ opacity: text2Opacity, y: text2Y }}
        >
          <p className="text-white/70 text-[12px] font-semibold tracking-[0.2em] uppercase mb-5">
            SlopeIQ
          </p>
          <h2 className="text-[52px] sm:text-[76px] lg:text-[88px] font-semibold leading-none tracking-tight text-white">
            Your ski data,<br />finally useful.
          </h2>
          <p className="mt-7 text-white/80 text-[18px] sm:text-[20px] max-w-[500px] leading-relaxed">
            Upload your Slopes session. Get a complete breakdown of your performance — grounded in your exact numbers, not generic advice.
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
              className="px-9 py-4 bg-white/15 backdrop-blur-sm text-white font-semibold text-[16px] rounded-full hover:bg-white/30 transition-colors border border-white/30"
            >
              How it works
            </Link>
          </div>
          <p className="mt-5 text-white/50 text-[13px]">One free session. No credit card required.</p>
        </motion.div>
      </div>
    </div>
  );
}
