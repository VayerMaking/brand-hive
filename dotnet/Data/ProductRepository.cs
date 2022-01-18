using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet.DTOs;
using dotnet.Entities;
using dotnet.Helpers;
using dotnet.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace dotnet.Data
{
    public class ProductRepository : IProductRepository
    {
        private readonly DataContext _context;
        private readonly IProductTypeRepository _productTypeRepository;
        private readonly IProductBrandRepository _productBrandRepository;
        public ProductRepository(DataContext context, 
                                IProductTypeRepository productTypeRepository,
                                IProductBrandRepository productBrandRepository)
        {
            _productTypeRepository = productTypeRepository;
            _productBrandRepository = productBrandRepository;
            _context = context;
        }
        public async Task<Product> GetProductByIdAsync(int id)
        {
            return await _context.Products
            .Include(p => p.ProductType)
            .Include(p => p.ProductBrand)
            .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<PagedList<Product>> GetProductsAsync(ProductParams productParams)
        {
            var query = _context.Products
            .Include(p => p.ProductType)
            .Include(p => p.ProductBrand);

            return await PagedList<Product>.CreateAsync(query,productParams.pageNumber,productParams.pageSize);

        }

        public async Task<Product> AddProduct(CreateProductDTO newProductDto, AppUser user)
        {
            int sellerId = user.Id;

            var productBrand = await _productBrandRepository.GetProductBrandByIdAsync(newProductDto.ProductBrandId);
            if (productBrand == null)
            {
                var myBrand = new ProductBrand
                {
                    Name = user.UserName
                };
                _productBrandRepository.AddProductBrand(myBrand);
                await _context.SaveChangesAsync();
                productBrand = await _productBrandRepository.GetProductBrandByNameAsync(myBrand.Name);
            }

            var productType = await _productTypeRepository.GetProductTypeByIdAsync(newProductDto.ProductTypeId);            

            var newProduct = new Product
            {
                sellerId = user.Id,
                Name = newProductDto.Name,
                Description = newProductDto.Description,
                Price = newProductDto.Price,
                PictureUrl = newProductDto.PictureUrl,
                ProductTypeId = newProductDto.ProductTypeId,
                ProductType = productType,
                ProductBrandId = newProductDto.ProductBrandId,
                ProductBrand = productBrand,

            };
            _context.Products.Add(newProduct);
            await _context.SaveChangesAsync();
            return newProduct;
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
        public void Update(Product product)
        {
            _context.Entry(product).State = EntityState.Modified;
        }
    }
}