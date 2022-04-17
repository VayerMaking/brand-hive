import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog/';
import { CartService } from '../_services/Cart.service';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormsModule } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { ProductServiceService } from '../_services/ProductService.service';

declare let paypal:any;

@Component({
  selector: 'app-CourseDialog',
  templateUrl: './CourseDialog.component.html',
  styleUrls: ['./CourseDialog.component.css']
})

export class CourseDialogComponent implements OnInit {
  total: any = 0;
  addScript: boolean = false;
  paypalConfig = {
    locale: 'en_US',
    style: {
    size: 'medium',
    color: 'black',
    shape: 'rect',
    label: 'pay',
    tagline: 'false'
    },
    env: 'sandbox',
    client: {
      sandbox: 'AXvzCxXl7dxX2Pg2g25KxIrvwOb0RHKHcJ1UTDNE5M8RCiVa-evzmLwmfpnS5wDDUmF8dIGQqiRe1orw'
    },
    commit: true,
    payment: (data, actions) => {
      return actions.payment.create({
        payment: {
          transactions: [
            {amount: {total: this.total, currency: 'USD' }}
          ]
        }
      })
    },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then( (payment) => {
          console.log(payment)
          console.log("payment completed");
          this.toastr.success("Payment successful", "Paypal")
          this.close();
          this.cart.forEach(element => {
            this.productService.deleteProduct(element.id).subscribe();
          });
          this.cart = [];
          this.cartService.emptyCart();
          window.location.reload();
          
      })
    }
  };

  constructor(private cartService: CartService,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    private toastr: ToastrService,
    private productService: ProductServiceService
    ) { }

  cart: any;
  

  ngOnInit() {
    this.cart=this.cartService.getItems()
    this.cart.forEach(e => {
      this.total+=e.price
      console.log(e.price);
    });
    if(!this.addScript){
      this.addPPScript().then(() => {
        paypal.Button.render(this.paypalConfig, '#pp-checkout')
      })
    }
  }

  addPPScript(){
    this.addScript = true;

    return new Promise((resolve, reject) => {
      let scripttag = document.createElement('script');
      scripttag.src = 'http://www.paypalobjects.com/api/checkout.js'; //<script src=""></script>
      scripttag.onload = resolve;
      document.body.appendChild(scripttag);
    })
  }

  remove(product: any) {
    this.cartService.removeFromCart(product);
    this.total -= product.price;
  }

  close() {
      this.dialogRef.close();
  }
}

