import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../common/types/auth-user';
import type { PaymentMethodModel } from './models/payment-method.model';
import type { CreatePaymentMethodInput } from './dto/create-payment-method.input';
import type { UpdatePaymentMethodInput } from './dto/update-payment-method.input';
export declare class PaymentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listForUser(viewer: AuthUser, userId: string): Promise<PaymentMethodModel[]>;
    create(viewer: AuthUser, input: CreatePaymentMethodInput): Promise<PaymentMethodModel>;
    update(viewer: AuthUser, input: UpdatePaymentMethodInput): Promise<PaymentMethodModel>;
    remove(viewer: AuthUser, id: string): Promise<boolean>;
}
