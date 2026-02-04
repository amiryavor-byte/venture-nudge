import { db } from '../src/db';
import { userProfiles, skills, interests } from '../src/db/schema';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

/**
 * Demo User Seeding Script
 * Creates comprehensive demo users across all three role types
 * Password for all demo users: demo123!
 */

async function seedDemoUsers() {
    console.log('🌱 Seeding demo users...\n');

    const DEMO_PASSWORD = 'demo123!';
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    const demoUsers = [
        // ========== REGULAR USERS (5) ==========
        {
            user: {
                id: uuidv4(),
                email: 'demo-user-1@venturenudge.com',
                passwordHash,
                name: 'Sarah Johnson',
                role: 'user',
                isActive: true,
                availableCapital: '$50,000',
                riskTolerance: 'high',
                preferredTimeCommitment: 'full-time',
                location: 'San Francisco, CA',
                subscriptionTier: 'monthly',
                subscriptionStatus: 'active',
                aiCredits: 150,
                createdAt: new Date(),
            },
            skills: [
                { name: 'Web Development', level: 'expert' },
                { name: 'Marketing', level: 'intermediate' },
                { name: 'Product Management', level: 'intermediate' },
            ],
            interests: [
                { name: 'SaaS' },
                { name: 'Technology' },
                { name: 'E-commerce' },
            ],
        },
        {
            user: {
                id: uuidv4(),
                email: 'demo-user-2@venturenudge.com',
                passwordHash,
                name: 'Michael Chen',
                role: 'user',
                isActive: true,
                availableCapital: '$25,000',
                riskTolerance: 'medium',
                preferredTimeCommitment: 'side-hustle',
                location: 'Austin, TX',
                subscriptionTier: 'monthly',
                subscriptionStatus: 'active',
                aiCredits: 75,
                createdAt: new Date(),
            },
            skills: [
                { name: 'Consulting', level: 'expert' },
                { name: 'Sales', level: 'expert' },
                { name: 'Business Strategy', level: 'intermediate' },
            ],
            interests: [
                { name: 'Professional Services' },
                { name: 'B2B' },
                { name: 'Consulting' },
            ],
        },
        {
            user: {
                id: uuidv4(),
                email: 'demo-user-3@venturenudge.com',
                passwordHash,
                name: 'Emma Rodriguez',
                role: 'user',
                isActive: true,
                availableCapital: '$5,000',
                riskTolerance: 'low',
                preferredTimeCommitment: 'side-hustle',
                location: 'Miami, FL',
                subscriptionTier: 'free',
                subscriptionStatus: 'active',
                aiCredits: 20,
                createdAt: new Date(),
            },
            skills: [
                { name: 'Content Creation', level: 'expert' },
                { name: 'Social Media', level: 'expert' },
                { name: 'Graphic Design', level: 'intermediate' },
            ],
            interests: [
                { name: 'Digital Marketing' },
                { name: 'Content' },
                { name: 'Creative Services' },
            ],
        },
        {
            user: {
                id: uuidv4(),
                email: 'demo-user-4@venturenudge.com',
                passwordHash,
                name: 'David Park',
                role: 'user',
                isActive: true,
                availableCapital: '$200,000',
                riskTolerance: 'high',
                preferredTimeCommitment: 'full-time',
                location: 'New York, NY',
                subscriptionTier: 'annual',
                subscriptionStatus: 'active',
                aiCredits: 500,
                createdAt: new Date(),
            },
            skills: [
                { name: 'Product Management', level: 'expert' },
                { name: 'Fundraising', level: 'expert' },
                { name: 'Operations', level: 'expert' },
            ],
            interests: [
                { name: 'Mobile Apps' },
                { name: 'Retail' },
                { name: 'Food & Beverage' },
            ],
        },
        {
            user: {
                id: uuidv4(),
                email: 'demo-user-5@venturenudge.com',
                passwordHash,
                name: 'Lisa Thompson',
                role: 'user',
                isActive: true,
                availableCapital: '$15,000',
                riskTolerance: 'medium',
                preferredTimeCommitment: 'side-hustle',
                location: 'Seattle, WA',
                subscriptionTier: 'monthly',
                subscriptionStatus: 'active',
                aiCredits: 100,
                createdAt: new Date(),
            },
            skills: [
                { name: 'Photography', level: 'expert' },
                { name: 'Design', level: 'expert' },
                { name: 'Client Management', level: 'intermediate' },
            ],
            interests: [
                { name: 'Photography' },
                { name: 'Events' },
                { name: 'Creative Services' },
            ],
        },

        // ========== PREMIUM USERS (2) ==========
        {
            user: {
                id: uuidv4(),
                email: 'premium@venturenudge.com',
                passwordHash,
                name: 'Premium Demo Account',
                role: 'premium',
                isActive: true,
                availableCapital: '$100,000',
                riskTolerance: 'high',
                preferredTimeCommitment: 'full-time',
                location: 'Los Angeles, CA',
                subscriptionTier: 'annual',
                subscriptionStatus: 'active',
                aiCredits: 99999, // Unlimited simulation
                createdAt: new Date(),
            },
            skills: [
                { name: 'Business Development', level: 'expert' },
                { name: 'Strategy', level: 'expert' },
                { name: 'Leadership', level: 'expert' },
            ],
            interests: [
                { name: 'All Industries' },
                { name: 'Enterprise' },
                { name: 'Startups' },
            ],
        },
        {
            user: {
                id: uuidv4(),
                email: 'vip@venturenudge.com',
                passwordHash,
                name: 'Enterprise Demo',
                role: 'premium',
                isActive: true,
                availableCapital: '$500,000',
                riskTolerance: 'high',
                preferredTimeCommitment: 'full-time',
                location: 'Boston, MA',
                subscriptionTier: 'annual',
                subscriptionStatus: 'active',
                aiCredits: 99999,
                createdAt: new Date(),
            },
            skills: [
                { name: 'Enterprise Sales', level: 'expert' },
                { name: 'M&A', level: 'expert' },
                { name: 'Scaling', level: 'expert' },
            ],
            interests: [
                { name: 'B2B SaaS' },
                { name: 'Enterprise Software' },
                { name: 'Growth' },
            ],
        },

        // ========== ADMIN USERS (2) ==========
        {
            user: {
                id: uuidv4(),
                email: 'admin@venturenudge.com',
                passwordHash,
                name: 'Alex Admin',
                role: 'admin',
                isActive: true,
                availableCapital: null,
                riskTolerance: null,
                preferredTimeCommitment: null,
                location: null,
                subscriptionTier: 'free',
                subscriptionStatus: 'active',
                aiCredits: 0,
                createdAt: new Date(),
            },
            skills: [],
            interests: [],
        },
        {
            user: {
                id: uuidv4(),
                email: 'support@venturenudge.com',
                passwordHash,
                name: 'Support Team',
                role: 'admin',
                isActive: true,
                availableCapital: null,
                riskTolerance: null,
                preferredTimeCommitment: null,
                location: null,
                subscriptionTier: 'free',
                subscriptionStatus: 'active',
                aiCredits: 0,
                createdAt: new Date(),
            },
            skills: [],
            interests: [],
        },
    ];

    // Insert users with related data
    for (const { user, skills: userSkills, interests: userInterests } of demoUsers) {
        // Check if user already exists
        const existingUsers = await db
            .select()
            .from(userProfiles)
            .where(eq(userProfiles.email, user.email));

        const existing = existingUsers[0];

        if (existing) {
            console.log(`⏭️  Skipped ${user.name} (${user.email}) - already exists`);
            continue;
        }

        // Insert user
        await db.insert(userProfiles).values(user);

        // Insert skills
        for (const skill of userSkills) {
            await db.insert(skills).values({
                id: uuidv4(),
                profileId: user.id,
                name: skill.name,
                level: skill.level,
            });
        }

        // Insert interests
        for (const interest of userInterests) {
            await db.insert(interests).values({
                id: uuidv4(),
                profileId: user.id,
                name: interest.name,
            });
        }

        console.log(`✅ Created ${user.name} (${user.role}) - ${user.email}`);
    }

    console.log('\n📊 Demo User Summary:');
    console.log('   - 5 Basic users');
    console.log('   - 2 Premium users');
    console.log('   - 2 Admin users');
    console.log('   - Total: 9 demo accounts');
    console.log('\n🔑 Password for all demo users: demo123!');
    console.log('\n✨ Demo seeding complete!\n');
}

seedDemoUsers()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error seeding demo users:', error);
        process.exit(1);
    });
