using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Orders;
using Sabio.Models.Requests.ShoppingCart;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrderApiController : BaseApiController
    {
       private IOrdersService _service = null;
       private IOrderItemsService _orderItemsService = null;
        private IOrderDetailsService _orderDetailsService = null;
        private IAuthenticationService<int> _authService = null;
       public OrderApiController(IOrdersService service
           , IOrderItemsService orderItemsService
           , IOrderDetailsService orderDetailsService
           , ILogger<OrderApiController> logger
           , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _orderItemsService = orderItemsService;
            _orderDetailsService = orderDetailsService;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Add(OrderAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                int id = _service.Add(model, userId);

                ItemResponse<int> response = new ItemResponse<int> { Item = id };

                result = StatusCode(201, response);

            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }

            return result;
        }

        [HttpPost("shoppingcart")]
        public ActionResult<ItemResponse<int>> AddFromShoppingCart(OrderAddFromCartRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                int id = _service.AddFromShoppingCart(model, userId);

                ItemResponse<int> response = new ItemResponse<int> { Item = id };

                result = StatusCode(201, response);

            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }

            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(OrderUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                _service.Update(model, userId);

                response = new SuccessResponse();

            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                _service.Delete(id, userId);

                response = new SuccessResponse();
            }
            catch(Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response= new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Order>> Get(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Order anOrder = _service.Get(id);

                if (anOrder == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Order> { Item = anOrder };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<Order>>> GetOrdersPaginated(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Order> paged = _service.GetOrdersPaginated(pageIndex, pageSize);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application Resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Order>> { Item = paged };
                }
            }
            catch(Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}"); 
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code,response);
        }

        [HttpGet("{createdBy:int}/paginate")]
        public ActionResult<ItemResponse<Paged<Order>>> GetOrderCreatedByPaginated(int pageIndex, int pageSize, int createdBy)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Order> paged = _service.GetOrderCreatedByPaginated(pageIndex, pageSize, createdBy);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application Resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Order>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("status/{statusId:int}/paginate")]
        public ActionResult<ItemResponse<Paged<Order>>> GetOrderByStatusPaginated(int pageIndex, int pageSize, int statusId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Order> paged = _service.GetOrderByStatusPaginated(pageIndex, pageSize, statusId);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application Resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Order>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("customer/search")]
        public ActionResult<ItemResponse<Paged<Order>>> GetOrderByNamePaginated(int pageIndex, int pageSize, string customer)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Order> paged = _service.GetOrderByNamePaginated(pageIndex, pageSize, customer);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application Resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<Order>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpPost("items")]
        public ActionResult<ItemResponse<int>> Add(OrderItemAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                int id = _orderItemsService.Add(model, userId);

                ItemResponse<int> response = new ItemResponse<int> { Item = id };

                result = StatusCode(201, response);

            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }

            return result;
        }

        [HttpPut("items/{id:int}")]
        public ActionResult<SuccessResponse> Update(OrderItemUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                _orderItemsService.Update(model, userId);

                response = new SuccessResponse();

            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpDelete("items/{id:int}")]
        public ActionResult<SuccessResponse> DeleteOrderItem(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();

                _orderItemsService.DeleteOrderItem(id, userId);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }

        [HttpGet("items/{id:int}")]
        public ActionResult<ItemResponse<List<OrderItem>>> GetOrderItems(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<OrderItem> orderItems = _orderItemsService.GetOrderItems(id);

                if (orderItems == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<List<OrderItem>> { Item = orderItems };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("items/paginate")]
        public ActionResult<ItemResponse<Paged<OrderItem>>> GetOrderItemsPaginated(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<OrderItem> paged = _orderItemsService.GetOrderItemsPaginated(pageIndex, pageSize);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application Resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<OrderItem>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("items/{createdBy:int}/paginate")]
        public ActionResult<ItemResponse<Paged<OrderItem>>> GetOrderItemsCreatedByPaginated(int pageIndex, int pageSize, int createdBy)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<OrderItem> paged = _orderItemsService.GetOrderItemsCreatedByPaginated(pageIndex, pageSize, createdBy);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application Resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<OrderItem>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("details/{id:int}")]
        public ActionResult<ItemResponse<List<OrderDetail>>> GetOrderDetails(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<OrderDetail> orderDetails = _orderDetailsService.GetOrderDetails(id);

                if (orderDetails == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<List<OrderDetail>> { Item = orderDetails };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpGet("details/paginate")]
        public ActionResult<ItemResponse<Paged<OrderDetail>>> GetOrderDetailsPaginated(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<OrderDetail> paged = _orderDetailsService.GetOrderDetailsPaginated(pageIndex, pageSize);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application Resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<OrderDetail>> { Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: {ex.Message}");
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
    }
}
