import { MenuItemModel } from '../../restaurants/models/menu-item.model';
export declare class OrderLineModel {
    id: string;
    quantity: number;
    unitPriceCents: number;
    menuItem: MenuItemModel;
}
