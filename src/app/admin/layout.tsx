import Link from 'next/link';
import { Home, Settings, Users, Library, DollarSign, Paintbrush } from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-[var(--color-background)]">
            {/* Sidebar */}
            <aside className="w-64 bg-[var(--color-surface)] border-r border-[var(--color-border)]">
                <div className="p-6">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]">
                        Admin Panel
                    </h2>
                </div>
                <nav className="space-y-1 px-4">
                    <Link
                        href="/admin"
                        className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
                    >
                        <Home className="mr-3 h-5 w-5" />
                        Overview
                    </Link>
                    <Link
                        href="/admin/models"
                        className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
                    >
                        <Library className="mr-3 h-5 w-5" />
                        Encyclopedia
                    </Link>
                    <Link
                        href="/admin/users"
                        className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
                    >
                        <Users className="mr-3 h-5 w-5" />
                        User Management
                    </Link>
                    <Link
                        href="/admin/affiliates"
                        className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
                    >
                        <DollarSign className="mr-3 h-5 w-5" />
                        Affiliate Programs
                    </Link>
                    <Link
                        href="/admin/theme"
                        className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
                    >
                        <Paintbrush className="mr-3 h-5 w-5" />
                        Theme & Styling
                    </Link>
                    <Link
                        href="/admin/settings"
                        className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition-colors"
                    >
                        <Settings className="mr-3 h-5 w-5" />
                        Settings
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto">{children}</div>
            </main>
        </div>
    );
}
