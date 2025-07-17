"use client";
import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Mail } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{from: 'user'|'bot', text: string, time: string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<string|null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages([...messages, { from: 'user', text: input, time: now }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/chatbot/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { from: 'bot', text: data.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch {
      setMessages(msgs => [...msgs, { from: 'bot', text: "Erreur lors de la réponse de l'IA.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
    setLoading(false);
  };

  const handleGenerateEmail = async () => {
    setGeneratedEmail(null);
    setLoading(true);
    try {
      const prompt = messages.filter(m => m.from === 'user' || m.from === 'bot').map(m => `${m.from === 'user' ? 'Utilisateur' : 'Assistant'}: ${m.text}`).join("\n");
      const res = await fetch("http://localhost:8000/api/generate-email/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, subject: "Email généré à partir du chat" }),
      });
      const data = await res.json();
      setGeneratedEmail(data.email || data.body || "Aucun email généré.");
    } catch {
      setGeneratedEmail("Erreur lors de la génération de l'email.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background py-10">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="bg-primary text-primary-foreground rounded-t-xl">
          <CardTitle>Assistant IA – Discussion</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col h-[70vh] p-0">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-muted">
            {messages.length === 0 && !loading && (
              <div className="text-muted-foreground text-center mt-8">Commencez la discussion avec l'IA…</div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}> 
                <div className="flex items-end gap-2">
                  {msg.from === 'bot' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback>IA</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`rounded-lg px-4 py-2 max-w-[70vw] text-sm shadow ${msg.from === 'user' ? 'bg-primary text-white' : 'bg-white dark:bg-zinc-800 text-foreground'}`}>{msg.text}
                    <div className="text-xs text-muted-foreground mt-1 text-right">{msg.time}</div>
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
          <form className="flex gap-2 p-4 border-t border-border bg-background" onSubmit={e => { e.preventDefault(); sendMessage(); }}>
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
          <div className="flex justify-end px-4 pb-4">
            <Button variant="outline" onClick={handleGenerateEmail} disabled={loading || messages.length === 0} className="flex gap-1 items-center">
              <Mail className="h-4 w-4" /> Transformer la discussion en email
            </Button>
          </div>
          {generatedEmail && (
            <div className="bg-zinc-100 dark:bg-zinc-900 border-t border-border p-4 mt-2 rounded-b-xl">
              <div className="font-semibold mb-2">Email généré :</div>
              <div className="whitespace-pre-line text-sm bg-white dark:bg-zinc-800 p-3 rounded shadow-inner">{generatedEmail}</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 