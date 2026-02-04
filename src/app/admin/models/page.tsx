// Force dynamic rendering - admin pages should not be statically generated
export const dynamic = 'force-dynamic';

import { getBusinessModels, deleteBusinessModel } from '@/app/actions/business-models';
import { ModelForm } from './model-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default async function ModelsPage() {
    const models = await getBusinessModels();

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Encyclopedia</h1>
                    <p className="text-gray-500">Manage the library of business operational guides.</p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Form Column */}
                <div className="lg:col-span-1">
                    <ModelForm />
                </div>

                {/* List Column */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-semibold">Existing Models ({models.length})</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        {models.map((model) => (
                            <Card key={model.id} className="relative group">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{model.name}</CardTitle>
                                            <CardDescription>{model.industry}</CardDescription>
                                        </div>
                                        <form action={async () => {
                                            'use server';
                                            await deleteBusinessModel(model.id);
                                        }}>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </form>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                                        {model.description}
                                    </p>
                                    <div className="mt-4 flex gap-2 flex-wrap">
                                        {Array.isArray(model.keyMetrics) && model.keyMetrics.slice(0, 3).map((metric: string) => (
                                            <span key={metric} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 text-xs rounded-full">
                                                {metric}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {models.length === 0 && (
                            <div className="col-span-2 text-center py-12 text-gray-400 bg-white dark:bg-zinc-800 rounded-lg border border-dashed">
                                No business models found. Add one to get started.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
