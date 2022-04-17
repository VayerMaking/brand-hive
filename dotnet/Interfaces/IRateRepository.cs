using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet.Entities;
using dotnet.DTOs;
using dotnet.Helpers;

namespace dotnet.Interfaces
{
    public interface IRateRepository
    {
        void Update(Rate product);
        Task<int> GetRatingAsync(int sellerId);
        Task<int> GetRatingsCount(int sellerId);
        Task<bool> RatingExists(int clientId, int sellerId);
        Rate AddRating(Rate rating);
        Task<int> DeleteRating(int id);
        
    }
}