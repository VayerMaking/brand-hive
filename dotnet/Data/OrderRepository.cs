using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnet.DTOs;
using dotnet.Entities;
using dotnet.Helpers;
using dotnet.Interfaces;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using System;
namespace dotnet.Data
{
    public class OrderRepository : IOrderRepository
    {
        private readonly DataContext _context;
        public OrderRepository(DataContext context)
        {
            _context = context;
        }
        public void AddOrder(Order Order)
        {
            _context.Orders.Add(Order);
        }

        public async Task<Order> GetOrderByIdAsync(int id)
        {
            return await _context.Orders.FindAsync(id);
        }
         public async Task<PagedList<Order>> GetOrdersAsync(OrderParams orderParams)
        {

            var query = _context.Orders
            .Include(p => p.product)
            .Include(p => p.seller)
            .Include(p => p.buyer).AsQueryable();

            return await PagedList<Order>.CreateAsync(query,orderParams.pageNumber,orderParams.pageSize);
        }
        public async Task<PagedList<Order>> GetOrdersBySellerIdAsync(int id, OrderParams orderParams)
        {
            var query = _context.Orders
            .Include(p => p.product)
            .Include(p => p.seller)
            .Include(p => p.buyer)
            .Where(w => w.sellerId == id)
            .AsQueryable();

            if (orderParams.filters != null){

                try{
                    var filters = JObject.Parse(orderParams.filters);

                    foreach(var item in filters)
                    {
                        switch(item.Key)
                        {
                            case "isCompleted":
                                var isCompleted = bool.Parse(item.Value.ToString());
                                query = query.Where(u => u.isCompleted == isCompleted);
                                break;
                        }
                    }
                }catch{
                    
                }
                

            }

            return await PagedList<Order>.CreateAsync(query,orderParams.pageNumber,orderParams.pageSize);
        }
        public async Task<PagedList<Order>> GetOrdersByBuyerIdAsync(int id, OrderParams orderParams)
        {
            var query = _context.Orders
            .Include(p => p.product)
            .Include(p => p.seller)
            .Include(p => p.buyer)
            .Where(w => w.buyerId == id)
            .AsQueryable();
            if (orderParams.filters != null){

                try{
                    var filters = JObject.Parse(orderParams.filters);

                    foreach(var item in filters)
                    {
                        switch(item.Key)
                        {
                            case "isCompleted":
                                var isCompleted = bool.Parse(item.Value.ToString());
                                query = query.Where(u => u.isCompleted == isCompleted);
                                break;
                        }
                    }
                }catch{
                    
                }
                

            }
            return await PagedList<Order>.CreateAsync(query,orderParams.pageNumber,orderParams.pageSize);
        }

        public async void markComplete(int id)
        {
            var order  = await GetOrderByIdAsync(id);
            order.isCompleted = true;
            Update(order);
            await _context.SaveChangesAsync();
        }
        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
        public void Update(Order Order)
        {
            _context.Entry(Order).State = EntityState.Modified;
        }
        public async Task<int> DeleteOrder(int id)
        {
            var Order = await this.GetOrderByIdAsync(id);
            _context.Entry(Order).State =  EntityState.Deleted; 
            return await _context.SaveChangesAsync();

        }
    }
}