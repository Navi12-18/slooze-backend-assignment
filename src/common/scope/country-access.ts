import { ForbiddenException } from '@nestjs/common';
import { Country, Role } from '@prisma/client';
import type { AuthUser } from '../types/auth-user';

export function assertCountryAccess(user: AuthUser, resourceCountry: Country): void {
  if (user.role === Role.ADMIN) {
    return;
  }
  if (!user.country || user.country !== resourceCountry) {
    throw new ForbiddenException(
      'This resource is outside your assigned country scope.',
    );
  }
}
