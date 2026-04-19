import { Module } from '@nestjs/common';
import { PaymentsResolver } from './payments.resolver';
import { PaymentsService } from './payments.service';

@Module({
  providers: [PaymentsService, PaymentsResolver],
})
export class PaymentsModule {}
