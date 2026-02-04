'use client'

import { Badge } from '@/components/ui/badge';
import { getRoleDisplayName, getRoleBadgeVariant, type UserRole } from '@/lib/rbac';

interface RoleBadgeProps {
    role: string | null;
    className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
    const variant = getRoleBadgeVariant(role);
    const displayName = getRoleDisplayName(role);

    return (
        <Badge variant={variant} className={className}>
            {displayName}
        </Badge>
    );
}
