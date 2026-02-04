import React, { useState } from 'react';
import { BusinessPlanData } from '@/lib/engines/business-plan-service';
import { Scale, CheckCircle2, Circle, AlertCircle, FileText, Building } from 'lucide-react';

interface LegalComplianceSectionProps {
    data: BusinessPlanData;
    onChange: (data: BusinessPlanData) => void;
}

const ENTITY_TYPES = [
    {
        id: 'Sole Proprietorship',
        label: 'Sole Proprietorship',
        description: 'Simplest. No liability protection. You are the business.',
        idealFor: 'Low-risk side hustles, freelancers.'
    },
    {
        id: 'LLC',
        label: 'Limited Liability Company (LLC)',
        description: 'Protects personal assets. Flexible taxation.',
        idealFor: 'Small businesses, startups, service providers.',
        recommended: true
    },
    {
        id: 'Corporation',
        label: 'C-Corporation',
        description: 'Double taxation, but allows stock issuance.',
        idealFor: 'Startups seeking venture capital.'
    },
    {
        id: 'Partnership',
        label: 'Partnership',
        description: 'Two or more owners. Shared liability.',
        idealFor: 'Professional firms (law, accounting).'
    }
] as const;

export function LegalComplianceSection({ data, onChange }: LegalComplianceSectionProps) {
    const [selectedEntity, setSelectedEntity] = useState<string | undefined>(data.legalStructure);

    const handleEntitySelect = (entity: any) => {
        setSelectedEntity(entity);
        onChange({ ...data, legalStructure: entity });
    };

    const handleAddLicense = () => {
        const currentLicenses = data.licenses || [];
        const newLicense = { name: 'New License', status: 'needed' as const, notes: '' };
        onChange({ ...data, licenses: [...currentLicenses, newLicense] });
    };

    const updateLicense = (index: number, field: string, value: string) => {
        const currentLicenses = [...(data.licenses || [])];
        currentLicenses[index] = { ...currentLicenses[index], [field]: value };
        onChange({ ...data, licenses: currentLicenses });
    };

    const removeLicense = (index: number) => {
        const currentLicenses = [...(data.licenses || [])];
        currentLicenses.splice(index, 1);
        onChange({ ...data, licenses: currentLicenses });
    };

    return (
        <section className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-100 rounded-lg">
                    <Scale className="w-6 h-6 text-indigo-700" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Legal & Compliance</h2>
                    <p className="text-slate-500">Structure your business and track regulatory requirements.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Entity Selection */}
                <div>
                    <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                        <Building className="w-4 h-4" /> Legal Entity Structure
                    </h3>
                    <div className="space-y-3">
                        {ENTITY_TYPES.map((entity) => (
                            <button
                                key={entity.id}
                                onClick={() => handleEntitySelect(entity.id)}
                                className={`w-full text-left p-4 rounded-xl border transition-all ${selectedEntity === entity.id
                                        ? 'bg-indigo-50 border-indigo-500 shadow-sm ring-1 ring-indigo-500'
                                        : 'bg-white border-slate-200 hover:border-indigo-300'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`font-semibold ${selectedEntity === entity.id ? 'text-indigo-700' : 'text-slate-700'}`}>
                                        {entity.label}
                                    </span>
                                    {selectedEntity === entity.id && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
                                </div>
                                <p className="text-sm text-slate-500 mb-2">{entity.description}</p>
                                <div className="text-xs font-medium text-slate-400 bg-slate-50 inline-block px-2 py-1 rounded">
                                    Best for: {entity.idealFor}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Licensing Checklist */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Licenses & Permits
                        </h3>
                        {/* <button className="text-xs text-indigo-600 font-medium hover:underline">
                            Auto-Generate for {data.location?.zipCode || 'Location'}
                        </button> */}
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 min-h-[300px]">
                        {!data.licenses || data.licenses.length === 0 ? (
                            <div className="text-center py-12">
                                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-400">No licenses tracked yet.</p>
                                <button
                                    onClick={handleAddLicense}
                                    className="mt-4 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-600 hover:text-indigo-600 hover:border-indigo-400 transition-colors shadow-sm"
                                >
                                    Add Custom License
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {data.licenses.map((license, idx) => (
                                    <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm group">
                                        <div className="flex items-center gap-2 mb-2">
                                            <button
                                                onClick={() => {
                                                    const nextStatus = { needed: 'in-progress', 'in-progress': 'acquired', acquired: 'needed' };
                                                    updateLicense(idx, 'status', nextStatus[license.status]);
                                                }}
                                                className={`w-5 h-5 rounded-full flex items-center justify-center border ${license.status === 'acquired' ? 'bg-green-500 border-green-500 text-white' :
                                                        license.status === 'in-progress' ? 'bg-yellow-100 border-yellow-400 text-yellow-600' :
                                                            'bg-white border-slate-300 text-transparent'
                                                    }`}
                                            >
                                                {license.status === 'acquired' && <CheckCircle2 size={12} />}
                                                {license.status === 'in-progress' && <Circle size={8} fill="currentColor" />}
                                            </button>
                                            <input
                                                type="text"
                                                value={license.name}
                                                onChange={(e) => updateLicense(idx, 'name', e.target.value)}
                                                className="flex-1 text-sm font-medium text-slate-700 bg-transparent border-none focus:ring-0 p-0 placeholder:text-slate-400"
                                                placeholder="License Name (e.g. Sales Tax ID)"
                                            />
                                            <button onClick={() => removeLicense(idx)} className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                ×
                                            </button>
                                        </div>
                                        <div className="pl-7">
                                            <input
                                                type="text"
                                                value={license.notes || ''}
                                                onChange={(e) => updateLicense(idx, 'notes', e.target.value)}
                                                className="w-full text-xs text-slate-500 bg-transparent border-none focus:ring-0 p-0 placeholder:text-slate-300"
                                                placeholder="Add notes (e.g. Agency, Cost)..."
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={handleAddLicense}
                                    className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-xs text-slate-400 hover:text-indigo-600 hover:border-indigo-400 hover:bg-white transition-all"
                                >
                                    + Add Item
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
