using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet.Entities;

namespace dotnet.Interfaces
{
    public interface IProductTypeRepository
    {
        Task<IReadOnlyList<ProductType>> GetProductTypesAsync();
        Task<ProductType> GetProductTypeByIdAsync(int id);
        void AddProductType(ProductType productType);
        Task<ProductType> RemoveProductType(int id);
        
    }
}