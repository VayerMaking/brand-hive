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
  // return this.http.post(this.baseUrl + 'account/login', model).pipe(
  //   map((response: any) => {
  //     const user = response;
  //     if(user){
  //       localStorage.setItem('user', JSON.stringify(user));
  //       console.log(user);
  //       this.setCurrentUser(user);
  //     }
  //     return user;
  //   })
  // );

  return this.http.get(this.baseUrl+'product/types/getAll').pipe(
    map((response: any) => {
      const types = response;
      return types;
    })
  )
}
}
