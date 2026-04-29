const randomString = (length: number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let value = ''
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  for (let i = 0; i < length; i += 1) {
    value += chars[bytes[i] % chars.length]
  }
  return value
}

const toBase64Url = (buffer: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

const sha256 = async (value: string) => {
  const encoded = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', encoded)
  return toBase64Url(digest)
}

const storageKeys = {
  state: 'oauth_pkce_state',
  verifier: 'oauth_pkce_verifier',
}

type OAuthConfig = {
  authorizeUrl: string
  clientId: string
  redirectUri: string
  scope: string
  audience?: string
  connection?: string
  prompt?: string
}

export const isOAuthConfigured = () =>
  Boolean(import.meta.env.VITE_OAUTH_AUTHORIZE_URL && import.meta.env.VITE_OAUTH_CLIENT_ID)

export const startOAuthLogin = async () => {
  const config: OAuthConfig = {
    authorizeUrl: import.meta.env.VITE_OAUTH_AUTHORIZE_URL ?? '',
    clientId: import.meta.env.VITE_OAUTH_CLIENT_ID ?? '',
    redirectUri: import.meta.env.VITE_OAUTH_REDIRECT_URI ?? `${window.location.origin}/auth/callback`,
    scope: import.meta.env.VITE_OAUTH_SCOPE ?? 'openid profile email',
    audience: import.meta.env.VITE_OAUTH_AUDIENCE,
    connection: import.meta.env.VITE_OAUTH_CONNECTION,
    prompt: import.meta.env.VITE_OAUTH_PROMPT,
  }

  if (!config.authorizeUrl || !config.clientId) {
    throw new Error('OAuth yapılandırması eksik.')
  }

  const state = randomString(40)
  const verifier = randomString(96)
  const challenge = await sha256(verifier)

  sessionStorage.setItem(storageKeys.state, state)
  sessionStorage.setItem(storageKeys.verifier, verifier)

  const url = new URL(config.authorizeUrl)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', config.clientId)
  url.searchParams.set('redirect_uri', config.redirectUri)
  url.searchParams.set('scope', config.scope)
  url.searchParams.set('state', state)
  url.searchParams.set('code_challenge', challenge)
  url.searchParams.set('code_challenge_method', 'S256')
  if (config.audience) {
    url.searchParams.set('audience', config.audience)
  }
  if (config.connection) {
    url.searchParams.set('connection', config.connection)
  }
  if (config.prompt) {
    url.searchParams.set('prompt', config.prompt)
  }

  window.location.assign(url.toString())
}

export const getOAuthPkceData = () => {
  const savedState = sessionStorage.getItem(storageKeys.state)
  const verifier = sessionStorage.getItem(storageKeys.verifier)
  return { savedState, verifier }
}

export const clearOAuthPkceData = () => {
  sessionStorage.removeItem(storageKeys.state)
  sessionStorage.removeItem(storageKeys.verifier)
}
