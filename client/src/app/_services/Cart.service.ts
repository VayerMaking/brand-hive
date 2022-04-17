import { Injectable } from '@angular/core';
import { Product } from '../_models/Product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

constructor() { }

cartContent: Array<Product> = [];

addToCart(product: Product){
  this.cartContent.push(product)
}

removeFromCart(product: Product){
  const id = this.cartContent.indexOf(product)
  if(id >= 0){
    this.cartContent.splice(id, 1)
  } else {
    console.log("element not found")
  }
}

printCart(){
  console.log(this.cartContent)
}
getItems(){
  return this.cartContent;
}
}
