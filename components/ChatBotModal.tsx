import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2, Send, Mail, Eye } from 'lucide-react';

interface ChatBotModalProps {
  open: boolean;
  onClose: () => void;
  onSendToGenerator: (fields: Partial<{recipient: string, subject: string, company: string, context: string, body: string}>) => void;
}

export default function ChatBotModal({ open, onClose, onSendToGenerator }: ChatBotModalProps) {
  const [messages, setMessages] = useState<{from: 'user'|'bot', text: string, time: string, emails?: any[]}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<Partial<{recipient: string, subject: string, company: string, context: string, body: string}>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // Détection naïve d'intention pour lister les emails
  const isListEmailsIntent = (msg: string) => {
    return /montre(-| )?moi|liste(-| )?moi|affiche(-| )?moi|voir|voir mes|liste des|afficher mes|emails?/i.test(msg) && /email|mail/i.test(msg);
  };

  const fetchAndShowEmails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/emails/', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      const emails = await res.json();
      setMessages(msgs => [...msgs, {
        from: 'bot',
        text: emails.length ? 'Voici vos emails :' : "Vous n'avez aucun email.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emails: emails.slice(0, 5), // Affiche les 5 plus récents
      }]);
    } catch {
      setMessages(msgs => [...msgs, { from: 'bot', text: "Erreur lors de la récupération des emails.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([...messages, { from: 'user', text: input, time: now }]);
    setInput('');
    if (isListEmailsIntent(input)) {
      await fetchAndShowEmails();
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/chatbot/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { from: 'bot', text: data.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      // Extraction naïve des champs (améliorable avec NLP)
      if (/destinataire\s*:\s*(\S+)/i.test(data.reply)) setFields(f => ({...f, recipient: data.reply.match(/destinataire\s*:\s*(\S+)/i)?.[1] || f.recipient}));
      if (/sujet\s*:\s*(.+)/i.test(data.reply)) setFields(f => ({...f, subject: data.reply.match(/sujet\s*:\s*(.+)/i)?.[1] || f.subject}));
      if (/contexte\s*:\s*(.+)/i.test(data.reply)) setFields(f => ({...f, context: data.reply.match(/contexte\s*:\s*(.+)/i)?.[1] || f.context}));
      if (/corps\s*:\s*([\s\S]+)/i.test(data.reply)) setFields(f => ({...f, body: data.reply.match(/corps\s*:\s*([\s\S]+)/i)?.[1] || f.body}));
    } catch (err) {
      setMessages((msgs) => [...msgs, { from: 'bot', text: "Erreur lors de la réponse de l'IA.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
    setLoading(false);
  };

  const canSendToGenerator = fields.recipient || fields.subject || fields.context || fields.body;

  // Action pour réutiliser un email dans le générateur
  const handleReuseEmail = (email: any) => {
    onSendToGenerator({
      recipient: email.recipient,
      subject: email.subject,
      company: email.company,
      context: email.context,
      body: email.body,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-3xl w-full h-[80vh] flex flex-col p-0">
        <DialogHeader className="bg-primary text-primary-foreground rounded-t-xl p-6">
          <DialogTitle>Assistant IA – Discussion</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4 bg-muted">
          {messages.length === 0 && !loading && (
            <div className="text-muted-foreground text-center mt-8">Commencez la discussion avec l'IA…</div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className="flex items-end gap-2 w-full">
                {msg.from === 'bot' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback>IA</AvatarFallback>
                  </Avatar>
                )}
                <div className={`rounded-lg px-4 py-2 max-w-[60vw] text-sm shadow ${msg.from === 'user' ? 'bg-primary text-white' : 'bg-white dark:bg-zinc-800 text-foreground'}`}>{msg.text}
                  <div className="text-xs text-muted-foreground mt-1 text-right">{msg.time}</div>
                  {/* Affichage des emails si présents */}
                  {msg.emails && (
                    <div className="mt-2 space-y-2">
                      {msg.emails.map((email, idx) => (
                        <div key={email.id || idx} className="border rounded p-2 bg-zinc-50 dark:bg-zinc-900 flex flex-col gap-1">
                          <div className="font-semibold">{email.subject}</div>
                          <div className="text-xs text-muted-foreground">À : {email.recipient} | Type : {email.type} | {email.company}</div>
                          <div className="text-xs line-clamp-2">{email.body}</div>
                          <div className="flex gap-2 mt-1">
                            <Button size="sm" variant="outline" onClick={() => handleReuseEmail(email)}><Mail className="h-4 w-4 mr-1" /> Réutiliser</Button>
                            <Button size="sm" variant="ghost" onClick={() => alert(email.body)}><Eye className="h-4 w-4 mr-1" /> Voir</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {msg.from === 'user' && (
                  <Avatar className="h-8 w-8">
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
        <form className="flex gap-2 p-6 border-t border-border bg-background" onSubmit={e => { e.preventDefault(); sendMessage(); }}>
          <Input
            className="flex-1"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
            placeholder="Votre message…"
            disabled={loading}
            autoFocus
          />
          <Button type="submit" disabled={loading || !input.trim()} className="flex gap-1 items-center">
            <Send className="h-4 w-4" /> Envoyer
          </Button>
        </form>
        <div className="flex justify-end px-8 pb-6">
          <Button variant="outline" onClick={() => onSendToGenerator(fields)} disabled={!canSendToGenerator} className="flex gap-1 items-center">
            <Mail className="h-4 w-4" /> Envoyer vers le générateur
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 