import { RestaurantsService } from './restaurants.service';
import { RestaurantModel } from './models/restaurant.model';
import type { AuthUser } from '../common/types/auth-user';
export declare class RestaurantsResolver {
    private readonly restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    restaurants(user: AuthUser): Promise<RestaurantModel[]>;
    restaurant(user: AuthUser, id: string): Promise<RestaurantModel>;
}
