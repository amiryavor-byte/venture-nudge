'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import AgoraRTC, {
    IAgoraRTCClient,
    IAgoraRTCRemoteUser,
    IRemoteAudioTrack,
} from 'agora-rtc-sdk-ng';

interface TENAgentConfig {
    backendUrl: string;
    agoraAppId: string;
    onAudioLevel?: (level: number) => void;
    onConnectionChange?: (connected: boolean) => void;
    onError?: (error: Error) => void;
}

interface TENAgentHook {
    isConnected: boolean;
    audioLevel: number;
    error: Error | null;
    connect: () => Promise<void>;
    disconnect: () => void;
}

export function useTENAgent(config: TENAgentConfig): TENAgentHook {
    const [isConnected, setIsConnected] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const [error, setError] = useState<Error | null>(null);

    const clientRef = useRef<IAgoraRTCClient | null>(null);
    const channelRef = useRef<string | null>(null);
    const audioLevelIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Connect to TEN agent backend
    const connect = useCallback(async () => {
        try {
            setError(null);

            // Initialize Agora client
            const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
            clientRef.current = client;

            // Request channel and token from TEN backend
            const response = await fetch(`${config.backendUrl}/start`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    request_id: Date.now().toString(),
                    graph_name: 'voice-assistant-realtime',
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to start TEN agent: ${response.statusText}`);
            }

            const data = await response.json();
            const { channel_name, token, uid } = data;
            channelRef.current = channel_name;

            // Join the Agora channel
            await client.join(config.agoraAppId, channel_name, token, uid);

            // Listen for remote users (the TEN agent)
            client.on('user-published', async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
                if (mediaType === 'audio') {
                    await client.subscribe(user, mediaType);
                    const remoteAudioTrack = user.audioTrack as IRemoteAudioTrack;

                    if (remoteAudioTrack) {
                        remoteAudioTrack.play();

                        // Monitor audio levels
                        if (config.onAudioLevel) {
                            audioLevelIntervalRef.current = setInterval(() => {
                                const level = remoteAudioTrack.getVolumeLevel();
                                setAudioLevel(level);
                                config.onAudioLevel?.(level);
                            }, 50);
                        }
                    }
                }
            });

            client.on('user-unpublished', (user: IAgoraRTCRemoteUser) => {
                if (audioLevelIntervalRef.current) {
                    clearInterval(audioLevelIntervalRef.current);
                    audioLevelIntervalRef.current = null;
                }
                setAudioLevel(0);
            });

            setIsConnected(true);
            config.onConnectionChange?.(true);
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Failed to connect to TEN agent');
            setError(error);
            config.onError?.(error);
            console.error('TEN agent connection error:', err);
        }
    }, [config]);

    // Disconnect from TEN agent
    const disconnect = useCallback(async () => {
        try {
            if (audioLevelIntervalRef.current) {
                clearInterval(audioLevelIntervalRef.current);
                audioLevelIntervalRef.current = null;
            }

            if (clientRef.current && channelRef.current) {
                // Stop agent session
                await fetch(`${config.backendUrl}/stop`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        channel_name: channelRef.current,
                    }),
                });

                await clientRef.current.leave();
                clientRef.current = null;
                channelRef.current = null;
            }

            setIsConnected(false);
            setAudioLevel(0);
            config.onConnectionChange?.(false);
        } catch (err) {
            console.error('TEN agent disconnect error:', err);
        }
    }, [config]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        isConnected,
        audioLevel,
        error,
        connect,
        disconnect,
    };
}
