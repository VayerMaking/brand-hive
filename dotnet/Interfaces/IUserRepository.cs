using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet.Entities;
using dotnet.DTOs;
using dotnet.Helpers;
namespace dotnet.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<PagedList<AppUser>> GetUsersAsync(ProductParams productParams);
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUsernameAsync(string username);
        void SetPermissions(UserDto userdto);
        string GetUsernameByTokenAsync(string token);
        void AddUser(AppUser user);

    }
}