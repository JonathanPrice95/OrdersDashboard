using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class OrderDetailsService : IOrderDetailsService
    {
        IDataProvider _data = null;

        IUserMapper _mapUser = null;

        IProductService _mapProduct = null;

        public OrderDetailsService(IDataProvider data, IUserMapper mapUser, IProductService mapProduct)
        {
            _data = data;
            _mapUser = mapUser;
            _mapProduct = mapProduct;
        }
        public List<OrderDetail> GetOrderDetails(int id)
        {
            string procName = "[dbo].[OrderDetails_Select_ByOrderId]";

            List<OrderDetail> list = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@OrderId", id);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                OrderDetail anOrderDetail = MapOrderDetails(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<OrderDetail>();
                }
                list.Add(anOrderDetail);
            });
            return list;
        }

        public Paged<OrderDetail> GetOrderDetailsPaginated(int pageIndex, int pageSize)
        {
            string procName = "[dbo].[OrderDetails_SelectAll_Paginated]";

            Paged<OrderDetail> pagedList = null;
            List<OrderDetail> myOrderDetails = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@PageIndex", pageIndex);
                parameterCollection.AddWithValue("@PageSize", pageSize);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                OrderDetail anOrder = MapOrderDetails(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (myOrderDetails == null)
                {
                    myOrderDetails = new List<OrderDetail>();
                }
                myOrderDetails.Add(anOrder);
            });
            if (myOrderDetails != null)
            {
                pagedList = new Paged<OrderDetail>(myOrderDetails, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        private OrderDetail MapOrderDetails(IDataReader reader, ref int startingIndex)
        {
            OrderDetail anOrderDetail = new OrderDetail();
            anOrderDetail.Id = reader.GetSafeInt32(startingIndex++);
            anOrderDetail.OrderId = reader.GetSafeInt32(startingIndex++);
            anOrderDetail.InventoryId = reader.GetSafeInt32(startingIndex++);
            anOrderDetail.Quantity = reader.GetSafeInt32(startingIndex++);
            anOrderDetail.UnitCost = reader.GetSafeDecimal(startingIndex++);
            anOrderDetail.DateAdded = reader.GetSafeDateTime(startingIndex++);
            anOrderDetail.DateModified = reader.GetSafeDateTime(startingIndex++);
            anOrderDetail.CreatedBy = _mapUser.MapUser(reader, ref startingIndex);
            anOrderDetail.CreatedByEmail = reader.GetSafeString(startingIndex++);
            anOrderDetail.ModifiedBy = _mapUser.MapUser(reader, ref startingIndex);
            anOrderDetail.ModifiedByEmail = reader.GetSafeString(startingIndex++);
            anOrderDetail.Product = _mapProduct.MapProduct(reader, ref startingIndex);
            return anOrderDetail;
        }
    }
}
