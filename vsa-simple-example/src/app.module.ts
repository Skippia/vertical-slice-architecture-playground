import { Module } from '@nestjs/common';
import { OrderModule } from './orders/order.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
