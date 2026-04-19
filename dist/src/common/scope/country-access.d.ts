import { Country } from '@prisma/client';
import type { AuthUser } from '../types/auth-user';
export declare function assertCountryAccess(user: AuthUser, resourceCountry: Country): void;
