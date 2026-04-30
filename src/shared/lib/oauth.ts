
const storageKeys = {
  state: 'oauth_pkce_state',
  verifier: 'oauth_pkce_verifier',
} as const

export const getOAuthPkceData = () => ({
  savedState: sessionStorage.getItem(storageKeys.state),
  verifier: sessionStorage.getItem(storageKeys.verifier),
})

export const clearOAuthPkceData = () => {
  sessionStorage.removeItem(storageKeys.state)
  sessionStorage.removeItem(storageKeys.verifier)
}
