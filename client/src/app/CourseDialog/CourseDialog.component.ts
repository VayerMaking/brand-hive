import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog/';
import { CartService } from '../_services/Cart.service';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormsModule } from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { ProductServiceService } from '../_services/ProductService.service';
import { OrderServiceService } from '../_services/OrderService.service';
import { Order } from '../_models/Order';
import { AccountServiceService } from '../_services/AccountService.service';

declare let paypal:any;

@Component({
  selector: 'app-CourseDialog',
  templateUrl: './CourseDialog.component.html',
  styleUrls: ['./CourseDialog.component.css']
})

export class CourseDialogComponent implements OnInit {
  address : string;
  zip: number;
  total: any = 0;
  model: any = {};
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

          this.address = payment.payer.payer_info.shipping_address.city + ' ' + payment.payer.payer_info.shipping_address.line1;
          this.zip = payment.payer.payer_info.shipping_address.postal_code;

          
          if(this.model.addressLine){
            this.address = this.model.addressLine
          }
          if(this.model.zip){
            this.zip = this.model.zip
          }
          this.cart.forEach(element => {
            var o = new Order(element.sellerId, element.id,  this.address, Number(this.zip));
            this.orderService.addOrder(o);
            //this.productService.deleteProduct(element.id).subscribe();
          
          });
          this.cart = [];
          this.cartService.emptyCart();

          

          this.cart.forEach(element => {
            //this.orderService.addOrder(o);
            this.productService.deleteProduct(element.id).subscribe();
          
          });

          //window.location.reload();
          
      })
    }
  };

  constructor(private cartService: CartService,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    private toastr: ToastrService,
    private productService: ProductServiceService,
    private orderService: OrderServiceService,
    private accountService: AccountServiceService
    ) { }

  cart: any;
  

  ngOnInit() {
    this.cart=this.cartService.getItems()
    this.cart.forEach(e => {
      this.total+=e.price
      console.log(e.sellerId);
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

