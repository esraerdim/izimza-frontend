import { http } from '@/shared/api'

export type LoginPayload = {
  email: string
  password: string
}

export type AuthUser = {
  id: number
  email: string
  firstName: string
  lastName: string
  phone: string
  isOAuthUser?: boolean
}

export type OAuthLoginPayload = {
  email: string
  firstName?: string
  lastName?: string
}

export type UpdateProfilePayload = {
  firstName: string
  lastName: string
  phone: string
}

export type ChangePasswordPayload = {
  currentPassword: string
  newPassword: string
}

type LoginResponse = {
  user: AuthUser
}

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>('/api/auth/login', payload)
    return data
  },

  async me(): Promise<AuthUser> {
    const { data } = await http.get<AuthUser>('/api/auth/me')
    return data
  },

  async logout(): Promise<void> {
    await http.post('/api/auth/logout')
  },

  async oauthLogin(payload: OAuthLoginPayload): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>('/api/auth/oauth-login', payload)
    return data
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
    const { data } = await http.patch<AuthUser>('/api/profile/me', payload)
    return data
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await http.post('/api/profile/me/password', payload)
  },
}
