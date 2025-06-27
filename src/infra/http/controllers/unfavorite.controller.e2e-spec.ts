import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Unfavorite (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  beforeEach(async () => {
    await prisma.favorite.deleteMany()
    await prisma.customer.deleteMany()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[DELETE] /favorites', async () => {
    const customer = await prisma.customer.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: await hash('123456', 8),
      },
    })

    await prisma.favorite.create({
      data: {
        customerId: customer.id,
        productId: '1',
      },
    })

    const accessToken = jwt.sign({
      sub: customer.id,
    })

    const response = await request(app.getHttpServer())
      .delete('/favorites')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        customerId: customer.id,
        productId: '1',
      })

    expect(response.statusCode).toBe(204)

    const favoriteOnDatabase = await prisma.favorite.findUnique({
      where: {
        customerId_productId: {
          customerId: customer.id,
          productId: '1',
        },
      },
    })

    expect(favoriteOnDatabase).toBeNull()
    expect(response.body).toEqual({})
  })
})
