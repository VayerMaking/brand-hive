using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet.Entities;
using dotnet.DTOs;
using dotnet.Helpers;

namespace dotnet.Interfaces
{
    public interface IProductRepository
    {
        void Update(Product product);
        Task<PagedList<Product>> GetProductsAsync(ProductParams productParams);
        Task<Product> GetProductByIdAsync(int id);
        Task<Product> AddProduct(CreateProductDTO newProductDto, AppUser user);
        Task<int> DeleteProduct(int id);
        
    }
}