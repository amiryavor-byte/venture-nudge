import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const businessPlans = sqliteTable('business_plans', {
    id: text('id').primaryKey(),
    userId: text('user_id'),
    name: text('name'),
    problem: text('problem'),
    targetAudience: text('target_audience'),
    solution: text('solution'),
    monetization: text('monetization'),
    content: text('content', { mode: 'json' }), // Stores full legacy BusinessPlanData JSON
    status: text('status').default('draft'),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const userProfiles = sqliteTable('user_profiles', {
    id: text('id').notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id'), // Optional, for auth
    email: text('email').unique(),
    passwordHash: text('password_hash'), // Hashed password, never exposed to frontend
    name: text('name'),
    role: text('role').default('user'), // 'user' (basic), 'premium' (full features), 'admin' (system management)
    isActive: integer('is_active', { mode: 'boolean' }).default(true),
    availableCapital: text('available_capital'),
    riskTolerance: text('risk_tolerance'), // 'low', 'medium', 'high'
    preferredTimeCommitment: text('preferred_time_commitment'), // 'full-time', 'side-hustle'
    location: text('location'), // e.g. "Boston, MA" or "02138"
    discoveryProfile: text('discovery_profile', { mode: 'json' }), // Guided conversation insights

    // Subscription & Monetization
    subscriptionTier: text('subscription_tier').default('free'), // 'free', 'monthly', 'annual', 'one-time'
    subscriptionStatus: text('subscription_status').default('active'), // 'active', 'cancelled', 'expired'
    subscriptionStartDate: integer('subscription_start_date', { mode: 'timestamp' }),
    subscriptionEndDate: integer('subscription_end_date', { mode: 'timestamp' }),
    stripeCustomerId: text('stripe_customer_id'),
    aiCredits: integer('ai_credits').default(0),

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// NextAuth Required Tables
export const accounts = sqliteTable('accounts', {
    userId: text('userId').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
}, (account) => ({
    compoundKey: {
        columns: [account.provider, account.providerAccountId],
        name: 'accounts_provider_providerAccountId_pk',
    },
}));

export const sessions = sqliteTable('sessions', {
    sessionToken: text('sessionToken').notNull().primaryKey(),
    userId: text('userId').notNull().references(() => userProfiles.id, { onDelete: 'cascade' }),
    expires: integer('expires', { mode: 'timestamp' }).notNull(),
});

export const verificationTokens = sqliteTable('verification_tokens', {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer('expires', { mode: 'timestamp' }).notNull(),
}, (vt) => ({
    compoundKey: {
        columns: [vt.identifier, vt.token],
        name: 'verification_tokens_identifier_token_pk',
    },
}));

export const skills = sqliteTable('skills', {
    id: text('id').primaryKey(),
    profileId: text('profile_id').references(() => userProfiles.id),
    name: text('name').notNull(),
    level: text('level'), // 'beginner', 'intermediate', 'expert'
});

export const interests = sqliteTable('interests', {
    id: text('id').primaryKey(),
    profileId: text('profile_id').references(() => userProfiles.id),
    name: text('name').notNull(),
});

export const businessConcepts = sqliteTable('business_concepts', {
    id: text('id').primaryKey(),
    profileId: text('profile_id').references(() => userProfiles.id),
    name: text('name').notNull(),
    description: text('description'),
    fitReason: text('fit_reason'), // Why AI picked this
    conceptType: text('concept_type'), // e.g., 'service', 'product', 'digital'
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const userProfilesRelations = relations(userProfiles, ({ many }) => ({
    skills: many(skills),
    interests: many(interests),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
    profile: one(userProfiles, {
        fields: [skills.profileId],
        references: [userProfiles.id],
    }),
}));

export const interestsRelations = relations(interests, ({ one }) => ({
    profile: one(userProfiles, {
        fields: [interests.profileId],
        references: [userProfiles.id],
    }),
}));


export const businessConceptsRelations = relations(businessConcepts, ({ one }) => ({
    profile: one(userProfiles, {
        fields: [businessConcepts.profileId],
        references: [userProfiles.id],
    }),
}));

export const businessModelTemplates = sqliteTable('business_model_templates', {
    id: text('id').primaryKey(),
    name: text('name').notNull(), // e.g., "SaaS", "Coffee Shop"
    industry: text('industry').notNull(), // e.g., "Technology", "Retail"
    description: text('description'),
    operationalGuide: text('operational_guide', { mode: 'json' }), // Step-by-step "how to run"
    keyMetrics: text('key_metrics', { mode: 'json' }), // e.g., ["CAC", "LTV", "Churn"]

    // Comprehensive Business Plan Structure
    businessPlan: text('business_plan', { mode: 'json' }), // Full structured plan (all 12 sections)

    // Quick-access denormalized fields for AI agent queries and filtering
    executiveSummary: text('executive_summary'),
    targetMarket: text('target_market', { mode: 'json' }), // Demographics, size, segments
    valueProposition: text('value_proposition'),
    revenueModel: text('revenue_model', { mode: 'json' }), // Pricing, streams, unit economics
    competitiveLandscape: text('competitive_landscape', { mode: 'json' }),
    marketingStrategy: text('marketing_strategy', { mode: 'json' }),
    operationsOverview: text('operations_overview', { mode: 'json' }),
    financialProjections: text('financial_projections', { mode: 'json' }), // 3-year P&L, startup costs
    riskAnalysis: text('risk_analysis', { mode: 'json' }),
    milestones: text('milestones', { mode: 'json' }), // 6-12 month roadmap

    // Metadata for AI matching and recommendations
    tags: text('tags', { mode: 'json' }), // e.g., ["b2b", "saas", "subscription", "low-capital"]
    category: text('category'), // e.g., "Technology", "Healthcare", "Professional Services"
    subcategory: text('subcategory'), // e.g., "SaaS", "Consulting", "E-commerce"
    startupCostRange: text('startup_cost_range'), // e.g., "$5k-$25k", "$100k+"
    timeToRevenue: text('time_to_revenue'), // e.g., "1-3 months", "6-12 months"
    skillsRequired: text('skills_required', { mode: 'json' }), // e.g., ["marketing", "software"]
    educationRecommended: text('education_recommended', { mode: 'json' }), // e.g., ["MBA", "Engineering", "Any"]
    licenseRequired: text('license_required'), // e.g., "CPA", "Medical License", "None"
    complexity: integer('complexity').default(5), // 1-10 scale

    // Related part-time, side, and complementary opportunities
    relatedOpportunities: text('related_opportunities', { mode: 'json' }), // Sub-businesses, part-time options, etc.

    isVerified: integer('is_verified', { mode: 'boolean' }).default(false), // Admin verified?
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const purchases = sqliteTable('purchases', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => userProfiles.id),
    type: text('type').notNull(), // 'one_time_plan', 'subscription', 'credits'
    amount: integer('amount').notNull(), // in cents
    planId: text('plan_id'), // if purchasing a specific plan
    creditsGranted: integer('credits_granted'), // if purchasing credits
    stripePaymentId: text('stripe_payment_id'),
    status: text('status').default('pending'), // 'pending', 'completed', 'refunded'
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const pricingConfig = sqliteTable('pricing_config', {
    id: text('id').primaryKey(),
    tier: text('tier').notNull().unique(), // 'one_time', 'monthly', 'annual'
    priceInCents: integer('price_in_cents').notNull(),
    displayPrice: text('display_price').notNull(), // e.g., "$4.99"
    billingPeriod: text('billing_period'), // 'month', 'year', null for one-time
    features: text('features', { mode: 'json' }), // Array of feature strings
    isActive: integer('is_active', { mode: 'boolean' }).default(true),
    sortOrder: integer('sort_order').default(0),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const themeConfig = sqliteTable('theme_config', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).default(false),
    isCustom: integer('is_custom', { mode: 'boolean' }).default(false),
    colors: text('colors', { mode: 'json' }).notNull(),
    fonts: text('fonts', { mode: 'json' }).notNull(),
    spacing: text('spacing', { mode: 'json' }),
    borderRadius: text('border_radius', { mode: 'json' }),
    shadows: text('shadows', { mode: 'json' }),
    images: text('images', { mode: 'json' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const appSettings = sqliteTable('app_settings', {
    id: text('id').primaryKey(), // 'global' or specific config key
    key: text('key').notNull().unique(), // e.g., "OPENAI_API_KEY"
    value: text('value'), // Encrypted or plain text value
    category: text('category').default('general'), // e.g. "api_keys", "branding"
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const affiliatePrograms = sqliteTable('affiliate_programs', {
    id: text('id').primaryKey(),

    // Basic Info
    name: text('name').notNull(), // e.g., "Mercury"
    category: text('category').notNull(), // e.g., "banking", "legal", "tax"
    description: text('description'),

    // Commission Details
    commissionType: text('commission_type'), // 'percentage', 'fixed', 'revenue_share', 'recurring'
    commissionRate: text('commission_rate'), // e.g., "10%", "$100", "$30/mo recurring"
    commissionNotes: text('commission_notes'), // Additional details
    estimatedCommissionValue: integer('estimated_commission_value').default(0), // Estimated $ in cents for sorting
    tierRank: integer('tier_rank').default(99), // 1 = highest earner in category, 2 = second, etc.

    // Links & Resources
    signupUrl: text('signup_url').notNull(),
    affiliateDashboardUrl: text('affiliate_dashboard_url'),
    apiDocsUrl: text('api_docs_url'),
    termsUrl: text('terms_url'),

    // Technical Details
    hasApi: integer('has_api', { mode: 'boolean' }).default(false),
    apiIntegrationStatus: text('api_integration_status').default('none'), // 'none', 'planned', 'in_progress', 'completed'
    cookieDuration: integer('cookie_duration'), // in days

    // Status & Lifecycle
    status: text('status').default('active'), // 'active', 'inactive', 'deprecated'
    phaseOutDate: text('phase_out_date'), // ISO date string when will be deprecated
    replacedBy: text('replaced_by'), // What native solution replaces this

    // Recommendation Logic
    targetIndustries: text('target_industries', { mode: 'json' }), // Array of industries
    targetBusinessTypes: text('target_business_types', { mode: 'json' }), // Array
    recommendationTiming: text('recommendation_timing'), // e.g., "during_planning", "post_formation"
    priority: integer('priority').default(5), // 1-10, higher = more important

    // Performance Tracking (updated manually or via webhook)
    totalConversions: integer('total_conversions').default(0),
    totalRevenue: integer('total_revenue').default(0), // in cents
    averageCommission: integer('average_commission').default(0), // in cents
    lastConversionDate: integer('last_conversion_date', { mode: 'timestamp' }),

    // Metadata
    notes: text('notes'), // Internal admin notes
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const affiliateReferrals = sqliteTable('affiliate_referrals', {
    id: text('id').primaryKey(),
    affiliateId: text('affiliate_id').references(() => affiliatePrograms.id),
    userId: text('user_id').references(() => userProfiles.id),

    clickedAt: integer('clicked_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    convertedAt: integer('converted_at', { mode: 'timestamp' }),

    status: text('status').default('pending'), // 'pending', 'converted', 'rejected'
    commissionAmount: integer('commission_amount'), // in cents

    // Tracking parameters
    referralCode: text('referral_code'),
    sourceContext: text('source_context'), // Where in the app the recommendation was made
});

// Avatar Voice Assistant Tables

export const avatarPricingSettings = sqliteTable('avatar_pricing_settings', {
    id: text('id').primaryKey(),

    // Markup configuration by tier
    proTierMarkup: integer('pro_tier_markup').default(150), // 150% = 1.5x markup
    enterpriseMarkup: integer('enterprise_markup').default(130), // 130% = 1.3x markup

    // Cost estimates (for admin reference and calculations)
    sttCostPerMinute: integer('stt_cost_per_minute').default(43), // $0.0043 stored as 43 (x10000)
    ttsCostPer1kChars: integer('tts_cost_per_1k_chars').default(1800), // $0.18 stored as 1800
    rtcCostPerMinute: integer('rtc_cost_per_minute').default(99), // $0.0099 stored as 99
    llmCostPerMessage: integer('llm_cost_per_message').default(200), // $0.02 stored as 200

    // Free tier limits
    freeTrialMessagesPerWeek: integer('free_trial_messages_per_week').default(3),

    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const avatarUsage = sqliteTable('avatar_usage', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => userProfiles.id, { onDelete: 'cascade' }),

    // Usage tracking
    messageCount: integer('message_count').default(0),
    lastResetAt: integer('last_reset_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    weeklyLimit: integer('weekly_limit').default(3), // For free tier users

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const avatarUsageLog = sqliteTable('avatar_usage_log', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => userProfiles.id, { onDelete: 'cascade' }),

    // Usage metrics
    messageCount: integer('message_count').default(1),
    audioMinutes: integer('audio_minutes'), // Stored as milliseconds, divide by 60000 for minutes
    charactersGenerated: integer('characters_generated'),

    // Costs (stored as cents x 100 for precision: $0.0043 = 43)
    sttCost: integer('stt_cost'), // Speech-to-text cost
    ttsCost: integer('tts_cost'), // Text-to-speech cost
    rtcCost: integer('rtc_cost'), // RTC/Agora cost
    llmCost: integer('llm_cost'), // LLM cost
    totalCost: integer('total_cost'), // Sum of above

    // Billing
    markup: integer('markup'), // Markup percentage applied (e.g., 150 for 150%)
    chargedAmount: integer('charged_amount'), // What user pays (totalCost * markup / 100)
    billingMonth: text('billing_month'), // "2026-02" for aggregation

    // Metadata
    conversationId: text('conversation_id'), // Link to chat session
    subscriptionTier: text('subscription_tier'), // User's tier at time of usage

    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const avatarSettings = sqliteTable('avatar_settings', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => userProfiles.id, { onDelete: 'cascade' }),

    // Avatar configuration
    avatarType: text('avatar_type').default('default'), // 'default' | 'live2d' | '3d' | 'realistic'
    avatarModelUrl: text('avatar_model_url'),
    avatarProperties: text('avatar_properties', { mode: 'json' }), // Custom properties

    // Voice configuration
    ttsProvider: text('tts_provider').default('elevenlabs'), // 'elevenlabs' | 'openai'
    voiceId: text('voice_id'),
    voicePitch: integer('voice_pitch').default(100), // 100 = normal (stored as percentage)
    voiceSpeed: integer('voice_speed').default(100), // 100 = normal
    voiceTone: text('voice_tone').default('professional'), // 'professional' | 'friendly' | 'energetic'

    // TEN property overrides (JSON)
    propertyOverrides: text('property_overrides', { mode: 'json' }),

    // Metadata
    isActive: integer('is_active', { mode: 'boolean' }).default(true),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

