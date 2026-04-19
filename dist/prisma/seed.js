"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    const hash = await bcrypt.hash('SloozeDemo#2026', 10);
    const nick = await prisma.user.upsert({
        where: { email: 'nick.fury@slooze.test' },
        update: {},
        create: {
            email: 'nick.fury@slooze.test',
            passwordHash: hash,
            displayName: 'Nick Fury',
            role: client_1.Role.ADMIN,
            country: null,
        },
    });
    const marvel = await prisma.user.upsert({
        where: { email: 'captain.marvel@slooze.test' },
        update: {},
        create: {
            email: 'captain.marvel@slooze.test',
            passwordHash: hash,
            displayName: 'Captain Marvel',
            role: client_1.Role.MANAGER,
            country: client_1.Country.INDIA,
        },
    });
    const america = await prisma.user.upsert({
        where: { email: 'captain.america@slooze.test' },
        update: {},
        create: {
            email: 'captain.america@slooze.test',
            passwordHash: hash,
            displayName: 'Captain America',
            role: client_1.Role.MANAGER,
            country: client_1.Country.AMERICA,
        },
    });
    const thanos = await prisma.user.upsert({
        where: { email: 'thanos@slooze.test' },
        update: {},
        create: {
            email: 'thanos@slooze.test',
            passwordHash: hash,
            displayName: 'Thanos',
            role: client_1.Role.MEMBER,
            country: client_1.Country.INDIA,
        },
    });
    const thor = await prisma.user.upsert({
        where: { email: 'thor@slooze.test' },
        update: {},
        create: {
            email: 'thor@slooze.test',
            passwordHash: hash,
            displayName: 'Thor',
            role: client_1.Role.MEMBER,
            country: client_1.Country.INDIA,
        },
    });
    const travis = await prisma.user.upsert({
        where: { email: 'travis@slooze.test' },
        update: {},
        create: {
            email: 'travis@slooze.test',
            passwordHash: hash,
            displayName: 'Travis',
            role: client_1.Role.MEMBER,
            country: client_1.Country.AMERICA,
        },
    });
    await prisma.orderLine.deleteMany();
    await prisma.order.deleteMany();
    await prisma.paymentMethod.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.restaurant.deleteMany();
    const rIndiaA = await prisma.restaurant.create({
        data: {
            name: 'Spice Route',
            country: client_1.Country.INDIA,
            city: 'Mumbai',
            description: 'Coastal Indian classics (mock data).',
            menuItems: {
                create: [
                    { name: 'Butter Chicken', priceCents: 899, currency: 'INR' },
                    { name: 'Masala Dosa', priceCents: 249, currency: 'INR' },
                    { name: 'Mango Lassi', priceCents: 129, currency: 'INR' },
                ],
            },
        },
        include: { menuItems: true },
    });
    const rIndiaB = await prisma.restaurant.create({
        data: {
            name: 'Dosa Point',
            country: client_1.Country.INDIA,
            city: 'Bengaluru',
            description: 'South Indian quick bites (mock data).',
            menuItems: {
                create: [
                    { name: 'Rava Dosa', priceCents: 199, currency: 'INR' },
                    { name: 'Filter Coffee', priceCents: 89, currency: 'INR' },
                ],
            },
        },
        include: { menuItems: true },
    });
    const rUsA = await prisma.restaurant.create({
        data: {
            name: 'Liberty Diner',
            country: client_1.Country.AMERICA,
            city: 'New York',
            description: 'Classic American diner (mock data).',
            menuItems: {
                create: [
                    { name: 'Cheeseburger', priceCents: 1299, currency: 'USD' },
                    { name: 'Caesar Salad', priceCents: 999, currency: 'USD' },
                    { name: 'Chocolate Shake', priceCents: 699, currency: 'USD' },
                ],
            },
        },
        include: { menuItems: true },
    });
    const rUsB = await prisma.restaurant.create({
        data: {
            name: 'Pacific Bowls',
            country: client_1.Country.AMERICA,
            city: 'Los Angeles',
            description: 'West coast bowls (mock data).',
            menuItems: {
                create: [
                    { name: 'Salmon Poke Bowl', priceCents: 1599, currency: 'USD' },
                    { name: 'Green Juice', priceCents: 799, currency: 'USD' },
                ],
            },
        },
        include: { menuItems: true },
    });
    const pm = async (userId, label, country, last4, isDefault) => prisma.paymentMethod.create({
        data: {
            userId,
            label,
            provider: 'mock_card',
            last4,
            country,
            isDefault,
        },
    });
    await pm(thanos.id, 'Thanos Visa', client_1.Country.INDIA, '4242', true);
    await pm(thor.id, 'Thor Mastercard', client_1.Country.INDIA, '5454', true);
    await pm(travis.id, 'Travis Amex', client_1.Country.AMERICA, '3782', true);
    await pm(marvel.id, 'Marvel Corp Card', client_1.Country.INDIA, '2222', true);
    await pm(america.id, 'America Corp Card', client_1.Country.AMERICA, '1111', true);
    console.log('Seed complete.', {
        admin: nick.email,
        restaurants: [rIndiaA.name, rIndiaB.name, rUsA.name, rUsB.name],
    });
}
main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map