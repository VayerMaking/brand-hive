using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet.Entities;
using dotnet.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace dotnet.Data
{
    public class ProductBrandRepository : IProductBrandRepository
    {
        private readonly DataContext _context;
        public ProductBrandRepository(DataContext context)
        {
            _context = context;
        }

        public void AddProductBrand(ProductBrand productBrand)
        {
            _context.ProductBrands.Add(productBrand);
        }

        public async Task<ProductBrand> GetProductBrandByIdAsync(int id)
        {
            return await _context.ProductBrands.FindAsync(id);
        }
        public async Task<ProductBrand> GetProductBrandByNameAsync(string Name)
        {
            return await _context.ProductBrands.FirstOrDefaultAsync(p => p.Name == Name);
        }
        public async Task<IReadOnlyList<ProductBrand>> GetProductBrandsAsync()
        {
            return await _context.ProductBrands.ToListAsync();
        }

        public Task<ProductBrand> RemoveProductBrand(int id)
        {
            throw new System.NotImplementedException();
        }
    }
}