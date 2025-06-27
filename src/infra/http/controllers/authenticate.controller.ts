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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { AuthenticateDto, AuthenticateResponseDto } from '@/infra/http/dtos'
import { z } from 'zod'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@ApiTags('auth')
@Controller('/sessions')
export class AuthenticateController {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  @Post('/')
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  @ApiOperation({ summary: 'Autenticar cliente' })
  @ApiBody({ type: AuthenticateDto })
  @ApiResponse({
    status: 201,
    description: 'Cliente autenticado com sucesso',
    type: AuthenticateResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
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
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
      },
    }
  }
}
