import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';

@Injectable()
export class ProductsService {

  private products: Product[] = [];

  constructor(@Inject('Firestore') private firestore) { }

  insertProduct(title: string, desc: string, price: number): string {
    const prodId = Math.random().toString();
    const newProduct: Product = new Product(prodId, title, desc, price);
    // this.products.push(newProduct);
    this.firestore.save(newProduct);
    return prodId;
  }

  getProducts(): Product[] {
    return [...this.products];
  }

  getSingleProduct(productId: string): Product {
    const product = this.findProduct(productId)[0];
    return {...product};
  }

  updateProduct(productId: string, title: string, desc: string, price: number) {
    const [product, index] = this.findProduct(productId);
    this.products[index] = {
      ...product,
      title: title ? title : product.title,
      desc: desc ? desc : product.desc,
      price: price ? price : product.price
    };
  }

  deleteProduct(prodId: string) {
    const index: number = this.findProduct(prodId)[1];
    this.products.splice(index, 1);
  }

  private findProduct(id: string): [Product, number] {
    const productIndex: number = this.products.findIndex(prod => prod.id === id);
    const product: Product = this.products[productIndex];
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    return [product, productIndex];
  }
}