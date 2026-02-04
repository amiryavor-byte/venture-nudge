'use client'

import { useState, useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { EditableCell } from '@/components/admin/editable-cell';
import { PasswordResetDialog } from '@/components/admin/password-reset-dialog';
import { Search, Key, Trash2, UserPlus } from 'lucide-react';
import { updateUser, deleteUser, type SafeUser } from '@/app/actions/user-management';
import { RoleBadge } from '@/components/admin/role-badge';

interface UserTableProps {
    users: SafeUser[];
}

export function UserTable({ users: initialUsers }: UserTableProps) {
    const [users, setUsers] = useState<SafeUser[]>(initialUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [passwordResetUser, setPasswordResetUser] = useState<SafeUser | null>(null);

    // Filter users based on search query
    const filteredUsers = useMemo(() => {
        if (!searchQuery.trim()) return users;

        const query = searchQuery.toLowerCase();
        return users.filter(user =>
            user.name?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.location?.toLowerCase().includes(query) ||
            user.userId?.toLowerCase().includes(query)
        );
    }, [users, searchQuery]);

    const handleUpdate = async (userId: string, field: keyof SafeUser, value: string) => {
        const result = await updateUser(userId, { [field]: value });

        if (result.success) {
            // Optimistically update local state
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId ? { ...user, [field]: value } : user
                )
            );
        }

        return result;
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        const result = await deleteUser(userId);

        if (result.success) {
            setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        } else {
            alert('Failed to delete user: ' + (result.error || 'Unknown error'));
        }
    };

    const getActiveStatusBadge = (isActive: boolean | null) => {
        if (isActive) {
            return <span className="inline-flex items-center rounded-full border border-transparent bg-green-600 px-2.5 py-0.5 text-xs font-semibold text-white">Active</span>;
        }
        return <span className="inline-flex items-center rounded-full border border-transparent bg-red-600 px-2.5 py-0.5 text-xs font-semibold text-white">Inactive</span>;
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by name, email, or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="text-sm text-muted-foreground">
                    {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-white dark:bg-zinc-900">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Capital</TableHead>
                            <TableHead>Risk</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={8}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    {searchQuery ? 'No users found matching your search.' : 'No users found.'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">
                                        <EditableCell
                                            value={user.name}
                                            onSave={(value) => handleUpdate(user.id, 'name', value)}
                                            placeholder="No name"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <EditableCell
                                            value={user.email}
                                            onSave={(value) => handleUpdate(user.id, 'email', value)}
                                            placeholder="No email"
                                            type="email"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <EditableCell
                                            value={user.location}
                                            onSave={(value) => handleUpdate(user.id, 'location', value)}
                                            placeholder="No location"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <EditableCell
                                            value={user.availableCapital}
                                            onSave={(value) => handleUpdate(user.id, 'availableCapital', value)}
                                            placeholder="N/A"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <EditableCell
                                            value={user.riskTolerance}
                                            onSave={(value) => handleUpdate(user.id, 'riskTolerance', value)}
                                            placeholder="N/A"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <RoleBadge role={user.role} />
                                    </TableCell>
                                    <TableCell>
                                        {getActiveStatusBadge(user.isActive)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => setPasswordResetUser(user)}
                                                title="Reset password"
                                            >
                                                <Key className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDelete(user.id)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                                title="Delete user"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Password Reset Dialog */}
            {passwordResetUser && (
                <PasswordResetDialog
                    isOpen={!!passwordResetUser}
                    onClose={() => setPasswordResetUser(null)}
                    userId={passwordResetUser.id}
                    userName={passwordResetUser.name || passwordResetUser.email || 'User'}
                />
            )}
        </div>
    );
}
