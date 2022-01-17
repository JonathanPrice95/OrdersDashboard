import axios from "axios";
import debug from "sabio-debug";
import {
  API_HOST_PREFIX,
  onGlobalError,
  onGlobalSuccess,
} from "./serviceHelpers";

const _logger = debug.extend("orderItemsService");

var endpoint = `${API_HOST_PREFIX}/api/orders/items`;

const createOrderItem = (payload) => {
  _logger("Add an Order Item is Firing");
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

const updateOrderItem = (payload) => {
  _logger("Update an Order Item is Firing", payload);
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

const deleteOrderItem = (payload) => {
  _logger("Delete an Order Item is Firing", payload);
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

const getByIdOrderItem = (payload) => {
  _logger("Get by Order Item by Order Id is Firing");
  const config = {
    method: "GET",
    url: `${endpoint}/${payload.id}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const paginateOrderItems = (payload) => {
  _logger("Get all Order Items (paginated) is Firing");
  const config = {
    method: "GET",
    url: `${endpoint}/paginate/?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getCreatedByOrderItem = (payload) => {
  _logger("Get Order Items by Created By (paginated) is Firing");
  const config = {
    method: "GET",
    url: `${endpoint}/${payload.id}/paginate/?pageIndex=${payload.pageIndex}&pageSize=${payload.pageSize}`,
    withCredentials: true,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export { createOrderItem, updateOrderItem, deleteOrderItem, getByIdOrderItem, paginateOrderItems, getCreatedByOrderItem   };