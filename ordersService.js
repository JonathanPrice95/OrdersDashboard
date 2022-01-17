import axios from "axios";
import debug from "sabio-debug";
import {
  API_HOST_PREFIX,
  onGlobalError,
  onGlobalSuccess,
} from "./serviceHelpers";

const _logger = debug.extend("OrdersService");

var endpoint = `${API_HOST_PREFIX}/api/orders`;

const createOrder = (payload) => {
  _logger("Add Order is Firing");
  const config = {
    method: "POST",
    url: endpoint,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const createOrderFromCart = (payload) => {
  _logger("Add Order is Firing");
  const config = {
    method: "POST",
    url: `${endpoint}/shoppingcart`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const updateOrder = (payload) => {
  _logger("Update Order is Firing");
  const config = {
    method: "PUT",
    url: `${endpoint}/${payload.id}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const deleteOrder = (payload) => {
  _logger("Delete Order is Firing");
  const config = {
    method: "DELETE",
    url: `${endpoint}/${payload}`,
    data: payload,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const getByIdOrder = (payload) => {
  _logger("Get by Order Id is Firing", payload);
  const config = {
    method: "GET",
    url: `${endpoint}/${payload}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const paginateOrders = (payload) => {
  _logger("Get all Orders (paginated) is Firing");
  const config = {
    method: "GET",
    url: `${endpoint}/paginate/?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByCreatedByOrder = (payload) => {
  _logger("Get Orders by Created By (paginated) is Firing");
  const config = {
    method: "GET",
    url: `${endpoint}/${payload.id}/paginate/?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByStatusOrder = (payload, id) => {
  _logger("Get Orders by Status (paginated) is Firing");
  const config = {
    method: "GET",
    url: `${endpoint}/status/${id}/paginate/?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getByNameOrder = (payload, searchParameter) => {
  _logger("Get Orders by customer Name (paginated) is Firing");
  const config = {
    method: "GET",
    url: `${endpoint}/customer/search/?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}&customer=${searchParameter}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getDetailsByOrderId = (payload) => {
  _logger("Get Order Details by Order Id is Firing");
  const config = {
    method: "GET",
    url: `${endpoint}/details/${payload}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export { createOrder, createOrderFromCart, updateOrder, deleteOrder, getByIdOrder, paginateOrders, getByCreatedByOrder, getByStatusOrder, getByNameOrder, getDetailsByOrderId };
