import { AuthGuard } from '@nestjs/passport'
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { Env } from '@/infra/env'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService<Env, true>,
  ) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const token = request.headers.authorization?.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException('Token is required')
    }

    try {
      const publicKey = this.configService.get('JWT_PUBLIC_KEY', {
        infer: true,
      })
      const payload = this.jwtService.verify(token, {
        publicKey: Buffer.from(publicKey, 'base64'),
        algorithms: ['RS256'],
      })
      request.customer = payload
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired')
      }

      throw new UnauthorizedException('Invalid token')
    }

    return super.canActivate(context)
  }
}
