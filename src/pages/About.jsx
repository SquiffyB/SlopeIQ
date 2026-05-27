const BELIEFS = [
  'Your data should tell you something you didn\'t already know.',
  'Coaching should be personal, not generic.',
  'The mountain changes. Your plan should too.',
];

export default function About() {
  return (
    <div className="max-w-[900px] mx-auto px-6 py-24">
      <div className="max-w-[640px]">
        <p className="eyebrow">About SlopeIQ</p>
        <h1 className="font-serif text-[52px] mt-4 text-ink leading-tight">Built by skiers, for skiers</h1>
        <p className="text-muted text-[17px] mt-8 leading-relaxed">
          SlopeIQ was built because the data was always there — Slopes captures everything — but nobody was doing anything meaningful with it. Speed, vertical, timestamps, run counts: it was all sitting in a file on your phone.
        </p>
        <p className="text-muted text-[17px] mt-5 leading-relaxed">
          SlopeIQ exists to turn that into something you can actually use to ski better. Not generic tips. Not motivational noise. Specific observations about your skiing, grounded in your own numbers, updated every time you get on the mountain.
        </p>
      </div>

      <div className="mt-20 border-t border-line pt-16">
        <p className="eyebrow mb-8">What we believe</p>
        <div className="space-y-6">
          {BELIEFS.map((b, i) => (
            <div key={i} className="flex items-start gap-5">
              <span className="text-coral font-serif text-[24px] leading-none mt-1">{i + 1}.</span>
              <p className="font-serif text-[24px] text-ink leading-snug">"{b}"</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 border-t border-line pt-16 card p-8">
        <p className="eyebrow mb-3">Privacy</p>
        <p className="text-muted text-[16px] leading-relaxed">
          Your raw GPS data never leaves your device. SlopeIQ parses your .slopes file in the browser and transmits only derived metrics — speeds, vertical totals, run durations — to the AI. We don't know where you ski unless you tell the Mountain Coach. We don't sell your data.
        </p>
      </div>
    </div>
  );
}
