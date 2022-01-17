using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Orders;
using Sabio.Models.Requests.ShoppingCart;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class OrdersService : IOrdersService
    {
        IDataProvider _data = null;

        IUserMapper _mapUser = null;

        ILocationService _mapLocation = null;

        public OrdersService(IDataProvider data, IUserMapper mapUser, ILocationService mapLocation)
        {
            _data = data;
            _mapUser = mapUser;
            _mapLocation = mapLocation;
        }

        public int Add(OrderAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Orders_Insert_V2]";

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

        public int AddFromShoppingCart(OrderAddFromCartRequest model, int userId)
        {
            DataTable myParamValue = null;

            if(model.Items != null)
            {
                myParamValue = MapOrderItemsToTable(model.Items, userId);
            }

            int id = 0;

            string procName = "[dbo].[Orders_InsertByShoppingCart]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection sqlParams)
            {
                AddShoppingCartParams(model, userId, sqlParams, myParamValue);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                sqlParams.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnParam)
            {
                object oId = returnParam["@Id"].Value;

                int.TryParse(oId.ToString(), out id);
            });

            return id;
        }

        public void Update(OrderUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Orders_Update]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@StatusId", model.StatusId);
                col.AddWithValue("@TotalPaid", model.TotalPaid);
                col.AddWithValue("@BaseTotal", model.BaseTotal);
                col.AddWithValue("@TaxTotal", model.TaxTotal);
                col.AddWithValue("@TaxRate", model.TaxRate);
                col.AddWithValue("@Handling", model.Handling);
                col.AddWithValue("@Shipping", model.Shipping);
                col.AddWithValue("@ShippingDiscount", model.ShippingDiscount);
                col.AddWithValue("@Insurance", model.Insurance);
                col.AddWithValue("@ModifiedBy", userId);
                col.AddWithValue("@Id", model.Id);
            }, returnParameters: null);
        }

        public Order Delete(int id, int userId)
        {
            string procName = "[dbo].[Orders_Delete_ById]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
                col.AddWithValue("@ModifiedBy", userId);
            });
            return null;
        }

        public Order Get(int id)
        {
            string procName = "[dbo].[Orders_Select_ById]";

            Order anOrder = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
                {
                    paramCollection.AddWithValue("@Id", id);
                }, delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    anOrder = MapOrders(reader, ref startingIndex);
                }
                );
            return anOrder;
        }

        public Paged<Order> GetOrderCreatedByPaginated(int pageIndex, int pageSize, int createdBy)
        {
            string procName = "[dbo].[Orders_Select_ByCreatedBy_Paginated]";

            Paged<Order> pagedList = null;
            List<Order> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {   
                paramCollection.AddWithValue("@CreatedBy", createdBy);
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Order anItem = MapOrders(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Order>();
                }
                list.Add(anItem);
            });
            if (list != null)
            {
                pagedList = new Paged<Order>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<Order> GetOrderByStatusPaginated(int pageIndex, int pageSize, int statusId)
        {
            string procName = "[dbo].[Orders_Select_ByStatusId_Paginated]";

            Paged<Order> pagedList = null;
            List<Order> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@StatusId", statusId);
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Order anItem = MapOrders(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Order>();
                }
                list.Add(anItem);
            });
            if (list != null)
            {
                pagedList = new Paged<Order>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<Order> GetOrderByNamePaginated(int pageIndex, int pageSize, string customerName)
        {
            string procName = "[dbo].[Orders_Select_ByName_Paginated]";

            Paged<Order> pagedList = null;
            List<Order> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Name", customerName);
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Order anItem = MapOrders(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Order>();
                }
                list.Add(anItem);
            });
            if (list != null)
            {
                pagedList = new Paged<Order>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<Order> GetOrdersPaginated(int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Orders_SelectAll_Paginated]";

            Paged<Order> pagedList = null;
            List<Order> myOrders = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@PageIndex", pageIndex);
                parameterCollection.AddWithValue("@PageSize", pageSize);

            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Order anOrder = MapOrders(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (myOrders == null)
                {
                    myOrders = new List<Order>();
                }
                myOrders.Add(anOrder);
            });
            if(myOrders != null)
            {
                pagedList = new Paged<Order>(myOrders, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        private static void AddCommonParams(OrderAddRequest model, SqlParameterCollection col)
        {
            if(model.TrackingCode == null)
            {
                model.TrackingCode = "";
            }
            if (model.TrackingUrl == null)
            {
                model.TrackingUrl = "";
            }
            col.AddWithValue("@Total", model.Total);
            col.AddWithValue("@TrackingCode", model.TrackingCode);
            col.AddWithValue("@TrackingUrl", model.TrackingUrl);
            col.AddWithValue("@ShippingAddressId", model.ShippingAddressId);
            col.AddWithValue("@PayerId", model.PayerId);
            col.AddWithValue("@PaymentId", model.PaymentId);
            col.AddWithValue("@PaymentTypeId", model.PaymentTypeId);
        }

        private static void AddShoppingCartParams(OrderAddFromCartRequest model, int userId, SqlParameterCollection sqlParams, DataTable myParamValue)
        {
            sqlParams.AddWithValue("@LocationTypeId", model.LocationTypeId);
            sqlParams.AddWithValue("@LineOne", model.LineOne);
            sqlParams.AddWithValue("@LineTwo", model.LineTwo);
            sqlParams.AddWithValue("@City", model.City);
            sqlParams.AddWithValue("@ZIP", model.Zip);
            sqlParams.AddWithValue("@StateShort", model.StateShort);
            sqlParams.AddWithValue("@Latitude", model.Latitude);
            sqlParams.AddWithValue("@Longitude", model.Longitude);
            sqlParams.AddWithValue("@CreatedBy", userId);
            sqlParams.AddWithValue("@Total", model.Total);
            sqlParams.AddWithValue("@TrackingCode", model.TrackingCode);
            sqlParams.AddWithValue("@TrackingUrl", model.TrackingUrl);
            sqlParams.AddWithValue("@PayerId", model.PayerId);
            sqlParams.AddWithValue("@PaymentId", model.PaymentId);
            sqlParams.AddWithValue("@PaymentTypeId", model.PaymentTypeId);
            sqlParams.AddWithValue("@BaseTotal", model.BaseTotal);
            sqlParams.AddWithValue("@TaxTotal", model.TaxTotal);
            sqlParams.AddWithValue("@Handling", model.Handling);
            sqlParams.AddWithValue("@Shipping", model.Shipping);
            sqlParams.AddWithValue("@ShippingDiscount", model.ShippingDiscount);
            sqlParams.AddWithValue("@Insurance", model.Insurance);
            sqlParams.AddWithValue("@ReferenceUrl", model.ReferenceUrl);
            sqlParams.AddWithValue("@PayerEmail", model.PayerEmail);
            sqlParams.AddWithValue("@PayerFirstName", model.PayerFirstName);
            sqlParams.AddWithValue("@PayerLastName", model.PayerLastName);
            sqlParams.AddWithValue("@PaymentStatus", model.PaymentStatus);
            sqlParams.AddWithValue("@PaymentStatusId", model.PaymentStatusId);
            sqlParams.AddWithValue("@BatchItems", myParamValue);
        }

        private DataTable MapOrderItemsToTable(List<OrderItemAddFromCartRequest> itemsToMap, int userId)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("OrderId", typeof(Int32));
            dt.Columns.Add("ProductId", typeof(Int32));
            dt.Columns.Add("Quantity", typeof(Int32));
            dt.Columns.Add("CreatedBy", typeof(Int32));
            dt.Columns.Add("ModifiedBy",typeof(Int32));

            foreach (OrderItemAddFromCartRequest singleItem in itemsToMap)
            {
                DataRow dr = dt.NewRow();
                int startingIndex = 0;

                dr.SetField(startingIndex++, 0);
                dr.SetField(startingIndex++, singleItem.ProductId);
                dr.SetField(startingIndex++, singleItem.Quantity);
                dr.SetField(startingIndex++, userId);
                dr.SetField(startingIndex++, userId);

                dt.Rows.Add(dr);
            }
            return dt;
        }

        private Order MapOrders(IDataReader reader, ref int startingIndex)
        {
            Order anOrder = new Order();
            anOrder.Id = reader.GetSafeInt32(startingIndex++);
            anOrder.Total = reader.GetSafeDecimal(startingIndex++);
            anOrder.TrackingCode = reader.GetSafeString(startingIndex++);
            anOrder.TrackingUrl = reader.GetSafeString(startingIndex++);
            anOrder.PayerId = reader.GetSafeString(startingIndex++);
            anOrder.PaymentId = reader.GetSafeString(startingIndex++);
            anOrder.PaymentTypeId = reader.GetSafeInt32(startingIndex++);
            anOrder.PaymentType = reader.GetSafeString(startingIndex++);
            anOrder.StatusId = reader.GetSafeInt32(startingIndex++);
            anOrder.Status = reader.GetSafeString(startingIndex++);
            anOrder.DateCreated = reader.GetSafeDateTime(startingIndex++);
            anOrder.DateModified = reader.GetSafeDateTime(startingIndex++);
            anOrder.CreatedBy = _mapUser.MapUser(reader, ref startingIndex);
            anOrder.ModifiedBy = _mapUser.MapUser(reader, ref startingIndex);
            anOrder.Location = _mapLocation.MapLocation(reader, ref startingIndex);
            anOrder.TotalPaid = reader.GetSafeDecimal(startingIndex++);
            anOrder.BaseTotal = reader.GetSafeDecimal(startingIndex++);
            anOrder.TaxTotal = reader.GetSafeDecimal(startingIndex++);
            anOrder.TaxRate = reader.GetSafeDecimal(startingIndex++);
            anOrder.Handling = reader.GetSafeDecimal(startingIndex++);
            anOrder.Shipping = reader.GetSafeDecimal(startingIndex++);
            anOrder.ShippingDiscount = reader.GetSafeDecimal(startingIndex++);
            anOrder.Insurance = reader.GetSafeDecimal(startingIndex++);
            return anOrder;
        }

    }
}
