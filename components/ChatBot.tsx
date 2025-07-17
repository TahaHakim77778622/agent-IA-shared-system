import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export default function ChatBot() {
  const [messages, setMessages] = useState<{from: 'user'|'bot', text: string, time: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([...messages, { from: 'user', text: input, time: now }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/chatbot/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { from: 'bot', text: data.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch (err) {
      setMessages((msgs) => [...msgs, { from: 'bot', text: "Erreur lors de la réponse de l'IA.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Bouton flottant pour ouvrir le chat */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-8 right-8 z-50 bg-primary text-white rounded-full shadow-lg p-4 hover:bg-primary/90 transition-all flex items-center justify-center"
          aria-label="Ouvrir le chatbot"
        >
          <MessageCircle className="h-7 w-7" />
        </button>
      )}
      {/* Fenêtre de chat */}
      {open && (
        <div className="fixed bottom-8 right-8 z-50 w-80 max-w-[95vw] bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-primary text-primary-foreground">
            <span className="font-semibold">Assistant IA</span>
            <button onClick={() => setOpen(false)} aria-label="Fermer" className="hover:bg-primary/20 rounded-full p-1">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 h-72 overflow-y-auto px-4 py-2 bg-muted">
            {messages.length === 0 && !loading && (
              <div className="text-muted-foreground text-center mt-8">Posez une question à l'IA…</div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`mb-2 flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className="flex items-end gap-2">
                  {msg.from === 'bot' && (
                    <Avatar className="h-7 w-7">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback>IA</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`rounded-lg px-3 py-2 max-w-[70vw] text-sm shadow ${msg.from === 'user' ? 'bg-primary text-white' : 'bg-white dark:bg-zinc-800 text-foreground'}`}>{msg.text}
                    <div className="text-xs text-muted-foreground mt-1 text-right">{msg.time}</div>
                  </div>
                  {msg.from === 'user' && (
                    <Avatar className="h-7 w-7">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            {loading && <div className="flex justify-center items-center"><Loader2 className="animate-spin mr-2" /> L'IA réfléchit…</div>}
            <div ref={messagesEndRef} />
          </div>
          <form className="flex gap-2 p-3 border-t border-border bg-background" onSubmit={e => { e.preventDefault(); sendMessage(); }}>
            <input
              className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
              placeholder="Votre message…"
              disabled={loading}
              autoFocus
            />
            <button
              className="bg-primary text-white px-4 py-1 rounded disabled:opacity-60"
              type="submit"
              disabled={loading || !input.trim()}
            >
              Envoyer
            </button>
          </form>
        </div>
      )}
    </div>
  );
} 