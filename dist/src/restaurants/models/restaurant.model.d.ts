import { Country } from '@prisma/client';
import { MenuItemModel } from './menu-item.model';
export declare class RestaurantModel {
    id: string;
    name: string;
    country: Country;
    city: string;
    description: string | null;
    menuItems: MenuItemModel[];
}
