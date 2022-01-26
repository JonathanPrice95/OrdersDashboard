import React from "react";
import * as ordersService from "@services/ordersService";
import * as orderItemsService from "@services/orderItemsService";
import OrderCard from "@components/orders/OrderCard";
import OrderDetailsCard from "@components/orders/OrderDetailsCard";
import OrderEditModal from "@components/orders/OrderEditModal";
import OrderDetailsModal from "@components/orders/OrderDetailsModal";
import debug from "sabio-debug";
import "rc-pagination/assets/index.css";
import Pagination from "rc-pagination";
import clsx from "clsx";
import swal from "sweetalert";
import toastr from "toastr";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Row,
  Table,
  Button,
  Col,
  Card,
  CardHeader,
  Input,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import { NavLink as NavLinkStrap } from "reactstrap";
import Select from "react-select";
import { Settings, Filter, Circle } from "react-feather";

const _logger = debug.extend("Orders");

const statusOptions = [
  { value: 88, label: "All statuses" },
  { value: 1, label: "Pending" },
  { value: 4, label: "Processing" },
  { value: 2, label: "Completed" },
  { value: 3, label: "Rejected" },
  { value: 5, label: "Cancelled" },
];

toastr.options = {
  closeButton: true,
  debug: false,
  newestOnTop: true,
  progressBar: false,
  positionClass: "toast-top-right",
  preventDuplicates: true,
  onclick: null,
  showDuration: "300",
  hideDuration: "500",
  timeOut: "3000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};

class Orders extends React.Component {
  state = {
    orders: [],
    orderToBeUpdated: {
      total: 0,
      totalPaid: 0,
      baseTotal: 0,
      taxRate: 0,
      taxTotal: 0,
      handling: 0,
      shipping: 0,
      shippingDiscount: 0,
      insurance: 0,
      trackingCode: "",
      trackingUrl: "",
      statusId: 0,
      id: 0,
      isOpen: false,
    },
    orderToDelete: 0,
    orderItemToDelete: 0,
    orderForDetails: {
      isOpen: false,
    },
    orderItemToUpdate: {
      orderId: 0,
      inventoryId: 0,
      productId: 0,
      quantity: 0,
      id: 0,
    },
    pagination: {
      pageIndex: 0,
      pageSize: 5,
      total: 0,
      currentPage: 1,
    },
    searchOpen: false,
    search: "",
    searchFilter: "All Orders",
    searchName: "",
    searchType: "All Orders",
    searchButtonStatus: "Search",
    statusValue: 88,
  };

  componentDidMount() {
    _logger("Orders Component Mounting");
    this.getPaginatedOrders();
  }

  getPaginatedOrders() {
    ordersService
      .paginateOrders(this.state.pagination)
      .then(this.onGetPaginatedOrdersSuccess)
      .catch(this.onGetPaginatedOrdersError);
  }

  onGetPaginatedOrdersSuccess = (response) => {
    var orderArray = response.item.pagedItems;
    let reorganizedArray = orderArray.map(this.mapOrderData);
    _logger("Paginated Orders Array: ", reorganizedArray);
    this.setState((prevState) => {
      let paginationData = { ...prevState.pagination };
      paginationData.total = response.item.totalCount;
      return {
        orders: reorganizedArray.map(this.mapOrders),
        pagination: paginationData,
        searchFilter: "All Orders",
      };
    });
  };

  onGetPaginatedOrdersError = (error) => {
    _logger("Order Error: ", error);
    toastr["error"]("The Application Resource is not Available");
  };

  mapOrderData = (order) => {
    let newDate = new Date(order.dateCreated);
    if (order.dateAdded) {
      newDate = new Date(order.dateAdded);
    }
    let day = newDate.getDate() - 1;
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    let fullYear = month + "/" + day + "/" + year;
    order.dateCreated = fullYear;
    order.statusColor = "neutral-first";
    order.statusTextColor =
      "px-4 py-1 h-auto text-first text-capitalize font-size-sm border-0";
    if (order.statusId === 2) {
      order.statusColor = "neutral-success";
      order.statusTextColor =
        "px-4 py-1 h-auto text-success text-capitalize font-size-sm border-0";
    } else if (order.statusId === 3 || order.statusId === 5) {
      order.statusColor = "neutral-danger";
      order.statusTextColor =
        "px-4 py-1 h-auto text-danger text-capitalize font-size-sm border-0";
    } else if (order.statusId === 4) {
      order.statusColor = "neutral-primary";
      order.statusTextColor =
        "px-4 py-1 h-auto text-primary text-capitalize font-size-sm border-0";
    }
    if (order.location.lineTwo === "") {
      order.address = `${order.location.lineOne}, ${order.location.city}, ${order.location.state.name} ${order.location.zip}`;
    } else {
      order.address = `${order.location.lineOne} ${order.location.lineTwo}, ${order.location.city}, ${order.location.state.name} ${order.location.zip}`;
    }
    return order;
  };

  mapOrders = (order) => {
    return (
      <OrderCard
        key={`Order-${order.id}`}
        orderProp={order}
        onOrderClick={this.onOrderClick}
        onEditClick={this.onEditClick}
        onDeleteClick={this.onDeleteClick}
      />
    );
  };

  onPaginationSizeChange = (size, e) => {
    e.preventDefault();
    _logger("New Page Size is ", size);
    let newCurrentPage = this.state.pagination.currentPage;
    if (size === this.state.pagination.pageSize) {
      return;
    } else {
      newCurrentPage = Math.floor(
        (this.state.pagination.pageSize *
          (this.state.pagination.currentPage - 1)) /
          size
      );
    }
    _logger("The new CurrentPage is ", newCurrentPage + 1);
    this.setState(
      (prevState) => {
        let pagination = { ...prevState.pagination };
        pagination.pageSize = size;
        pagination.currentPage = newCurrentPage + 1;
        pagination.pageIndex = newCurrentPage;
        return { pagination };
      },
      () => {
        if (this.state.searchType === "Name") {
          this.getOrdersByName();
        } else if (this.state.searchType === "Status") {
          this.getStatusFilterOrders(this.state.statusValue);
        } else {
          this.getPaginatedOrders();
        }
      }
    );
  };

  onPageChange = (page) => {
    this.setState(
      (prevState) => {
        let pagination = { ...prevState.pagination };
        pagination.currentPage = page;
        pagination.pageIndex = page - 1;
        return { pagination };
      },
      () => {
        if (this.state.searchType === "Name") {
          this.getOrdersByName();
        } else if (this.state.searchType === "Status") {
          this.getOrdersByStatus();
        } else {
          this.getPaginatedOrders();
        }
      }
    );
  };

  setSearchOpen = (open, e) => {
    e.preventDefault();
    this.setState(() => {
      return {
        searchOpen: open,
      };
    });
  };

  onSearchChange = (e) => {
    this.setState(() => {
      return { search: e.target.value };
    });
  };

  onSearch = () => {
    this.setState((prevState) => {
      let paginationData = { ...prevState.pagination };
      paginationData.pageIndex = 0;
      paginationData.currentPage = 1;
      return {
        pagination: paginationData,
      };
    });
    if (this.state.searchButtonStatus === "Clear") {
      this.setState(
        () => {
          return {
            search: "",
            searchFilter: "All Orders",
            searchName: "",
            searchType: "All Orders",
            searchButtonStatus: "Search",
          };
        },
        () => {
          this.getPaginatedOrders();
        }
      );
    } else {
      let searchParameter = this.state.search;
      _logger("Search String Entered", searchParameter);
      if (searchParameter) {
        _logger("The Search is not null");
        if (isNaN(Number(searchParameter))) {
          _logger("Search By Customer Name", searchParameter);
          this.setState(
            () => {
              return {
                searchName: searchParameter,
              };
            },
            () => {
              _logger("Search By Customer Name:", this.state.searchName);
              this.getOrdersByName();
            }
          );
        } else {
          _logger("Search By Order Number", Number(searchParameter));
          this.getOrdersById(Number(searchParameter));
        }
      }
    }
  };

  getOrdersByName() {
    ordersService
      .getByNameOrder(this.state.pagination, this.state.searchName)
      .then(this.onGetByNameSuccess)
      .catch(this.onGetByIdOrNameError);
  }

  onGetByNameSuccess = (response) => {
    let orderArray = response.item.pagedItems;
    let reorganizedArray = orderArray.map(this.mapOrderData);
    _logger("Paginated Orders Array Search By Name: ", reorganizedArray);
    this.setState((prevState) => {
      let paginationData = { ...prevState.pagination };
      paginationData.total = response.item.totalCount;
      return {
        orders: reorganizedArray.map(this.mapOrders),
        pagination: paginationData,
        searchFilter: `Customer: ${this.state.searchName}`,
        search: "",
        searchType: "Name",
        searchButtonStatus: "Clear",
      };
    });
  };

  getOrdersById(id) {
    ordersService
      .getByIdOrder(id)
      .then(this.onGetByIdSuccess)
      .catch(this.onGetByIdOrNameError);
  }

  onGetByIdSuccess = (response) => {
    var orderArray = [response.item];
    let reorganizedArray = orderArray.map(this.mapOrderData);
    _logger(
      "Paginated Orders Array Search By Order Number: ",
      reorganizedArray
    );
    this.setState((prevState) => {
      let paginationData = { ...prevState.pagination };
      paginationData.total = response.item.totalCount;
      return {
        orders: reorganizedArray.map(this.mapOrders),
        pagination: paginationData,
        searchFilter: `Order #${response.item.id}`,
        search: "",
        searchType: "Number",
        searchButtonStatus: "Clear",
      };
    });
  };

  onGetByIdOrNameError = (error) => {
    _logger("Order Error: ", error);
    toastr["warning"]("Order not found");
    if (this.state.orders[1]) {
      return;
    } else {
      this.getPaginatedOrders();
    }
  };

  onFilterStatus = (e) => {
    let orderStatus = e.value;
    _logger("Status Filter for option:", orderStatus);
    if (orderStatus === 88) {
      if (this.state.statusValue === 88) {
        return;
      } else {
        this.setState(
          (prevState) => {
            let paginationData = { ...prevState.pagination };
            paginationData.pageIndex = 0;
            paginationData.currentPage = 1;
            return {
              pagination: paginationData,
              statusValue: 88,
              searchType: "",
            };
          },
          () => {
            this.getPaginatedOrders();
          }
        );
      }
    } else {
      this.getStatusFilterOrders(orderStatus);
    }
  };

  getStatusFilterOrders(status) {
    _logger("Filtering for Order Status: ", status);
    this.setState(
      (prevState) => {
        let paginationData = { ...prevState.pagination };
        paginationData.pageIndex = 0;
        paginationData.currentPage = 1;
        return {
          pagination: paginationData,
          statusValue: status,
        };
      },
      () => {
        this.getOrdersByStatus();
      }
    );
  }

  getOrdersByStatus() {
    ordersService
      .getByStatusOrder(this.state.pagination, this.state.statusValue)
      .then(this.onGetByStatusSuccess)
      .catch(this.onGetByStatusError);
  }

  onGetByStatusSuccess = (response) => {
    let orderArray = response.item.pagedItems;
    let reorganizedArray = orderArray.map(this.mapOrderData);
    _logger("Paginated Orders Array Filter By Status: ", reorganizedArray);
    this.setState((prevState) => {
      let paginationData = { ...prevState.pagination };
      paginationData.total = response.item.totalCount;
      let orderStatus = reorganizedArray[0].status;
      let orderStatusId = reorganizedArray[0].statusId;
      return {
        orders: reorganizedArray.map(this.mapOrders),
        pagination: paginationData,
        searchFilter: `Order Status: ${orderStatus}`,
        search: "",
        searchType: "Status",
        statusValue: orderStatusId,
        searchButtonStatus: "Search",
        searchName: "",
      };
    });
  };

  onGetByStatusError = (error) => {
    _logger("Get By Order Status Error: ", error);
    toastr["warning"]("Order Status not found");
  };

  onOrderClick = (order) => {
    _logger(`Order Details Clicked, Id#${order.id}`, order);
    this.setState((prevState) => {
      let orderForDetails = { ...prevState.orderForDetails };
      orderForDetails.id = order.id;
      orderForDetails.firstName = order.createdBy.firstName;
      orderForDetails.lastName = order.createdBy.lastName;
      orderForDetails.dateCreated = order.dateCreated;
      orderForDetails.status = order.status;
      orderForDetails.statusColor = order.statusColor;
      orderForDetails.statusTextColor = order.statusTextColor;
      orderForDetails.statusId = order.statusId;
      orderForDetails.total = order.total.toFixed(2);
      orderForDetails.totalPaid = order.totalPaid.toFixed(2);
      orderForDetails.trackingCode = order.trackingCode;
      orderForDetails.trackingUrl = order.trackingUrl;
      orderForDetails.payerId = order.payerId;
      orderForDetails.paymentId = order.paymentId;
      orderForDetails.paymentTypeId = order.paymentTypeId;
      orderForDetails.paymentType = order.paymentType;
      orderForDetails.shippingAddressType = order.location.type.name;
      orderForDetails.address = order.address;
      return { orderForDetails };
    });
    ordersService
      .getDetailsByOrderId(order.id)
      .then(this.onGetDetailsByOrderIdSuccess)
      .catch(this.onGetDetailsByOrderIdError);
  };

  onGetDetailsByOrderIdSuccess = (response) => {
    let orderArray = response.item;
    _logger("Order Details Array: ", orderArray);
    this.setState((prevState) => {
      let orderForDetails = { ...prevState.orderForDetails };
      orderForDetails.length = orderArray.length;
      orderForDetails.isOpen = !prevState.orderForDetails.isOpen;
      return {
        orderForDetails: orderForDetails,
        orderItemCard: orderArray.map(this.mapOrderDetails),
      };
    });
  };

  onGetDetailsByOrderIdError = (error) => {
    _logger("Get Details By Order Id Error: ", error);
    toastr["warning"](
      `No items found for Order #${this.state.orderForDetails.id}`
    );
    this.setState((prevState) => {
      let orderForDetails = { ...prevState.orderForDetails };
      orderForDetails.length = 0;
      orderForDetails.isOpen = !prevState.orderForDetails.isOpen;
      return {
        orderForDetails: orderForDetails,
        orderItemCard: <></>,
      };
    });
  };

  mapOrderDetails = (orderItem) => {
    return (
      <OrderDetailsCard
        key={`OrderItem-${orderItem.id}`}
        orderItemProp={orderItem}
        onEditClick={this.onOrderItemEditClick}
        onDeleteClick={this.onOrderItemDeleteClick}
      />
    );
  };

  toggleOrderDetailsModal = () => {
    _logger("Order Details Modal Toggled");
    this.setState((prevState) => {
      let orderForDetails = { ...prevState.orderForDetails };
      orderForDetails.isOpen = !this.state.orderForDetails.isOpen;
      _logger("Details Modal State:", orderForDetails.isOpen);
      return { orderForDetails };
    });
    if (
      this.state.searchButtonStatus === "Clear" &&
      this.state.searchType === "Number"
    ) {
      this.getOrdersById(this.state.orderForDetails.id);
    } else if (
      this.state.searchButtonStatus === "Clear" &&
      this.state.searchType === "Name"
    ) {
      this.getOrdersByName();
    } else if (this.state.searchType === "Status") {
      this.getOrdersByStatus();
    } else {
      this.getPaginatedOrders();
    }
  };

  onOrderItemEditClick = (orderItem, orderItemData) => {
    _logger(
      `Edit Order Clicked, OrderId: ${orderItem.orderId}, OrderItemId: ${orderItem.id}, InventoryId: ${orderItem.inventoryId}, ProductId: ${orderItem.product.id} Quantity: ${orderItemData.quantity}`
    );
    this.setState(
      (prevState) => {
        let orderItemToUpdate = { ...prevState.orderItemToUpdate };
        orderItemToUpdate.orderId = orderItem.orderId;
        orderItemToUpdate.id = orderItem.id;
        orderItemToUpdate.inventoryId = Number(orderItem.inventoryId);
        orderItemToUpdate.productId = Number(orderItem.product.id);
        orderItemToUpdate.quantity = Number(orderItemData.quantity);
        return { orderItemToUpdate };
      },
      () => {
        orderItemsService
          .updateOrderItem(this.state.orderItemToUpdate)
          .then(this.onUpdateOrderItemSuccess)
          .catch(this.onUpdateOrderItemError);
      }
    );
  };

  onUpdateOrderItemSuccess = (response) => {
    _logger("Order Updated Successfully", response);
    toastr["success"](
      `Order #${this.state.orderItemToUpdate.orderId}, Item #${this.state.orderItemToUpdate.id} updated`
    );
    this.toggleOrderDetailsModal();
  };

  onUpdateOrderItemError = (error) => {
    _logger("Update Error:", error);
    toastr["error"](
      `Unable to update order #${this.state.orderItemToUpdate.orderId}, Item #${this.state.orderItemToUpdate.id}`
    );
  };

  onOrderItemDeleteClick = (orderItem) => {
    swal({
      title: "Are you sure?",
      text: `Once deleted, you will not be able to recover Order Item #${orderItem.id}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.setState(
          () => {
            return { orderItemToDelete: orderItem.id };
          },
          () => {
            orderItemsService
              .deleteOrderItem(orderItem.id)
              .then(this.onDeleteOrderItemSuccess)
              .catch(this.onDeleteOrderItemError);
          }
        );
      } else {
        swal(`Order Item #${orderItem.id} was not deleted`);
        return;
      }
    });
  };

  onDeleteOrderItemSuccess = (response) => {
    _logger(`Order Item #${this.state.orderItemToDelete} Deleted`, response);
    swal(`Order Item #${this.state.orderItemToDelete} Deleted`, {
      icon: "success",
    });
    this.toggleOrderDetailsModal();
    if (this.state.orderForDetails.length === 1) {
      swal({
        title: `There are no items in Order #${this.state.orderForDetails.id}`,
        text: `Click OK to delete this order or cancel to keep this order.`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          this.setState(
            () => {
              return { orderToDelete: this.state.orderForDetails.id };
            },
            () => {
              ordersService
                .deleteOrder(this.state.orderForDetails.id)
                .then(this.onDeleteOrderSuccess)
                .catch(this.onDeleteOrderError);
            }
          );
          this.setState(() => {
            return {
              searchButtonStatus: "Search",
              searchFilter: "All Orders",
              searchName: "",
              searchType: "All Orders",
            };
          });
        } else {
          swal(`Order #${this.state.orderForDetails.id} was not deleted`);
          return;
        }
      });
    }
  };

  onDeleteOrderItemError = (error) => {
    _logger("Order Item Delete Error: ", error);
    toastr["error"](
      `Unable to delete Order Item #${this.state.orderItemToDelete}`
    );
  };

  onEditClick = (order) => {
    _logger(`Update Order Clicked, Id#${order.id}`);
    this.setState((prevState) => {
      let orderToBeUpdated = { ...prevState.orderToBeUpdated };
      orderToBeUpdated.id = order.id;
      orderToBeUpdated.total = order.total;
      orderToBeUpdated.totalPaid = order.totalPaid;
      orderToBeUpdated.baseTotal = order.baseTotal;
      orderToBeUpdated.taxRate = order.taxRate;
      orderToBeUpdated.taxTotal = order.taxTotal;
      orderToBeUpdated.handling = order.handling;
      orderToBeUpdated.shipping = order.shipping;
      orderToBeUpdated.shippingDiscount = order.shippingDiscount;
      orderToBeUpdated.insurance = order.insurance;
      orderToBeUpdated.trackingCode = order.trackingCode;
      orderToBeUpdated.trackingUrl = order.trackingUrl;
      orderToBeUpdated.statusId = order.statusId;
      orderToBeUpdated.payerId = order.payerId;
      orderToBeUpdated.paymentId = order.paymentId;
      orderToBeUpdated.paymentTypeId = order.paymentTypeId;
      orderToBeUpdated.shippingAddressId = order.location.id;
      orderToBeUpdated.isOpen = !prevState.orderToBeUpdated.isOpen;
      return { orderToBeUpdated };
    });
  };

  toggleModal = () => {
    _logger("Order Edit Modal Toggled");
    this.setState((prevState) => {
      let orderToBeUpdated = { ...prevState.orderToBeUpdated };
      orderToBeUpdated.isOpen = !this.state.orderToBeUpdated.isOpen;
      _logger("Edit Order Modal State:", orderToBeUpdated.isOpen);
      return { orderToBeUpdated };
    });
    if (
      this.state.searchButtonStatus === "Clear" &&
      this.state.searchType === "Number"
    ) {
      this.getOrdersById(this.state.orderToBeUpdated.id);
    } else if (
      this.state.searchButtonStatus === "Clear" &&
      this.state.searchType === "Name"
    ) {
      this.getOrdersByName();
    } else if (this.state.searchType === "Status") {
      this.getOrdersByStatus();
    } else {
      this.getPaginatedOrders();
    }
  };

  onDeleteClick = (order) => {
    swal({
      title: "Are you sure?",
      text: `Once deleted, you will not be able to recover order #${order.id}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.setState(
          () => {
            return { orderToDelete: order.id };
          },
          () => {
            ordersService
              .deleteOrder(order.id)
              .then(this.onDeleteOrderSuccess)
              .catch(this.onDeleteOrderError);
          }
        );
      } else {
        swal(`Order #${order.id} was not deleted`);
        return;
      }
    });
  };

  onDeleteOrderSuccess = (response) => {
    _logger(`Order #${this.state.orderToDelete} Deleted`, response);
    this.getPaginatedOrders();
    swal(`Order #${this.state.orderToDelete} Deleted`, {
      icon: "success",
    });
  };

  onDeleteOrderError = (error) => {
    _logger("Order Error: ", error);
    toastr["error"](`Unable to delete order #${this.state.orderToDelete}`);
  };

  render() {
    return (
      <React.Fragment>
        <Card className="card-box mb-5">
          <CardHeader className="d-flex align-items-center justify-content-between card-header-alt p-4">
            <div className={clsx("", { "d-none": this.state.searchOpen })}>
              <h6 className="font-weight-bold font-size-lg mb-0 text-black">
                {this.state.searchFilter}
              </h6>
            </div>
            <div
              className={clsx("d-flex align-items-center", {
                "w-100": this.state.searchOpen,
              })}
            >
              <div
                className={clsx("search-wrapper search-wrapper--grow w-100", {
                  "is-active": this.state.searchOpen,
                })}
              >
                <span className="icon-wrapper text-black">
                  <FontAwesomeIcon icon={["fas", "search"]} />
                </span>
                <Input
                  type="search"
                  onChange={(e) => this.onSearchChange(e)}
                  onFocus={(e) => this.setSearchOpen(true, e)}
                  onBlur={(e) => this.setSearchOpen(false, e)}
                  placeholder="Search orders..."
                />
              </div>
              <Button
                className="btn btn-dark ml-3"
                color="neutral-primary"
                type="button"
                onClick={this.onSearch}
              >
                {this.state.searchButtonStatus}
              </Button>
            </div>
          </CardHeader>
          <div className="divider" />
          <div className="divider" />
          <div className="d-flex align-items-center justify-content-between px-4 py-3">
            <UncontrolledDropdown>
              <DropdownToggle
                size="sm"
                outline
                color="primary"
                className="d-flex align-items-center justify-content-center mr-2"
              >
                <Filter className="w-50" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-lg p-0">
                <div className="p-3">
                  <Row>
                    <Col>
                      <small className="font-weight-bold pb-2 text-uppercase text-primary d-block">
                        Status
                      </small>
                      <Select
                        name="statusTypeId"
                        placeholer="Select..."
                        options={statusOptions}
                        onChange={(e) => this.onFilterStatus(e)}
                      ></Select>
                    </Col>
                  </Row>
                </div>
                <div className="divider" />
              </DropdownMenu>
            </UncontrolledDropdown>
            <UncontrolledDropdown>
              <DropdownToggle
                size="sm"
                outline
                color="primary"
                className="d-flex align-items-center justify-content-center"
              >
                <Settings className="w-50" />
              </DropdownToggle>
              <DropdownMenu
                right
                className="dropdown-menu-lg overflow-hidden p-0"
              >
                <div className="font-weight-bold px-4 pt-3">Results</div>
                <Nav className="nav-neutral-first nav-pills-rounded flex-column p-2">
                  <NavItem>
                    <NavLinkStrap
                      onClick={(e) => this.onPaginationSizeChange(5, e)}
                    >
                      <div className="nav-link-icon mr-2">
                        <Circle />
                      </div>
                      <span className="font-size-md">
                        <b>5</b> results per page
                      </span>
                    </NavLinkStrap>
                  </NavItem>
                  <NavItem>
                    <NavLinkStrap
                      onClick={(e) => this.onPaginationSizeChange(15, e)}
                    >
                      <div className="nav-link-icon mr-2">
                        <Circle />
                      </div>
                      <span className="font-size-md">
                        <b>15</b> results per page
                      </span>
                    </NavLinkStrap>
                  </NavItem>
                  <NavItem>
                    <NavLinkStrap
                      onClick={(e) => this.onPaginationSizeChange(30, e)}
                    >
                      <div className="nav-link-icon mr-2">
                        <Circle />
                      </div>
                      <span className="font-size-md">
                        <b>30</b> results per page
                      </span>
                    </NavLinkStrap>
                  </NavItem>
                </Nav>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
          <div className="divider" />
          <div className="pt-4 px-4">
            <Table responsive className="table-alternate-spaced mb-0">
              <thead className="thead-light text-capitalize font-size-sm font-weight-bold">
                <tr>
                  <th className="text-left px-4">Order #</th>
                  <th className="text-left">Customer</th>
                  <th className="text-left">Order Amount</th>
                  <th className="text-left">Payment Info</th>
                  <th className="text-left">Tracking #</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <>{this.state.orders}</>
              </tbody>
            </Table>
          </div>
          <div className="divider mt-3" />
          <div className="card-footer p-4 d-flex justify-content-center">
            <Pagination
              onChange={this.onPageChange}
              current={this.state.pagination.currentPage}
              pageSize={this.state.pagination.pageSize}
              total={this.state.pagination.total}
              hideOnSinglePage={true}
            />
          </div>
        </Card>
        <OrderEditModal
          orderProp={this.state.orderToBeUpdated}
          toggleModal={this.toggleModal}
        ></OrderEditModal>
        <OrderDetailsModal
          orderProp={this.state.orderForDetails}
          toggleModal={this.toggleOrderDetailsModal}
          orderCardProp={this.state.orderItemCard}
        ></OrderDetailsModal>
      </React.Fragment>
    );
  }
}

Orders.propTypes = {
  pagination: PropTypes.shape({
    pageIndex: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
  }),
};

export default Orders;
