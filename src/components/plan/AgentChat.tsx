'use client';

import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { useRef, useEffect, useState, FormEvent } from 'react';

interface AgentChatProps {
    businessName: string;
    competitors: any[];
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export function AgentChat({ businessName, competitors }: AgentChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: `Hi! I'm your Strategic Advisor for ${businessName}. I've analyzed your competitors and I'm ready to help you develop winning strategies. What would you like to know?`
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/business-plan/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                    context: {
                        businessName,
                        competitors
                    }
                })
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.message || 'I apologize, but I encountered an error processing your request.'
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-xl border border-indigo-100 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-indigo-600 p-4 text-white flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                    <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-sm">Strategic Advisor</h3>
                    <p className="text-xs text-indigo-200">Online • Access to Market Intel</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" ref={scrollRef}>
                {messages.length === 1 && (
                    <div className="text-center p-8 text-gray-400">
                        <Sparkles className="w-8 h-8 mx-auto mb-2 text-indigo-300" />
                        <p className="text-sm">Ask me anything about your competitors or strategy.</p>
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                            <button
                                onClick={() => setInput("Who is my biggest threat?")}
                                className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:bg-indigo-50 transition cursor-pointer"
                            >
                                "Who is my biggest threat?"
                            </button>
                            <button
                                onClick={() => setInput("How do I beat their pricing?")}
                                className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:bg-indigo-50 transition"
                            >
                                "How do I beat their pricing?"
                            </button>
                        </div>
                    </div>
                )}

                {messages.map(m => (
                    <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-gray-200' : 'bg-indigo-100'}`}>
                            {m.role === 'user' ? <User className="w-4 h-4 text-gray-600" /> : <Bot className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${m.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-white text-gray-700 border border-gray-100 rounded-bl-none'
                            }`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                            <span className="text-xs text-gray-400">Thinking...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100">
                <div className="relative">
                    <input
                        className="w-full bg-gray-50 border border-gray-200 rounded-full pl-5 pr-12 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about strategy, pricing, or gaps..."
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
}
