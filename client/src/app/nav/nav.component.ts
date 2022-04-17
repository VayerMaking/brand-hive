import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AccountServiceService } from '../_services/AccountService.service';
import { LocalStorageService } from '../_services/LocalStorage.service';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { CourseDialogComponent } from '../CourseDialog/CourseDialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  logged: boolean;
  cartopen: boolean = false;
  seller: boolean = false;
  model: any = {};
  username : string;
  animal: string;
  name: string;

  constructor(
    public accountService : AccountServiceService, 
    private router : Router,
    private toastr : ToastrService,
    private lsService : LocalStorageService,
    private dialog: MatDialog
    ) {  }

  ngOnInit(): void {
    if(this.accountService.getRole.toString() == "seller")
      this.seller = true;
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
      this.toastr.error("Invalid login information")
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

  openOrders() {
    console.log("Sending to orders");
    this.router.navigate(['orders']);
  }

  openCartPage(){
    // const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
    //   width: '250px',
    //   data: {name: this.name, animal: this.animal}
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   this.animal = result;
    // });
    this.cartopen = true;
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let a = this.dialog.open(CourseDialogComponent, dialogConfig);
    console.log(a)

    this.dialog.afterAllClosed.subscribe(
      result => {
        this.cartopen = false;
    })
      
    
  }

}
