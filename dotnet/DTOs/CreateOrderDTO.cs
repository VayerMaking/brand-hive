namespace dotnet.DTOs
{
    public class CreateOrderDTO
    {
        public int sellerId { get; set; }
        public int buyerId { get; set; }
        public int productId { get; set; }
        public string addressLine { get; set; }
        public int zipCode { get; set; }
    }
}