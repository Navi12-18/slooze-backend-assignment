import { Country } from '@prisma/client';
export declare class PaymentMethodModel {
    id: string;
    userId: string;
    label: string;
    provider: string;
    last4: string;
    isDefault: boolean;
    country: Country;
}
