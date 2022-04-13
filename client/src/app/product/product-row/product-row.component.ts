import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/_models/Product';

@Component({
  selector: 'app-product-row',
  templateUrl: './product-row.component.html',
  styleUrls: ['./product-row.component.scss']
})
export class ProductRowComponent implements OnInit {
  @Input() product: Product
  @HostBinding('attr.class') cssCLass = 'item'
  constructor() { }

  ngOnInit() {
    if(this.product.pictureUrl.length<10) this.product.pictureUrl = "https://safetyaustraliagroup.com.au/wp-content/uploads/2019/05/image-not-found.png"
    console.log('a')
  }

}
