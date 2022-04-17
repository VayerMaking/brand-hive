using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet.Entities;

namespace dotnet.Interfaces
{
    public interface IProductSizeClothesRepository
    {
        Task<IReadOnlyList<ProductSize>> GetProductSizesAsync();
        Task<ProductSize> GetProductSizeByIdAsync(int id);
        Task<ProductSize> GetProductSizeByNameSAsync(string Name);
        void AddProductSize(ProductSize productSize);
        Task<ProductSize> RemoveProductSize(int id);
        
    }
}