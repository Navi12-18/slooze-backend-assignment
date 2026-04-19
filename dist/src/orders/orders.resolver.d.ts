import { OrdersService } from './orders.service';
import { OrderModel } from './models/order.model';
import { AddToCartInput } from './dto/add-to-cart.input';
import type { AuthUser } from '../common/types/auth-user';
export declare class OrdersResolver {
    private readonly orders;
    constructor(orders: OrdersService);
    myOrders(user: AuthUser): Promise<OrderModel[]>;
    activeCart(user: AuthUser): Promise<OrderModel | null>;
    addToCart(user: AuthUser, input: AddToCartInput): Promise<OrderModel>;
    setCartLineQuantity(user: AuthUser, orderLineId: string, quantity: number): Promise<OrderModel>;
    checkout(user: AuthUser, orderId: string, paymentMethodId: string): Promise<OrderModel>;
    cancelOrder(user: AuthUser, orderId: string): Promise<OrderModel>;
}
