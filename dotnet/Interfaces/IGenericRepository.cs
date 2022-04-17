using System.Collections.Generic;
using System.Threading.Tasks;

namespace dotnet.Interfaces
{
    public interface IGenericRepository<T>
    {
         Task<T> GetByIdAsync(int id);

         Task<List<T>> ListAllAsync(int id);

         Task<T> GetEntityWithSpec(ISpecification<T> spec);
         Task<List<T>> ListAsync(ISpecification<T> spec);
    }
}