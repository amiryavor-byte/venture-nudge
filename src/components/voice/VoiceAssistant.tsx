'use client'

import { useState, useCallback, useRef, useEffect } from 'react';
import { useRealtimeAPI, RealtimeMessage } from './useRealtimeAPI';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';

interface VoiceAssistantProps {
    userId?: string;
    conversationId?: string;
    onClose?: () => void;
}

export function VoiceAssistant({ userId, conversationId, onClose }: VoiceAssistantProps) {
    const [messages, setMessages] = useState<RealtimeMessage[]>([]);
    const [isSendingToChat, setIsSendingToChat] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const sendMessageRef = useRef<((text: string) => void) | null>(null);

    const handleError = useCallback((error: Error) => {
        console.error('Realtime API error:', error);
    }, []);

    const {
        isConnected,
        isRecording,
        error,
        transcript,
        connect,
        disconnect,
        sendMessage,
        toggleRecording,
    } = useRealtimeAPI({
        onMessage: async (message: RealtimeMessage) => {
            setMessages((prev) => [...prev, message]);

            // When user speaks, send transcript to our chat API for processing
            if (message.role === 'user') {
                setIsSendingToChat(true);
                try {
                    const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            messages: [{ role: 'user', content: message.content }],
                            userId,
                            conversationId,
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
                                // Parse the streaming format (0:"text")
                                try {
                                    const jsonStr = line.slice(2); // Remove "0:" prefix
                                    const text = JSON.parse(jsonStr);
                                    aiResponseText += text;
                                } catch (e) {
                                    // Ignore parse errors for incomplete chunks
                                }
                            }
                        }
                    }

                    console.log('AI Response:', aiResponseText);

                    // Send AI response text back to Realtime API for TTS
                    if (aiResponseText && sendMessageRef.current) {
                        sendMessageRef.current(aiResponseText);
                    }
                } catch (error) {
                    console.error('Error calling chat API:', error);
                } finally {
                    setIsSendingToChat(false);
                }
            }
        },
        onError: handleError,
    });

    // Keep sendMessageRef up to date
    useEffect(() => {
        sendMessageRef.current = sendMessage;
    }, [sendMessage]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="h-full flex flex-col bg-slate-950">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div>
                    <h2 className="text-lg font-semibold text-white">🎤 Voice Assistant</h2>
                    <p className="text-sm text-slate-400">
                        {isConnected ? (
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Connected
                            </span>
                        ) : 'Not connected'}
                    </p>
                </div>
                {onClose && (
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        Exit Voice Mode
                    </Button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && !isConnected && (
                    <div className="text-center text-slate-400 mt-8">
                        <p className="mb-4">Click "Connect" to start a voice conversation</p>
                        <p className="text-sm">Same AI responses as text chat</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <Card className={`max-w-[80%] p-3 ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-100'}`}>
                            <p className="text-sm">{msg.content}</p>
                        </Card>
                    </div>
                ))}

                {isSendingToChat && (
                    <div className="flex justify-start">
                        <Card className="bg-slate-800 p-3">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                                <p className="text-sm text-slate-100">Processing...</p>
                            </div>
                        </Card>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10">
                <div className="flex items-center justify-center gap-4">
                    {!isConnected ? (
                        <Button size="lg" onClick={connect} className="bg-green-600 hover:bg-green-700">
                            <Phone className="w-5 h-5 mr-2" />
                            Connect
                        </Button>
                    ) : (
                        <>
                            <Button
                                size="lg"
                                onClick={toggleRecording}
                                className={isRecording ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}
                            >
                                {isRecording ? <><MicOff className="w-5 h-5 mr-2" />Mute</> : <><Mic className="w-5 h-5 mr-2" />Unmute</>}
                            </Button>
                            <Button size="lg" onClick={disconnect} className="bg-red-600 hover:bg-red-700 text-white">
                                <PhoneOff className="w-5 h-5 mr-2" />
                                Disconnect
                            </Button>
                        </>
                    )}
                </div>
                {error && <p className="text-red-400 text-sm text-center mt-4">Error: {error.message}</p>}
            </div>
        </div>
    );
}
