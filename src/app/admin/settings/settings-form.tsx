'use client'

import { useState } from 'react';
import { updateSetting } from '@/app/actions/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function SettingsForm({ initialSettings }: { initialSettings: Record<string, string | null> }) {
    const [loading, setLoading] = useState(false);

    // AI API Keys
    const [openaiKey, setOpenaiKey] = useState(initialSettings['OPENAI_API_KEY'] || '');
    const [anthropicKey, setAnthropicKey] = useState(initialSettings['ANTHROPIC_API_KEY'] || '');

    // OAuth Configuration
    const [nextauthSecret, setNextauthSecret] = useState(initialSettings['NEXTAUTH_SECRET'] || '');
    const [nextauthUrl, setNextauthUrl] = useState(initialSettings['NEXTAUTH_URL'] || 'http://localhost:3000');
    const [googleClientId, setGoogleClientId] = useState(initialSettings['GOOGLE_CLIENT_ID'] || '');
    const [googleClientSecret, setGoogleClientSecret] = useState(initialSettings['GOOGLE_CLIENT_SECRET'] || '');
    const [appleId, setAppleId] = useState(initialSettings['APPLE_ID'] || '');
    const [appleSecret, setAppleSecret] = useState(initialSettings['APPLE_SECRET'] || '');

    // Avatar API Configuration (OpenAI Realtime + Agora)
    const [agoraAppId, setAgoraAppId] = useState(initialSettings['AGORA_APP_ID'] || '');
    const [agoraAppCert, setAgoraAppCert] = useState(initialSettings['AGORA_APP_CERTIFICATE'] || '');

    async function handleSave(key: string, value: string) {
        setLoading(true);
        await updateSetting(key, value);
        setLoading(false);
    }

    return (
        <div className="space-y-6">
            {/* AI API Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle>AI API Configuration</CardTitle>
                    <CardDescription>Manage keys for AI providers (OpenAI, Anthropic).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">OpenAI API Key</label>
                        <div className="flex gap-2">
                            <Input
                                type="password"
                                value={openaiKey}
                                onChange={(e) => setOpenaiKey(e.target.value)}
                                placeholder="sk-..."
                            />
                            <Button
                                onClick={() => handleSave('OPENAI_API_KEY', openaiKey)}
                                disabled={loading}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Anthropic API Key</label>
                        <div className="flex gap-2">
                            <Input
                                type="password"
                                value={anthropicKey}
                                onChange={(e) => setAnthropicKey(e.target.value)}
                                placeholder="sk-ant-..."
                            />
                            <Button
                                onClick={() => handleSave('ANTHROPIC_API_KEY', anthropicKey)}
                                disabled={loading}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* OAuth Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle>OAuth Configuration</CardTitle>
                    <CardDescription>Configure Google and Apple Sign In credentials for user authentication.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* NextAuth Configuration */}
                    <div className="border-b pb-4">
                        <h3 className="text-sm font-semibold mb-3">NextAuth Settings</h3>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">NextAuth URL</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        value={nextauthUrl}
                                        onChange={(e) => setNextauthUrl(e.target.value)}
                                        placeholder="http://localhost:3000"
                                    />
                                    <Button
                                        onClick={() => handleSave('NEXTAUTH_URL', nextauthUrl)}
                                        disabled={loading}
                                    >
                                        Save
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-500">Base URL for OAuth callbacks</p>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">NextAuth Secret</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="password"
                                        value={nextauthSecret}
                                        onChange={(e) => setNextauthSecret(e.target.value)}
                                        placeholder="Generate with: openssl rand -base64 32"
                                    />
                                    <Button
                                        onClick={() => handleSave('NEXTAUTH_SECRET', nextauthSecret)}
                                        disabled={loading}
                                    >
                                        Save
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-500">Secret for encrypting tokens and cookies</p>
                            </div>
                        </div>
                    </div>

                    {/* Google OAuth */}
                    <div className="border-b pb-4">
                        <h3 className="text-sm font-semibold mb-3">Google OAuth</h3>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Google Client ID</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        value={googleClientId}
                                        onChange={(e) => setGoogleClientId(e.target.value)}
                                        placeholder="xxx.apps.googleusercontent.com"
                                    />
                                    <Button
                                        onClick={() => handleSave('GOOGLE_CLIENT_ID', googleClientId)}
                                        disabled={loading}
                                    >
                                        Save
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-500">
                                    From <a href="https://console.cloud.google.com/" target="_blank" className="text-blue-500 hover:underline">Google Cloud Console</a>
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Google Client Secret</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="password"
                                        value={googleClientSecret}
                                        onChange={(e) => setGoogleClientSecret(e.target.value)}
                                        placeholder="GOCSPX-..."
                                    />
                                    <Button
                                        onClick={() => handleSave('GOOGLE_CLIENT_SECRET', googleClientSecret)}
                                        disabled={loading}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Apple Sign In */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3">Apple Sign In</h3>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Apple Service ID</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        value={appleId}
                                        onChange={(e) => setAppleId(e.target.value)}
                                        placeholder="com.venturenudge.auth"
                                    />
                                    <Button
                                        onClick={() => handleSave('APPLE_ID', appleId)}
                                        disabled={loading}
                                    >
                                        Save
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-500">
                                    From <a href="https://developer.apple.com/" target="_blank" className="text-blue-500 hover:underline">Apple Developer Portal</a>
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Apple Private Key</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="password"
                                        value={appleSecret}
                                        onChange={(e) => setAppleSecret(e.target.value)}
                                        placeholder="-----BEGIN PRIVATE KEY-----..."
                                    />
                                    <Button
                                        onClick={() => handleSave('APPLE_SECRET', appleSecret)}
                                        disabled={loading}
                                    >
                                        Save
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-500">Private key from App ID configuration</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Avatar API Configuration */}
            <Card>
                <CardHeader>
                    <CardTitle>🎤 Avatar Voice Assistant API Keys</CardTitle>
                    <CardDescription>Configure API credentials for the Nudge AI Avatar (uses OpenAI Realtime API)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Info Banner */}
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-sm text-blue-300 font-medium mb-1">💡 Cost-Optimized Setup</p>
                        <p className="text-xs text-slate-400">
                            Using OpenAI Realtime API (combines speech-to-text, LLM, and text-to-speech) + Agora for video streaming.
                            This is 19% cheaper than separate services and ensures avatar follows your existing chat rules.
                        </p>
                    </div>

                    {/* OpenAI - Already configured above, just reference it */}
                    <div className="border-b pb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-sm font-semibold">OpenAI Realtime API</h3>
                            <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded">Already Configured Above</span>
                        </div>
                        <p className="text-xs text-slate-500">
                            Uses your existing OpenAI API key for voice conversations. Supports gpt-4o-realtime-preview model.
                        </p>
                    </div>

                    {/* Agora */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold">Agora (Real-Time Communication)</h3>
                            <a
                                href="https://console.agora.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 hover:underline"
                            >
                                Sign Up (Free) →
                            </a>
                        </div>
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Agora App ID</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        value={agoraAppId}
                                        onChange={(e) => setAgoraAppId(e.target.value)}
                                        placeholder="Enter Agora App ID"
                                    />
                                    <Button
                                        onClick={() => handleSave('AGORA_APP_ID', agoraAppId)}
                                        disabled={loading}
                                    >
                                        Save
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-500">Free tier: 10,000 minutes/month</p>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Agora App Certificate</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="password"
                                        value={agoraAppCert}
                                        onChange={(e) => setAgoraAppCert(e.target.value)}
                                        placeholder="Enter App Certificate"
                                    />
                                    <Button
                                        onClick={() => handleSave('AGORA_APP_CERTIFICATE', agoraAppCert)}
                                        disabled={loading}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cost Summary */}
                    <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                        <p className="text-xs font-medium text-indigo-300 mb-1">💰 Cost per Voice Minute</p>
                        <div className="text-xs text-slate-400 space-y-1">
                            <p>OpenAI Realtime: $0.06/min (input) + $0.24/min (output)</p>
                            <p>Agora RTC: $0.01/min</p>
                            <p className="font-medium text-indigo-300 mt-2">Total: ~$0.31/min (~$0.005/message)</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
