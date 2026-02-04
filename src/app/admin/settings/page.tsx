import { getSettings } from '@/app/actions/admin';
import { SettingsForm } from './settings-form';

export default async function SettingsPage() {
    const settings = await getSettings();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-gray-500">Configure global application parameters.</p>
            </div>
            <SettingsForm initialSettings={settings} />
        </div>
    );
}
