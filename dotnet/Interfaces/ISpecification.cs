using System;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace dotnet.Interfaces
{
    public interface ISpecification<T>
    {
         Expression<Func<T, bool>> Criteria {get;}

         List<Expression<Func<T, object>>> Include {get;}
    }
}