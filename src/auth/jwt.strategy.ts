import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'UKK_RPL_SMK_TELKOM_MALANG_SECRET_KEY',
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        member: true,
        space_owner: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Pengguna tidak valid atau telah dihapus');
    }

    return {
      sub: user.id, 
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      member: user.member,
      space_owner: user.space_owner,
    };
  }
}