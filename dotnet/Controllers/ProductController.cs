using System.Threading.Tasks;
using dotnet.Data;
using dotnet.DTOs;
using Microsoft.AspNetCore.Mvc;
using dotnet.Extensions;
using dotnet.Entities;
using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using dotnet.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Linq;
using dotnet.Helpers;
namespace dotnet.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class ProductController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IUserRepository _userRepository;
        private readonly IProductRepository _productRepository;
        private readonly IProductTypeRepository _productTypeRepository;
        private readonly IProductBrandRepository _productBrandRepository;
        public ProductController(IUserRepository UserRepository,
                                 IProductRepository ProductRepository, 
                                 IProductTypeRepository ProductTypeRepository,
                                 IProductBrandRepository ProductBrandRepository,
                                 DataContext context)
        {
            _context = context;
            _userRepository = UserRepository;
            _productRepository = ProductRepository;
            _productTypeRepository = ProductTypeRepository;
            _productBrandRepository = ProductBrandRepository;
        }
        [HttpPost("create")]
        public async Task<ActionResult<Product>> CreateProduct(CreateProductDTO newProductDto)
        {
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUsernameAsync(username);
            
            if(user.role == null || user.role == "user") return Unauthorized("You need elevated permissions to list new products!");
            
            var productType = await _productTypeRepository.GetProductTypeByIdAsync(newProductDto.ProductTypeId);
            if (productType == null)
            {
                return Unauthorized("This product type does not exist!");
            }

            var product = _productRepository.AddProduct(newProductDto, user);
            return Ok(product);
            
        }
        [HttpGet("getAll")]
        public async Task<ActionResult<List<ProductBrand>>> GetProducts([FromQuery]ProductParams productParams)
        {
            var products = await _productRepository.GetProductsAsync(productParams);

            Response.AddPagination(products.CurrentPage, products.PageSize, products.TotalCount, products.TotalPages);
            return Ok(products);
        }

        [HttpGet("brands/getAll")]
        public async Task<ActionResult<List<ProductBrand>>> GetProductBrands()
        {
            return Ok(await _productBrandRepository.GetProductBrandsAsync());
        }
        
        [HttpGet("types/getAll")]
        public async Task<ActionResult<List<ProductBrand>>> GetProductTypes()
        {
            return Ok(await _productTypeRepository.GetProductTypesAsync());
        }
        [HttpPost("types/add")]
        public async Task<ActionResult<ProductBrand>> AddProductType(CreateProductTypeDTO createProductTypeDTO)
        {
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if(user.role != "admin") return Unauthorized("You need elevated permissions to list new products!");

            var newProductType = new ProductType
            {
                Name = createProductTypeDTO.Name
            };
            _productTypeRepository.AddProductType(newProductType);
            await _context.SaveChangesAsync();
            
            return Ok();
        }

    }
}