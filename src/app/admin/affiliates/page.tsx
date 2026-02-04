import { getAffiliatePrograms, getAffiliateStats } from '@/app/actions/affiliate-management';
import { AffiliateTable } from './affiliate-table';
import { StatsCard } from './stats-cards';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function AffiliatesPage() {
    const affiliates = await getAffiliatePrograms();
    const stats = await getAffiliateStats();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Affiliate Programs</h1>
                    <p className="text-gray-500">
                        Manage affiliate partnerships, track performance, and configure recommendations.
                    </p>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Affiliate
                </Button>
            </div>

            {/* Stats Dashboard */}
            <StatsCard stats={stats} />

            {/* Table */}
            <AffiliateTable affiliates={affiliates} />
        </div>
    );
}
