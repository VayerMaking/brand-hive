import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountServiceService } from '../_services/AccountService.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  createOfferMode = false;
  users: any;

  constructor(private http: HttpClient, public accountService: AccountServiceService) { }


  ngOnInit(): void {
  }


  offerToggle(){
    this.createOfferMode=!this.createOfferMode
  }

  cancelCreateoffer(event: boolean){
    this.createOfferMode= event;
  }
}
