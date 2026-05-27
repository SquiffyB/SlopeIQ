const STEPS = [
  {
    n: '01',
    title: 'Export',
    body: 'Open Slopes, go to your session, and export as a .slopes file using Active Times.'
  },
  {
    n: '02',
    title: 'Upload',
    body: 'Drop your file into SlopeIQ. Everything is processed in your browser — nothing is stored.'
  },
  {
    n: '03',
    title: 'Debrief',
    body: 'Get AI coaching on your runs, speed, vertical, and fatigue — grounded in your own numbers.'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative">
      <div className="max-w-[860px] mx-auto px-6 py-24 sm:py-28">
        <p className="eyebrow text-center">How it works</p>
        <h2 className="font-serif text-[34px] sm:text-[42px] text-center mt-3 text-ink">
          Three steps to clearer skiing
        </h2>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map(step => (
            <div key={step.n} className="card p-6 sm:p-7">
              <div className="text-coral font-medium text-[14px] tracking-wide">
                {step.n}
              </div>
              <h3 className="font-serif text-[24px] mt-2 text-ink">{step.title}</h3>
              <p className="text-muted text-[15px] mt-3 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
