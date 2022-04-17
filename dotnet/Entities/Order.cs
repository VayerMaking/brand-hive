namespace dotnet.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public int sellerId { get; set; }
        public AppUser seller { get; set; }
        public int buyerId { get; set; }
        public AppUser buyer { get; set; }
        public int productId { get; set; }
        public Product product { get; set; }
        public string addressLine { get; set; }
        public int zipCode { get; set; }
        public bool isCompleted { get; set; }

    }
}