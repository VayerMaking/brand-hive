using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnet.DTOs;
using dotnet.Entities;
using dotnet.Helpers;
using dotnet.Interfaces;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System;
namespace dotnet.Data
{
    public class ProductRepository : IProductRepository
    {
        private readonly DataContext _context;
        private readonly IProductTypeRepository _productTypeRepository;
        private readonly IProductBrandRepository _productBrandRepository;
        private readonly IProductSizeShoeRepository _productSizeShoeRepository;
        private readonly IProductSizeClothesRepository _productSizeClothesRepository;
        public ProductRepository(DataContext context, 
                                IProductTypeRepository productTypeRepository,
                                IProductBrandRepository productBrandRepository,
                                IProductSizeShoeRepository productSizeShoeRepository,
                                IProductSizeClothesRepository productSizeClothesRepository)
        {
            _productTypeRepository = productTypeRepository;
            _productBrandRepository = productBrandRepository;
            _productSizeShoeRepository = productSizeShoeRepository;
            _productSizeClothesRepository = productSizeClothesRepository;
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
            .Include(p => p.ProductBrand).AsQueryable();

            if (productParams.filters != null){

                try{
                    var filters = JObject.Parse(productParams.filters);

                    foreach(var item in filters)
                    {
                        switch(item.Key)
                        {
                            case "ProductBrandId":
                                var brandInt = Int64.Parse(item.Value.ToString());
                                query = query.Where(u => u.ProductBrandId == brandInt);
                                break;

                            case "ProductTypeId":
                                var typeInt = Int64.Parse(item.Value.ToString());
                                query = query.Where(u => u.ProductTypeId == typeInt);
                                break;

                            case "ProductSizeId":
                                var sizeInt = Int64.Parse(item.Value.ToString());
                                query = query.Where(u => u.ProductSizeId == sizeInt);
                                break;

                        }
                    }
                }catch{
                    
                }
                

            }

            if (productParams.orderBy!=null && productParams.direction!=null){

                    try{
                            var item = productParams.orderBy;
                        var ordering = productParams.direction;

                        switch(ordering)
                        {
                            case "asc":
                                switch(item)
                                {
                                    case "Price":
                                        query = query.OrderBy(u => u.Price);
                                        break;

                                    case "Name":
                                        query = query.OrderBy(u => u.Name);
                                        break;
                                }
                                break;

                            case "desc":
                                switch(item)
                                {
                                    case "Price":
                                        query = query.OrderByDescending(u => u.Price);
                                        break;

                                    case "Name":
                                        query = query.OrderByDescending(u => u.Name);
                                        break;
                                }
                                break;
                        }
                    }catch{
                        
                    }

                   
            }
            

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

            dynamic productSize;

            if( productType.Name.ToLower() == "shoes")
            {
                productSize = await _productSizeShoeRepository.GetProductSizeByIdAsync(newProductDto.ProductTypeId);         
            }
            else
            {
                productSize = await _productSizeClothesRepository.GetProductSizeByIdAsync(newProductDto.ProductTypeId);
            }       

            
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
                ProductSizeId = newProductDto.ProductSizeId,
                ProductSize = productSize


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
        public async Task<int> DeleteProduct(int id)
        {
            var product = await this.GetProductByIdAsync(id);
            _context.Entry(product).State =  EntityState.Deleted; 
            return await _context.SaveChangesAsync();

        }
    }
}