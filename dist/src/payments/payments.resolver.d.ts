import { PaymentsService } from './payments.service';
import { PaymentMethodModel } from './models/payment-method.model';
import { CreatePaymentMethodInput } from './dto/create-payment-method.input';
import { UpdatePaymentMethodInput } from './dto/update-payment-method.input';
import type { AuthUser } from '../common/types/auth-user';
export declare class PaymentsResolver {
    private readonly payments;
    constructor(payments: PaymentsService);
    paymentMethods(user: AuthUser, userId: string): Promise<PaymentMethodModel[]>;
    createPaymentMethod(user: AuthUser, input: CreatePaymentMethodInput): Promise<PaymentMethodModel>;
    updatePaymentMethod(user: AuthUser, input: UpdatePaymentMethodInput): Promise<PaymentMethodModel>;
    deletePaymentMethod(user: AuthUser, id: string): Promise<boolean>;
}
