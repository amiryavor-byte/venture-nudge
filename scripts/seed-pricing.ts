import { db } from '@/db';
import { seedDefaultPricing } from '@/lib/pricing-service';

async function main() {
    console.log('Seeding pricing configuration...');
    await seedDefaultPricing();
    console.log('Done!');
    process.exit(0);
}

main().catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
});
