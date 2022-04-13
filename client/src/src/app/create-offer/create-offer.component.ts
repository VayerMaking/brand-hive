import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AccountServiceService } from '../_services/AccountService.service';
import { ProductServiceService } from '../_services/ProductService.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.component.html',
  styleUrls: ['./create-offer.component.scss']
})
export class CreateOfferComponent implements OnInit {

  @Output() cancelCreateoffer = new EventEmitter();
  model: any = {};
  typesLoaded: boolean = false;
  brandsLoaded: boolean= false;
  brands: any
  baseUrl = "https://localhost:5001/";
  types: any;
  constructor(private accountService: AccountServiceService,
     private router: Router,
     private ps: ProductServiceService,
     private http: HttpClient) { }

  ngOnInit() {
    this.getTypes()
  }

  cancel(){
    console.log("canceled");
    this.cancelCreateoffer.emit(false);
  }

  getTypes(){
    console.log(this.accountService.getCurrentUser()['token'])
    var header = {
      headers: new HttpHeaders()
        .set('Authorization', 'Bearer '+this.accountService.getCurrentUser()['token'])
    }
    this.http.get(this.baseUrl+'product/types/getAll',header).pipe(
      map((response: any) => {
        const types = response;
        return types;
      })
    ).subscribe(response => {

      this.typesLoaded=true;
      this.types = response;
      console.log(response[0])
    }, error => {
      console.log(error.error);
    })
  }
  createOffer() {
   console.log(this.model);
  
   const users = this.http.post(this.baseUrl+'product/create', { headers:new HttpHeaders()
    .append('Authorization', 'Bearer '+this.accountService.getCurrentUser()['token'])
    .append('Content-Type', 'application/json')
    .append('Accept', '*/*'),
    params:this.model})

   users.pipe(
    map((response: any) => {
      console.log(response);
    })
  ).subscribe(response => {
  }, error => {
    console.log(error.error);
  }) 

  }
}
