'use client'

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, RefreshCw, Loader2 } from 'lucide-react';
import { generateSecurePassword, resetUserPassword } from '@/app/actions/user-management';

interface PasswordResetDialogProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    userName: string;
}

export function PasswordResetDialog({
    isOpen,
    onClose,
    userId,
    userName
}: PasswordResetDialogProps) {
    const [password, setPassword] = useState('');
    const [copied, setCopied] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleGenerate = async () => {
        const newPassword = await generateSecurePassword(16);
        setPassword(newPassword);
    };

    const handleCopy = async () => {
        if (password) {
            await navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleReset = async () => {
        if (!password || password.length < 8) {
            alert('Password must be at least 8 characters long');
            return;
        }

        setIsResetting(true);
        const result = await resetUserPassword(userId, password);
        setIsResetting(false);

        if (result.success) {
            setShowSuccess(true);
            // Auto-close after showing success
            setTimeout(() => {
                handleClose();
            }, 3000);
        } else {
            alert('Failed to reset password: ' + (result.error || 'Unknown error'));
        }
    };

    const handleClose = () => {
        setPassword('');
        setCopied(false);
        setShowSuccess(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>
                        Reset password for <strong>{userName}</strong>
                    </DialogDescription>
                </DialogHeader>

                {showSuccess ? (
                    <div className="py-6 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                            <Check className="h-6 w-6 text-green-600 dark:text-green-300" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold">Password Reset Successful</h3>
                        <p className="text-sm text-muted-foreground">
                            The new password has been set for this user.
                        </p>
                        {password && (
                            <div className="mt-4 rounded-md bg-muted p-3">
                                <p className="text-xs text-muted-foreground mb-1">Temporary password:</p>
                                <code className="text-sm font-mono break-all">{password}</code>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium">
                                    New Password
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        id="password"
                                        type="text"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={handleGenerate}
                                        title="Generate secure password"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={handleCopy}
                                        disabled={!password}
                                        title="Copy to clipboard"
                                    >
                                        {copied ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Password must be at least 8 characters long
                                </p>
                            </div>

                            {password && (
                                <div className="rounded-md bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-3">
                                    <p className="text-xs text-amber-800 dark:text-amber-200">
                                        <strong>Important:</strong> Make sure to copy this password before closing.
                                        You won't be able to view it again.
                                    </p>
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isResetting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleReset}
                                disabled={!password || isResetting}
                            >
                                {isResetting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Resetting...
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
