const config = {
    minVersion: '2.4.0',
    notifications: {
        adminToken: process.env.APP_API_ADMIN_TOKEN || '',
        storageDir: process.env.APP_API_DATA_DIR || './data/notifications',
        expoEndpoint: process.env.EXPO_PUSH_ENDPOINT || 'https://exp.host/--/api/v2/push/send',
    },
    auth: {
        baseUrl: process.env.AUTHENTIK_URL || 'https://authentik.login.no',
        clientId: process.env.AUTHENTIK_CLIENT_ID || '',
        clientSecret: process.env.AUTHENTIK_CLIENT_SECRET || '',
        callbackUrl: process.env.APP_AUTH_CALLBACK_URL || 'https://app.login.no/api/auth/callback',
        defaultRedirectUri: process.env.NUCLEUS_APP_REDIRECT_URI || 'login://auth',
    }
}

export default config
