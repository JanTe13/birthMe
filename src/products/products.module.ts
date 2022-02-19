import { Module } from '@nestjs/common';
import { FirebaseModule } from 'nestjs-firebase-module/src/firebase.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [FirebaseModule.forFeature('products')],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}