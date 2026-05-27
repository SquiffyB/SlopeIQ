import { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import UploadZone from './components/UploadZone.jsx';
import ResultsDashboard from './components/ResultsDashboard.jsx';
import Footer from './components/Footer.jsx';
import { parseSlopesFile } from './utils/parseSlopesFile.js';
import { getCoaching } from './utils/callClaude.js';

const API_KEY_STORAGE = 'slopeiq.anthropicKey';

export default function App() {
  const [file, setFile] = useState(null);
  const [session, setSession] = useState(null);
  const [coaching, setCoaching] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');

  const uploadRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(API_KEY_STORAGE);
      if (saved) setApiKey(saved);
    } catch (_) {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    try {
      if (apiKey) localStorage.setItem(API_KEY_STORAGE, apiKey);
      else localStorage.removeItem(API_KEY_STORAGE);
    } catch (_) {
      // ignore
    }
  }, [apiKey]);

  function scrollToUpload() {
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleFile(f) {
    setError('');
    setSession(null);
    setCoaching(null);
    setFile(f);
  }

  async function handleAnalyze() {
    if (!file) return;
    setError('');
    setIsAnalyzing(true);
    setCoaching(null);
    try {
      const parsed = await parseSlopesFile(file);
      setSession(parsed);
      setCoaching({ loading: true });

      // Scroll into results once parsed
      setTimeout(() => {
        document
          .getElementById('results')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

      const result = await getCoaching(parsed, apiKey);
      setCoaching({ loading: false, ...result });
    } catch (err) {
      setError(err.message || 'Something went wrong reading the file.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Navbar onUploadClick={scrollToUpload} />
      <main>
        <Hero onUploadClick={scrollToUpload} />
        <HowItWorks />
        <div className="divider max-w-[860px] mx-auto" />
        <UploadZone
          file={file}
          onFile={handleFile}
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          error={error}
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
        />
        {session && (
          <div ref={resultsRef}>
            <ResultsDashboard session={session} coaching={coaching} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
