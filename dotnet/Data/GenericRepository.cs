using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet.Entities;
using dotnet.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace dotnet.Data
{
    public class GenericRepository<T> : IGenericRepository<T> where T: BaseEntity
    {
        private readonly DataContext context;
        public GenericRepository(DataContext _context)
        {
            this.context = _context;
        }

        public async Task<T> GetByIdAsync(int id)
        {
            return await context.Set<T>().FindAsync(id);
        }

        public Task<T> GetEntityWithSpec(ISpecification<T> spec)
        {
            throw new System.NotImplementedException();
        }

        public async Task<List<T>> ListAllAsync(int id)
        {
            return await context.Set<T>().ToListAsync();
        }

        public Task<List<T>> ListAsync(ISpecification<T> spec)
        {
            throw new System.NotImplementedException();
        }
    }
}