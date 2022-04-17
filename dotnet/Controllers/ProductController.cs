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
using Microsoft.AspNetCore.Http;

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
        private readonly IProductSizeShoeRepository _productSizeRepository;
        public ProductController(IUserRepository UserRepository,
                                 IProductRepository ProductRepository, 
                                 IProductTypeRepository ProductTypeRepository,
                                 IProductBrandRepository ProductBrandRepository,
                                 IProductSizeShoeRepository ProductSizeRepository,
                                 DataContext context)
        {
            _context = context;
            _userRepository = UserRepository;
            _productRepository = ProductRepository;
            _productTypeRepository = ProductTypeRepository;
            _productBrandRepository = ProductBrandRepository;
            _productSizeRepository = ProductSizeRepository;
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
        [HttpPost("delete/{id}")]
        public async Task<ActionResult<List<ProductBrand>>> GetProducts(int id)
        {
            var products = await _productRepository.DeleteProduct(id);

            return Ok();
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

        [HttpGet("sizes/getAll")]
        public async Task<ActionResult<List<ProductBrand>>> GetProductSizes([FromQuery]int ProductTypeId)
        {
            return Ok(await _productSizeRepository.GetProductSizesAsync(ProductTypeId));
        }
         [HttpPost("sizes/add")]
        public async Task<ActionResult<ProductBrand>> AddProductSize(CreateProductSizeDTO createProductSizeDTO)
        {
            var username = User.GetUsername();
            var user = await _userRepository.GetUserByUsernameAsync(username);

            if(user.role != "admin") return Unauthorized("You need elevated permissions to list new products!");


            var productType = await _productTypeRepository.GetProductTypeByIdAsync(createProductSizeDTO.ProductTypeId);

            if (productType == null) return BadRequest("Invalid type selected!");

            var newProductSize = new ProductSize
            {
                nameS = createProductSizeDTO.nameS,
                nameI = createProductSizeDTO.nameI,
                ProductTypeId = createProductSizeDTO.ProductTypeId,
                ProductType = productType
            };
            _productSizeRepository.AddProductSize(newProductSize);
            await _context.SaveChangesAsync();
            
            return Ok();
        }

        // [HttpPost("add-photo")]
        // public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file, [FromQuery] int product_id)
        // {
        //     var user = await _userRepository.GetUserByUsernameAsync(User.GetUsername());

        //     var result = await _photoService.AddPhotoAsync(file);

        //     if (result.Error != null) return BadRequest(result.Error.Message);

        //     var photo = new Photo
        //     {
        //         Url = result.SecureUrl.AbsoluteUri,
        //         PublicId = result.PublicId
        //     };

        //     product.Photos.Add(photo);

        //     if (await _context.SaveChangesAsync() > 0)
        //     {
        //         return Ok();
        //     }


        //     return BadRequest("Problem addding photo");
        // }

    }
}