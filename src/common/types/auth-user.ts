import type { Country, Role } from '@prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  country: Country | null;
}
