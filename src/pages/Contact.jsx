import { motion } from 'framer-motion';

const BLUE = '#1B76DC';
const INK = '#0B2039';
const MUTED = '#52546A';
const LINE = 'rgba(11,32,57,0.08)';

const EMAIL = 'eli.zolan@slopeiq.co';

export default function Contact() {
  return (
    <section className="min-h-screen flex items-center px-6" style={{ background: '#F5F5F3' }}>
      <motion.div
        className="max-w-[620px] mx-auto w-full text-center pt-24 pb-20"
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-[12px] tracking-[0.22em] uppercase font-semibold" style={{ color: BLUE }}>Contact</p>
        <h1 className="font-display font-bold mt-4" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.4rem)', lineHeight: 1.02, color: INK }}>
          Get in touch.
        </h1>
        <p className="mt-5 text-[18px] leading-[1.6]" style={{ color: MUTED }}>
          Questions, feedback, or account help — reach out and we'll get back to you.
        </p>

        <a
          href={`mailto:${EMAIL}`}
          className="inline-block mt-10 px-7 py-4 rounded-xl text-[16px] font-semibold text-white transition-transform hover:-translate-y-0.5"
          style={{ background: BLUE, boxShadow: `0 6px 20px ${BLUE}40` }}
        >
          {EMAIL}
        </a>

        <div className="mt-12 pt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[14px]"
          style={{ borderTop: `1px solid ${LINE}` }}>
          <a href={`mailto:${EMAIL}`} className="font-medium transition-colors" style={{ color: MUTED }}>Email</a>
          <a href="https://getslopes.com" target="_blank" rel="noopener noreferrer" className="font-medium transition-colors" style={{ color: MUTED }}>Slopes App</a>
          <a href="/" className="font-medium transition-colors" style={{ color: MUTED }}>Back to home</a>
        </div>

        <p className="mt-10 text-[13px]" style={{ color: 'rgba(11,32,57,0.4)' }}>
          SlopeIQ is not affiliated with the Slopes app.
        </p>
      </motion.div>
    </section>
  );
}
