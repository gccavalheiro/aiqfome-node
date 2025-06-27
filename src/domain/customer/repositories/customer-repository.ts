import { Injectable } from '@nestjs/common'

@Injectable()
export class CustomerRepository {
  constructor(private prisma: PrismaService) {
    
  }
}