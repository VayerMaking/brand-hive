import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '../_models/Token';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AccountServiceService } from '../_services/AccountService.service';
import { LocalStorageService } from '../_services/LocalStorage.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  baseUrl = "https://localhost:5001/";
  users: any;
  usersLoaded: boolean = false;

  constructor(public accountService:AccountServiceService,
              private http: HttpClient,
              private lsService: LocalStorageService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.http.get(this.baseUrl+'account/getAll').pipe(
      map((response: any) => {
          const users = response;
          return users
      })
      ).subscribe(response => {
        this.usersLoaded=true;
        this.users = response;
        console.log(response)
      }, error => {
        console.log(error.error);
      })
  }

  checkIfAdmin(role) {
    if(role == "admin") return true;
    else return false;
  }

  makeAdmin(username) {
      this.accountService.makeAdmin(username).subscribe(response => {
        console.log(response);
      }, error => {
        console.log(error.error);
      })
  }
}
