using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Threading.Tasks;
using dotnet.Entities;
using dotnet.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using dotnet.DTOs;
using dotnet.Helpers;
namespace dotnet.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.SingleOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<PagedList<AppUser>> GetUsersAsync(ProductParams productParams)
        {
            var query = _context.Users;

            return await PagedList<AppUser>.CreateAsync(query,productParams.pageNumber,productParams.pageSize);

            //return await _context.Users.ToListAsync();
        }
        public String GetUsernameByTokenAsync(string token){
            string secret = "deni pravi chat deni pravi chat deni pravi chat"; 
            var key = Encoding.ASCII.GetBytes(secret);
            var handler = new JwtSecurityTokenHandler();
            var validations = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false
            };
            var claims = handler.ValidateToken(token, validations, out var tokenSecure);
            return claims.Identity.Name;
        }

        public void AddUser(AppUser user)
        {
            _context.Users.Add(user);
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
        public async void SetPermissions(UserDto userdto)
        {
            var user = await this.GetUserByUsernameAsync(userdto.username);
            user.role = userdto.role;
            await this.SaveAllAsync();

        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }
    }
}