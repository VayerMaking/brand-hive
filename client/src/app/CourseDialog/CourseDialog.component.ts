import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog/';
import { CartService } from '../_services/Cart.service';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormsModule } from "@angular/forms";

declare let paypal:any;

@Component({
  selector: 'app-CourseDialog',
  templateUrl: './CourseDialog.component.html',
  styleUrls: ['./CourseDialog.component.css']
})

export class CourseDialogComponent implements OnInit {

  addScript: boolean = false;
  paypalConfig = {
    env: 'sandbox',
    client: {
      sandbox: 'AXvzCxXl7dxX2Pg2g25KxIrvwOb0RHKHcJ1UTDNE5M8RCiVa-evzmLwmfpnS5wDDUmF8dIGQqiRe1orw'
    },
    commit: true,
    payment: (data, actions) => {
      return actions.payment.create({
        payment: {
          transactions: [
            {amount: {total: 100, currency: 'USD' }}
          ]
        }
      })
    },
    onAuthorize: (data, actions) => {
      return actions.payment.execute().then( (payment) => {
          console.log("payment completed");
      })
    }
  };

  constructor(private cartService: CartService,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    ) { }

  cart: any;

  ngOnInit() {
    this.cart=this.cartService.getItems()
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
  }

  close() {
      this.dialogRef.close();
  }
}

