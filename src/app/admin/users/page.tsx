// Force dynamic rendering - admin pages should not be statically generated
export const dynamic = 'force-dynamic';

import { getUsersWithSearch } from '@/app/actions/user-management';
import { UserTable } from './user-table';

export default async function UsersPage() {
    const users = await getUsersWithSearch();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                <p className="text-gray-500">Manage user accounts, permissions, and passwords.</p>
            </div>

            <UserTable users={users} />
        </div>
    );
}
