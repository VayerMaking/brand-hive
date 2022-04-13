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
  logged: boolean;
  model: any = {};
  username : string;

  constructor(
    public accountService : AccountServiceService, 
    private router : Router,
    private lsService : LocalStorageService
    ) {  }

  ngOnInit(): void {

  }


  login(){
    console.log(this.model)
    this.accountService.login(this.model).subscribe(response => {
      this.lsService.setAuthData(response)
      this.logged = this.accountService.isLogged();
      console.log("in login()", this.logged)
      
      this.router.navigate(['/home'])
    }, error => {
      console.log(error);
    })
  }


  logout(){
    localStorage.removeItem('user');
    this.logged = false;
    this.router.navigate([''])
    this.accountService.setCurrentUser(null);
  }


  sendToAdmin() {
    console.log("Sending to admin");
    this.router.navigate(['admin']);
  }


  DropsharkButton() {
    this.router.navigate(['home']);
    // console.log("in Button()", this.logged)
    // if(this.logged) {
    //   console.log("Sending logged user to home");
    //   this.router.navigate(['home']);
    // }
    // else {
    //   console.log("Sending guest to index");
    //   this.router.navigate(['']);
    // }
  }

  sendToHome() {
    console.log("Sending logged user to home");
    this.router.navigate(['home']);
  }

  sendToCreateOffer() {
    console.log("Sending to Create");
    this.router.navigate(['product']);
  }
}
