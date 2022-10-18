import { Injectable, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { from, map, Observable } from 'rxjs';
import { Product } from './product.model';

interface ProductData {
  productKey: string,
  product: Product
}

@Injectable()
export class ProductsService {

  insertProduct(product: Product): Observable<Product> {
    product.id = product.title.replace(' ', '');
    return from(admin.database().ref('products').push(product)).pipe(map(
      () => {
        return product;
      }));
  }

  getProducts(): Observable<Product[]> {
    return from(admin.database().ref('products').get()).pipe(map(
      (response) => {
        const productsResult: Product[] = [];
        if (response.val()) {
          for (const product of Object.values(response.val())) {
            productsResult.push(this.parseToProduct(product));
          }
        }
        return productsResult;
      }));
  }

  getSingleProduct(productId: string): Observable<Product> {
    return this.findProduct(productId).pipe(map(
      (response: ProductData) => {
        return response.product;
      }));
  }

  updateProduct(productId: string, product: Product): Observable<Product> {
    return this.findProduct(productId).pipe(map(
      (response: ProductData) => {
        if (product.title) response.product.title = product.title;
        if (product.description) response.product.description = product.description;
        if (product.price) response.product.price = product.price;
        admin.database().ref('products').child(response.productKey).update(response.product);
        return response.product;
      }));
  }

  deleteProduct(productId: string): Observable<boolean> {
    return this.findProduct(productId).pipe(map(
      (response: ProductData) => {
        admin.database().ref('products').child(response.productKey).remove();
        return true;
      }));
  }

  private findProduct(id: string): Observable<ProductData> {
    return from(admin.database().ref('products').orderByChild('id').equalTo(id).once('value')).pipe(map(
      (response) => {
        if (!response.val()) {
          throw new NotFoundException('Could not find product.');
        }
        const completeProduct: [string, any] = Object.entries(response.val())[0];
        return {
          productKey: completeProduct[0],
          product: this.parseToProduct(completeProduct[1])
        };
      }));
  }

  private parseToProduct(value: any): Product {
    const newProduct = new Product();
    newProduct.id = value.id;
    newProduct.title = value.title;
    newProduct.description = value.description;
    newProduct.price = value.price;

    return newProduct;
  }
}