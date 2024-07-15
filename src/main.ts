import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// ejecutar prisma npx prisma init

// ejecutamos la micración de prisma para que lo haga por nosotros en sql poniendo la sentencia
// npx prisma migrate dev --name init

// ejecutamos también el cliente de prisma
// npm install @prisma/client 

async function bootstrap() {

  const logger = new Logger('ProductsMS-main');
  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      // transport: Transport.TCP,
      transport: Transport.NATS,
      options: {
        // port: envs.port,
        servers: envs.natsServers
      }
    }
  );


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );


  // await app.listen(envs.port);
  await app.listen();

  logger.log(`Products Microservice running on port ${ envs.port }`);
}
bootstrap();
