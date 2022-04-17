import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Product } from '../_models/Product';
import { AccountServiceService } from '../_services/AccountService.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Product[]
  createOfferMode = false;
  users: any;
  baseUrl = "https://localhost:5001/";
  typesLoaded: boolean;
  types: any;
  
  constructor(private http: HttpClient, public accountService: AccountServiceService) { 
    
  }


  ngOnInit(): void {

  }


  offerToggle(){
    this.createOfferMode=!this.createOfferMode
  }

  cancelCreateoffer(event: boolean){
    this.createOfferMode= event;
  }
  productWasSelected(halo: Product): void {
    //console.log('Product clicked: ', halo);
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
   // this.pageOfItems = pageOfItems;
}
}
