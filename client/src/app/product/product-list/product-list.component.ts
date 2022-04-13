import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/_models/Product';
import { AccountServiceService } from 'src/app/_services/AccountService.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  baseUrl = "https://localhost:5001/";
  pageSize: any = "12";
  totalPages: any = "100";
  currentPage: any = "1";

  @Input() productList: Product[];
  @Output() onProductSelected: EventEmitter<Product> = new EventEmitter<Product>();
  private currentProduct: Product
  typesLoaded: boolean;
  
  constructor(private http: HttpClient, public accountService: AccountServiceService) { 

    
  
}

  ngOnInit() {
    var headers = new HttpHeaders()
        .set('Authorization', 'Bearer '+this.accountService.getCurrentUser()['token'])
  
    this.http.get(this.baseUrl+'product/getAll', 
    {
      headers: headers,
      observe: 'response',
      params: new HttpParams().set("pageNumber", this.currentPage)
                              .set("pageSize", this.pageSize)
    }).pipe(
      map((response: any) => {
        const types = response;
        return types;
      })
    ).subscribe(response => {

      this.typesLoaded=true;
      this.productList = response.body;
      var pag = JSON.parse(response.headers.get("Pagination"))
      this.totalPages = String(pag["TotalItems"])
    }, error => {
      console.log(error.error);
    })
  }

  clicked(product: Product): void {
    this.currentProduct = product
    this.onProductSelected.emit(product)
  }

  isSelected(product: Product): boolean {
    if (!product || !this.currentProduct) {
      return false
    }
    return product.id === this.currentProduct.id
  }
  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    console.log(pageOfItems)
    this.currentPage = pageOfItems["pageIndex"]+1;
    this.pageSize = String(pageOfItems["pageSize"]);
    this.ngOnInit();

}

}
