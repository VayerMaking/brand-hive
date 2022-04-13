import { Injectable } from '@angular/core';
import { Token } from '../_models/Token';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

constructor() { }

public setAuthData(auth: Token) {
  localStorage.setItem('Authorization', JSON.stringify(auth));
}

public setUser(user: User) {
  localStorage.setItem('user', JSON.stringify(user));
}

public getToken() : Token {
  let token = JSON.parse(localStorage.getItem('Authorization'));
  return token == null ? null : token;
}

public getUser() {
  let user = JSON.parse(localStorage.getItem('user'));
  return user == null ? null : user;
}
}
