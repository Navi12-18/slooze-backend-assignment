import { Country } from '@prisma/client';
export declare class CreatePaymentMethodInput {
    userId: string;
    label: string;
    provider: string;
    last4: string;
    country: Country;
    isDefault?: boolean;
}
