import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Update Customer (E2E)', () => {
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

  test('[PUT] /customers/:id - should update customer name', async () => {
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
      .put(`/customers/${customer.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Updated',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      id: customer.id,
      name: 'John Updated',
      email: 'john.doe@example.com',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
  })

  test('[PUT] /customers/:id - should update customer email', async () => {
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
      .put(`/customers/${customer.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'john.updated@example.com',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      id: customer.id,
      name: 'John Doe',
      email: 'john.updated@example.com',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
  })

  test('[PUT] /customers/:id - should update customer password', async () => {
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
      .put(`/customers/${customer.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: '654321',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      id: customer.id,
      name: 'John Doe',
      email: 'john.doe@example.com',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })

    const updatedCustomer = await prisma.customer.findUnique({
      where: { id: customer.id },
    })
    expect(updatedCustomer?.password).not.toBe(customer.password)
  })

  test('[PUT] /customers/:id - should update multiple fields', async () => {
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
      .put(`/customers/${customer.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Updated',
        email: 'john.updated@example.com',
        password: '654321',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      id: customer.id,
      name: 'John Updated',
      email: 'john.updated@example.com',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
  })

  test('[PUT] /customers/:id - should return 409 for duplicate email', async () => {
    const customer1 = await prisma.customer.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: await hash('123456', 8),
      },
    })

    await prisma.customer.create({
      data: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: await hash('123456', 8),
      },
    })

    const accessToken = jwt.sign({
      sub: customer1.id,
    })

    const response = await request(app.getHttpServer())
      .put(`/customers/${customer1.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        email: 'jane.smith@example.com',
      })

    expect(response.statusCode).toBe(409)
    expect(response.body.message).toBe(
      'Customer with same email already exists',
    )
  })
})
