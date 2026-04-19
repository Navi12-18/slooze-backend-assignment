import { Controller, Get, Redirect } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class RootController {
  @Public()
  @Get()
  @Redirect('/graphql', 302)
  redirectRoot(): void {}
}
