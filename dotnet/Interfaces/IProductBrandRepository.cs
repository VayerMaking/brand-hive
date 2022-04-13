using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet.Entities;

namespace dotnet.Interfaces
{
    public interface IProductBrandRepository
    {
        Task<IReadOnlyList<ProductBrand>> GetProductBrandsAsync();
        Task<ProductBrand> GetProductBrandByIdAsync(int id);
        Task<ProductBrand> GetProductBrandByNameAsync(string Name);
        void AddProductBrand(ProductBrand productBrand);
        Task<ProductBrand> RemoveProductBrand(int id);
        
    }
}