import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Delete Customer (E2E)', () => {
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

  test('[DELETE] /customers/:id', async () => {
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
      .delete(`/customers/${customer.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const customerOnDatabase = await prisma.customer.findUnique({
      where: { id: customer.id },
    })

    expect(customerOnDatabase).toBeTruthy()
    expect(customerOnDatabase?.deletedAt).toBeTruthy()
    expect(customerOnDatabase?.deletedAt).toBeInstanceOf(Date)
  })
})
