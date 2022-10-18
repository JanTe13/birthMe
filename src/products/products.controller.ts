import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Product } from './product.model';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {

  constructor(private productsService: ProductsService) { }

  @Get()
  getAllProducts(): Observable<Product[]> {
    return this.productsService.getProducts();
  }

  @Post()
  addProduct(
    @Body() product: Product 
  ): Observable<Product> {
	  return this.productsService.insertProduct(product);
	}

  @Get(':id')
  getProduct(@Param('id') prodId: string): Observable<Product> {
    return this.productsService.getSingleProduct(prodId);
  }

  @Patch(':id')
  updateProduct(
    @Param('id') prodId: string,
    @Body() product: Product
  ): Observable<Product> {
    return this.productsService.updateProduct(prodId, product);
  }

  @Delete(':id')
  removeProduct(@Param('id') prodId: string): Observable<boolean> {
    return this.productsService.deleteProduct(prodId);
  }
}
