import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';
import { sendMessageToGemini, ChatMessage } from '../services/geminiService';

interface AIAssistantProps {
  contextData: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ contextData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'System Online. I am your Physics Assistant. How can I help with the current circuit configuration?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await sendMessageToGemini(messages, input, contextData);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 h-[500px] tech-panel rounded-lg shadow-2xl flex flex-col overflow-hidden border border-cyan-500/30">
          {/* Header */}
          <div className="bg-slate-900/80 p-4 border-b border-cyan-500/20 flex justify-between items-center backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-cyan-500/10 rounded border border-cyan-500/30">
                <Bot className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm tracking-wide">AI TUTOR <span className="text-cyan-500">v1.0</span></h3>
                <span className="text-[10px] text-cyan-600 animate-pulse">● ONLINE</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-cyan-600/20 border border-cyan-500/30 text-cyan-50 rounded-br-none' 
                      : 'bg-slate-800/80 border border-slate-700 text-slate-300 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800/50 p-3 rounded-lg rounded-bl-none border border-slate-700/50 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span className="text-xs text-slate-500">Processing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-slate-900/80 border-t border-cyan-500/20 flex gap-2 backdrop-blur-md">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query simulation parameters..."
              className="flex-1 bg-slate-950/50 border border-slate-700 rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 text-sm placeholder:text-slate-600"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-cyan-600/80 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded border border-cyan-400/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group bg-cyan-950 border border-cyan-500 text-cyan-400 hover:bg-cyan-900 hover:text-white p-4 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all duration-300 flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
        {isOpen ? <X className="w-6 h-6 relative z-10" /> : <MessageCircle className="w-6 h-6 relative z-10" />}
      </button>
    </div>
  );
};

export default AIAssistant;