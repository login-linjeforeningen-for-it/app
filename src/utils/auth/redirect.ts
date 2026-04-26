import config from '#constants'

const ALLOWED_REDIRECT_PREFIXES = ['login://', 'exp://']

export function normalizeAppRedirectUri(value: string | undefined) {
    const redirectUri = value || config.auth.defaultRedirectUri
    const defaultRedirectUri = normalizeExpoDevClientScheme(config.auth.defaultRedirectUri)
    const nativeRedirectUri = normalizeExpoDevClientScheme(redirectUri)

    if (ALLOWED_REDIRECT_PREFIXES.some(prefix => nativeRedirectUri.startsWith(prefix))) {
        return nativeRedirectUri
    }

    return defaultRedirectUri
}

function normalizeExpoDevClientScheme(value: string) {
    const match = value.match(/^exp\+([a-z][a-z0-9+.-]*:\/\/.*)$/i)
    return match?.[1] || value
}
