import { ApiProperty } from '@nestjs/swagger'

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Nome do cliente',
    example: 'João Silva',
    minLength: 3,
  })
  name!: string

  @ApiProperty({
    description: 'Email do cliente',
    example: 'joao@example.com',
    format: 'email',
  })
  email!: string

  @ApiProperty({
    description: 'Senha do cliente',
    example: '123456',
    minLength: 6,
  })
  password!: string
}

export class UpdateCustomerDto {
  @ApiProperty({
    description: 'Nome do cliente',
    example: 'João Silva',
    minLength: 3,
    required: false,
  })
  name?: string

  @ApiProperty({
    description: 'Email do cliente',
    example: 'joao@example.com',
    format: 'email',
    required: false,
  })
  email?: string

  @ApiProperty({
    description: 'Senha do cliente',
    example: '123456',
    minLength: 6,
    required: false,
  })
  password?: string
}

export class CustomerResponseDto {
  @ApiProperty({
    description: 'ID único do cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string

  @ApiProperty({
    description: 'Nome do cliente',
    example: 'João Silva',
  })
  name!: string

  @ApiProperty({
    description: 'Email do cliente',
    example: 'joao@example.com',
  })
  email!: string

  @ApiProperty({
    description: 'Data de criação',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt!: Date

  @ApiProperty({
    description: 'Data da última atualização',
    example: '2024-01-01T00:00:00.000Z',
    nullable: true,
  })
  updatedAt!: Date | null
}

export class CustomerListResponseDto {
  @ApiProperty({
    description: 'Lista de clientes',
    type: [CustomerResponseDto],
  })
  customers!: CustomerResponseDto[]

  @ApiProperty({
    description: 'Informações de paginação',
  })
  pagination!: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
} 