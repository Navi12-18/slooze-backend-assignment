import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { RestaurantsService } from './restaurants.service';
import { RestaurantModel } from './models/restaurant.model';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';

@Resolver(() => RestaurantModel)
export class RestaurantsResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Query(() => [RestaurantModel])
  restaurants(@CurrentUser() user: AuthUser): Promise<RestaurantModel[]> {
    return this.restaurantsService.findAll(user);
  }

  @Query(() => RestaurantModel)
  restaurant(
    @CurrentUser() user: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<RestaurantModel> {
    return this.restaurantsService.findById(user, id);
  }
}
