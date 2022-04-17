using System.Linq;
using dotnet.Entities;
using dotnet.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace dotnet.Data
{
    public class SpecificationEvaluator<TEntity> where TEntity: Product
    {
        public static IQueryable<TEntity> GetQuery(IQueryable<TEntity> inputQuery,
        ISpecification<TEntity> spec)
        {
            var query = inputQuery;

            query = spec.Include.Aggregate(query, (current,include) => current.Include(include));

            return query;

        }
    }
}