import Logo from './Logo.jsx';

export default function Footer() {
  return (
    <footer className="border-t border-line mt-16">
      <div className="max-w-[1080px] mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-muted-2">
        <Logo size={22} />
        <p>SlopeIQ is not affiliated with Slopes app.</p>
        <p>Built by SFZ Labs</p>
      </div>
    </footer>
  );
}
