import { AffiliateStats } from '@/app/actions/affiliate-management';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Activity, CheckCircle, TrendingUp } from 'lucide-react';

interface StatsCardProps {
    stats: AffiliateStats;
}

export function StatsCard({ stats }: StatsCardProps) {
    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(cents / 100);
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Programs */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                        Total Programs
                    </CardTitle>
                    <Activity className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.totalPrograms}</div>
                    <p className="text-xs text-gray-500 mt-1">
                        Across all categories
                    </p>
                </CardContent>
            </Card>

            {/* Active Programs */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                        Active Programs
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.activePrograms}</div>
                    <p className="text-xs text-gray-500 mt-1">
                        Currently recommending
                    </p>
                </CardContent>
            </Card>

            {/* Total Revenue */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                        Total Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                    <p className="text-xs text-gray-500 mt-1">
                        From {stats.totalConversions} conversions
                    </p>
                </CardContent>
            </Card>

            {/* Top Performer */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                        Top Performer
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                    {stats.topPerformers.length > 0 ? (
                        <>
                            <div className="text-2xl font-bold">{stats.topPerformers[0].name}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                {formatCurrency(stats.topPerformers[0].revenue)} earned
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="text-2xl font-bold">—</div>
                            <p className="text-xs text-gray-500 mt-1">No conversions yet</p>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
