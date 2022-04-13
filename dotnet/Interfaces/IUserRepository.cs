using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet.Entities;

namespace dotnet.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser> GetUserByIdAsync(int id);
        Task<AppUser> GetUserByUsernameAsync(string username);
        string GetUsernameByTokenAsync(string token);
        void AddUser(AppUser user);

    }
}