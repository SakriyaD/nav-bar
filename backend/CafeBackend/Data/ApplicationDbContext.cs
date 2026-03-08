using CafeBackend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace CafeBackend.Data
{
    public class ApplicationDbContext : DbContext
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base (options)
        {
            
        }

        //Tables
        public DbSet<Category> Categories {get;set;}
        public DbSet<Product> Products {get;set;}

        public DbSet<Order> Orders {get;set;}
    }
}
