import { ApiProperty } from '@nestjs/swagger'

export class AuthenticateDto {
  @ApiProperty({
    description: 'Email do cliente',
    example: 'joao@example.com',
    format: 'email',
  })
  email!: string

  @ApiProperty({
    description: 'Senha do cliente',
    example: '123456',
  })
  password!: string
}

export class AuthenticateResponseDto {
  @ApiProperty({
    description: 'Token de acesso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token!: string

  @ApiProperty({
    description: 'Informações do cliente autenticado',
  })
  customer!: {
    id: string
    name: string
    email: string
  }
} 