using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using dotnet.Data;
using dotnet.DTOs;
using System.Security.Cryptography;
using System.Text;
using dotnet.Entities;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using dotnet.Interfaces;
using dotnet.Extensions;
using dotnet.Helpers;
namespace dotnet.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrderController : ControllerBase
    {
        

        private readonly DataContext _context;
        private readonly IUserRepository _userRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;
        public OrderController(DataContext context,
                               IUserRepository userRepository,
                               IOrderRepository orderRepository,
                               IProductRepository productRepository)
        {
            _context = context;
            _userRepository = userRepository;
            _orderRepository = orderRepository;
            _productRepository = productRepository;
        }



        [HttpPost("create")]
        public async Task<ActionResult<Product>> CreateOrder(CreateOrderDTO newOrderDto)
        {
            var username = User.GetUsername();

            var user = await _userRepository.GetUserByUsernameAsync(username);
            if (user.role == null) return Unauthorized("You need to be logged in to make orders!");

            var seller = await _userRepository.GetUserByIdAsync(newOrderDto.sellerId);
            if (seller == null ) return Unauthorized("This seller does not exist!");
            else if (seller.role != "seller") return Unauthorized("This is not a seller!");
            

            var product = await _productRepository.GetProductByIdAsync(newOrderDto.productId);
            if (product == null) return Unauthorized("This product does not exist!");
            else if (product.sellerId != seller.Id) return Unauthorized("This item is not listed by that seller!");

            var order = new Order {
                addressLine = newOrderDto.addressLine,
                zipCode = newOrderDto.zipCode,
                isCompleted = false,
                sellerId = seller.Id,
                buyerId = user.Id,
                productId = product.Id
            };

            _orderRepository.AddOrder(order);
            await _context.SaveChangesAsync();
            return Ok();

        }
        [HttpGet("getAll")]
        public async Task<ActionResult<List<Order>>> GetOrders([FromQuery] OrderParams orderParams)
        {

            var username = User.GetUsername();

            var user = await _userRepository.GetUserByUsernameAsync(username);
            if (user.role == null) return Unauthorized("Only admins can view other orders!");

            var orders = await _orderRepository.GetOrdersAsync(orderParams);

            Response.AddPagination(orders.CurrentPage, orders.PageSize, orders.TotalCount, orders.TotalPages);
            return Ok(orders);
        }

        [HttpGet("getAllBySellerId")]
        public async Task<ActionResult<List<Order>>> getAllBySellerId([FromQuery] OrderParams orderParams)
        {

            var username = User.GetUsername();

            var user = await _userRepository.GetUserByUsernameAsync(username);
            if (user.role == null) return Unauthorized("Only admins can view other orders!");

            var orders = await _orderRepository.GetOrdersBySellerIdAsync(user.Id, orderParams);

            Response.AddPagination(orders.CurrentPage, orders.PageSize, orders.TotalCount, orders.TotalPages);
            return Ok(orders);
        }

        [HttpGet("getAllByBuyerId")]
        public async Task<ActionResult<List<Order>>> getAllByBuyerId([FromQuery] OrderParams orderParams)
        {

            var username = User.GetUsername();

            var user = await _userRepository.GetUserByUsernameAsync(username);
            if (user.role == null) return Unauthorized("Only admins can view other orders!");

            var orders = await _orderRepository.GetOrdersByBuyerIdAsync(user.Id, orderParams);

            Response.AddPagination(orders.CurrentPage, orders.PageSize, orders.TotalCount, orders.TotalPages);
            return Ok(orders);
        }

        [HttpGet("markComplete/{id}")]
        public async Task<ActionResult<List<Order>>> completeOrder(int id)
        {

            _orderRepository.markComplete(id);
            return Ok();
        }

        [HttpPost("delete/{id}")]
        public async Task<ActionResult<List<ProductBrand>>> GetProducts(int id)
        {
            var products = await _orderRepository.DeleteOrder(id);

            return Ok();
        }
    }
}