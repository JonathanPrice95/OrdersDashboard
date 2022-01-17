using Sabio.Models;
using Sabio.Models.Domain;
using System.Collections.Generic;

namespace Sabio.Services
{
    public interface IOrderDetailsService
    {
        List<OrderDetail> GetOrderDetails(int id);

        Paged<OrderDetail> GetOrderDetailsPaginated(int pageIndex, int pageSize);
    }
}