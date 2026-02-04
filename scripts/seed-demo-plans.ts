import { db } from '../src/db';
import { businessPlans, userProfiles } from '../src/db/schema';
import { type BusinessPlanData } from '../src/lib/business-plan-service';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';

/**
 * Demo Business Plans Seeding Script
 * Creates 6 realistic business plans linked to demo users
 */

async function seedDemoPlans() {
    console.log('🌱 Seeding demo business plans...\n');

    // Get demo user IDs
    const users = await db.select().from(userProfiles);
    console.log(`Found ${users.length} total users in database`);

    const getUserByEmail = (email: string) => users.find(u => u.email === email);

    const sarah = getUserByEmail('demo-user-1@venturenudge.com');
    const michael = getUserByEmail('demo-user-2@venturenudge.com');
    const emma = getUserByEmail('demo-user-3@venturenudge.com');
    const david = getUserByEmail('demo-user-4@venturenudge.com');
    const lisa = getUserByEmail('demo-user-5@venturenudge.com');
    const premium = getUserByEmail('premium@venturenudge.com');

    console.log('User lookup results:');
    console.log(` - Sarah: ${sarah ? '✓' : '✗'}`);
    console.log(` - Michael: ${michael ? '✓' : '✗'}`);
    console.log(` - Emma: ${emma ? '✓' : '✗'}`);
    console.log(` - David: ${david ? '✓' : '✗'}`);
    console.log(` - Lisa: ${lisa ? '✓' : '✗'}`);
    console.log(` - Premium: ${premium ? '✓' : '✗'}\n`);

    if (!sarah || !michael || !emma || !david || !lisa || !premium) {
        console.error('❌ Demo users not found. Please run seed-demo-users.ts first.');
        console.error('Available emails in database:');
        users.forEach(u => console.error(`   - ${u.email}`));
        process.exit(1);
    }

    const demoPlans = [
        // Plan 1: AI-Powered Fitness Coach (Sarah - SaaS)
        {
            userId: sarah.id,
            name: 'AI-Powered Fitness Coach',
            problem: 'Personal training is expensive ($50-100/session) and scheduling is difficult',
            targetAudience: 'Fitness enthusiasts aged 25-45 seeking affordable, personalized workout guidance',
            solution: 'AI-driven mobile app providing personalized workout plans, form correction via computer vision, and adaptive programming',
            monetization: '$29/month subscription with AI-powered features',
            status: 'active',
            content: {
                missionStatement: 'Democratize personal training through AI, making expert fitness guidance accessible to everyone.',
                amirRole: 'Solo Founder',
                davidRole: 'N/A',
                shareAmir: 100,
                shareDavid: 0,
                basePriceLow: 19,
                basePriceHigh: 49,
                featurePriceLow: 29,
                featurePriceHigh: 29,
                hourlyRate: 0,
                clientsPerDev: 10000,
                devMonthlyCost: 0,
                hostingCost: 150,
                serverCost: 500,
                revenueStrategy: 'Freemium model with $29/month premium tier offering AI form analysis and custom meal plans. Target 10K users by Year 1.',
                buyoutClause: 'Open to acquisition at 5x ARR after reaching product-market fit.',
                exitSchedule: [
                    { year: 'Year 1', amir: 100, david: 0, role: 'Full Time - MVP \u0026 Launch' },
                    { year: 'Year 2', amir: 100, david: 0, role: 'Full Time - Growth' },
                    { year: 'Year 3', amir: 100, david: 0, role: 'Full Time - Scale' },
                ],
                projections: [
                    { year: 2026, month: 0, revenue: 150000, expenses: 50000, profit: 100000, clientCount: 5000, upgradeAdoption: 25 },
                    { year: 2027, month: 0, revenue: 600000, expenses: 150000, profit: 450000, clientCount: 20000, upgradeAdoption: 30 },
                    { year: 2028, month: 0, revenue: 1800000, expenses: 450000, profit: 1350000, clientCount: 50000, upgradeAdoption: 35 },
                ],
                monthlyProjections: Array.from({ length: 12 }, (_, i) => ({
                    year: 2026,
                    month: i + 1,
                    revenue: 5000 + (i * 7500),
                    expenses: 2000 + (i * 2500),
                    profit: 3000 + (i * 5000),
                    clientCount: 500 + (i * 400),
                    upgradeAdoption: 20 + i,
                })),
                workflowSteps: [
                    { id: '1', title: 'MVP Development', description: 'Build core AI workout generation and basic tracking (3 months)' },
                    { id: '2', title: 'Beta Launch', description: 'Release to 100 beta users, gather feedback (1 month)' },
                    { id: '3', title: 'App Store Launch', description: 'Public launch on iOS/Android with marketing push' },
                    { id: '4', title: 'Scale \u0026 Optimize', description: 'Improve AI models, add social features, scale infrastructure' },
                ],
                salesPitch: 'Personal training for everyone. AI coaches that adapt to your goals, correct your form in real-time, and cost 90% less than human trainers.',
                marketAnalysis: `**Target Market**: 78M gym members in US, 35% use fitness apps. TAM $15B (fitness app market). Primary: 25-45 year olds, college-educated, $50K+ income, tech-savvy. Pain points: can't afford personal trainers, generic workout apps don't adapt, poor form leads to injuries.`,
                competitiveAdvantage: `MyFitnessPal (food tracking only, no AI coaching), Peloton ($44/month, equipment required), Future ($149/month human coaches). Our advantage: 1) AI form correction via phone camera 2) Adaptive programming based on performance 3) 1/5th the cost of competitors 4) No equipment needed`,
                productRoadmap: [
                    { id: '1', feature: 'AI Form Analysis', quarter: 'Q2 2026', status: 'in-progress', description: 'Computer vision to analyze exercise form and provide corrections' },
                    { id: '2', feature: 'Nutrition Integration', quarter: 'Q3 2026', status: 'planned', description: 'AI meal planning synchronized with workout goals' },
                    { id: '3', feature: 'Social Features', quarter: 'Q4 2026', status: 'idea', description: 'Challenges, leaderboards, workout sharing' },
                ],
                marketStats: {
                    competitors: [
                        { name: 'MyFitnessPal', marketShare: 35, aiScore: 20, features: ['Calorie tracking', 'Barcode scanner'], weaknesses: ['No workout guidance', 'No AI'] },
                        { name: 'Peloton', marketShare: 25, aiScore: 30, features: ['Live classes', 'Community'], weaknesses: ['Expensive ($44/mo)', 'Equipment required'] },
                        { name: 'Future', marketShare: 10, aiScore: 60, features: ['Human coaches', 'Personalized'], weaknesses: ['Very expensive ($149/mo)', 'Not scalable'] },
                    ],
                    featureComparison: [
                        { feature: 'AI Coaching', us: 95, competitors: 20 },
                        { feature: 'Affordability', us: 95, competitors: 40 },
                        { feature: 'Form Correction', us: 90, competitors: 15 },
                        { feature: 'Brand Recognition', us: 10, competitors: 80 },
                    ],
                },
            } as BusinessPlanData,
        },

        // Plan 2: Eco-Friendly Cleaning Service (Michael)
        {
            userId: michael.id,
            name: 'Green Clean Co',
            problem: 'Traditional cleaning services use harsh chemicals that harm environment and health',
            targetAudience: 'Eco-conscious homeowners and small offices in Austin, TX metro area',
            solution: 'Professional cleaning using 100% plant-based, non-toxic products with subscription packages',
            monetization: 'Recurring monthly/bi-weekly subscriptions + hourly deep cleaning',
            status: 'active',
            content: {
                missionStatement: 'Provide spotless homes and offices while protecting the environment and client health.',
                amirRole: 'N/A',
                davidRole: 'Solo Founder',
                shareAmir: 0,
                shareDavid: 100,
                basePriceLow: 80,
                basePriceHigh: 200,
                featurePriceLow: 150,
                featurePriceHigh: 400,
                hourlyRate: 40,
                clientsPerDev: 50,
                devMonthlyCost: 0,
                hostingCost: 0,
                serverCost: 0,
                revenueStrategy: 'Build recurring revenue with monthly subscriptions. Upsell deep cleaning and specialized services (carpet, windows). Target 100 recurring clients by Year 1.',
                buyoutClause: 'Open to acquisition by larger cleaning franchise at 3x annual profit.',
                exitSchedule: [
                    { year: 'Year 1', amir: 0, david: 100, role: 'Founder/Cleaner - Building Base' },
                    { year: 'Year 2', amir: 0, david: 100, role: 'Owner/Manager - 2 Staff' },
                    { year: 'Year 3', amir: 0, david: 100, role: 'Owner - 5 Staff' },
                ],
                projections: [
                    { year: 2026, month: 0, revenue: 120000, expenses: 60000, profit: 60000, clientCount: 100, upgradeAdoption: 30 },
                    { year: 2027, month: 0, revenue: 280000, expenses: 140000, profit: 140000, clientCount: 200, upgradeAdoption: 40 },
                    { year: 2028, month: 0, revenue: 480000, expenses: 220000, profit: 260000, clientCount: 350, upgradeAdoption: 45 },
                ],
                monthlyProjections: [],
                workflowSteps: [
                    { id: '1', title: 'Service Delivery', description: 'Perform cleaning using eco-friendly products and methods' },
                    { id: '2', title: 'Quality Check', description: 'Photo documentation and client approval via app' },
                    { id: '3', title: 'Recurring Booking', description: 'Auto-schedule next appointment for subscription clients' },
                ],
                salesPitch: 'Spotless homes, healthy families, happy planet. Professional cleaning that doesn\'t compromise your values or your health.',
                marketAnalysis: 'Austin metro area has 2M residents, 800K households. Target eco-conscious segment (25% = 200K households). Average cleaning spend $150/month. TAM $360M annually in Austin alone.',
                competitiveAdvantage: 'Maid Brigade and Molly Maid use some green products but not exclusively. Our 100% commitment, local brand, and transparent sourcing differentiate us. Lower overhead = competitive pricing.',
                productRoadmap: [
                    { id: '1', feature: 'Mobile App Booking', quarter: 'Q2 2026', status: 'planned', description: 'Self-service scheduling and payment' },
                    { id: '2', feature: 'Franchise Model', quarter: 'Q1 2027', status: 'idea', description: 'Expand to other cities via franchising' },
                ],
            } as BusinessPlanData,
        },

        // Plan 3: Wedding Photography Studio (Lisa)
        {
            userId: lisa.id,
            name: 'Moments by Lisa',
            problem: 'Wedding couples struggle to find photographers who understand their unique style and budget',
            targetAudience: 'Engaged couples in Seattle area, ages 25-35, planning modern, personalized weddings',
            solution: 'Boutique photography service with customizable packages and artistic, candid style',
            monetization: 'Per-wedding pricing: $2,500-5,000 depending on hours and deliverables',
            status: 'active',
            content: {
                missionStatement: 'Capture authentic moments that couples will treasure forever.',
                amirRole: 'N/A',
                davidRole: 'Solo photographer',
                shareAmir: 0,
                shareDavid: 100,
                basePriceLow: 2500,
                basePriceHigh: 5000,
                featurePriceLow: 3500,
                featurePriceHigh: 3500,
                hourlyRate: 250,
                clientsPerDev: 30,
                devMonthlyCost: 0,
                hostingCost: 50,
                serverCost: 0,
                revenueStrategy: 'Book 20-30 weddings per year at $3,500 average. Upsell engagement shoots, albums, prints. Build reputation through Instagram and referrals.',
                buyoutClause: 'N/A - lifestyle business',
                exitSchedule: [
                    { year: 'Year 1', amir: 0, david: 100, role: 'Solo Photographer - Side Hustle' },
                    { year: 'Year 2', amir: 0, david: 100, role: 'Full-Time Photographer' },
                    { year: 'Year 3', amir: 0, david: 100, role: 'Lead Photographer + 1 Associate' },
                ],
                projections: [
                    { year: 2026, month: 0, revenue: 52500, expenses: 15000, profit: 37500, clientCount: 15, upgradeAdoption: 40 },
                    { year: 2027, month: 0, revenue: 105000, expenses: 25000, profit: 80000, clientCount: 30, upgradeAdoption: 50 },
                    { year: 2028, month: 0, revenue: 180000, expenses: 60000, profit: 120000, clientCount: 50, upgradeAdoption: 60 },
                ],
                monthlyProjections: [],
                workflowSteps: [
                    { id: '1', title: 'Consultation \u0026 Booking', description: 'Meet couple, understand vision, sign contract, collect deposit' },
                    { id: '2', title: 'Wedding Day Coverage', description: '8-10 hours of photography capturing all key moments' },
                    { id: '3', title: 'Post-Production', description: 'Edit 400-600 photos, deliver digital gallery within 4 weeks' },
                    { id: '4', title: 'Upsell Albums/Prints', description: 'Offer premium albums and canvas prints' },
                ],
                salesPitch: 'Your wedding day deserves more than generic posed shots. I capture the real moments - the laughter, the tears, the magic.',
                marketAnalysis: 'Seattle metro: 4M residents, ~20K weddings/year. Average photography spend: $2,500-3,000. Most photographers booked 9-12 months out. High demand for modern, candid styles.',
                competitiveAdvantage: 'Boutique, personalized service vs. photography mills. Modern editing style. Strong Instagram presence (15K followers). Transparent pricing. Fast turnaround (4 weeks vs. industry 8-12 weeks).',
                productRoadmap: [
                    { id: '1', feature: 'Associate Photographer Program', quarter: 'Q3 2027', status: 'idea', description: 'Train and hire associate to handle more bookings' },
                    { id: '2', feature: 'Destination Weddings', quarter: 'Q4 2027', status: 'idea', description: 'Expand to destination wedding market (Hawaii, Mexico)' },
                ],
            } as BusinessPlanData,
        },

        // Plan 4: Social Media Marketing Agency (Emma - Draft)
        {
            userId: emma.id,
            name: 'Amplify Digital',
            problem: 'Small businesses can\'t afford full-service agencies but need professional social media presence',
            targetAudience: 'Local small businesses in Miami: restaurants, boutiques, salons with $5K-20K marketing budgets',
            solution: 'Affordable social media management packages with content creation, posting, and engagement',
            monetization: 'Monthly retainers: $500-2,000/month depending on service level',
            status: 'draft',
            content: {
                missionStatement: 'Help local businesses thrive by building authentic connections with their customers online.',
                amirRole: 'N/A',
                davidRole: 'Solo Founder',
                shareAmir: 0,
                shareDavid: 100,
                basePriceLow: 500,
                basePriceHigh: 2000,
                featurePriceLow: 1000,
                featurePriceHigh: 1000,
                hourlyRate: 75,
                clientsPerDev: 15,
                devMonthlyCost: 0,
                hostingCost: 30,
                serverCost: 0,
                revenueStrategy: 'Build recurring MRR with 10-15 clients at $1,000 average. Upsell ad management and content shoots. Low overhead = high margins.',
                buyoutClause: 'N/A',
                exitSchedule: [
                    { year: 'Year 1', amir: 0, david: 100, role: 'Solo - Building Portfolio' },
                ],
                projections: [
                    { year: 2026, month: 0, revenue: 72000, expenses: 15000, profit: 57000, clientCount: 10, upgradeAdoption: 20 },
                ],
                monthlyProjections: [],
                workflowSteps: [
                    { id: '1', title: 'Client Onboarding', description: 'Brand audit, content strategy, editorial calendar' },
                    { id: '2', title: 'Content Creation', description: 'Photos, graphics, captions for 3-4 posts/week' },
                    { id: '3', title: 'Community Management', description: 'Respond to comments, messages, engage with followers' },
                    { id: '4', title: 'Monthly Reporting', description: 'Analytics and recommendations' },
                ],
                salesPitch: 'Your customers are scrolling. Make sure they see you. Affordable social media management that drives real results.',
                marketAnalysis: 'Miami-Dade: 2.7M residents, 150K small businesses. Only 30% have active social media. Average marketing budget $10K/year. TAM $450M.',
                competitiveAdvantage: 'Local expertise, bilingual (English/Spanish), affordable pricing, fast response time. Competing against expensive agencies ($3K+/mo) and unreliable freelancers.',
                productRoadmap: [],
            } as BusinessPlanData,
        },

        // Plan 5: Coffee Roastery (David)
        {
            userId: david.id,
            name: 'Brooklyn Bean Roasters',
            problem: 'Commodity coffee dominates market; consumers want artisanal, ethically-sourced beans',
            targetAudience: 'Coffee enthusiasts in NYC willing to pay premium for quality and sustainability',
            solution: 'Small-batch specialty coffee roastery with direct trade relationships and online + retail sales',
            monetization: 'B2C retail ($18-24/bag) + B2B wholesale to cafes ($12-15/lb) + subscriptions',
            status: 'active',
            content: {
                missionStatement: 'Roast exceptional coffee while building direct relationships with farmers and our community.',
                amirRole: 'N/A',
                davidRole: 'Founder/Head Roaster',
                shareAmir: 0,
                shareDavid: 100,
                basePriceLow: 18,
                basePriceHigh: 24,
                featurePriceLow: 20,
                featurePriceHigh: 20,
                hourlyRate: 0,
                clientsPerDev: 500,
                devMonthlyCost: 0,
                hostingCost: 100,
                serverCost: 50,
                revenueStrategy: '60% DTC online/subscriptions, 30% wholesale to cafes, 10% farmers markets. Target 10K lbs/year by Year 2. High margins on DTC (70%), lower on wholesale (40%).',
                buyoutClause: 'Open to acquisition by specialty coffee brand at 4x EBITDA.',
                exitSchedule: [
                    { year: 'Year 1', amir: 0, david: 100, role: 'Full Time - Setup \u0026 Launch' },
                    { year: 'Year 2', amir: 0, david: 100, role: 'Full Time - Growing B2B' },
                    { year: 'Year 3', amir: 0, david: 100, role: 'Full Time - Scaling Production' },
                ],
                projections: [
                    { year: 2026, month: 0, revenue: 180000, expenses: 130000, profit: 50000, clientCount: 300, upgradeAdoption: 25 },
                    { year: 2027, month: 0, revenue: 420000, expenses: 250000, profit: 170000, clientCount: 800, upgradeAdoption: 35 },
                    { year: 2028, month: 0, revenue: 750000, expenses: 400000, profit: 350000, clientCount: 1500, upgradeAdoption: 40 },
                ],
                monthlyProjections: [],
                workflowSteps: [
                    { id: '1', title: 'Sourcing', description: 'Direct relationships with farmers in Ethiopia, Colombia, Guatemala' },
                    { id: '2', title: 'Roasting', description: 'Small-batch roasting optimized for each origin' },
                    { id: '3', title: 'Fulfillment', description: 'DTC orders shipped within 48 hours of roasting' },
                    { id: '4', title: 'Wholesale Distribution', description: 'Weekly deliveries to cafe partners in NYC' },
                ],
                salesPitch: 'Coffee that tells a story. From farmer to cup, we build relationships and roast with purpose.',
                marketAnalysis: 'Specialty coffee market: $85B globally, growing 12% annually. NYC: 8M residents, 3.2K cafes. 74% of adults drink coffee daily. Premium segment willing to pay $18-24/bag.',
                competitiveAdvantage: 'Direct trade relationships (higher quality, better margins). Hyper-local Brooklyn brand. Small-batch freshness. Transparent sourcing. Community-focused (partnering with local cafes, not competing).',
                productRoadmap: [
                    { id: '1', feature: 'Subscription Service', quarter: 'Q2 2026', status: 'in-progress', description: 'Monthly coffee subscription with free shipping' },
                    { id: '2', feature: 'Pop-Up Cafe', quarter: 'Q4 2026', status: 'planned', description: 'Weekend pop-up to sell direct and build brand' },
                    { id: '3', feature: 'Wholesale Expansion', quarter: 'Q2 2027', status: 'idea', description: 'Expand to Philadelphia and Boston markets' },
                ],
            } as BusinessPlanData,
        },

        // Plan 6: Online Tutoring Platform (Premium User - showcase platform features)
        {
            userId: premium.id,
            name: 'TutorMesh - Peer Learning Platform',
            problem: 'Quality tutoring is expensive and hard to find; student tutors need flexible income',
            targetAudience: 'College students seeking affordable tutoring + student tutors wanting flexible work',
            solution: 'Marketplace connecting student tutors with learners, focusing on STEM subjects',
            monetization: '20% commission on hourly tutoring sessions ($20-50/hr average)',
            status: 'active',
            content: {
                missionStatement: 'Democratize access to quality tutoring while empowering students to earn and teach.',
                amirRole: 'Solo Founder',
                davidRole: 'N/A',
                shareAmir: 100,
                shareDavid: 0,
                basePriceLow: 20,
                basePriceHigh: 50,
                featurePriceLow: 30,
                featurePriceHigh: 30,
                hourlyRate: 0,
                clientsPerDev: 5000,
                devMonthlyCost: 0,
                hostingCost: 200,
                serverCost: 800,
                revenueStrategy: 'Take-rate model: 20% commission on all sessions. Target 10K sessions/month by Year 2. Upsell premium features to tutors (priority listing, analytics).',
                buyoutClause: 'Open to acquisition by edtech company at 6-8x ARR after achieving product-market fit.',
                exitSchedule: [
                    { year: 'Year 1', amir: 100, david: 0, role: 'Full Time - Building Marketplace' },
                    { year: 'Year 2', amir: 100, david: 0, role: 'Full Time - Growth \u0026 Scale' },
                    { year: 'Year 3', amir: 100, david: 0, role: 'Full Time - Expanding Markets' },
                ],
                projections: [
                    { year: 2026, month: 0, revenue: 240000, expenses: 100000, profit: 140000, clientCount: 2000, upgradeAdoption: 15 },
                    { year: 2027, month: 0, revenue: 960000, expenses: 300000, profit: 660000, clientCount: 8000, upgradeAdoption: 20 },
                    { year: 2028, month: 0, revenue: 2400000, expenses: 700000, profit: 1700000, clientCount: 20000, upgradeAdoption: 25 },
                ],
                monthlyProjections: [],
                workflowSteps: [
                    { id: '1', title: 'Tutor Onboarding', description: 'Verify student status, subject expertise, background check' },
                    { id: '2', title: 'Matching', description: 'Algorithm matches learners with tutors based on subject, availability, ratings' },
                    { id: '3', title: 'Session \u0026 Payment', description: 'Video platform integration, automatic payment processing' },
                    { id: '4', title: 'Quality Control', description: 'Rating system, content moderation, dispute resolution' },
                ],
                salesPitch: 'Learn from students who just aced the class. Affordable, relatable tutoring that actually works.',
                marketAnalysis: 'US K-12 + college tutoring market: $8B annually. 70M students, 30% use tutoring. Average spend $40/hour. Traditional services charge $60-100/hr. We enable $25-40/hr through student marketplace.',
                competitiveAdvantage: 'Wyzant (broad, expensive), Chegg (study help, not live tutoring), Course Hero (documents, not tutoring). Our edge: 1) Peer-to-peer authenticity 2) Lower prices 3) Focus on college students (both sides) 4) Modern video platform',
                productRoadmap: [
                    { id: '1', feature: 'AI Matching Algorithm', quarter: 'Q3 2026', status: 'in-progress', description: 'ML model to improve tutor-learner matching based on success rates' },
                    { id: '2', feature: 'Group Sessions', quarter: 'Q4 2026', status: 'planned', description: 'Enable 1-to-many tutoring for better economics' },
                    { id: '3', title: 'Study Groups', quarter: 'Q1 2027', status: 'planned', description: 'Self-organized student study groups with optional tutor moderation' },
                    { id: '4', feature: 'International Expansion', quarter: 'Q3 2027', status: 'idea', description: 'Launch in UK, Canada, Australia markets' },
                ],
                marketStats: {
                    competitors: [
                        { name: 'Wyzant', marketShare: 40, aiScore: 25, features: ['Broad subjects', 'Background checks'], weaknesses: ['Expensive ($60-100/hr)', 'Older interface'] },
                        { name: 'Chegg Tutors', marketShare: 25, aiScore: 35, features: ['On-demand', 'Study tools'], weaknesses: ['Quality inconsistent', 'Limited subjects'] },
                        { name: 'Varsity Tutors', marketShare: 20, aiScore: 30, features: ['Test prep focus', 'Structured'], weaknesses: ['Very expensive', 'Corporate feel'] },
                    ],
                    featureComparison: [
                        { feature: 'Affordability', us: 95, competitors: 35 },
                        { feature: 'Peer Learning', us: 100, competitors: 20 },
                        { feature: 'Modern Platform', us: 90, competitors: 50 },
                        { feature: 'Brand Recognition', us: 15, competitors: 75 },
                    ],
                },
            } as BusinessPlanData,
        },
    ];

    // Insert plans
    for (const plan of demoPlans) {
        const planId = uuidv4();

        // Check if plan already exists
        const existing = await db
            .select()
            .from(businessPlans)
            .where(eq(businessPlans.name, plan.name))
            .get();

        if (existing) {
            console.log(`⏭️  Skipped "${plan.name}" - already exists`);
            continue;
        }

        await db.insert(businessPlans).values({
            id: planId,
            userId: plan.userId,
            name: plan.name,
            problem: plan.problem,
            targetAudience: plan.targetAudience,
            solution: plan.solution,
            monetization: plan.monetization,
            content: plan.content,
            status: plan.status,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log(`✅ Created business plan: "${plan.name}" (${plan.status})`);
    }

    console.log('\n📊 Demo Business Plans Summary:');
    console.log('   - 6 business plans created');
    console.log('   - Across various industries (SaaS, Services, Retail, E-commerce)');
    console.log('   - 5 active plans + 1 draft');
    console.log('\n✨ Demo plans seeding complete!\n');
}

seedDemoPlans()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error seeding demo plans:', error);
        console.error(error.stack);
        process.exit(1);
    });
