using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet.Entities;
using dotnet.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace dotnet.Data
{
    public class ProductSizeClothesRepository : IProductSizeClothesRepository
    {
        private readonly DataContext _context;
        public ProductSizeClothesRepository(DataContext context)
        {
            _context = context;
        }

        public void AddProductSize(ProductSize productSize)
        {
            _context.ProductSizes.Add(productSize);
        }

        public async Task<ProductSize> GetProductSizeByIdAsync(int id)
        {
            return await _context.ProductSizes.FindAsync(id);
        }
        public async Task<ProductSize> GetProductSizeByNameSAsync(string Name)
        {
            return await _context.ProductSizes.FirstOrDefaultAsync(p => p.nameS == Name);
        }
        public async Task<IReadOnlyList<ProductSize>> GetProductSizesAsync()
        {
            return await _context.ProductSizes.ToListAsync();
        }

        public Task<ProductSize> RemoveProductSize(int id)
        {
            throw new System.NotImplementedException();
        }
    }
}