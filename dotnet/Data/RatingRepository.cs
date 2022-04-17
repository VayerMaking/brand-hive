using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet.Entities;
using dotnet.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace dotnet.Data
{
    public class RateRepository : IRateRepository
    {
        private readonly DataContext _context;
        public RateRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<bool> RatingExists(int clientId, int sellerId)
        {
            var rates = await _context.Rates
             .Where(w => w.sellerId == sellerId)
             .Where(w => w.clientId == clientId).ToListAsync();
             return rates.Any() ? true : false;
        }
        public Rate AddRating(Rate rating)
        {
             _context.Rates.Add(rating);

            
            return rating;
        }

        public Task<int> DeleteRating(int id)
        {
            throw new System.NotImplementedException();
        }

        public async Task<int> GetRatingAsync(int sellerId)
        {
            var rates = await _context.Rates.Where(w => w.sellerId == sellerId).ToListAsync();
            var totalRates = await GetRatingsCount(sellerId);

            var ratesSum = 0;
            foreach(var rate in rates){
                ratesSum+=rate.score;
            }
            

            return totalRates==0 ? 0 : ratesSum/totalRates;
        }
        
        public async Task<int> GetRatingsCount(int sellerId)
        {
            return await _context.Rates.Where(w => w.sellerId == sellerId).CountAsync();
        }

        public void Update(Rate product)
        {
            throw new System.NotImplementedException();
        }
    }
}