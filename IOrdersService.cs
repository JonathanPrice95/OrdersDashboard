using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Orders;
using Sabio.Models.Requests.ShoppingCart;

namespace Sabio.Services
{
    public interface IOrdersService
    {
        int Add(OrderAddRequest model, int userId);

        int AddFromShoppingCart(OrderAddFromCartRequest model, int userId);

        void Update(OrderUpdateRequest model, int userId);

        Order Delete(int id, int userId);

        Order Get(int id);

        Paged<Order> GetOrdersPaginated(int pageIndex, int pageSize);

        Paged<Order> GetOrderCreatedByPaginated(int pageIndex, int pageSize, int createdBy);

        Paged<Order> GetOrderByStatusPaginated(int pageIndex, int pageSize, int statusId);

        Paged<Order> GetOrderByNamePaginated(int pageIndex, int pageSize, string customerName);
    }
}