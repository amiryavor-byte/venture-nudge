import { NextResponse } from 'next/server';
import { RtcTokenBuilder, RtcRole } from 'agora-access-token';
import { getSettingValue } from '@/lib/settings';

/**
 * API route to generate Agora RTC tokens for video streaming
 * These tokens authenticate users to join Agora video channels
 */
export async function POST(req: Request) {
    try {
        const { channelName, uid } = await req.json();

        if (!channelName || uid === undefined) {
            return NextResponse.json(
                { error: 'channelName and uid are required' },
                { status: 400 }
            );
        }

        // Get Agora credentials from settings
        const appId = await getSettingValue('AGORA_APP_ID');
        const appCertificate = await getSettingValue('AGORA_APP_CERTIFICATE');

        if (!appId || !appCertificate) {
            return NextResponse.json(
                { error: 'Agora credentials not configured in admin settings' },
                { status: 500 }
            );
        }

        // Token configuration
        const role = RtcRole.PUBLISHER; // User can publish and subscribe
        const expirationTimeInSeconds = 3600; // 1 hour
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

        // Generate token
        const token = RtcTokenBuilder.buildTokenWithUid(
            appId,
            appCertificate,
            channelName,
            uid,
            role,
            privilegeExpiredTs
        );

        return NextResponse.json({
            token,
            channel: channelName,
            uid,
            appId,
            expiresAt: privilegeExpiredTs
        });
    } catch (error) {
        console.error('Error generating Agora token:', error);
        return NextResponse.json(
            { error: 'Failed to generate Agora token' },
            { status: 500 }
        );
    }
}
