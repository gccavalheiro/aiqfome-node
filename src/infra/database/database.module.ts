import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaFavoriteRepository } from './prisma/repositories/prisma-favorite-repository'
import { PrismaCustomerRepository } from './prisma/repositories/prisma-customer-repository'

@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaService,
    PrismaCustomerRepository,
    PrismaFavoriteRepository,
  ],
  exports: [PrismaService, PrismaCustomerRepository, PrismaFavoriteRepository],
})
export class DatabaseModule {}
