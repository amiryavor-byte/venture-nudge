'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';
import { Send, Bot, User, Sparkles, Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRealtimeAPI, RealtimeMessage } from '../voice/useRealtimeAPI';
// import { Message } from 'ai'; 

interface ChatInterfaceProps {
    onContextUpdate: (data: any) => void;
}

export function ChatInterface({ onContextUpdate }: ChatInterfaceProps) {
    const chatHelpers = useChat({
        api: '/api/chat',
        initialMessages: [
            {
                id: 'welcome',
                role: 'assistant',
                content: "Hi! I'm Venture Nudge, your AI Co-Founder. 🚀\n\nI can help you build a business plan, but first, I need to know where you're at. What's your current status?"
            }
        ],
        onFinish: (message) => {
            console.log('[onFinish] Final message:', message);
            onContextUpdate?.({ lastMessage: message });
        },
    });

    const {
        messages,
        setMessages,
        sendMessage: sendChatMessage,
        status,
    } = chatHelpers || {};

    // Local input state
    const [input, setInput] = useState('');
    const isLoading = status === 'in_progress';

    // Voice state
    const [isVoiceConnected, setIsVoiceConnected] = useState(false);
    const [isSendingToChat, setIsSendingToChat] = useState(false);
    const sendMessageRef = useRef<((text: string) => void) | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    // Initialize voice functionality
    const {
        isConnected: voiceConnected,
        isRecording,
        error: voiceError,
        connect: connectVoice,
        disconnect: disconnectVoice,
        sendMessage: sendVoiceMessage,
        toggleRecording,
    } = useRealtimeAPI({
        onMessage: async (message: RealtimeMessage) => {
            // Add voice message to text chat history
            if (message.role === 'user') {
                // Add user's spoken message to chat using setMessages
                const userMessage = {
                    id: Date.now().toString(),
                    role: 'user' as const,
                    content: message.content
                };
                if (setMessages && messages) {
                    setMessages([...messages, userMessage]);
                }

                setIsSendingToChat(true);
                try {
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            messages: [...(messages || []), { role: 'user', content: message.content }],
                            voiceMode: true,
                        }),
                    });

                    if (!response.ok || !response.body) {
                        throw new Error('Failed to get response from chat API');
                    }

                    // Read the streaming response
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    let aiResponseText = '';

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value, { stream: true });
                        const lines = chunk.split('\n');

                        for (const line of lines) {
                            if (line.startsWith('0:')) {
                                try {
                                    const jsonStr = line.slice(2);
                                    const text = JSON.parse(jsonStr);
                                    aiResponseText += text;
                                } catch (e) {
                                    // Ignore parse errors
                                }
                            }
                        }
                    }

                    console.log('AI Response:', aiResponseText);

                    // Add AI response to chat history
                    if (aiResponseText && setMessages && messages) {
                        const assistantMessage = {
                            id: Date.now().toString(),
                            role: 'assistant' as const,
                            content: aiResponseText
                        };
                        setMessages([...messages, assistantMessage]);

                        // Send to Realtime API for TTS
                        if (sendMessageRef.current) {
                            sendMessageRef.current(aiResponseText);
                        }
                    }
                } catch (error) {
                    console.error('Error calling chat API:', error);
                } finally {
                    setIsSendingToChat(false);
                }
            }
        },
        onError: (error: Error) => {
            console.error('Voice error:', error);
        },
        onConnectionChange: (connected: boolean) => {
            setIsVoiceConnected(connected);

            // Auto-play welcome message when voice connects
            if (connected && messages && messages.length > 0) {
                const welcomeMsg = messages[0];
                if (welcomeMsg?.role === 'assistant' && sendMessageRef.current) {
                    // Send welcome message to TTS
                    console.log('Auto-playing welcome message via TTS');
                    sendMessageRef.current(welcomeMsg.content);
                }
            }
        },
    });

    // Keep sendMessageRef updated
    useEffect(() => {
        sendMessageRef.current = sendVoiceMessage;
    }, [sendVoiceMessage]);

    useEffect(() => {
        setIsMounted(true);
        if (!chatHelpers) {
            console.error("useChat returned null/undefined");
        } else {
            console.log("Chat Helpers State:", {
                messagesCount: chatHelpers.messages?.length,
            });

            // Manually set welcome message if no messages exist (fixes hydration issue)
            if (!chatHelpers.messages || chatHelpers.messages.length === 0) {
                const welcomeMessage = {
                    id: 'welcome',
                    role: 'assistant' as const,
                    content: "Hi! I'm Venture Nudge, your AI Co-Founder. 🚀\n\nI can help you build a business plan, but first, I need to know where you're at. What's your current status?"
                };
                // Use setMessages if available, otherwise this will show on next render
                if (chatHelpers.setMessages) {
                    chatHelpers.setMessages([welcomeMessage]);
                }
            }
        }
    }, [chatHelpers]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (content: string) => {
        if (!setMessages || !sendChatMessage) {
            console.error("chat functions not available");
            return;
        }

        // Add user message to history
        const userMessage = { id: Date.now().toString(), role: 'user' as const, content };
        setMessages([...(messages || []), userMessage]);

        // Send to AI
        await sendChatMessage(content);

        // Clear input
        setInput('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input?.trim()) return;
        await handleSendMessage(input);
    };

    const clearChatHistory = () => {
        if (chatHelpers?.setMessages) {
            chatHelpers.setMessages([{
                id: 'welcome',
                role: 'assistant' as const,
                content: "Hi! I'm Venture Nudge, your AI Co-Founder. 🚀\n\nI can help you build a business plan, but first, I need to know where you're at. What's your current status?"
            }]);
        }
        // Also clear any localStorage persistence
        if (typeof window !== 'undefined') {
            const storageKey = `ai-chat-messages`;
            localStorage.removeItem(storageKey);
        }
    };

    const effectiveMessages = messages || [];
    const isDev = process.env.NODE_ENV === 'development';

    if (!isMounted || !chatHelpers) {
        return <div className="flex items-center justify-center h-full">
            <div className="text-zinc-400">Loading chat...</div>
        </div>;
    }

    return (
        <div className="flex flex-col h-full relative">
            {/* Header */}
            <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-10 pointer-events-none">
                <div className="px-4 py-2 rounded-full bg-zinc-900/40 backdrop-blur-md border border-white/5 pointer-events-auto">
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "w-2 h-2 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]",
                            isVoiceConnected ? "bg-green-500 animate-pulse" : "bg-emerald-500"
                        )} />
                        <span className="text-xs font-medium text-zinc-400 tracking-wide">
                            Venture Nudge AI {isVoiceConnected && "• Voice Active"}
                        </span>
                    </div>
                </div>

                {/* Dev-only Clear Chat Button */}
                {isDev && (
                    <button
                        onClick={() => {
                            if (confirm('Clear all chat history and start over?')) {
                                clearChatHistory();
                            }
                        }}
                        className="px-3 py-1.5 rounded-full bg-red-900/40 hover:bg-red-900/60 backdrop-blur-md border border-red-500/20 text-red-400 text-xs font-medium transition-all pointer-events-auto flex items-center gap-1.5"
                        title="Clear chat history (dev only)"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                        Clear Chat
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-20 space-y-8 scrollbar-hide">
                {effectiveMessages?.map((m: any) => (
                    <div
                        key={m.id}
                        className={cn(
                            "flex gap-4 max-w-[85%] md:max-w-[75%]",
                            m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                    >
                        {/* Avatar */}
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg",
                            m.role === 'user' ? "bg-zinc-800 border border-white/10" : "bg-zinc-900 border border-indigo-500/30"
                        )}>
                            {m.role === 'user' ? <User size={14} className="text-zinc-400" /> : <Bot size={14} className="text-indigo-400" />}
                        </div>

                        {/* Message Bubble */}
                        <div className={cn(
                            "rounded-2xl px-4 py-3 shadow-xl",
                            m.role === 'user'
                                ? "bg-zinc-800 border border-white/5"
                                : "bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-indigo-900/20 border border-indigo-500/20"
                        )}>
                            <p className="text-[15px] leading-relaxed text-zinc-100 whitespace-pre-wrap">
                                {m.content}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Quick Action Chips - Show after first assistant message */}
                {effectiveMessages?.length === 1 && effectiveMessages[0]?.role === 'assistant' && (
                    <div className="flex flex-wrap gap-3 max-w-[85%] md:max-w-[75%] mr-auto ml-12">
                        {[
                            "💼 I'm employed full-time",
                            "🎓 I'm a student",
                            "🏠 I'm between jobs",
                            "🚀 I'm an entrepreneur",
                            "👨‍💼 I'm a freelancer/consultant",
                            "🔄 I'm looking to pivot careers"
                        ].map((chip) => (
                            <button
                                key={chip}
                                onClick={() => handleSendMessage(chip)}
                                disabled={isLoading}
                                className="px-4 py-2 rounded-full bg-zinc-800/50 hover:bg-zinc-800 border border-white/10 text-sm text-zinc-300 transition-all disabled:opacity-50"
                            >
                                {chip}
                            </button>
                        ))}
                    </div>
                )}

                {isLoading && (
                    <div className="flex gap-4 max-w-[85%] md:max-w-[75%] mr-auto">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                            <Bot size={14} className="text-indigo-400" />
                        </div>
                        <div className="rounded-2xl px-4 py-3 bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-indigo-900/20 border border-indigo-500/20">
                            <div className="flex items-center gap-2">
                                <Sparkles size={14} className="text-indigo-400 animate-pulse" />
                                <span className="text-zinc-400 text-sm">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}

                {isSendingToChat && (
                    <div className="flex gap-4 max-w-[85%] md:max-w-[75%] mr-auto">
                        <div className="w-8 h-8 rounded-full bg-zinc-900 border border-indigo-500/30 flex items-center justify-center flex-shrink-0 mt-1 shadow-lg">
                            <Bot size={14} className="text-indigo-400" />
                        </div>
                        <div className="rounded-2xl px-4 py-3 bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-indigo-900/20 border border-indigo-500/20">
                            <div className="flex items-center gap-2">
                                <Mic size={14} className="text-indigo-400 animate-pulse" />
                                <span className="text-zinc-400 text-sm">Processing voice...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="sticky bottom-0 p-4 bg-gradient-to-t from-black via-black to-transparent">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                    <div className="relative flex items-center gap-2 bg-zinc-900/90 backdrop-blur-sm rounded-full border border-white/10 shadow-2xl px-4 py-2">
                        {/* Voice Button */}
                        {!isVoiceConnected ? (
                            <button
                                type="button"
                                onClick={connectVoice}
                                className="flex-shrink-0 p-2 rounded-full hover:bg-green-600/20 transition-colors text-green-500"
                                title="Start voice conversation"
                            >
                                <Phone size={20} />
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={toggleRecording}
                                    className={cn(
                                        "flex-shrink-0 p-2 rounded-full transition-colors",
                                        isRecording
                                            ? "bg-red-600/20 text-red-500 hover:bg-red-600/30"
                                            : "bg-indigo-600/20 text-indigo-500 hover:bg-indigo-600/30"
                                    )}
                                    title={isRecording ? "Mute" : "Unmute"}
                                >
                                    {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                                </button>
                                <button
                                    type="button"
                                    onClick={disconnectVoice}
                                    className="flex-shrink-0 p-2 rounded-full hover:bg-red-600/20 transition-colors text-red-500"
                                    title="End voice conversation"
                                >
                                    <PhoneOff size={20} />
                                </button>
                            </div>
                        )}

                        {/* Text Input */}
                        <input
                            value={input}
                            onChange={(e) => setInput?.(e.target.value)}
                            placeholder={isVoiceConnected ? "Voice active - or type here..." : "Type your message..."}
                            className="flex-1 bg-transparent text-zinc-100 placeholder-zinc-500 outline-none text-[15px] py-2"
                            disabled={isLoading}
                        />

                        {/* Send Button */}
                        <button
                            type="submit"
                            disabled={!input?.trim() || isLoading}
                            className="flex-shrink-0 p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <Send size={18} className="text-white" />
                        </button>
                    </div>

                    {voiceError && (
                        <p className="text-red-400 text-xs text-center mt-2">
                            Voice error: {voiceError.message}
                        </p>
                    )}
                </form>
            </div>

            {/* Debug Info */}
            <div className="absolute bottom-0 left-0 right-0 p-1 text-[10px] text-zinc-800 text-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                {chatHelpers ? 'Connected' : 'Connecting...'}
            </div>
        </div>
    );
}
