using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet.Entities;

namespace dotnet.Interfaces
{
    public interface IProductSizeShoeRepository
    {
        Task<IReadOnlyList<ProductSize>> GetProductSizesAsync(int ProductTypeId);
        Task<ProductSize> GetProductSizeByIdAsync(int id);
        Task<ProductSize> GetProductSizeByNameSAsync(string Name);
        void AddProductSize(ProductSize productSize);
        Task<ProductSize> RemoveProductSize(int id);
        
    }
}