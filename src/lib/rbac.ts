/**
 * Role-Based Access Control (RBAC) Utilities
 * 
 * Role Structure:
 * - user: Basic tier with limited features (50 AI credits/month, max 2 business plans)
 * - premium: Full feature access (unlimited credits, unlimited plans, advanced analytics) - NO admin access
 * - admin: System administrator (can manage users, pricing, settings) - regular feature access
 */

export type UserRole = 'user' | 'premium' | 'admin';

/**
 * Check if user has a specific role
 */
export function hasRole(userRole: string | null, requiredRole: UserRole): boolean {
    return userRole === requiredRole;
}

/**
 * Check if user can access admin dashboard and admin features
 * Only admins can access admin areas
 */
export function canAccessAdmin(userRole: string | null): boolean {
    return userRole === 'admin';
}

/**
 * Check if user can manage other users (create, edit, delete)
 */
export function canManageUsers(userRole: string | null): boolean {
    return userRole === 'admin';
}

/**
 * Check if user can manage system settings (pricing, themes, app settings)
 */
export function canManageSettings(userRole: string | null): boolean {
    return userRole === 'admin';
}

/**
 * Check if user can access premium features
 * Premium users and admins have access to premium features
 */
export function canAccessPremiumFeatures(userRole: string | null): boolean {
    return userRole === 'premium' || userRole === 'admin';
}

/**
 * Check if user can edit a specific business plan
 * Users can edit their own plans, admins can edit any plan
 */
export function canEditBusinessPlan(
    userRole: string | null,
    planOwnerId: string,
    currentUserId: string
): boolean {
    if (userRole === 'admin') {
        return true; // Admins can edit any plan
    }
    return planOwnerId === currentUserId; // Users can only edit their own plans
}

/**
 * Get the feature tier based on user role
 */
export function getFeatureTier(userRole: string | null): 'basic' | 'premium' {
    if (userRole === 'premium' || userRole === 'admin') {
        return 'premium';
    }
    return 'basic';
}

/**
 * Get feature limits based on user role
 */
export function getFeatureLimits(userRole: string | null) {
    const tier = getFeatureTier(userRole);

    if (tier === 'premium') {
        return {
            maxBusinessPlans: Infinity,
            aiCreditsPerMonth: Infinity,
            canAccessWhiteLabel: true,
            canAccessAdvancedAnalytics: true,
            canExportToPDF: true,
            canCollaborate: true,
        };
    }

    // Basic tier limits
    return {
        maxBusinessPlans: 2,
        aiCreditsPerMonth: 50,
        canAccessWhiteLabel: false,
        canAccessAdvancedAnalytics: false,
        canExportToPDF: false,
        canCollaborate: false,
    };
}

/**
 * Check if user can create another business plan
 */
export function canCreateBusinessPlan(
    userRole: string | null,
    currentPlanCount: number
): boolean {
    const limits = getFeatureLimits(userRole);
    return currentPlanCount < limits.maxBusinessPlans;
}

/**
 * Check if user can change another user's role
 * Admins can change roles, but:
 * - Cannot change their own role
 * - Cannot promote users to admin (prevent elevation attacks)
 */
export function canChangeUserRole(
    actorRole: string | null,
    actorId: string,
    targetId: string,
    newRole: UserRole
): { allowed: boolean; reason?: string } {
    // Only admins can change roles
    if (actorRole !== 'admin') {
        return { allowed: false, reason: 'Only administrators can change user roles' };
    }

    // Cannot change own role
    if (actorId === targetId) {
        return { allowed: false, reason: 'You cannot change your own role' };
    }

    // Cannot promote users to admin (security measure)
    if (newRole === 'admin') {
        return { allowed: false, reason: 'Cannot promote users to administrator. Contact system owner.' };
    }

    return { allowed: true };
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: string | null): string {
    switch (role) {
        case 'admin':
            return 'Administrator';
        case 'premium':
            return 'Premium';
        case 'user':
        default:
            return 'Basic';
    }
}

/**
 * Get role badge variant for UI
 */
export function getRoleBadgeVariant(role: string | null): 'default' | 'secondary' | 'premium' {
    switch (role) {
        case 'admin':
            return 'default'; // Blue
        case 'premium':
            return 'premium'; // Purple/gold (needs custom variant)
        case 'user':
        default:
            return 'secondary'; // Gray
    }
}

/**
 * Check if email is a demo account
 */
export function isDemoAccount(email: string | null): boolean {
    if (!email) return false;
    return email.endsWith('@venturenudge.com');
}
