import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Master Demo Data Seeding Script
 * Orchestrates seeding of all demo data in correct order
 */

async function runScript(scriptName: string): Promise<void> {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Running: ${scriptName}`);
    console.log('='.repeat(60));

    try {
        const scriptPath = path.join(__dirname, scriptName);
        const { stdout, stderr } = await execAsync(`npx tsx "${scriptPath}"`);

        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
    } catch (error: any) {
        console.error(`❌ Error running ${scriptName}:`, error.message);
        throw error;
    }
}

async function seedAllDemoData() {
    console.log('\n🚀 Starting Demo Data Seeding Process...\n');
    console.log('This will create:');
    console.log('  - 9 demo user accounts (5 basic, 2 premium, 2 admin)');
    console.log('  - 6 sample business plans');
    console.log('  - All with password: demo123!\n');

    try {
        // Step 1: Seed demo users (with skills and interests)
        await runScript('seed-demo-users.ts');

        // Step 2: Seed demo business plans (linked to users)
        await runScript('seed-demo-plans.ts');

        console.log('\n' + '='.repeat(60));
        console.log('✨ ALL DEMO DATA SEEDED SUCCESSFULLY! ✨');
        console.log('='.repeat(60));
        console.log('\n📋 Quick Start:');
        console.log('   1. Visit http://localhost:3000/admin/users to see all demo accounts');
        console.log('   2. Login credentials:');
        console.log('      - premium@venturenudge.com / demo123! (full features demo)');
        console.log('      - admin@venturenudge.com / demo123! (admin access)');
        console.log('      - demo-user-1@venturenudge.com / demo123! (basic user)');
        console.log('\n💡 All demo accounts use password: demo123!');
        console.log('');

    } catch (error) {
        console.error('\n❌ Demo data seeding failed.');
        console.error('Please check the error messages above.');
        process.exit(1);
    }
}

seedAllDemoData()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
