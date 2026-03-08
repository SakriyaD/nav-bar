namespace CafeBackend.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string ProductName { get; set; } = null!;
        public decimal Rate { get; set; }
        public int CategoryId { get; set; }

        // Navigation
        //one product to many categories
        public Category Category { get; set; } = null!;

        //Add order rs also
    }
}