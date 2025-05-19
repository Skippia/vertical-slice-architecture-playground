import { Module } from '@nestjs/common'
import { CheckoutService } from './checkout.service'
import { CheckoutController } from './checkout.controller'
import { UserModule } from '../user/user.module'
import { ProductModule } from '../product/product.module'
import { ProductModelModule } from '../product-model/product-model.module'

@Module({
  imports: [UserModule, ProductModule, ProductModelModule],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
