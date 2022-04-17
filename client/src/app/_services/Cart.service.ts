import { Injectable } from '@angular/core';
import { Product } from '../_models/Product';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CartService {

constructor(private toastr: ToastrService) { }

cartContent: Array<Product> = [];

productInCart(product: Product) {
  for (var i = 0; i < this.cartContent.length; i++) {
      if (this.cartContent[i] === product) {
          return true;
      }
  }

  return false;
}

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
emptyCart(){
  this.cartContent = [];
}
}
