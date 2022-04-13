import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators'
import { User } from '../_models/User';
import { Token } from '../_models/Token';
import { LocalStorageService } from './LocalStorage.service';

@Injectable({
  providedIn: 'root'
})
export class AccountServiceService {
a : any;
baseUrl = "https://localhost:5001/";
accUrl = "https://localhost:5001/account";
logged : boolean;
username : string;

private currentUserSource = new ReplaySubject<User>(1);
currentUser$ = this.currentUserSource.asObservable();

constructor(private http: HttpClient, private lsService : LocalStorageService) { this.logged = false; }


printHello(){
  return this.http.get('https://localhost:5001/Weatherforecast');
}


register(model: any){
  return this.http.post(this.accUrl + '/register', model).pipe(
    map((response: any) => {
      const user = response;
      if(user){
        this.lsService.setUser(user);
        this.setCurrentUser(user);
        console.log(user);

        this.logged = true; //Tuk logged 'poluchava' stoinost true
        this.username = user.username;
      }
      return user;
    })
  );
}


login(model: any) : Observable<Token> {
  var data = "grant_type=password&username=" + model.username + "&password=" + model.passoword;

  return this.http.post<Token>(this.accUrl + '/login', model).pipe(
    map((response: any) => {
      const user = response;
      const token = response.token;
      if(user){
        this.lsService.setUser(user);
        this.lsService.setAuthData(token);
        this.setCurrentUser(user);
        console.log(user);
        
        
        this.logged = true; //Tuk logged 'poluchava' stoinost true
        console.log(this.logged); //Daje tuk se printi stoinostta na logged 'true'
        this.username = user.username;
      }
      return user;
    })
  );
}


isLogged(){
  console.log(this.logged); //Tuk izvedenata stoinost e 'false'
  return this.logged; //wtf????
}


setCurrentUser(user: User){
  this.currentUserSource.next(user);
}


getCurrentUser(){
  //console.log(JSON.parse(localStorage.getItem('user'))['token'])
  return JSON.parse(localStorage.getItem('user'))
}

getRole(){
  //console.log(JSON.parse(localStorage.getItem('user'))['token'])
  return JSON.parse(localStorage.getItem('user'))['role']
}


getUsers(){
  return this.http.get(this.accUrl+'/getAll').pipe(
    map((response: any) => {
        const users = response;
        return users;
    })
  )
}

makeSeller(username){
  var u = new User(username,"seller")

  return this.http.post(this.baseUrl + 'account/setPermissions', u, {
    observe: 'response',
    headers: new HttpHeaders()
        .set('Authorization', 'Bearer '+this.getCurrentUser()['token'])
  }).pipe(
    map((response:any) => {
      this.getUsers();
    })
  )
}

makeAdmin(u){
  var user = new User(u,"admin")
  console.log(user)
  return this.http.post(this.baseUrl + 'account/setPermissions', user,
  {
    observe: 'response',
    headers: new HttpHeaders()
        .set('Authorization', 'Bearer '+this.getCurrentUser()['token'])
  }).pipe(
    map((response:any) => {

      this.getUsers();
    })
  )
}

}
