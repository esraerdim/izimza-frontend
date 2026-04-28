import { http } from '../../../shared/api'

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
}
