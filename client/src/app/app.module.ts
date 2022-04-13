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
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductRowComponent } from './product/product-row/product-row.component';
import {MatIconModule} from '@angular/material/icon';
import { JwPaginationComponent } from 'jw-angular-pagination';
import { PagerComponent } from './pager/pager.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment'
import {
  AngularFireStorageModule,
  AngularFireStorageReference,
  AngularFireUploadTask} from "@angular/fire/storage";

@NgModule({
  declarations: [						
      AppComponent,
      NavComponent,
      HomeComponent,
      IndexComponent,
      RegisterComponent,
      CreateOfferComponent,
      ProductListComponent,
      ProductRowComponent,
      AdminComponent,
      PagerComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatIconModule,
    FormsModule,
    MatFormFieldModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatSelectModule,
    AngularFireStorageModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    BrowserAnimationsModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    
    AngularFireModule.initializeApp(environment.firebaseConfig, "cloud"),
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
