import { useRef, useState } from 'react';

export default function UploadZone({
  file,
  onFile,
  onAnalyze,
  isAnalyzing,
  error,
  apiKey,
  onApiKeyChange
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function handleSelect(f) {
    if (!f) return;
    onFile(f);
  }

  function onChange(e) {
    handleSelect(e.target.files?.[0]);
    e.target.value = '';
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleSelect(e.dataTransfer.files?.[0]);
  }

  return (
    <section id="upload" className="relative">
      <div className="cta-orb animate-orb" aria-hidden="true" />
      <div className="relative max-w-[760px] mx-auto px-6 py-20">
        <p className="eyebrow text-center">Your session</p>
        <h2 className="font-serif text-[34px] sm:text-[42px] text-center mt-3 text-ink">
          Drop your session in
        </h2>

        <div
          className={`upload-zone mt-10 p-10 sm:p-14 text-center cursor-pointer ${
            dragging ? 'dragging' : ''
          }`}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".slopes"
            className="hidden"
            onChange={onChange}
          />

          {!file ? (
            <>
              <div className="mx-auto w-12 h-12 rounded-full bg-coral/10 border border-coral/30 flex items-center justify-center mb-5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8634a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="text-ink text-[18px] font-medium">
                Drop your .slopes file here
              </p>
              <p className="text-muted text-[14px] mt-2">or click to browse</p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-teal text-[15px]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="font-medium">{file.name}</span>
              </div>
              <p className="text-muted-2 text-[12px]">
                {(file.size / 1024).toFixed(1)} KB · ready to analyze
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-5 text-center text-coral text-[14px]">{error}</div>
        )}

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            disabled={!file || isAnalyzing}
            onClick={onAnalyze}
            className="btn-primary"
          >
            {isAnalyzing ? (
              <>
                <span className="inline-block w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Analyzing your session...
              </>
            ) : (
              'Analyze session'
            )}
          </button>

          <details className="mt-3 text-[12px] text-muted-2">
            <summary className="cursor-pointer hover:text-muted">
              Anthropic API key (optional, for AI coaching)
            </summary>
            <div className="mt-3 flex flex-col items-center gap-2">
              <input
                type="password"
                placeholder="sk-ant-..."
                value={apiKey}
                onChange={e => onApiKeyChange(e.target.value)}
                className="w-[320px] max-w-full bg-surface border border-line rounded-lg px-3 py-2 text-[13px] text-ink focus:outline-none focus:border-coral/50"
              />
              <p className="text-muted-2 text-[11px] max-w-[360px] text-center leading-relaxed">
                Stored only in your browser. Without a key you'll still get
                rule-based observations.
              </p>
            </div>
          </details>
        </div>
      </div>
    </section>
  );
}
