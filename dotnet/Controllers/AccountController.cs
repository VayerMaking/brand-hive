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
    public class AccountController : ControllerBase
    {
        

        private readonly DataContext _context;
        private readonly IUserRepository _userRepo;
        private readonly IRateRepository _rateRepo;
        public AccountController(DataContext context, IUserRepository userRepo, IRateRepository rateRepo)
        {
            _rateRepo = rateRepo;
            _context = context;
            _userRepo = userRepo;

        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> login(LoginDto loginDto)
        {
            var user = await _context.Users.SingleOrDefaultAsync(user => user.UserName == loginDto.username);

            if (user == null) return new UnauthorizedResult();

            using var hmac = new HMACSHA512(user.passwordSalt);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.password));

            for (int i = 0; i < computedHash.Length; i++)
            {
                if (computedHash[i] != user.passwordHash[i]) return new UnauthorizedResult();
            }

            return new UserDto
            {
                username = user.UserName,
                firstName = user.firstName,
                lastName = user.lastName,
                role = user.role,
                token = CreateToken(user)
            };
        }

        [HttpPost("register")] // 192.168.1.4/account/register
        public async Task<ActionResult<UserDto>> register(RegisterDto registerDto)
        {
            if (await UserExists(registerDto.username)) return new BadRequestResult();


            using var hmac = new HMACSHA512();

            var user = new AppUser
            {
                UserName = registerDto.username.ToLower(),
                firstName = registerDto.firstName,
                lastName = registerDto.lastName,
                passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.password)),
                passwordSalt = hmac.Key,
                role = "user"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                username = user.UserName,
                firstName = user.firstName,
                lastName = user.lastName,
                token = CreateToken(user)

            };
        }

        [HttpGet("getAll")]
        public async Task<ActionResult<List<ProductBrand>>> GetAllUsers([FromQuery] ProductParams productParams)
        {
            var products = await _userRepo.GetUsersAsync(productParams);

            Response.AddPagination(products.CurrentPage, products.PageSize, products.TotalCount, products.TotalPages);
            return Ok(products);
        }

        [HttpPost("addRate")]
        public async Task<ActionResult<RateDTO>> AddRate(RateDTO rateDto)
        {
            var username = User.GetUsername();
            var user = await _userRepo.GetUserByUsernameAsync(username);

            if(rateDto.score<1 || rateDto.score>10) return Unauthorized("Invalid score range");
            
            if((await _rateRepo.RatingExists(user.Id, rateDto.sellerId))) return Unauthorized("You have already rated that user!");

            var rate = new Rate{
                sellerId = rateDto.sellerId,
                clientId = user.Id,
                score = rateDto.score

            };
            _rateRepo.AddRating(rate);
            await _context.SaveChangesAsync();

            
            return Ok(rateDto);
        }


        [HttpPost("setPermissions")]
        public async Task<ActionResult<List<ProductBrand>>> SetPermissions(UserDto userdto)
        {
            var username = User.GetUsername();
            var user = await _userRepo.GetUserByUsernameAsync(username);

            if (user == null) return Unauthorized("Only admins can change roles!");
            if (user.role != "admin") return Unauthorized("Only admins can change roles!");

            this._userRepo.SetPermissions(userdto);
            return Ok(userdto);



        }
        public string CreateToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.UserName)
            };
            var _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("deni pravi chat deni pravi chat deni pravi chat"));
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public async Task<bool> UserExists(string username)
        {
            return await _context.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}