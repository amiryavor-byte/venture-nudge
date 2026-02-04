import { db } from './src/db/index.js';
import { appSettings } from './src/db/schema.js';
import { eq } from 'drizzle-orm';

(async () => {
    const app_id = await db.select().from(appSettings).where(eq(appSettings.key, 'AGORA_APP_ID'));
    const cert = await db.select().from(appSettings).where(eq(appSettings.key, 'AGORA_APP_CERTIFICATE'));

    console.log('AGORA_APP_ID:', app_id[0]?.value || 'NOT FOUND');
    console.log('AGORA_APP_CERTIFICATE:', cert[0]?.value || 'NOT FOUND');
    process.exit(0);
})();
