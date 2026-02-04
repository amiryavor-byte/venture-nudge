'use client'

import { Button } from '@/components/ui/button';
import { Mic, MessageSquare } from 'lucide-react';

interface VoiceModeToggleProps {
    isVoiceMode: boolean;
    onToggle: (enabled: boolean) => void;
    disabled?: boolean;
}

export function VoiceModeToggle({ isVoiceMode, onToggle, disabled }: VoiceModeToggleProps) {
    return (
        <div className="flex items-center gap-2">
            <Button
                variant={isVoiceMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => onToggle(false)}
                disabled={disabled || !isVoiceMode}
                className={!isVoiceMode ? 'bg-indigo-600 text-white' : ''}
            >
                <MessageSquare className="w-4 h-4 mr-2" />
                Text
            </Button>
            <Button
                variant={isVoiceMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => onToggle(true)}
                disabled={disabled}
                className={isVoiceMode ? 'bg-indigo-600 text-white' : ''}
            >
                <Mic className="w-4 h-4 mr-2" />
                Voice
            </Button>
        </div>
    );
}
