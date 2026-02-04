import { useEffect, useRef, useState, useCallback } from 'react';

export interface RealtimeMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export interface UseRealtimeAPIOptions {
    onMessage?: (message: RealtimeMessage) => void;
    onError?: (error: Error) => void;
    onConnectionChange?: (connected: boolean) => void;
}

export function useRealtimeAPI(options: UseRealtimeAPIOptions = {}) {
    const [isConnected, setIsConnected] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [transcript, setTranscript] = useState('');

    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const dataChannelRef = useRef<RTCDataChannel | null>(null);
    const audioStreamRef = useRef<MediaStream | null>(null);

    // Connect to OpenAI Realtime API
    const connect = useCallback(async () => {
        try {
            setError(null);

            // Clean up any existing connection first
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
            if (audioStreamRef.current) {
                audioStreamRef.current.getTracks().forEach(track => track.stop());
                audioStreamRef.current = null;
            }

            // Get ephemeral token from our API
            const tokenResponse = await fetch('/api/realtime/token');
            if (!tokenResponse.ok) {
                throw new Error('Failed to get Realtime token');
            }
            const { token } = await tokenResponse.json();

            // Get user's microphone FIRST
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStreamRef.current = stream;

            // Create peer connection AFTER we have the stream
            const pc = new RTCPeerConnection();
            peerConnectionRef.current = pc;

            // Add audio track to peer connection
            stream.getTracks().forEach((track) => {
                pc.addTrack(track, stream);
            });

            // Set up event handlers for peer connection
            pc.oniceconnectionstatechange = () => {
                console.log('ICE connection state:', pc.iceConnectionState);
                if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'closed') {
                    setIsConnected(false);
                    options.onConnectionChange?.(false);
                }
            };

            // Handle incoming audio tracks for TTS playback
            pc.ontrack = (event) => {
                console.log('Received audio track for playback');
                const audioElement = new Audio();
                audioElement.srcObject = event.streams[0];
                audioElement.play().catch(err => {
                    console.error('Error playing audio:', err);
                });
            };

            // Create data channel for sending/receiving messages
            const dc = pc.createDataChannel('oai-events');
            dataChannelRef.current = dc;

            // Handle incoming messages
            dc.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    handleRealtimeMessage(message);
                } catch (err) {
                    console.error('Error parsing message:', err);
                }
            };

            dc.onopen = () => {
                console.log('Data channel opened');
                setIsConnected(true);
                setIsRecording(true); // Auto-start recording when connected
                options.onConnectionChange?.(true);
            };

            dc.onclose = () => {
                console.log('Data channel closed');
                setIsConnected(false);
                setIsRecording(false);
                options.onConnectionChange?.(false);
            };

            dc.onerror = (error) => {
                console.error('Data channel error:', error);
            };

            // Create offer
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            // Send offer to OpenAI
            const sdpResponse = await fetch('https://api.openai.com/v1/realtime', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/sdp',
                },
                body: offer.sdp,
            });

            if (!sdpResponse.ok) {
                const errorText = await sdpResponse.text();
                console.error('OpenAI Realtime API error:', errorText);
                throw new Error(`Failed to establish connection: ${sdpResponse.status}`);
            }

            const answerSDP = await sdpResponse.text();
            await pc.setRemoteDescription({
                type: 'answer',
                sdp: answerSDP,
            });

            console.log('Connected to OpenAI Realtime API');
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            console.error('Connection error:', error);
            setError(error);
            options.onError?.(error);

            // Clean up on error
            if (audioStreamRef.current) {
                audioStreamRef.current.getTracks().forEach(track => track.stop());
                audioStreamRef.current = null;
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
            setIsConnected(false);
            setIsRecording(false);
        }
    }, [options]);

    // Handle messages from OpenAI Realtime API
    const handleRealtimeMessage = (message: any) => {
        if (message.type === 'conversation.item.input_audio_transcription.completed') {
            // Speech-to-text completed
            const userMessage: RealtimeMessage = {
                role: 'user',
                content: message.transcript,
                timestamp: Date.now(),
            };
            setTranscript(message.transcript);
            options.onMessage?.(userMessage);
        } else if (message.type === 'response.audio_transcript.done') {
            // Text-to-speech transcript
            const assistantMessage: RealtimeMessage = {
                role: 'assistant',
                content: message.transcript,
                timestamp: Date.now(),
            };
            options.onMessage?.(assistantMessage);
        } else if (message.type === 'error') {
            console.error('Realtime API error:', message);
            setError(new Error(message.error?.message || 'Unknown error'));
        }
    };

    // Send a text message to be spoken by the assistant
    const sendMessage = useCallback((text: string) => {
        if (!dataChannelRef.current || dataChannelRef.current.readyState !== 'open') {
            console.warn('Data channel not open');
            return;
        }

        // Add the assistant's message to the conversation
        const conversationItemMessage = {
            type: 'conversation.item.create',
            item: {
                type: 'message',
                role: 'assistant',
                content: [
                    {
                        type: 'text',
                        text: text
                    }
                ]
            }
        };

        // Create a response to generate audio from the message
        const responseMessage = {
            type: 'response.create',
            response: {
                modalities: ['text', 'audio'],
                instructions: 'Please generate audio for the last assistant message.'
            }
        };

        console.log('Sending assistant message for TTS:', text);
        dataChannelRef.current.send(JSON.stringify(conversationItemMessage));
        dataChannelRef.current.send(JSON.stringify(responseMessage));
    }, []);

    // Toggle recording
    const toggleRecording = useCallback(() => {
        setIsRecording((prev) => !prev);
    }, []);

    // Disconnect
    const disconnect = useCallback(() => {
        // Stop audio tracks
        if (audioStreamRef.current) {
            audioStreamRef.current.getTracks().forEach((track) => track.stop());
            audioStreamRef.current = null;
        }

        // Close data channel
        if (dataChannelRef.current) {
            dataChannelRef.current.close();
            dataChannelRef.current = null;
        }

        // Close peer connection
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        setIsConnected(false);
        setIsRecording(false);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        isConnected,
        isRecording,
        error,
        transcript,
        connect,
        disconnect,
        sendMessage,
        toggleRecording,
    };
}
