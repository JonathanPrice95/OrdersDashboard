import React, { useState } from "react";
import * as orderItemsService from "@services/orderItemsService";
import { Card, Col, Row, Button, Badge, Input, Modal } from "reactstrap";
import hero4 from "@assets/images/hero-bg/hero-4.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import toastr from "toastr";

const _logger = debug.extend("OrderDetailModal");

const OrderDetailsModal = (props) => {
  _logger("Order Details Modal Firing");
  const order = props.orderProp;
  const orderItemCard = props.orderCardProp;

  const [newOrderItemData, setNewOrderItemData] = useState({
    orderId: order.id,
    quantity: 0,
    productId: 0,
    quantityValid: "",
    productIdValid: "",
  });

  const toggleModal = function () {
    props.toggleModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    _logger("New Value:", value);
    let validationMessage = { ...newOrderItemData };
    let isInteger = Number.isInteger(Number(value));
    let isPositive = Number(value) >= 1;
    let newValue = Number(value) - (Number(value) - Math.floor(Number(value)));
    _logger(`Integer: ${isInteger}, Positive: ${isPositive}`);
    if ((name === "quantity") & (!isPositive || !isInteger)) {
      validationMessage.quantityValid = "Enter a positive whole number";
    } else if ((name === "quantity") & isPositive & isInteger) {
      validationMessage.quantityValid = "";
    } else if ((name === "productId") & (!isPositive || !isInteger)) {
      validationMessage.productIdValid = "Enter a positive whole number";
    } else if ((name === "productId") & isPositive & isInteger) {
      validationMessage.productIdValid = "";
    }
    setNewOrderItemData((prevState) => ({
      ...prevState,
      [name]: newValue,
      orderId: order.id,
      quantityValid: validationMessage.quantityValid,
      productIdValid: validationMessage.productIdValid,
    }));
  };

  const handleSubmit = () => {
    _logger(
      `Add Order Item Submitted. Order#${newOrderItemData.orderId}, Product #${newOrderItemData.productId}, Quantity: ${newOrderItemData.quantity}`
    );
    if (
      newOrderItemData.quantityValid !== "" ||
      newOrderItemData.productIdValid !== "" ||
      newOrderItemData.quantity === 0 ||
      newOrderItemData.productId === 0
    ) {
      return;
    }
    orderItemsService
      .createOrderItem(newOrderItemData)
      .then(onCreateOrderItemSuccess)
      .catch(onCreateOrderItemError);
  };

  const onCreateOrderItemSuccess = (response) => {
    _logger("Order Updated Successfully", response);
    toastr["success"](`Order #${order.id} updated`);
    toggleModal();
  };

  const onCreateOrderItemError = (error) => {
    _logger("Update Error:", error);
    toastr["error"](
      `Unable to add Product #${newOrderItemData.productId} with Quantity ${newOrderItemData.quantity} to Order #${order.id}`
    );
  };

  return (
    <React.Fragment>
      <Modal
        zIndex={2000}
        centered
        size="xl"
        isOpen={order.isOpen}
        toggle={toggleModal}
        contentClassName="border-0 p-4 p-lg-5"
      >
        <Row>
          <Card className="col-12 card-box p-1 mb-1">
            <div className="hero-wrapper bg-composed-wrapper bg-deep-sky h-100 rounded-top m-3">
              <div className="flex-grow-1 w-100 d-flex">
                <div
                  className="bg-composed-wrapper--image rounded br-xl-right-0"
                  style={{ backgroundImage: "url(" + hero4 + ")" }}
                />
                <div className="bg-composed-wrapper--bg bg-second opacity-3 rounded br-xl-right-0" />
                <div className="bg-composed-wrapper--content text-center p-6">
                  <div className="text-white">
                    <div className="row d-flex justify-content-between">
                      <div className="col-2 m-3">
                        <h4 className="font-weight-bold">Order #{order.id}</h4>
                      </div>
                      <div className="col-2 m-3">
                        <Badge
                          className={order.statusTextColor}
                          color={order.statusColor}
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <div className="col-2 m-2">
                        <Button
                          tag="a"
                          href="#/"
                          onClick={toggleModal}
                          color="primary"
                          className="font-weight-bold rounded-lg px-4 btn-gradient shadow-none bg-vicious-stance"
                        >
                          <span className="btn-wrapper--label text-uppercase">
                            Close
                          </span>
                        </Button>
                      </div>
                    </div>
                    <div className="divider" />
                    <div className="table-alternate-spaced mb-0 p-2">
                      <div className="thead-light font-size-m text-white text-left">
                        <div className="d-flex w-100 justify-content-between">
                          <p className="col-sm text-left">Customer</p>
                          <p className="col-sm text-left">Order Date</p>
                          <p className="col-sm text-left">Total/Paid</p>
                          <p className="col-sm text-left">Payment Info</p>
                          <p className="col-sm text-left">Tracking Info</p>
                          <p className="col-sm text-left">Shipping Address</p>
                        </div>
                      </div>
                      <div className="font-size-m text-white-50 text-left">
                        <div className="d-flex w-100 justify-content-between">
                          <div className="col-sm text-left">
                            <div className="font-size-sm">
                              {order.firstName} {order.lastName}
                            </div>
                          </div>
                          <div className="col-sm text-left">
                            <div className="font-size-sm">
                              {order.dateCreated}
                            </div>
                          </div>
                          <div className="col-sm text-left">
                            <div className="font-size-sm pl-2">
                              ${order.total}/$
                              {order.totalPaid}
                            </div>
                          </div>
                          <div className="col-sm text-left">
                            <div className="font-size-sm">
                              {order.paymentId}
                            </div>
                            <div className="font-size-sm">
                              {order.paymentType}
                            </div>
                          </div>
                          <div className="col-sm text-left">
                            <div className="font-size-sm">
                              {order.trackingCode}
                            </div>
                            <div className="font-size-sm">
                              {order.trackingUrl}
                            </div>
                          </div>
                          <div className="col-sm text-left">
                            <div className="font-size-sm">{order.address}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hero-footer pb-4"></div>
            </div>
          </Card>
          <Col
            lg="12"
            className="d-flex flex-wrap pr-3 pl-3 justify-content-around"
          >
            <>{orderItemCard}</>
            <Card className="col-4 card-box-hover-rise p-1 mb-1 align-content-center">
              <div className="bg-composed-wrapper bg-arielle-smile">
                <div className="bg-composed-wrapper--image bg-premium-dark opacity-2" />
                <div className="bg-composed-wrapper--content text-center text-light p-3">
                  <div className="d-flex justify-content-between">
                    <h5 className="mt-2 font-size-xl font-weight-bold">
                      Add an Item to Order #{order.id}
                    </h5>
                    <span>
                      <Button
                        onClick={handleSubmit}
                        color="primary"
                        className="mx-1 shadow-none d-40 border-0 p-0 d-inline-flex align-items-center justify-content-center"
                      >
                        <FontAwesomeIcon
                          icon={["far", "edit"]}
                          className="font-size-sm"
                        />
                      </Button>
                    </span>
                  </div>
                  <div className="divider my-3" />
                  <span className="text-danger">
                    {newOrderItemData.productIdValid}
                  </span>
                  <div className="d-flex justify-content-between mb-3">
                    <h5 className="mt-2 font-size-xl">Product ID</h5>
                    <Input
                      type="number"
                      name="productId"
                      className="col-3 mb-0 mr-1 pl-2 pr-1 d-40 font-size-lg opacity-8"
                      style={{ textAlign: "right" }}
                      value={newOrderItemData.productId}
                      onChange={handleChange}
                    ></Input>
                  </div>
                  <span className="text-danger">
                    {newOrderItemData.quantityValid}
                  </span>
                  <div className="d-flex justify-content-between">
                    <h5 className="mt-2 font-size-xl">Quantity</h5>
                    <Input
                      type="number"
                      name="quantity"
                      className="col-3 mb-0 mr-1 pl-2 pr-1 d-40 font-size-lg opacity-8"
                      style={{ textAlign: "right" }}
                      value={newOrderItemData.quantity}
                      onChange={handleChange}
                    ></Input>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Modal>
    </React.Fragment>
  );
};

OrderDetailsModal.propTypes = {
  orderProp: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    dateCreated: PropTypes.string,
    status: PropTypes.string,
    statusColor: PropTypes.string,
    statusTextColor: PropTypes.string,
    statusId: PropTypes.number,
    total: PropTypes.string,
    totalPaid: PropTypes.string,
    trackingCode: PropTypes.string,
    trackingUrl: PropTypes.string,
    payerId: PropTypes.string,
    paymentId: PropTypes.string,
    paymentType: PropTypes.string,
    paymentTypeId: PropTypes.number,
    shippingAddressType: PropTypes.string,
    address: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
  }),

  toggleModal: PropTypes.func,
  orderCardProp: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        orderItemCard: PropTypes.element,
      })
    ),
    PropTypes.shape({
      orderItemCard: PropTypes.element,
    }),
  ]),
};

export default OrderDetailsModal;
