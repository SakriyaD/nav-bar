namespace CafeBackend.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string CategoryName { get; set; } = null!;

        // Navigation
        //Many Categories to 1 product
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}