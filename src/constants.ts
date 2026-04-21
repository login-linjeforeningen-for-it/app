const config = {
    minVersion: '2.4.0',
    auth: {
        baseUrl: process.env.AUTHENTIK_URL || 'https://authentik.login.no',
        clientId: process.env.AUTHENTIK_CLIENT_ID || '',
        clientSecret: process.env.AUTHENTIK_CLIENT_SECRET || '',
        callbackUrl: process.env.APP_AUTH_CALLBACK_URL || 'https://app.login.no/api/auth/callback',
        defaultRedirectUri: process.env.NUCLEUS_APP_REDIRECT_URI || 'login://auth',
    }
}

export default config
