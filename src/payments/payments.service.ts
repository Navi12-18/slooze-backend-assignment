import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthUser } from '../common/types/auth-user';
import type { PaymentMethodModel } from './models/payment-method.model';
import type { CreatePaymentMethodInput } from './dto/create-payment-method.input';
import type { UpdatePaymentMethodInput } from './dto/update-payment-method.input';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(viewer: AuthUser, userId: string): Promise<PaymentMethodModel[]> {
    if (viewer.role === Role.ADMIN) {
      return this.prisma.paymentMethod.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    }
    if (viewer.id === userId) {
      return this.prisma.paymentMethod.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    }
    if (viewer.role === Role.MANAGER && viewer.country) {
      const target = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!target) throw new NotFoundException('User not found');
      if (target.country === viewer.country) {
        return this.prisma.paymentMethod.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
        });
      }
    }
    throw new ForbiddenException('Cannot access payment methods for this user.');
  }

  async create(viewer: AuthUser, input: CreatePaymentMethodInput): Promise<PaymentMethodModel> {
    if (viewer.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can create payment methods.');
    }
    const target = await this.prisma.user.findUnique({ where: { id: input.userId } });
    if (!target) throw new NotFoundException('User not found');
    if (input.country !== target.country) {
      throw new ForbiddenException('Payment method country must match the user country.');
    }
    const isDefault = input.isDefault ?? false;
    if (isDefault) {
      await this.prisma.paymentMethod.updateMany({
        where: { userId: input.userId },
        data: { isDefault: false },
      });
    }
    return this.prisma.paymentMethod.create({
      data: {
        userId: input.userId,
        label: input.label,
        provider: input.provider,
        last4: input.last4,
        country: input.country,
        isDefault,
      },
    });
  }

  async update(viewer: AuthUser, input: UpdatePaymentMethodInput): Promise<PaymentMethodModel> {
    if (viewer.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can update payment methods.');
    }
    const existing = await this.prisma.paymentMethod.findUnique({ where: { id: input.id } });
    if (!existing) throw new NotFoundException('Payment method not found');
    if (input.isDefault) {
      await this.prisma.paymentMethod.updateMany({
        where: { userId: existing.userId },
        data: { isDefault: false },
      });
    }
    return this.prisma.paymentMethod.update({
      where: { id: input.id },
      data: {
        label: input.label ?? undefined,
        provider: input.provider ?? undefined,
        last4: input.last4 ?? undefined,
        isDefault: input.isDefault ?? undefined,
      },
    });
  }

  async remove(viewer: AuthUser, id: string): Promise<boolean> {
    if (viewer.role !== Role.ADMIN) {
      throw new ForbiddenException('Only admins can delete payment methods.');
    }
    await this.prisma.paymentMethod.delete({ where: { id } });
    return true;
  }
}
