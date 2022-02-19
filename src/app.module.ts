import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { FirebaseModule } from 'nestjs-firebase-module/src/firebase.module';

@Module({
  imports: [
    FirebaseModule.forRoot({
      credentials: {
        privateKey: "AIzaSyDQoSSuuBVTL9k0p2ekBgbsHBtCLv4Pgpw",
        projectId: "birthme-26f7e",
        clientEmail: "",
      },
    }),
    ProductsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
