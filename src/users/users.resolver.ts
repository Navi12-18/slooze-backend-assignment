import { Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserModel } from './models/user.model';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types/auth-user';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly users: UsersService) {}

  @Query(() => UserModel, { name: 'me' })
  me(@CurrentUser() user: AuthUser): Promise<UserModel> {
    return this.users.findById(user.id);
  }
}
