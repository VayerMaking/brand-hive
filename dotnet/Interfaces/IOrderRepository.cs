using System.Collections.Generic;
using System.Threading.Tasks;
using dotnet.Entities;
using dotnet.Helpers;

namespace dotnet.Interfaces
{
    public interface IOrderRepository
    {
        Task<PagedList<Order>> GetOrdersAsync(OrderParams orderParams);
        Task<Order> GetOrderByIdAsync(int id);
        Task<PagedList<Order>> GetOrdersBySellerIdAsync(int id, OrderParams orderParams);
        Task<PagedList<Order>> GetOrdersByBuyerIdAsync(int id, OrderParams orderParams);
        void AddOrder(Order Order);
        Task<int> DeleteOrder(int id);
        void markComplete(int id);
        
    }
}