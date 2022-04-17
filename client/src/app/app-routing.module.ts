import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { IndexComponent } from './index/index.component';
import { NavComponent } from './nav/nav.component';
import { AdminComponent} from './admin/admin.component';
import { CreateOfferComponent } from './create-offer/create-offer.component';
import { currentOrdersComponent } from './currentOrders/currentOrders.component';

const routes: Routes = [
  {path: '', component: IndexComponent},
  {path: 'home', component: HomeComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'product', component: CreateOfferComponent},
  {path: 'orders', component: currentOrdersComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
