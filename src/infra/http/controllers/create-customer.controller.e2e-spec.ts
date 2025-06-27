import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create customer (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  beforeEach(async () => {
    await prisma.favorite.deleteMany()
    await prisma.customer.deleteMany()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /customers', async () => {
    const response = await request(app.getHttpServer())
      .post('/customers')
      .send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '123456',
      })

    expect(response.statusCode).toBe(201)

    const customerOnDatabase = await prisma.customer.findUnique({
      where: {
        email: 'john.doe@example.com',
      },
    })

    expect(customerOnDatabase).toBeTruthy()
    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'John Doe',
      email: 'john.doe@example.com',
    })
  })
})
