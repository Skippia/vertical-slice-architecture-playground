import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService)
  const port = configService.get<string>('PORT')!

  /**
   * Pipes
   */
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  await app.listen(port)
}

bootstrap()
