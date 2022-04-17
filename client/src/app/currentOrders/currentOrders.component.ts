import { Component, OnInit } from "@angular/core";
import { OrderServiceService } from "../_services/OrderService.service";
import { MatGridListModule } from '@angular/material/grid-list';
import { AccountServiceService } from "../_services/AccountService.service";
import { delay } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";


@Component({
    selector: 'currentOrders',
    templateUrl: './currentOrders.component.html',
    styleUrls: ['./currentOrders.component.scss']
  })
  export class currentOrdersComponent implements OnInit {
    orders : any 
    pageSize: any = "12";
    totalPages: any = "100";
    currentPage: any = "1";
    completed: string = "false";
    model: any = {};

    constructor(
      public accountService : AccountServiceService,
        private orderService : OrderServiceService,
        private toastr: ToastrService,
    ) {}
    
    async ngOnInit() {
      this.model.seller = {};
      await this.getOrders();
      // /this.orders = this.orderService.orderList;
      //console.log(this.orders);
    }

    async getOrders() {
      
     this.orderService.getOrders(this.completed, this.accountService.getRole(), this.pageSize, this.currentPage, this.totalPages).subscribe(response => {

      
      this.orders = response.body;
      console.log(this.orders)
      var pag = JSON.parse(response.headers.get("Pagination"))
      this.totalPages = String(pag["TotalItems"])
      console.log(this.orders);
      return this.orders;

    }, error => {
      console.log(error.error);
    })
      
      

    }

    refreshOrders(){
      this.orderService.getOrders("true",this.accountService.getRole(), this.pageSize, this. currentPage, this.totalPages).subscribe(response => {

      
        this.orders = response.body;
        console.log(this.orders)
        var pag = JSON.parse(response.headers.get("Pagination"))
        this.totalPages = String(pag["TotalItems"])
        console.log(this.orders);
        return this.orders;
  
      }, error => {
        console.log(error.error);
      });
      //this.getOrders();
    }

    changeOrders() {
      console.log("AAAAAAAA")
      if(this.completed == "false"){
        this.completed = "true"
      }
      else if(this.completed == "true"){
        this.completed = "false"
      }
      console.log(this.completed)
      this.ngOnInit()
    }

    markCompleted(id){
      this.orderService.markComplete(id).subscribe(response => {

        
        console.log(response);
        this.toastr.success("Order marked complete!","Success")
        this.ngOnInit()
  
      }, error => {
        console.log(error.error);
      });
    }

    selectSeller(seller: any){
      this.model.seller=seller
    }
    
    rateSeller(){
    console.log(this.model.seller.id);
     this.accountService.rateSeller(this.model.seller.id, this.model.score).subscribe(response => {
    
      //this.router.navigate(['home'])

        this.toastr.success(this.model.seller.userName + " has been rated!","Rating added")

      console.log(response);
      //this.toastr.success("Product " + this.model["Name"] + " listed successfuly!","New product listed")
    }, error => {
      this.toastr.error(error.error,"Rating error")
    }) 
    
    }

    onChangePage(pageOfItems: Array<any>) {
      // update current page of items
      console.log(pageOfItems)
      this.currentPage = pageOfItems["pageIndex"]+1;
      this.pageSize = String(pageOfItems["pageSize"]);
      this.ngOnInit();
  
  }

  }