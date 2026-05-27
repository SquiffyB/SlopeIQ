import { Link } from 'react-router-dom';

const STEPS = [
  {
    n: '01',
    title: 'Export from Slopes',
    body: 'Open the Slopes app on your phone. Go to any session. Tap Export → .slopes file (Active Times). That file contains your full session: every run, every lift, speed, vertical, and timestamps.',
    note: 'The "Active Times" export option includes all the data SlopeIQ needs. Regular exports may not contain run-level breakdown.',
  },
  {
    n: '02',
    title: 'Upload to SlopeIQ',
    body: 'Drop the file into SlopeIQ. We parse it entirely in your browser — nothing is transmitted until the AI coaching step, and even then only derived metrics (never raw GPS) are sent to our AI.',
    note: 'Your location data never leaves your device. We receive only calculated stats: speeds, vertical totals, run durations.',
  },
  {
    n: '03',
    title: 'Get your SlopeScore + Debrief',
    body: 'Your SlopeScore is calculated immediately. Then AI coaching runs against your data and your history to surface patterns you wouldn\'t find yourself — warmup patterns, fatigue windows, effort efficiency.',
    note: 'SlopeScore improves with every session uploaded. The more history you build, the more specific the coaching gets.',
  },
  {
    n: '04',
    title: 'Plan your next session',
    body: 'Open Mountain Coach. Tell it where you\'re going. It pulls live trail data from Skimap.org, cross-references your speed profile and SlopeScore dimensions, and builds a personalized plan — which trails fit your ability, how many runs to target, when to break, when to stop.',
    note: 'Mountain Coach is a Pro feature. It combines your historical performance with real trail data for each resort.',
  },
];

export default function HowItWorks() {
  return (
    <div className="max-w-[900px] mx-auto px-6 py-24">
      <div className="text-center mb-20">
        <p className="eyebrow">How it works</p>
        <h1 className="font-serif text-[52px] mt-4 text-ink leading-tight">From file to coaching in minutes</h1>
        <p className="text-muted text-[17px] mt-5 max-w-[500px] mx-auto leading-relaxed">
          Four steps. No technical setup. No accounts required for the first session.
        </p>
      </div>

      <div className="space-y-0">
        {STEPS.map((step, i) => (
          <div key={step.n} className={`grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 py-16 ${i > 0 ? 'border-t border-line' : ''}`}>
            <div>
              <span className="text-[60px] font-serif text-coral/20 leading-none select-none">{step.n}</span>
              <h2 className="font-serif text-[32px] text-ink mt-2 leading-tight">{step.title}</h2>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-muted text-[17px] leading-relaxed">{step.body}</p>
              <div className="mt-5 bg-surface border border-line rounded-xl px-5 py-4">
                <p className="text-muted-2 text-[13px] leading-relaxed">
                  <span className="text-coral font-medium">Note: </span>{step.note}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-line pt-16 text-center">
        <h3 className="font-serif text-[32px] text-ink">Ready to start?</h3>
        <p className="text-muted mt-3 mb-8">First session is free. No credit card required.</p>
        <Link to="/signup" className="btn-primary px-8 py-4">Create your free account</Link>
      </div>
    </div>
  );
}
