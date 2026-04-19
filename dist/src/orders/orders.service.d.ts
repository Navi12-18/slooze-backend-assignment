import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../common/types/auth-user';
import type { OrderModel } from './models/order.model';
export declare class OrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    myOrders(v: AuthUser): Promise<OrderModel[]>;
    activeCart(v: AuthUser): Promise<OrderModel | null>;
    addToCart(v: AuthUser, input: {
        restaurantId: string;
        menuItemId: string;
        quantity: number;
    }): Promise<OrderModel>;
    setCartLineQuantity(v: AuthUser, lineId: string, qty: number): Promise<OrderModel>;
    checkout(v: AuthUser, orderId: string, paymentMethodId: string): Promise<OrderModel>;
    cancelOrder(v: AuthUser, orderId: string): Promise<OrderModel>;
}
