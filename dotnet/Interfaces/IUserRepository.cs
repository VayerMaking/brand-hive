using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet.Entities;
using dotnet.DTOs;
namespace dotnet.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUsernameAsync(string username);
        void SetPermissions(UserDto userdto);
        string GetUsernameByTokenAsync(string token);
        void AddUser(AppUser user);

    }
}