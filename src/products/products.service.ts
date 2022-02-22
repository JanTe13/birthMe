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

  insertProduct(title: string, desc: string, price: number): Observable<Product> {
    const productId = title.replace(' ', '');
    const newProduct: Product = new Product(productId, title, desc, price);
    return from(admin.database().ref('products').push(newProduct)).pipe(map(
      () => {
        return newProduct;
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

  updateProduct(productId: string, title: string, desc: string, price: number): Observable<Product> {
    return this.findProduct(productId).pipe(map(
      (response: ProductData) => {
        if (title) response.product.title = title;
        if (desc) response.product.description = desc;
        if (price) response.product.price = price;
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
    return new Product(
      value.id,
      value.title,
      value.description,
      value.price
    );
  }
}