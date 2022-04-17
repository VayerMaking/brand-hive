using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace dotnet.Entities
{
    public class Product : BaseEntity
    {
        public int sellerId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Price { get; set; }
        public string PictureUrl { get; set; }
        public ProductType ProductType { get; set; }
        public int ProductTypeId { get; set; }
        public ProductBrand ProductBrand { get; set; }
        public int ProductBrandId { get; set; }
         
         public ProductSize ProductSize { get; set; }
         public int ProductSizeId { get; set; }

    }
}