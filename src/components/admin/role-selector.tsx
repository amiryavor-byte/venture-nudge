'use client'

import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { type UserRole, getRoleDisplayName } from '@/lib/rbac';

interface RoleSelectorProps {
    currentRole: string | null;
    onChange: (newRole: UserRole) => Promise<void>;
    disabled?: boolean;
    canChangeToAdmin?: boolean; // Whether admin role option should be available
}

const ROLE_OPTIONS: UserRole[] = ['user', 'premium', 'admin'];

export function RoleSelector({
    currentRole,
    onChange,
    disabled = false,
    canChangeToAdmin = false,
}: RoleSelectorProps) {
    const [isChanging, setIsChanging] = useState(false);

    const handleChange = async (newRole: string) => {
        setIsChanging(true);
        try {
            await onChange(newRole as UserRole);
        } finally {
            setIsChanging(false);
        }
    };

    // Filter out admin role if not allowed
    const availableRoles = canChangeToAdmin
        ? ROLE_OPTIONS
        : ROLE_OPTIONS.filter(r => r !== 'admin');

    return (
        <Select
            value={currentRole || 'user'}
            onValueChange={handleChange}
            disabled={disabled || isChanging}
        >
            <SelectTrigger className="w-[140px]">
                <SelectValue>
                    {isChanging ? 'Changing...' : getRoleDisplayName(currentRole)}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {availableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                        {getRoleDisplayName(role)}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
