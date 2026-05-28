const BELIEFS = [
  'Your data should tell you something you didn\'t already know.',
  'Coaching should be personal, not generic.',
  'The mountain changes. Your plan should too.',
];

export default function About() {
  return (
    <div className="max-w-[760px] mx-auto px-6 py-24">
      <p className="eyebrow">About SlopeIQ</p>
      <h1 className="text-[52px] sm:text-[64px] font-semibold leading-[1.05] tracking-tight mt-5 text-ink">
        Built by skiers,<br />for skiers.
      </h1>

      <div className="mt-12 space-y-6 text-[17px] text-muted leading-relaxed">
        <p>
          If you're reading this, you're probably like us — spending days on the mountain, recording every run, and then watching that data sit completely unused on your phone.
        </p>
        <p>
          The Slopes app captures everything: speed, vertical, timestamps, run counts. It was all there. But nobody was doing anything meaningful with it. You'd get a summary of how many feet you skied and call it a day.
        </p>
        <p>
          SlopeIQ exists to change that. Not generic tips. Not motivational noise. Specific observations about your skiing — grounded in your own numbers — updated every time you get on the mountain. An AI that knows whether your fatigue window hits at run 7 or run 12. A Mountain Coach that knows your ability level and builds your optimal day before you even click in.
        </p>
        <p>
          We believe you should be the expert on your own skiing. Not outsourcing that to a generic algorithm. SlopeIQ puts the data back in your hands.
        </p>
      </div>

      <div className="mt-20 border-t border-line pt-16">
        <p className="eyebrow mb-10">What we believe</p>
        <div className="space-y-8">
          {BELIEFS.map((b, i) => (
            <div key={i} className="flex items-start gap-6">
              <span className="text-coral font-bold text-[20px] leading-none mt-1 tabular-nums">{i + 1}.</span>
              <p className="text-[22px] font-semibold text-ink leading-snug tracking-tight">"{b}"</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 border-t border-line pt-16">
        <div className="card p-8">
          <p className="eyebrow mb-4">Privacy</p>
          <p className="text-muted text-[16px] leading-relaxed">
            Your raw GPS data never leaves your device. SlopeIQ parses your .slopes file in the browser and transmits only derived metrics — speeds, vertical totals, run durations — to the AI. We don't know where you ski unless you tell the Mountain Coach. We don't sell your data. Ever.
          </p>
        </div>
      </div>
    </div>
  );
}
