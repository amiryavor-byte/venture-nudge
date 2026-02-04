import Link from 'next/link';
// force rebuild
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="fixed w-full z-50 backdrop-blur-lg border-b border-white/5 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-lg">V</div>
            <span className="font-semibold text-lg tracking-tight">VentureNudge<span className="text-indigo-400">.ai</span></span>
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">Sign In</Link>
            <Link href="/signup" className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="relative pt-32 pb-16 px-6">
        {/* Hero Section */}
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium uppercase tracking-wider">
            <span>Powered by Venture Nudge Engine</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent pb-2">
            Be your own boss. <br /> We'll show you where to start.
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop guessing. Use our AI-driven engines to model financials, analyze market gaps, and generate a battle-tested roadmap for <strong>any venture</strong>.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/chat"
              className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-semibold transition-all shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-10px_rgba(99,102,241,0.6)]"
            >
              Start Brainstorming
              <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
            </Link>
            <Link
              href="/demo"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full font-semibold transition-all border border-slate-700"
            >
              View Sample Plan
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="max-w-7xl mx-auto mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            title="Market Intelligence"
            description="Real-time competitor tracking and gap analysis powered by SERP data."
            icon="🌐"
          />
          <FeatureCard
            title="Financial Modeling"
            description="Automated P&L, cash flow projections, and burn rate calculators."
            icon="📈"
          />
          <FeatureCard
            title="Strategic Roadmap"
            description="Turn ideas into a quarterly execution plan with clear milestones."
            icon="🗺️"
          />
        </div>
      </main>

      {/* Decorative Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { title: string, description: string, icon: string }) {
  return (
    <div className="p-8 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-indigo-500/30 transition-colors group">
      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-slate-100">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
