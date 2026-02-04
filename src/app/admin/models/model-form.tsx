'use client'

import { useState } from 'react';
import { createBusinessModel } from '@/app/actions/business-models';
// import { useFormState } from 'react-dom'; // Next 14+
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ModelForm() {
    // Basic form handling without complex optimistic updates for speed
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.currentTarget);
        await createBusinessModel(null, formData);
        setLoading(false);
        (event.target as HTMLFormElement).reset();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Business Model</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Model Name</label>
                            <Input name="name" placeholder="e.g. SaaS Subscription" required />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Industry</label>
                            <Input name="industry" placeholder="e.g. Technology" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea name="description" placeholder="Short summary of how this runs..." required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Operational Guide (JSON)</label>
                            <Textarea
                                name="operationalGuide"
                                placeholder='{"Step 1": "Details..."}'
                                className="font-mono text-xs"
                                defaultValue='{"phase1": "Planning", "phase2": "Launch"}'
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Key Metrics (JSON Array)</label>
                            <Textarea
                                name="keyMetrics"
                                placeholder='["CAC", "LTV"]'
                                className="font-mono text-xs"
                                defaultValue='["Revenue", "Profit"]'
                            />
                        </div>
                    </div>

                    <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Add to Library'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
