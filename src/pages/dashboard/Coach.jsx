import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UpgradePrompt from '../../components/UpgradePrompt';

function Message({ role, content }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed ${isUser ? 'bg-coral text-white rounded-br-md' : 'bg-surface border border-line text-ink rounded-bl-md'}`}>
        <pre className="whitespace-pre-wrap font-sans">{content}</pre>
      </div>
    </div>
  );
}

export default function Coach() {
  const { user, profile, getToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [resort, setResort] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const isPro = profile?.tier === 'pro';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const token = await getToken();
      const res = await fetch('/api/mountain-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ message: text, history: messages, conversationId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      if (data.resort) setResort(data.resort);
      if (data.conversationId) setConversationId(data.conversationId);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Sorry, I'm having trouble connecting right now. Try again in a moment.` }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function resetConversation() {
    setMessages([]);
    setResort(null);
    setConversationId(null);
  }

  if (!isPro) return <UpgradePrompt feature="Mountain Coach" />;

  return (
    <div className="max-w-[1080px] mx-auto px-6 py-8 h-[calc(100vh-64px)] flex gap-6">
      {/* Chat pane */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="eyebrow">Mountain Coach</p>
            <h2 className="font-serif text-[28px] text-ink mt-1">Your AI coach on the mountain</h2>
          </div>
          <button onClick={resetConversation} className="btn-ghost text-[13px] px-4 py-2">New conversation</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-2 scrollbar-thin">
          {messages.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted text-[16px] leading-relaxed max-w-[400px] mx-auto">
                Tell me where you're skiing and I'll build your day. Or ask me about your data — I know your SlopeScore and session history.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {[
                  "I'm going to Stowe this weekend",
                  "What trails match my skill level?",
                  "Build me an optimal day plan",
                  "What does my fatigue pattern look like?",
                ].map(s => (
                  <button key={s} onClick={() => setInput(s)} className="text-[13px] text-muted border border-line rounded-full px-3 py-1.5 hover:border-coral/30 hover:text-ink transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => <Message key={i} role={m.role} content={m.content} />)}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-surface border border-line rounded-2xl rounded-bl-md px-4 py-3">
                <span className="flex gap-1">
                  {[0, 1, 2].map(i => <span key={i} className="w-1.5 h-1.5 bg-muted-2 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="pt-4 border-t border-line">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Message your coach…"
              className="flex-1 bg-surface border border-line rounded-xl px-4 py-3 text-[15px] text-ink placeholder:text-muted-2 focus:outline-none focus:border-coral/40 transition-colors"
            />
            <button onClick={send} disabled={!input.trim() || loading} className="btn-primary px-5 py-3 shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mountain info panel */}
      <div className="w-72 shrink-0 hidden lg:flex flex-col gap-4">
        <div className="card p-5">
          <p className="eyebrow mb-3">Mountain info</p>
          {resort ? (
            <div>
              <p className="text-ink font-semibold">{resort}</p>
              <p className="text-muted text-[13px] mt-1">Trail data loaded from Skimap.org</p>
            </div>
          ) : (
            <p className="text-muted-2 text-[13px] leading-relaxed">Tell your coach which resort you're planning and trail data will load here automatically.</p>
          )}
        </div>
        <div className="card p-5">
          <p className="eyebrow mb-3">Your profile</p>
          <p className="text-muted-2 text-[13px] leading-relaxed">Your SlopeScore, speed profile, and session history are already loaded. The coach knows your skiing.</p>
        </div>
      </div>
    </div>
  );
}
