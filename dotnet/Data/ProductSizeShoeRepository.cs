using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet.Entities;
using dotnet.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;
namespace dotnet.Data
{
    public class ProductSizeShoeRepository : IProductSizeShoeRepository
    {
        private readonly DataContext _context;
        public ProductSizeShoeRepository(DataContext context)
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
        public async Task<IReadOnlyList<ProductSize>> GetProductSizesAsync(int ProductTypeId)
        {

            var query = _context.ProductSizes
            .Include(p => p.ProductType).AsQueryable();

            if( ProductTypeId > 0 )
            {
                query = query.Where(w => w.ProductTypeId == ProductTypeId);
            }
            

            return await query.ToListAsync();
        }

        public Task<ProductSize> RemoveProductSize(int id)
        {
            throw new System.NotImplementedException();
        }
    }
}