import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../common/types/auth-user';
import type { RestaurantModel } from './models/restaurant.model';
export declare class RestaurantsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(viewer: AuthUser): Promise<RestaurantModel[]>;
    findById(viewer: AuthUser, id: string): Promise<RestaurantModel>;
}
