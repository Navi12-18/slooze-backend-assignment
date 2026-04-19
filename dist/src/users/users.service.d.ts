import { PrismaService } from '../prisma/prisma.service';
import type { UserModel } from './models/user.model';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<UserModel>;
}
