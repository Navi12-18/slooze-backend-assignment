import { Country, Role } from '@prisma/client';
export declare class UserModel {
    id: string;
    email: string;
    displayName: string;
    role: Role;
    country: Country | null;
}
