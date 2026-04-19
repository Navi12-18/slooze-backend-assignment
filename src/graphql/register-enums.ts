import { registerEnumType } from '@nestjs/graphql';
import { Country, OrderStatus, Role } from '@prisma/client';

export function registerGraphqlEnums(): void {
  registerEnumType(Role, { name: 'Role' });
  registerEnumType(Country, { name: 'Country' });
  registerEnumType(OrderStatus, { name: 'OrderStatus' });
}
