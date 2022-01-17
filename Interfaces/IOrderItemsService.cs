using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Orders;
using System.Collections.Generic;

namespace Sabio.Services
{
    public interface IOrderItemsService
    {
        int Add(OrderItemAddRequest model, int userId);

        void Update(OrderItemUpdateRequest model, int userId);

        OrderItem DeleteOrderItem(int id, int userId);

        List<OrderItem> GetOrderItems(int id);

        Paged<OrderItem> GetOrderItemsPaginated(int pageIndex, int pageSize);

        Paged<OrderItem> GetOrderItemsCreatedByPaginated(int pageIndex, int pageSize, int createdBy);
    }
}