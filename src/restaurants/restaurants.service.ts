import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { assertCountryAccess } from '../common/scope/country-access';
import type { AuthUser } from '../common/types/auth-user';
import type { RestaurantModel } from './models/restaurant.model';
import { Role } from '@prisma/client';

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(viewer: AuthUser): Promise<RestaurantModel[]> {
    if (viewer.role === Role.ADMIN) {
      return this.prisma.restaurant.findMany({
        include: { menuItems: true },
        orderBy: { name: 'asc' },
      });
    }
    if (!viewer.country) {
      return [];
    }
    return this.prisma.restaurant.findMany({
      where: { country: viewer.country },
      include: { menuItems: true },
      orderBy: { name: 'asc' },
    });
  }

  async findById(viewer: AuthUser, id: string): Promise<RestaurantModel> {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: { menuItems: true },
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    assertCountryAccess(viewer, restaurant.country);
    return restaurant;
  }
}
