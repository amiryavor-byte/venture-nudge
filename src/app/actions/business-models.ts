'use server'

import { BusinessModelService } from '@/lib/business-model-service';
import { revalidatePath } from 'next/cache';

export async function getBusinessModels() {
    return await BusinessModelService.getAll();
}

export async function createBusinessModel(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const industry = formData.get('industry') as string;
    const description = formData.get('description') as string;
    const guideRaw = formData.get('operationalGuide') as string;
    const metricsRaw = formData.get('keyMetrics') as string;

    try {
        const operationalGuide = JSON.parse(guideRaw || '{}');
        const keyMetrics = JSON.parse(metricsRaw || '[]');

        await BusinessModelService.create({
            name,
            industry,
            description,
            operationalGuide,
            keyMetrics,
            isVerified: true
        });

        revalidatePath('/admin/models');
        return { message: 'Business model created successfully' };
    } catch (e) {
        return { message: 'Failed to create business model: ' + e };
    }
}

export async function deleteBusinessModel(id: string) {
    await BusinessModelService.delete(id);
    revalidatePath('/admin/models');
}
