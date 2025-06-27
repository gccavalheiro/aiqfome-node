import { ApiProperty } from '@nestjs/swagger'

export class AddFavoriteDto {
  @ApiProperty({
    description: 'ID do cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  customerId!: string

  @ApiProperty({
    description: 'ID do produto',
    example: '1',
  })
  productId!: string
}

export class FavoriteResponseDto {
  @ApiProperty({
    description: 'ID único do favorito',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string

  @ApiProperty({
    description: 'ID do cliente',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  customerId!: string

  @ApiProperty({
    description: 'ID do produto',
    example: '1',
  })
  productId!: string

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

export class CustomerFavoriteProductDto {
  @ApiProperty({
    description: 'ID do produto',
    example: 1,
  })
  id!: number

  @ApiProperty({
    description: 'Título do produto',
    example: 'Produto exemplo',
  })
  title!: string

  @ApiProperty({
    description: 'URL da imagem do produto',
    example: 'https://example.com/image.jpg',
  })
  image!: string

  @ApiProperty({
    description: 'Preço do produto',
    example: 99.99,
  })
  price!: number

  @ApiProperty({
    description: 'Avaliação do produto',
  })
  review!: {
    rate: number
    count: number
  }
}

export class CustomerFavoritesResponseDto {
  @ApiProperty({
    description: 'Lista de produtos favoritos do cliente',
    type: [CustomerFavoriteProductDto],
  })
  favorites!: CustomerFavoriteProductDto[]
}

export class FavoriteListResponseDto {
  @ApiProperty({
    description: 'Lista de favoritos',
    type: [FavoriteResponseDto],
  })
  favorites!: FavoriteResponseDto[]

  @ApiProperty({
    description: 'Número total de favoritos',
    example: 5,
  })
  total!: number
} 