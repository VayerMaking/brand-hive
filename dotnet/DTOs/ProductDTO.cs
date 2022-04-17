using dotnet.Entities;

namespace dotnet.DTOs
{
    public class ProductDTO
    {
        public int id { get; set; }
        public int sellerId { get; set; }
        public int sellerRate { get; set; }
        public int sellerRatesTotal { get; set; }
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