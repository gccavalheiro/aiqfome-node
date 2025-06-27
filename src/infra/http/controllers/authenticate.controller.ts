import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { z } from 'zod'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  @Post('/')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const customer = await this.prisma.customer.findUnique({
      where: {
        email,
      },
    })

    if (!customer) {
      throw new UnauthorizedException('Customer credentials do not match')
    }

    const isPasswordValid = await compare(password, customer.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Customer credentials do not match')
    }

    const token = this.jwt.sign({
      sub: customer.id,
    })

    return {
      access_token: token,
    }
  }
}
