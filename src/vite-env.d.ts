

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  
  
  const component: DefineComponent<object, object, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_GOOGLE_GSI_CLIENT_ID?: string
  readonly VITE_OAUTH_AUTHORIZE_URL?: string
  readonly VITE_OAUTH_TOKEN_URL?: string
  readonly VITE_OAUTH_USERINFO_URL?: string
  readonly VITE_OAUTH_CLIENT_ID?: string
  readonly VITE_OAUTH_REDIRECT_URI?: string
  readonly VITE_OAUTH_SCOPE?: string
  readonly VITE_OAUTH_AUDIENCE?: string
  readonly VITE_OAUTH_CONNECTION?: string
  readonly VITE_OAUTH_PROMPT?: string
  readonly VITE_DEMO_EMAIL?: string
  readonly VITE_DEMO_PASSWORD?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
