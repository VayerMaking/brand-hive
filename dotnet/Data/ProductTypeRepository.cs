using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet.Entities;
using dotnet.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace dotnet.Data
{
    public class ProductTypeRepository : IProductTypeRepository
    {
        private readonly DataContext _context;
        public ProductTypeRepository(DataContext context)
        {
            _context = context;
        }

        public void AddProductType(ProductType productType)
        {
            _context.ProductTypes.Add(productType);
        }

        public async Task<ProductType> GetProductTypeByIdAsync(int id)
        {
            return await _context.ProductTypes.FindAsync(id);
        }
        public async Task<IReadOnlyList<ProductType>> GetProductTypesAsync()
        {
            return await _context.ProductTypes.ToListAsync();
        }

        public Task<ProductType> RemoveProductType(int id)
        {
            throw new System.NotImplementedException();
        }
    }
}