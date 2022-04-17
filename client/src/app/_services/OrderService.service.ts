import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { Order } from '../_models/Order';

@Injectable({
    providedIn: 'root'
  })
  
export class OrderServiceService {
    baseUrl = "https://localhost:5001/";
    brands: any
    types: any
    filters: any = {};
    sizes: any;
    pageSize: any = "12";
    totalPages: any = "100";
    currentPage: any = "1";
    typesLoaded: boolean;
    @Input() orderList: Order[];

  constructor(private http: HttpClient) { }

    getOrders(completed: any, mode: any) {
      if(mode== 'user'){
        console.log(completed);
        return this.http.get(this.baseUrl+'order/getAllByBuyerId', 
        {
          observe: 'response',
          params: new HttpParams().set("pageNumber", this.currentPage)
                                  .set("pageSize", this.pageSize)
                                  .set("orderBy", this.filters.orderBy)
                                  .set("filters","{\"isCompleted\": +"+completed+"}")
                                  //.set("direction", this.direction=="arrow_downward" ? "asc" : "desc")
        }).pipe(
          map((response: any) => {
            const types = response;
            //console.log(types);
            return types;
          })
        )
      }else{
        return this.http.get(this.baseUrl+'order/getAllBySellerId', 
        {
          observe: 'response',
          params: new HttpParams().set("pageNumber", this.currentPage)
                                  .set("pageSize", this.pageSize)
                                  .set("orderBy", this.filters.orderBy)
                                  .set("filters","{\"isCompleted\": +"+completed+"}")
                                  //.set("direction", this.direction=="arrow_downward" ? "asc" : "desc")
        }).pipe(
          map((response: any) => {
            const types = response;
            //console.log(types);
            return types;
          })
        )
      }
      

    }

    addOrder(order: any) {
      console.log(order);
      this.http.post(this.baseUrl+'order/create', order).pipe(
        map((response: any) => {
          console.log(response);
          console.log("ORDER MADE")
        })
      ).subscribe(response => {
        
        //this.router.navigate(['home'])
        //this.toastr.success("Product " + this.model["Name"] + " listed successfuly!","New product listed")
      }, error => {
        console.log(error.error);
      }) 
      }

      

    markComplete(id: number) {
        return this.http.get(this.baseUrl+'order/markComplete/'+String(id)).pipe(
          map((response: any) => {
            console.log(response);
            return response
          })
        )
    }
    
  


}