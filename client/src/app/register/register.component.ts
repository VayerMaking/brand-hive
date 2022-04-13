import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountServiceService } from '../_services/AccountService.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  @Input() usersFromHomeComponent: any;
  @Output() cancelRegister = new EventEmitter();
  model: any = {};
  logged: any;
  constructor(private accountService: AccountServiceService) { this.logged = accountService.isLogged; }

  ngOnInit(): void {
  }

  register() {
    console.log(this.model);
    this.accountService.register(this.model).subscribe(response=> {
      console.log(response);
      this.cancel();
    }, error => {
      console.log(error);
    })
  }

  cancel(){
    console.log("canceled");
    this.cancelRegister.emit(false);
  }

}
