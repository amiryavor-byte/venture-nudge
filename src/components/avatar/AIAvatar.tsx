'use client';

import { useEffect, useState } from 'react';
import { AvatarRenderer } from './AvatarRenderer';
import { useTENAgent } from './useTENAgent';
import { Bot, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIAvatarProps {
    isVoiceActive: boolean;
    onConnectionChange?: (connected: boolean) => void;
}

export function AIAvatar({ isVoiceActive, onConnectionChange }: AIAvatarProps) {
    const [showAvatar, setShowAvatar] = useState(false);

    const tenAgent = useTENAgent({
        backendUrl: process.env.NEXT_PUBLIC_TEN_AGENT_URL || 'https://venture-nudge-ten.fly.dev',
        agoraAppId: process.env.NEXT_PUBLIC_AGORA_APP_ID || '',
        onAudioLevel: (level) => {
            // Audio level is handled by the hook and passed to AvatarRenderer
        },
        onConnectionChange: (connected) => {
            onConnectionChange?.(connected);
        },
        onError: (error) => {
            console.error('TEN Agent error:', error);
        },
    });

    // Connect/disconnect based on voice state
    useEffect(() => {
        if (isVoiceActive && !tenAgent.isConnected) {
            tenAgent.connect();
        } else if (!isVoiceActive && tenAgent.isConnected) {
            tenAgent.disconnect();
        }
    }, [isVoiceActive, tenAgent.isConnected]);

    const handleToggleAvatar = () => {
        setShowAvatar(!showAvatar);
    };

    if (!showAvatar) {
        return (
            <button
                onClick={handleToggleAvatar}
                className="fixed bottom-24 right-6 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg border border-white/10 flex items-center justify-center transition-all z-50"
                title="Show AI Avatar"
            >
                <Bot size={20} className="text-white" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-24 right-6 w-80 h-80 bg-zinc-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 inset-x-0 p-3 flex items-center justify-between bg-gradient-to-b from-zinc-900 to-transparent z-10">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        tenAgent.isConnected ? "bg-green-500 animate-pulse" : "bg-zinc-500"
                    )} />
                    <span className="text-xs font-medium text-zinc-400">
                        {tenAgent.isConnected ? 'Avatar Connected' : 'Connecting...'}
                    </span>
                </div>

                <button
                    onClick={handleToggleAvatar}
                    className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                    title="Hide avatar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>

            {/* Avatar Container */}
            <div className="w-full h-full flex items-center justify-center">
                {tenAgent.error ? (
                    <div className="flex flex-col items-center gap-2 text-center p-6">
                        <AlertCircle size={32} className="text-red-400" />
                        <p className="text-sm text-zinc-400">Connection Error</p>
                        <p className="text-xs text-zinc-500">{tenAgent.error.message}</p>
                        <button
                            onClick={() => tenAgent.connect()}
                            className="mt-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
                        >
                            Retry
                        </button>
                    </div>
                ) : tenAgent.isConnected ? (
                    <AvatarRenderer
                        isRecording={isVoiceActive}
                        audioLevel={tenAgent.audioLevel}
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 size={32} className="text-indigo-400 animate-spin" />
                        <p className="text-sm text-zinc-400">Connecting to avatar...</p>
                    </div>
                )}
            </div>

            {/* Audio Level Indicator */}
            {tenAgent.isConnected && tenAgent.audioLevel > 0.1 && (
                <div className="absolute bottom-0 inset-x-0 h-1 bg-zinc-800">
                    <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-100"
                        style={{ width: `${tenAgent.audioLevel * 100}%` }}
                    />
                </div>
            )}
        </div>
    );
}
