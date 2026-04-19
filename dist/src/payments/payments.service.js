"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let PaymentsService = class PaymentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listForUser(viewer, userId) {
        if (viewer.role === client_1.Role.ADMIN) {
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
        if (viewer.role === client_1.Role.MANAGER && viewer.country) {
            const target = await this.prisma.user.findUnique({ where: { id: userId } });
            if (!target)
                throw new common_1.NotFoundException('User not found');
            if (target.country === viewer.country) {
                return this.prisma.paymentMethod.findMany({
                    where: { userId },
                    orderBy: { createdAt: 'desc' },
                });
            }
        }
        throw new common_1.ForbiddenException('Cannot access payment methods for this user.');
    }
    async create(viewer, input) {
        if (viewer.role !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Only admins can create payment methods.');
        }
        const target = await this.prisma.user.findUnique({ where: { id: input.userId } });
        if (!target)
            throw new common_1.NotFoundException('User not found');
        if (input.country !== target.country) {
            throw new common_1.ForbiddenException('Payment method country must match the user country.');
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
    async update(viewer, input) {
        if (viewer.role !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Only admins can update payment methods.');
        }
        const existing = await this.prisma.paymentMethod.findUnique({ where: { id: input.id } });
        if (!existing)
            throw new common_1.NotFoundException('Payment method not found');
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
    async remove(viewer, id) {
        if (viewer.role !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('Only admins can delete payment methods.');
        }
        await this.prisma.paymentMethod.delete({ where: { id } });
        return true;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map