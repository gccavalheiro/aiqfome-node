import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { ListCustomerController } from './controllers/list-customer.controller'
import { GetCustomerController } from './controllers/get-customer.controller'
import { CreateCustomerController } from './controllers/create-customer.controller'
import { UpdateCustomerController } from './controllers/update-customer.controller'
import { DeleteCustomerController } from './controllers/delete-customer.controller'
import { FavoriteController } from './controllers/favorite.controller'
import { UnfavoriteController } from './controllers/unfavorite.controller'
import { ListCustomerFavoriteController } from './controllers/list-customer-favorite.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  imports: [],
  controllers: [
    AuthenticateController,
    ListCustomerController,
    GetCustomerController,
    CreateCustomerController,
    UpdateCustomerController,
    DeleteCustomerController,
    FavoriteController,
    UnfavoriteController,
    ListCustomerFavoriteController,
  ],
  providers: [PrismaService],
})
export class HttpModule {}
