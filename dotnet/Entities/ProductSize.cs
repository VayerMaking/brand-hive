namespace dotnet.Entities
{
    public class ProductSize
    {
        public int id { get; set; }
        public string nameS { get; set; }
        public int nameI { get; set; }
        public int ProductTypeId { get; set; }
        public ProductType ProductType { get; set; }
    }
}