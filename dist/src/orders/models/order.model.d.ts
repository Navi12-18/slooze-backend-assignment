import { Country, OrderStatus } from '@prisma/client';
import { OrderLineModel } from './order-line.model';
export declare class OrderModel {
    id: string;
    userId: string;
    restaurantId: string;
    status: OrderStatus;
    country: Country;
    lines: OrderLineModel[];
}
