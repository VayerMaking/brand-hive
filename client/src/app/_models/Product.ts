import { ProductBrand } from "./ProductBrand";
import { ProductType } from "./ProductType";

export class Product {
    constructor(
      public id: number,
      public name: string,
      public pictureUrl: string,
      public description: string,
      public price: number,
      public productBrand: ProductBrand,
      public productType: ProductType) 
    {}
  }