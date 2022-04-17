import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Token } from '../_models/Token';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { AccountServiceService } from '../_services/AccountService.service';
import { LocalStorageService } from '../_services/LocalStorage.service';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  baseUrl = "https://localhost:5001/";
  users: any;
  usersLoaded: boolean = false;
  pageSize: any = "10";
  totalPages: any = "100";
  currentPage: any = "1";

  constructor(public accountService:AccountServiceService,
              private http: HttpClient,
              private router : Router,
              private lsService: LocalStorageService,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.http.get(this.baseUrl+'account/getAll', {headers : new HttpHeaders()
      .set('Authorization', 'Bearer '+this.accountService.getCurrentUser()['token']),
      params: new HttpParams().set('pageNumber',this.currentPage)
                              .set('pageSize',this.pageSize),
      observe: 'response'}).pipe(
      map((response: any) => {
          const users = response;
          return users
      })
      ).subscribe(response => {
        this.usersLoaded=true;
        this.users = response.body;

        var pag = JSON.parse(response.headers.get("Pagination"))
        this.totalPages = String(pag["TotalItems"])
        console.log(response)
      }, error => {
        console.log(error.error);
      })
  }

  makeAdmin(username) {
      this.accountService.makeAdmin(username).subscribe(response => {
        this.getUsers();
        this.toastr.success("User "+ username+" set to admin","Permissions change")
      }, error => {
        console.log(error.error);
      })
      
  }
  checkIfAdmin(s){
    if( s.role != 'seller' && this.accountService.getCurrentUser()['username']!=s.userName) return true
    return false
  }
  checkIfSeller(s){
    if( s.role == 'seller' && this.accountService.getCurrentUser()['username']!=s.userName) return true
    return false
  }

  makeSeller(username) {
    this.accountService.makeSeller(username).subscribe(response => {
      this.getUsers();
      this.toastr.success("User "+ username+" set to seller","Permissions change")
    }, error => {
      console.log(error.error);
    })
    
  }
  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.currentPage = pageOfItems["pageIndex"]+1;
    this.pageSize = String(pageOfItems["pageSize"]);
    this.getUsers();

}
}
