import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { IndexComponent } from './index/index.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateOfferComponent } from './create-offer/create-offer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AdminComponent } from './admin/admin.component';
import { AccountServiceService } from './_services/AccountService.service';
import { LocalStorageService } from './_services/LocalStorage.service';
import { AuthInterceptor } from './Interceptors/AuthInterceptor';

@NgModule({
  declarations: [					
      AppComponent,
      NavComponent,
      HomeComponent,
      IndexComponent,
      RegisterComponent,
      CreateOfferComponent,
      AdminComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AccountServiceService,
    LocalStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
