'use client';

// Force dynamic rendering to prevent SSR window access errors
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ProgressPillar } from '@/components/chat/ProgressPillar';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChatPage() {
    const [context, setContext] = useState({
        businessName: '',
        problem: '',
        targetAudience: '',
        solution: '',
        monetization: '',
    });

    const handleContextUpdate = (newData: any) => {
        setContext((prev) => ({ ...prev, ...newData }));
    };

    return (
        <div className="relative flex h-screen w-full bg-zinc-950 overflow-hidden font-sans">
            {/* Background Texture / Subtle Gradient (No Nebula) */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 opacity-80 pointer-events-none" />

            {/* Top Navigation / Back Button (Floating) */}
            <div className="absolute top-6 left-6 z-40">
                <Link
                    href="/"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md"
                >
                    <ChevronLeft size={16} />
                    <span className="text-sm font-medium">Back</span>
                </Link>
            </div>

            {/* Main Chat Area - Centered */}
            <main className="relative flex-1 flex flex-col items-center justify-center h-full">
                <div className="w-full h-full max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-8">
                    <ChatInterface onContextUpdate={handleContextUpdate} />
                </div>
            </main>

            {/* The Right Edge Pillar */}
            <ProgressPillar context={context} />
        </div>
    );
}

function CanvasItem({ label, value }: { label: string, value: string }) {
    // Deprecated component - keeping just in case needed for reference, but not used in render
    return null;
}
