import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Favorite (E2E)', () => {
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

  test('[POST] /favorites', async () => {
    const customer = await prisma.customer.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: await hash('123456', 8),
      },
    })

    const accessToken = jwt.sign({
      sub: customer.id,
    })

    const response = await request(app.getHttpServer())
      .post('/favorites')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        customerId: customer.id,
        productId: '1',
      })

    expect(response.statusCode).toBe(201)

    const favoriteOnDatabase = await prisma.favorite.findUnique({
      where: {
        customerId_productId: {
          customerId: customer.id,
          productId: '1',
        },
      },
    })

    expect(favoriteOnDatabase).toBeTruthy()
    expect(response.body).toEqual({
      id: expect.any(String),
      customerId: customer.id,
      productId: '1',
      createdAt: expect.any(String),
      deletedAt: null,
      updatedAt: expect.any(String),
    })
  })
})
