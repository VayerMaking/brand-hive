import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductServiceService {
  baseUrl = "https://localhost:5001/";
  brands: any
  types: any
constructor(private http: HttpClient) { }

getProducts() {
    
}

getBrands() {

}

getTypes() {

  return this.http.get(this.baseUrl+'product/types/getAll').pipe(
    map((response: any) => {
      const types = response;
      return types;
    })
  )
}

deleteProduct(id:any) {

  return this.http.post(this.baseUrl+'product/delete/'+id,{}).pipe(
    map((response: any) => {
      console.log(response)
      return response;
    })
  )
}


}
