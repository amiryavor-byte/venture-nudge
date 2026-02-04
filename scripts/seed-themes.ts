import { seedDefaultThemes } from '@/lib/theme-service';

async function main() {
    console.log('Seeding themes...');
    await seedDefaultThemes();
    console.log('Done!');
    process.exit(0);
}

main().catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
});
