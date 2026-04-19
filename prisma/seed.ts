import { PrismaClient, Country, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('SloozeDemo#2026', 10);

  const nick = await prisma.user.upsert({
    where: { email: 'nick.fury@slooze.test' },
    update: {},
    create: {
      email: 'nick.fury@slooze.test',
      passwordHash: hash,
      displayName: 'Nick Fury',
      role: Role.ADMIN,
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
      role: Role.MANAGER,
      country: Country.INDIA,
    },
  });

  const america = await prisma.user.upsert({
    where: { email: 'captain.america@slooze.test' },
    update: {},
    create: {
      email: 'captain.america@slooze.test',
      passwordHash: hash,
      displayName: 'Captain America',
      role: Role.MANAGER,
      country: Country.AMERICA,
    },
  });

  const thanos = await prisma.user.upsert({
    where: { email: 'thanos@slooze.test' },
    update: {},
    create: {
      email: 'thanos@slooze.test',
      passwordHash: hash,
      displayName: 'Thanos',
      role: Role.MEMBER,
      country: Country.INDIA,
    },
  });

  const thor = await prisma.user.upsert({
    where: { email: 'thor@slooze.test' },
    update: {},
    create: {
      email: 'thor@slooze.test',
      passwordHash: hash,
      displayName: 'Thor',
      role: Role.MEMBER,
      country: Country.INDIA,
    },
  });

  const travis = await prisma.user.upsert({
    where: { email: 'travis@slooze.test' },
    update: {},
    create: {
      email: 'travis@slooze.test',
      passwordHash: hash,
      displayName: 'Travis',
      role: Role.MEMBER,
      country: Country.AMERICA,
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
      country: Country.INDIA,
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
      country: Country.INDIA,
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
      country: Country.AMERICA,
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
      country: Country.AMERICA,
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

  const pm = async (
    userId: string,
    label: string,
    country: Country,
    last4: string,
    isDefault: boolean,
  ) =>
    prisma.paymentMethod.create({
      data: {
        userId,
        label,
        provider: 'mock_card',
        last4,
        country,
        isDefault,
      },
    });

  await pm(thanos.id, 'Thanos Visa', Country.INDIA, '4242', true);
  await pm(thor.id, 'Thor Mastercard', Country.INDIA, '5454', true);
  await pm(travis.id, 'Travis Amex', Country.AMERICA, '3782', true);
  await pm(marvel.id, 'Marvel Corp Card', Country.INDIA, '2222', true);
  await pm(america.id, 'America Corp Card', Country.AMERICA, '1111', true);

  // eslint-disable-next-line no-console
  console.log('Seed complete.', {
    admin: nick.email,
    restaurants: [rIndiaA.name, rIndiaB.name, rUsA.name, rUsB.name],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
