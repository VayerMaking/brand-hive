using System.Security.Claims;

namespace dotnet.Extensions
{
    public static class ClaimsPrincipleExtensions
    {
        public static string GetUsername(this ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }

        // public static bool checkPermissions(this ClaimsPrincipal user)
        // {
        //     var user = await _userRepo.GetUserByUsernameAsync(username);
            
        //     if(user == null) return Unauthorized("Only admins can change roles!");
        //     if(user.role != "admin") return Unauthorized("Only admins can change roles!");
        // }

        public static int GetUserId(this ClaimsPrincipal user)
        {
            return int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        }
    }
}