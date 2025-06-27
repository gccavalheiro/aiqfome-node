import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { CustomerPayload } from './jwt.strategy'

export const CurrentCustomer = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    return request.user as CustomerPayload
  },
)
