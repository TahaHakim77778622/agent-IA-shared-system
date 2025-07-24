import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Loader2, Send, Mail, Eye } from 'lucide-react';
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatBotModalProps {
  open: boolean;
  onClose: () => void;
  onSendToGenerator: (fields: Partial<{recipient: string, subject: string, company: string, context: string, body: string, type: string}>) => void;
}

const REQUIRED_FIELDS = ['recipient', 'subject', 'context'];

// Ajoute une fonction pour détecter si un message contient un email généré
const detectGeneratedEmail = (text: string) => {
  // Détection simple : commence par 'Voici votre email' ou contient 'Objet :' et 'Corps :'
  if (/voici (votre|l')?email/i.test(text) || (/objet\s*:/i.test(text) && /corps\s*:/i.test(text))) {
    // Extraction du corps de l'email
    const bodyMatch = text.match(/corps\s*[:=\-]?\s*([\s\S]+)/i);
    const subjectMatch = text.match(/sujet\s*[:=\-]?\s*([\w\s\-\?!.]+)/i);
    return {
      body: bodyMatch ? bodyMatch[1].trim() : '',
      subject: subjectMatch ? subjectMatch[1].trim() : '',
    };
  }
  return null;
};

export default function ChatBotModal({ open, onClose, onSendToGenerator }: ChatBotModalProps) {
  const [messages, setMessages] = useState<{from: 'user'|'bot', text: string, time: string, emails?: any[]}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<Partial<{recipient: string, subject: string, company: string, context: string, body: string, type: string}>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Charger l'historique à l'ouverture
  useEffect(() => {
    if (open) {
      const saved = localStorage.getItem('chatbot_history');
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    }
  }, [open]);

  // Sauvegarder l'historique à chaque message
  useEffect(() => {
    if (open && messages.length > 0) {
      localStorage.setItem('chatbot_history', JSON.stringify(messages));
    }
  }, [messages, open]);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // Bouton nouvelle discussion
  const handleNewConversation = () => {
    setMessages([]);
    setFields({});
    localStorage.removeItem('chatbot_history');
  };

  // Extraction intelligente des champs depuis la réponse de l'IA
  const extractFields = (text: string) => {
    let newFields: Partial<{recipient: string, subject: string, company: string, context: string, body: string, type: string}> = {};
    // Extraction simple (améliorable avec NLP)
    const recipient = text.match(/destinataire\s*[:=\-]?\s*([\w@.\- ]+)/i);
    if (recipient) newFields.recipient = recipient[1].trim();
    const subject = text.match(/sujet\s*[:=\-]?\s*([\w\s\-\?!.]+)/i);
    if (subject) newFields.subject = subject[1].trim();
    const context = text.match(/contexte\s*[:=\-]?\s*([\w\s\-\?!.]+)/i);
    if (context) newFields.context = context[1].trim();
    const company = text.match(/entreprise\s*[:=\-]?\s*([\w\s\-]+)/i);
    if (company) newFields.company = company[1].trim();
    const body = text.match(/corps\s*[:=\-]?\s*([\s\S]+)/i);
    if (body) newFields.body = body[1].trim();
    const type = text.match(/type\s*[:=\-]?\s*([\w\s\-]+)/i);
    if (type) newFields.type = type[1].trim();
    return newFields;
  };

  const allFieldsPresent = REQUIRED_FIELDS.every(f => fields[f as keyof typeof fields]);

  // Nouvelle fonction : détecter si l'IA demande explicitement la liste des emails
  const iaWantsEmails = (text: string) => {
    return /voici vos emails|liste de vos emails|je vais afficher|je vais vous montrer|je vais chercher|emails trouvés|emails récents|vos derniers emails/i.test(text);
  };

  const fetchAndShowEmails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/emails/', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      const emails = await res.json();
      setMessages(msgs => {
        const last = msgs[msgs.length - 1];
        // Ajoute la liste d'emails à la dernière réponse de l'IA
        return [
          ...msgs.slice(0, -1),
          { ...last, emails: emails.slice(0, 5) }
        ];
      });
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
    setLoading(true);
    try {
      // Prompt ultra-contextuel et professionnel
      const persona = `Tu es ProMail Assistant, un assistant IA expert en communication professionnelle.\n- Tu aides l’utilisateur à générer des emails clairs, adaptés et professionnels.\n- Tu poses les bonnes questions, une à une, sans jamais répéter.\n- Tu comprends le contexte de la discussion et tu t’adaptes au style de l’utilisateur.\n- Quand tu as toutes les infos, tu annonces clairement que l’email est prêt à être généré.\n- Si l’utilisateur demande autre chose (reformulation, conseils, historique…), tu réponds de façon pertinente et professionnelle.\n- Sois naturel, jamais robotique, et guide l’utilisateur jusqu’à la génération de l’email.\n- Propose des suggestions ou reformule si besoin.`;
      const history = messages.map(m => `${m.from === 'user' ? 'Utilisateur' : 'Assistant'}: ${m.text}`).join('\n') + `\nUtilisateur: ${input}`;
      const prompt = `${persona}\n\nVoici l’historique de la conversation :\n${history}`;
      const res = await fetch('http://localhost:8000/api/chatbot/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await res.json();
      setMessages((msgs) => {
        const newMsgs = [...msgs, { from: 'bot', text: data.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
        if (iaWantsEmails(data.reply)) {
          setTimeout(fetchAndShowEmails, 100);
        }
        const extracted = extractFields(data.reply);
        if (Object.keys(extracted).length > 0) setFields(f => ({ ...f, ...extracted }));
        return newMsgs.map(m => ({ ...m, from: m.from === 'user' ? 'user' : 'bot' }));
      });
    } catch (err) {
      setMessages((msgs) => [...msgs, { from: 'bot', text: "Erreur lors de la réponse de l'IA.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
    setLoading(false);
  };

  // Action pour réutiliser un email dans le générateur
  const handleReuseEmail = (email: any) => {
    onSendToGenerator({
      recipient: email.recipient,
      subject: email.subject,
      company: email.company,
      context: email.context,
      body: email.body,
      type: email.type,
    });
    onClose();
  };

  // Fonctions d'export pour un email
  const exportOneExcel = (email: any) => {
    const ws = XLSX.utils.json_to_sheet([{ Sujet: email.subject, Destinataire: email.recipient, Société: email.company, Type: email.type, Date: email.createdAt || "", Contenu: email.body }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Email");
    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), `email-chatbot.xlsx`);
    toast({
      title: "Email exporté en Excel",
      description: `Email de ${email.subject} exporté avec succès.`,
    });
  };
  const exportOneWord = async (email: any) => {
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [
              new TextRun({ text: `Sujet: ${email.subject}`, bold: true }),
              new TextRun("\n"),
              new TextRun({ text: `Destinataire: ${email.recipient}` }),
              new TextRun("\n"),
              new TextRun({ text: `Société: ${email.company}` }),
              new TextRun("\n"),
              new TextRun({ text: `Type: ${email.type}` }),
              new TextRun("\n\n"),
              new TextRun({ text: email.body }),
            ],
          }),
        ],
      }],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `email-chatbot.docx`);
    toast({
      title: "Email exporté en Word",
      description: `Email de ${email.subject} exporté avec succès.`,
    });
  };
  const exportOneGmail = (email: any) => {
    const subject = email.subject;
    const body = `Destinataire: ${email.recipient}\nSociété: ${email.company}\nType: ${email.type}\n\n${email.body}`;
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    toast({
      title: "Email ouvert dans Gmail",
      description: `Email de ${email.subject} ouvert dans Gmail.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-3xl w-full h-[80vh] flex flex-col p-0">
        <DialogHeader className="bg-primary text-primary-foreground rounded-t-xl p-6 flex flex-row items-center justify-between">
          <DialogTitle>Assistant IA – Discussion</DialogTitle>
          <Button variant="ghost" size="sm" onClick={handleNewConversation}>Nouvelle discussion</Button>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4 bg-muted">
          {messages.length === 0 && !loading && (
            <div className="text-muted-foreground text-center mt-8">Commencez la discussion avec l'IA…</div>
          )}
          {messages.map((msg, i) => {
            const generated = msg.from === 'bot' ? detectGeneratedEmail(msg.text) : null;
            return (
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
                      <div className="mt-2 space-y-2 overflow-x-auto">
                        {msg.emails.map((email, idx) => (
                          <div key={email.id || idx} className="border rounded p-2 bg-zinc-50 dark:bg-zinc-900 flex flex-col gap-1 animate-fade-in">
                            <div className="font-semibold">{email.subject}</div>
                            <div className="text-xs text-muted-foreground">À : {email.recipient} | Type : {email.type} | {email.company}</div>
                            <div className="text-xs line-clamp-2">{email.body}</div>
                            <div className="flex gap-2 mt-1">
                              <Button size="sm" variant="outline" onClick={() => handleReuseEmail(email)}><Mail className="h-4 w-4 mr-1" /> Réutiliser</Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="outline"><FileText className="h-4 w-4 mr-1" /> Exporter</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="animate-fade-in">
                                  <DropdownMenuItem onClick={() => exportOneExcel(email)}><FileText className="h-4 w-4 mr-2" /> Excel (.xlsx)</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => exportOneWord(email)}><FileText className="h-4 w-4 mr-2" /> Word (.docx)</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => exportOneGmail(email)}><Mail className="h-4 w-4 mr-2" /> Gmail</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <Button size="sm" variant="ghost" onClick={() => alert(email.body)}><Eye className="h-4 w-4 mr-1" /> Voir</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Bouton envoyer vers le générateur si email généré */}
                    {generated && (
                      <div className="mt-2 flex justify-end">
                        <Button size="sm" variant="outline" onClick={() => onSendToGenerator({ ...fields, body: generated.body, subject: generated.subject, type: fields.type })}>
                          <Mail className="h-4 w-4 mr-1" /> Envoyer vers le générateur
                        </Button>
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
            );
          })}
          {loading && <div className="flex justify-center items-center animate-fade-in"><Loader2 className="animate-spin mr-2 text-primary" /> L'IA réfléchit…</div>}
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
          <Button variant="outline" onClick={() => onSendToGenerator({ ...fields })} disabled={!allFieldsPresent} className="flex gap-1 items-center">
            <Mail className="h-4 w-4" /> Envoyer vers le générateur
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 