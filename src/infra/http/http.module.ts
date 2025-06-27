import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateCustomerController } from './controllers/create-customer.controller'
import { DeleteCustomerController } from './controllers/delete-customer.controller'
import { FavoriteController } from './controllers/favorite.controller'
import { GetCustomerController } from './controllers/get-customer.controller'
import { ListCustomerFavoriteController } from './controllers/list-customer-favorite.controller'
import { ListCustomerController } from './controllers/list-customer.controller'
import { UnfavoriteController } from './controllers/unfavorite.controller'
import { UpdateCustomerController } from './controllers/update-customer.controller'

@Module({
  imports: [DatabaseModule],
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
  providers: [],
})
export class HttpModule {}
