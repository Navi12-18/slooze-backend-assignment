import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from './jwt-payload';

function getAuthorizationHeader(req: Request): string | undefined {
  const fromGet = req.get?.('Authorization') ?? req.get?.('authorization');
  if (fromGet) {
    return fromGet;
  }
  const raw = req.headers?.authorization;
  if (Array.isArray(raw)) {
    return raw[0];
  }
  if (typeof raw === 'string') {
    return raw;
  }
  return undefined;
}

/** Accepts `Authorization: Bearer <jwt>` (RFC 6750) or a raw JWT (common in GraphQL UIs). */
function extractJwtFromRequest(req: Request): string | null {
  const auth = getAuthorizationHeader(req)?.trim();
  if (!auth) {
    return null;
  }
  if (auth.toLowerCase().startsWith('bearer ')) {
    return auth.slice(7).trim();
  }
  // Compact JWT: header.payload.signature (do not regex-match charset; padding etc. varies)
  const parts = auth.split('.');
  if (parts.length === 3 && parts.every((p) => p.length > 0)) {
    return auth;
  }
  return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: extractJwtFromRequest,
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException(
        'User in token was not found. Run prisma migrate/seed and login again.',
      );
    }
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      country: user.country,
    };
  }
}
