import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { Product } from '../../_models/Product';
import { AccountServiceService } from '../../_services/AccountService.service';
import { CartService } from '../../_services/Cart.service';


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

  filters: any = {};
  types: any;
  brands: any;
  sizes: any;

  direction: any = "arrow_downward"

  @Input() productList: Product[];
  @Output() onProductSelected: EventEmitter<Product> = new EventEmitter<Product>();
  private currentProduct: Product
  typesLoaded: boolean;
  
  constructor(private http: HttpClient, 
    public accountService: AccountServiceService, 
    public cartService: CartService,
    public toastr:ToastrService) { 

    
  
}

  ngOnInit() {
    this.getProducts()
    this.getTypes()
    this.getBrands()
    this.getSizes()
  }

  getProducts() {
    this.http.get(this.baseUrl+'product/getAll', 
    {
      observe: 'response',
      params: new HttpParams().set("pageNumber", this.currentPage)
                              .set("pageSize", this.pageSize)
                              .set("orderBy", this.filters.orderBy)
                              .set("filters", JSON.stringify(this.filters))
                              .set("direction", this.direction=="arrow_downward" ? "asc" : "desc")
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

  getTypes(){
    this.http.get(this.baseUrl+'product/types/getAll').pipe(
      map((response: any) => {
        const types = response;
        return types;
      })
    ).subscribe(response => {

      this.typesLoaded=true;
      this.types = response;
      console.log(response)
    }, error => {
      console.log(error.error);
    })
  }

  getBrands(){
    this.http.get(this.baseUrl+'product/brands/getAll').pipe(
      map((response: any) => {
        const types = response;
        return types;
      })
    ).subscribe(response => {

      this.brands = response;
      console.log(response[0])
    }, error => {
      console.log(error.error);
    })
  }
  getSizes(){
    console.log(this.filters.ProductTypeId)
    var params = new HttpParams();
    if (this.filters.ProductTypeId != null){
      var params = params.set("ProductTypeId", this.filters.ProductTypeId)
    }
    this.http.get(this.baseUrl+'product/sizes/getAll', {
      params: params
    }).pipe(
      map((response: any) => {
        const types = response;
        return types;
      })
    ).subscribe(response => {

      this.sizes = response;
      console.log(response[0])
    }, error => {
      console.log(error.error);
    })
  }

  clicked(product: Product): void {
    this.currentProduct = product
    this.onProductSelected.emit(product)
    if(!this.cartService.productInCart(product)) {
      this.toastr.info("Product added to cart", "Cart changed")
      this.cartService.addToCart(product);
    }
    else {
      this.toastr.error("Product already in cart")
    }
    this.cartService.printCart();
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
  onChangeDirection(){
    if (this.direction=="arrow_downward"){
      this.direction="arrow_upward"
    }else{
      this.direction="arrow_downward"
    }

    this.getProducts();
  }

  onChangeCategory(){
    this.getSizes()
    this.getProducts()
  }

  clearFilters() {
    this.filters = [];
    this.types = [];
    this.brands = [];
    this.sizes = [];

    console.log(this.filters)

    this.ngOnInit()    
  }
}
