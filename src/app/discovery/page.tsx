'use client';

import { useState, useTransition } from 'react';
import { submitDiscoveryProfile, generateConcepts, submitManualConcept, createPlanFromConcept, expandPlanSections } from '@/app/actions/discovery';
import { Loader2, ArrowRight, CheckCircle, Lightbulb } from 'lucide-react';

export default function DiscoveryPage() {
    const [step, setStep] = useState(1);
    const [isPending, startTransition] = useTransition();
    const [profileId, setProfileId] = useState<string | null>(null);
    const [concepts, setConcepts] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        interests: '',
        skills: '',
        availableCapital: '',
        riskTolerance: 'medium' as 'low' | 'medium' | 'high',
        preferredTimeCommitment: 'side-hustle' as 'full-time' | 'side-hustle',
        location: ''
    });

    const [manualEntry, setManualEntry] = useState(false);
    const [manualFormData, setManualFormData] = useState({
        businessType: '',
        location: ''
    });

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleManualSubmit = () => {
        startTransition(async () => {
            try {
                const result = await submitManualConcept(manualFormData);
                setConcepts(result);
                setStep(4); // Results step
            } catch (error: any) {
                console.error("Failed to submit concept", error);
                alert("Failed to submit concept.");
            }
        });
    };

    const handleBuildPlan = (conceptId: string) => {
        startTransition(async () => {
            try {
                // 1. Create Draft Plan
                const res = await createPlanFromConcept(conceptId);
                if (!res.success) throw new Error("Failed to create plan");

                // 2. Expand with AI (Deep Dive)
                await expandPlanSections(res.planId);

                // 3. Redirect to Editor
                window.location.href = `/plan/${res.planId}`;
            } catch (error: any) {
                console.error("Build Plan Failed", error);
                alert("Failed to build plan: " + error.message);
            }
        });
    };

    const handleSubmit = () => {
        startTransition(async () => {
            // 1. Submit Profile
            const result = await submitDiscoveryProfile({
                interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
                skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
                availableCapital: formData.availableCapital,
                riskTolerance: formData.riskTolerance,
                preferredTimeCommitment: formData.preferredTimeCommitment,
                location: formData.location
            });

            if (result.success && result.profileId) {
                setProfileId(result.profileId);
                // 2. Generate Ideas
                try {
                    const generated = await generateConcepts(result.profileId);
                    setConcepts(generated);
                    setStep(4); // Results step
                } catch (error: any) {
                    console.error("Failed to generate concepts", error);
                    alert(`Failed to generate concepts: ${error.message || error}`);
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-neutral-900 border border-neutral-800 rounded-xl p-8 shadow-2xl">

                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                        Business Genesis Engine
                    </h1>
                    <p className="text-neutral-400">
                        Don't know where to start? Tell us about you, and we'll build the plan.
                    </p>
                    {step === 1 && !manualEntry && (
                        <div className="mt-4">
                            <button
                                onClick={() => setManualEntry(true)}
                                className="text-sm text-neutral-500 hover:text-neutral-300 underline"
                            >
                                I already have an idea
                            </button>
                        </div>
                    )}
                </div>

                {/* Manual Entry Form */}
                {manualEntry && step !== 4 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <span className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">✎</span>
                            What do you want to build?
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-1">Business Type</label>
                            <input
                                type="text"
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                                placeholder="e.g. Pizza Shop, AI Consultant, Dog Walker"
                                value={manualFormData.businessType}
                                onChange={e => setManualFormData({ ...manualFormData, businessType: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-1">Location (Context)</label>
                            <input
                                type="text"
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3"
                                placeholder="e.g. Boston, MA"
                                value={manualFormData.location}
                                onChange={e => setManualFormData({ ...manualFormData, location: e.target.value })}
                            />
                        </div>

                        <div className="flex justify-between pt-4">
                            <button onClick={() => setManualEntry(false)} className="text-neutral-400 hover:text-white px-4 py-2">Back to Wizard</button>
                            <button
                                onClick={handleManualSubmit}
                                disabled={isPending || !manualFormData.businessType}
                                className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
                                {isPending ? 'Generating Proposal...' : 'Create Proposal'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Steps */}
                {step === 1 && !manualEntry && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <span className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                            What do you enjoy?
                        </h2>
                        <p className="text-sm text-neutral-400">List your hobbies, passions, or things you do for fun (comma separated).</p>
                        <textarea
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-neutral-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            rows={4}
                            placeholder="e.g. Cooking, Gaming, Hiking, Writing code, repairing cars..."
                            value={formData.interests}
                            onChange={e => setFormData({ ...formData, interests: e.target.value })}
                        />
                        <div className="flex justify-end pt-4">
                            <button onClick={handleNext} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                                Next <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <span className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                            What are you good at?
                        </h2>
                        <p className="text-sm text-neutral-400">List your professional skills or talents (comma separated).</p>
                        <textarea
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-neutral-200 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            rows={4}
                            placeholder="e.g. Graphic Design, Python Programming, Public Speaking, Carpentry..."
                            value={formData.skills}
                            onChange={e => setFormData({ ...formData, skills: e.target.value })}
                        />
                        <div className="flex justify-between pt-4">
                            <button onClick={handleBack} className="text-neutral-400 hover:text-white px-4 py-2">Back</button>
                            <button onClick={handleNext} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                                Next <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <span className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                            Resources & Goals
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-1">Available Capital to Invest</label>
                            <input
                                type="text"
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3"
                                placeholder="e.g. $1,000, $50,000, $0"
                                value={formData.availableCapital}
                                onChange={e => setFormData({ ...formData, availableCapital: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-400 mb-1">Location (City/Zip for local insights)</label>
                            <input
                                type="text"
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3"
                                placeholder="e.g. Boston, MA or 02138"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Risk Tolerance</label>
                                <select
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3"
                                    value={formData.riskTolerance}
                                    onChange={e => setFormData({ ...formData, riskTolerance: e.target.value as any })}
                                >
                                    <option value="low">Low (Safe bets)</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High (High risk/reward)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Commitment</label>
                                <select
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3"
                                    value={formData.preferredTimeCommitment}
                                    onChange={e => setFormData({ ...formData, preferredTimeCommitment: e.target.value as any })}
                                >
                                    <option value="side-hustle">Side Hustle</option>
                                    <option value="full-time">Full Time</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <button onClick={handleBack} className="text-neutral-400 hover:text-white px-4 py-2">Back</button>
                            <button
                                onClick={handleSubmit}
                                disabled={isPending}
                                className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
                                {isPending ? 'Analyzing...' : 'Generate Ideas'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center p-3 bg-green-900/30 rounded-full text-green-400 mb-4">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold">Analysis Complete</h2>
                            <p className="text-neutral-400">Based on your profile, we recommend these business matches:</p>
                        </div>

                        <div className="grid gap-4">
                            {concepts.map((concept, idx) => (
                                <div key={idx} className="bg-neutral-800/50 border border-neutral-700 p-5 rounded-xl hover:border-blue-500/50 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{concept.name}</h3>
                                        <span className="text-xs font-mono uppercase bg-neutral-900 border border-neutral-700 px-2 py-1 rounded text-neutral-400">
                                            {concept.conceptType}
                                        </span>
                                    </div>
                                    <p className="text-neutral-300 mb-3 text-sm leading-relaxed">{concept.description}</p>
                                    <div className="bg-blue-900/10 border border-blue-900/30 p-3 rounded-lg mb-4">
                                        <p className="text-xs text-blue-300"><span className="font-semibold">Match Logic:</span> {concept.fitReason}</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleBuildPlan(concept.id); }}
                                        disabled={isPending}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                        {isPending ? 'Building Plan...' : 'Build This Plan'}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center pt-8">
                            <button onClick={() => window.location.reload()} className="text-neutral-500 hover:text-neutral-300 text-sm">
                                Start Over
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
