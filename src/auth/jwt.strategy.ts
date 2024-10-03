// src/auth/jwt.strategy.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_jwt_secret',
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.usersService.findOneByEmail(payload.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
