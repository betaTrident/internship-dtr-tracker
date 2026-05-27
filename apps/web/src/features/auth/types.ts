import type { Role } from "@/features/dtr"

export type AuthUser = {
  id: string
  fullName: string
  email: string
  role: Role
}

export type StoredAuthUser = AuthUser & {
  password: string
}

