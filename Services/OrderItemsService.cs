using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Orders;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class OrderItemsService : UserMapperService, IOrderItemsService
    {
        IDataProvider _data = null;

        IUserMapper _mapUser = null;
        public OrderItemsService(IDataProvider data, IUserMapper mapUser)
        {
            _data = data;
            _mapUser = mapUser;
        }

        public int Add(OrderItemAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[OrderItems_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@CreatedBy", userId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCol)
            {
                object oId = returnCol["@Id"].Value;

                int.TryParse(oId.ToString(), out id);
            });

            return id;
        }
        public void Update(OrderItemUpdateRequest model, int userId)
        {
            string procName = "[dbo].[OrderItems_Update]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@ModifiedBy", userId);
                col.AddWithValue("@Id", model.Id);
                col.AddWithValue("@InventoryId", model.InventoryId);
            }, returnParameters: null);
        }
        public OrderItem DeleteOrderItem(int id, int userId)
        {
            string procName = "[dbo].[OrderItems_Delete_ById]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
                col.AddWithValue("@ModifiedBy", userId);
            });
            return null;
        }
        public List<OrderItem> GetOrderItems(int id)
        {
            string procName = "[dbo].[OrderItems_Select_ById]";

            List<OrderItem> list = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@OrderId", id);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                OrderItem anItem = MapOrderItems(reader, ref startingIndex);

                if (list == null)
                {
                    list = new List<OrderItem>();
                }
                list.Add(anItem);
            });
            return list;
        }
        public Paged<OrderItem> GetOrderItemsPaginated(int pageIndex, int pageSize)
        {
            string procName = "[dbo].[OrderItems_SelectAll_Paginated]";

            Paged<OrderItem> pagedList = null;
            List<OrderItem> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                OrderItem anItem = MapOrderItems(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<OrderItem>();
                }
                list.Add(anItem);
            });
            if (list != null)
            {
                pagedList = new Paged<OrderItem>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        public Paged<OrderItem> GetOrderItemsCreatedByPaginated(int pageIndex, int pageSize, int createdBy)
        {
            string procName = "[dbo].[OrderItems_Select_ByCreatedBy_Paginated]";

            Paged<OrderItem> pagedList = null;
            List<OrderItem> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
                paramCollection.AddWithValue("@CreatedBy", createdBy);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                OrderItem anItem = MapOrderItems(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<OrderItem>();
                }
                list.Add(anItem);
            });
            if (list != null)
            {
                pagedList = new Paged<OrderItem>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }
        private static void AddCommonParams(OrderItemAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@OrderId", model.OrderId);
            col.AddWithValue("@ProductId", model.ProductId);
            col.AddWithValue("@Quantity", model.Quantity);
        }
        private OrderItem MapOrderItems(IDataReader reader, ref int startingIndex)
        {
            OrderItem anItem = null;
            anItem = new OrderItem();
            anItem.Id = reader.GetSafeInt32(startingIndex++);
            anItem.OrderId = reader.GetSafeInt32(startingIndex++);
            anItem.InventoryId = reader.GetSafeInt32(startingIndex++);
            anItem.Quantity = reader.GetSafeInt32(startingIndex++);
            anItem.DateAdded = reader.GetSafeDateTime(startingIndex++);
            anItem.DateModified = reader.GetSafeDateTime(startingIndex++);
            anItem.CreatedBy = _mapUser.MapUser(reader, ref startingIndex);
            anItem.ModifiedBy = _mapUser.MapUser(reader, ref startingIndex);
            return anItem;
        }

    }
}
