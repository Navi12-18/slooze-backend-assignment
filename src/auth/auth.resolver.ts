import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { LoginResponse } from './models/auth.models';
import { Public } from '../common/decorators/public.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Mutation(() => LoginResponse)
  login(@Args('input') input: LoginInput): Promise<LoginResponse> {
    return this.auth.login(input.email, input.password);
  }
}
