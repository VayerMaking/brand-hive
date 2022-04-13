import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccountServiceService } from '../_services/AccountService.service';
import { LocalStorageService } from '../_services/LocalStorage.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  denis: any;
  model: any = {};
  username : string;

  constructor(
    public accountService : AccountServiceService, 
    private router : Router,
    private lsService : LocalStorageService
    ) {  }

  ngOnInit(): void {
    this.accountService.printHello().subscribe(answer => {
    this.denis = answer
  }, error => {
    console.log(error);
  })
  }


  login(){
    console.log(this.model)
    this.accountService.login(this.model).subscribe(response => {
      this.lsService.setAuthData(response)
      this.router.navigate(['/home'])
    }, error => {
      console.log(error.error);
    })
  }


  logout(){
    localStorage.removeItem('user');
    this.router.navigate([''])
    this.accountService.setCurrentUser(null);
  }


  sendToAdmin() {
    console.log("Sending to admin");
    this.router.navigate(['admin']);
  }


  sendToHome() {
    console.log("Sending to home");
    this.router.navigate(['home']);
  }
}
