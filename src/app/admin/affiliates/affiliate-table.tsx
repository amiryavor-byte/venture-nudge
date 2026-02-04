'use client';

import { useState } from 'react';
import { AffiliateProgram, deleteAffiliateProgram, bulkUpdateStatus, updateAffiliateProgram } from '@/app/actions/affiliate-management';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Search,
    ExternalLink,
    Trash2,
    Edit,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Code,
    TrendingUp,
    ChevronDown,
    ChevronRight,
    Save,
    StickyNote,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AffiliateTableProps {
    affiliates: AffiliateProgram[];
}

export function AffiliateTable({ affiliates }: AffiliateTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [editingNotes, setEditingNotes] = useState<{ [key: string]: string }>({});
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [categorySearchTerm, setCategorySearchTerm] = useState('');

    // Get unique categories
    const categories = [...new Set(affiliates.map(a => a.category))].filter(Boolean).sort();

    // Filter affiliates
    const filteredAffiliates = affiliates.filter(affiliate => {
        const matchesSearch = affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            affiliate.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || affiliate.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || affiliate.category === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</Badge>;
            case 'inactive':
                return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">Inactive</Badge>;
            case 'deprecated':
                return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">Deprecated</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            banking: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
            legal: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
            tax: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
            accounting: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
            pos: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100',
            hr: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100',
            shipping: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100',
            crm: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100',
            email_marketing: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-100',
            productivity: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-100',
        };
        return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    };

    const formatCurrency = (cents: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(cents / 100);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this affiliate program?')) {
            await deleteAffiliateProgram(id);
        }
    };

    const toggleRow = (id: string) => {
        if (expandedRow === id) {
            setExpandedRow(null);
        } else {
            setExpandedRow(id);
            // Initialize editing state with current notes
            const affiliate = affiliates.find(a => a.id === id);
            if (affiliate && !editingNotes[id]) {
                setEditingNotes({ ...editingNotes, [id]: affiliate.notes || '' });
            }
        }
    };

    const handleSaveNotes = async (id: string) => {
        const notes = editingNotes[id] || '';
        await updateAffiliateProgram(id, { notes });
        // Optionally close the row or show success feedback
    };

    return (
        <Card>
            <CardContent className="p-6">
                {/* Search and Status Filter */}
                <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search affiliates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 text-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="deprecated">Deprecated</option>
                    </select>
                </div>

                {/* Category Filter Dropdown */}
                <div className="mb-6 relative">
                    <button
                        type="button"
                        onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                        className="w-full sm:w-auto min-w-[280px] px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-xl text-left flex items-center justify-between gap-3 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryFilter === 'all'
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                                : 'bg-gradient-to-br from-purple-500 to-violet-500 text-white'
                                }`}>
                                <span className="text-lg font-bold">
                                    {categoryFilter === 'all'
                                        ? affiliates.length
                                        : affiliates.filter(a => a.category === categoryFilter).length
                                    }
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Category Filter</span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 capitalize">
                                    {categoryFilter === 'all' ? 'All Categories' : categoryFilter.replace(/_/g, ' ')}
                                </span>
                            </div>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''
                            }`} />
                    </button>

                    {/* Dropdown Panel */}
                    {categoryDropdownOpen && (
                        <>
                            {/* Backdrop to close on outside click */}
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => {
                                    setCategoryDropdownOpen(false);
                                    setCategorySearchTerm('');
                                }}
                            />
                            <div className="absolute top-full mt-2 w-full sm:w-96 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                                {/* Search Input */}
                                <div className="p-3 border-b border-gray-200 dark:border-zinc-700">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search categories..."
                                            value={categorySearchTerm}
                                            onChange={(e) => setCategorySearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {/* Category List */}
                                <div className="max-h-[400px] overflow-y-auto">
                                    {/* All Categories Option */}
                                    <button
                                        onClick={() => {
                                            setCategoryFilter('all');
                                            setCategoryDropdownOpen(false);
                                            setCategorySearchTerm('');
                                        }}
                                        className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors ${categoryFilter === 'all' ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                                <span className="text-sm font-bold text-white">{affiliates.length}</span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                All Categories
                                            </span>
                                        </div>
                                        {categoryFilter === 'all' && (
                                            <CheckCircle className="h-5 w-5 text-blue-500" />
                                        )}
                                    </button>

                                    {/* Individual Categories */}
                                    {categories
                                        .filter(cat =>
                                            cat.toLowerCase().includes(categorySearchTerm.toLowerCase())
                                        )
                                        .map(cat => {
                                            const count = affiliates.filter(a => a.category === cat).length;
                                            const isActive = categoryFilter === cat;

                                            // Category-specific gradient colors
                                            const categoryColors: Record<string, { from: string; to: string }> = {
                                                banking: { from: 'from-blue-500', to: 'to-cyan-500' },
                                                legal: { from: 'from-purple-500', to: 'to-violet-500' },
                                                tax: { from: 'from-amber-500', to: 'to-yellow-500' },
                                                accounting: { from: 'from-green-500', to: 'to-emerald-500' },
                                                pos: { from: 'from-pink-500', to: 'to-rose-500' },
                                                hr: { from: 'from-indigo-500', to: 'to-blue-500' },
                                                shipping: { from: 'from-orange-500', to: 'to-red-500' },
                                                crm: { from: 'from-cyan-500', to: 'to-teal-500' },
                                                email_marketing: { from: 'from-fuchsia-500', to: 'to-pink-500' },
                                                productivity: { from: 'from-violet-500', to: 'to-purple-500' },
                                            };

                                            const colors = categoryColors[cat] || { from: 'from-gray-500', to: 'to-gray-600' };

                                            return (
                                                <button
                                                    key={cat}
                                                    onClick={() => {
                                                        setCategoryFilter(cat);
                                                        setCategoryDropdownOpen(false);
                                                        setCategorySearchTerm('');
                                                    }}
                                                    className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors ${isActive ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors.from} ${colors.to} flex items-center justify-center`}>
                                                            <span className="text-sm font-bold text-white">{count}</span>
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                                                            {cat.replace(/_/g, ' ')}
                                                        </span>
                                                    </div>
                                                    {isActive && (
                                                        <CheckCircle className="h-5 w-5 text-purple-500" />
                                                    )}
                                                </button>
                                            );
                                        })}

                                    {categorySearchTerm && categories.filter(cat =>
                                        cat.toLowerCase().includes(categorySearchTerm.toLowerCase())
                                    ).length === 0 && (
                                            <div className="px-4 py-8 text-center text-sm text-gray-500">
                                                No categories found for "{categorySearchTerm}"
                                            </div>
                                        )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Results Count */}
                <p className="text-sm text-gray-500 mb-4">
                    Showing {filteredAffiliates.length} of {affiliates.length} programs
                </p>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-gray-200 dark:border-zinc-700">
                            <tr>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-200 w-12">
                                    {/* Expand column */}
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    Program
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    Commission
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    Status
                                </th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    Performance
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAffiliates.map(affiliate => (
                                <>
                                    <tr
                                        key={affiliate.id}
                                        className="border-b border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                                    >
                                        <td className="py-4 px-4">
                                            <button
                                                onClick={() => toggleRow(affiliate.id)}
                                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                title={affiliate.notes ? "View notes" : "Add notes"}
                                            >
                                                {expandedRow === affiliate.id ? (
                                                    <ChevronDown className="h-4 w-4" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4" />
                                                )}
                                                {affiliate.notes && (
                                                    <StickyNote className="h-3 w-3 text-yellow-500 absolute -mt-2 ml-2" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{affiliate.name}</span>
                                                    {affiliate.hasApi && (
                                                        <Code className="h-3 w-3 text-blue-500" title="Has API" />
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge className={getCategoryColor(affiliate.category)}>
                                                        {affiliate.category}
                                                    </Badge>
                                                    {affiliate.phaseOutDate && (
                                                        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
                                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                                            Phase-out: {new Date(affiliate.phaseOutDate).getFullYear()}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-green-600 dark:text-green-400">
                                                    {affiliate.commissionRate}
                                                </span>
                                                {affiliate.commissionType && (
                                                    <span className="text-xs text-gray-500">
                                                        {affiliate.commissionType}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            {getStatusBadge(affiliate.status || 'active')}
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col text-sm">
                                                <span>{affiliate.totalConversions || 0} conversions</span>
                                                <span className="text-gray-500">
                                                    {formatCurrency(affiliate.totalRevenue || 0)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => window.open(affiliate.signupUrl, '_blank')}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                                    title="Sign Up for Affiliate Program"
                                                >
                                                    <ExternalLink className="h-4 w-4 mr-1" />
                                                    Sign Up
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(affiliate.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* Expanded Row with Notes */}
                                    {expandedRow === affiliate.id && (
                                        <tr key={`${affiliate.id}-expanded`} className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50">
                                            <td colSpan={6} className="py-4 px-4">
                                                <div className="max-w-4xl">
                                                    <div className="flex items-start gap-4">
                                                        <div className="flex-1">
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                                Notes (Affiliate ID, account details, special terms, etc.)
                                                            </label>
                                                            <textarea
                                                                value={editingNotes[affiliate.id] || ''}
                                                                onChange={(e) => setEditingNotes({
                                                                    ...editingNotes,
                                                                    [affiliate.id]: e.target.value
                                                                })}
                                                                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 text-sm min-h-[100px]"
                                                                placeholder="Store affiliate ID, account details, payout method, special terms, or anything important to remember about this program..."
                                                            />
                                                            <div className="flex justify-end mt-2">
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleSaveNotes(affiliate.id)}
                                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                                >
                                                                    <Save className="h-4 w-4 mr-1" />
                                                                    Save Notes
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                            {affiliate.affiliateDashboardUrl && (
                                                                <a
                                                                    href={affiliate.affiliateDashboardUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:underline flex items-center gap-1"
                                                                >
                                                                    <ExternalLink className="h-3 w-3" />
                                                                    Dashboard
                                                                </a>
                                                            )}
                                                            {affiliate.apiDocsUrl && (
                                                                <a
                                                                    href={affiliate.apiDocsUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:underline flex items-center gap-1"
                                                                >
                                                                    <Code className="h-3 w-3" />
                                                                    API Docs
                                                                </a>
                                                            )}
                                                            {affiliate.termsUrl && (
                                                                <a
                                                                    href={affiliate.termsUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:underline flex items-center gap-1"
                                                                >
                                                                    <ExternalLink className="h-3 w-3" />
                                                                    Terms
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>

                    {filteredAffiliates.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            No affiliate programs found. Try adjusting your filters.
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
