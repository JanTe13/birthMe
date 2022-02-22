import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Product } from './product.model';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {

  constructor(private productsService: ProductsService) { }

  @Post()
  addProduct(
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number
  ): Observable<Product> {
	  return this.productsService.insertProduct(prodTitle, prodDesc, prodPrice);
	}

  @Get()
  getAllProducts(): Observable<Product[]> {
    return this.productsService.getProducts();
  }

  @Get(':id')
  getProduct(@Param('id') prodId: string): Observable<Product> {
    return this.productsService.getSingleProduct(prodId);
  }

  @Patch(':id')
  updateProduct(
    @Param('id') prodId: string,
    @Body('title') prodTitle: string,
    @Body('description') prodDesc: string,
    @Body('price') prodPrice: number
  ): Observable<Product> {
    return this.productsService.updateProduct(prodId, prodTitle, prodDesc, prodPrice);
  }

  @Delete(':id')
  removeProduct(@Param('id') prodId: string): Observable<boolean> {
    return this.productsService.deleteProduct(prodId);
  }
}
