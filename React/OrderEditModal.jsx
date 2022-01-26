import React, { useEffect, useState } from "react";
import * as ordersService from "@services/ordersService";
import { Col, Button, Modal } from "reactstrap";
import hero4 from "@assets/images/hero-bg/hero-4.jpg";
import PropTypes from "prop-types";
import { Formik, Form, Field, ErrorMessage } from "formik";
import orderSchema from "@components/forms/validate/orderSchema";
import debug from "sabio-debug";
import toastr from "toastr";

const basicSchema = orderSchema;

const _logger = debug.extend("OrderEditModal");

const OrderEditModal = (props) => {
  const order = props.orderProp;

  const [newCostData, setNewCostData] = useState({
    total: 0,
    totalPaid: 0,
    balance: 0,
    baseTotal: 0,
    taxRate: 0,
    taxTotal: 0,
    handling: 0,
    shipping: 0,
    shippingDiscount: 0,
    insurance: 0,
    balanceFont: "neutral-primary",
  });

  const toggleModal = function () {
    props.toggleModal();
  };

  _logger("Order Edit Modal Firing");

  useEffect(() => {
    setNewCostData((prevState) => {
      let updatedCostData = { ...prevState };
      let initializeOrder = { ...order };
      updatedCostData.totalPaid = initializeOrder.totalPaid;
      updatedCostData.baseTotal = initializeOrder.baseTotal;
      updatedCostData.taxRate = initializeOrder.taxRate;
      updatedCostData.taxTotal = (
        (initializeOrder.baseTotal * initializeOrder.taxRate) /
        100
      ).toFixed(2);
      updatedCostData.handling = initializeOrder.handling;
      updatedCostData.shipping = initializeOrder.shipping;
      updatedCostData.shippingDiscount = initializeOrder.shippingDiscount;
      updatedCostData.insurance = initializeOrder.insurance;
      updatedCostData.total = (
        initializeOrder.baseTotal * (1 + initializeOrder.taxRate / 100) +
        initializeOrder.shipping +
        initializeOrder.handling +
        initializeOrder.insurance -
        initializeOrder.shippingDiscount
      ).toFixed(2);
      updatedCostData.balance = (
        Number(updatedCostData.total) - updatedCostData.totalPaid
      ).toFixed(2);
      if (Number(updatedCostData.balance) !== 0) {
        updatedCostData.balanceFont = "neutral-danger";
      } else {
        updatedCostData.balanceFont = "neutral-primary";
      }
      return updatedCostData;
    });
  }, [order.isOpen]);

  const handleSubmit = (values) => {
    _logger("Order Update Submitted:", values);
    values.total = Number(newCostData.total);
    values.totalPaid = Number(values.totalPaid);
    values.baseTotal = Number(values.baseTotal);
    values.handling = Number(values.handling);
    values.insurance = Number(values.insurance);
    values.shipping = Number(values.shipping);
    values.shippingDiscount = Number(values.shippingDiscount);
    values.taxRate = Number(values.taxRate);
    values.taxTotal = Number(values.taxTotal);
    values.statusId = Number(values.statusId);
    ordersService
      .updateOrder(values)
      .then(onUpdateOrderSuccess)
      .catch(onUpdateOrderError);
  };

  const onUpdateOrderSuccess = (response) => {
    _logger("Order Updated Successfully", response);
    toastr["success"](`Order #${order.id} updated`);
    toggleModal();
  };

  const onUpdateOrderError = (error) => {
    _logger("Update Error:", error);
    toastr["error"](`Unable to update order #${order.id}`);
  };

  const onKeyDown = (keyEvent) => {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    } else if (keyEvent.keyCode === 9) {
      let inputName = keyEvent.target.name;
      let inputValue = Number(Number(keyEvent.target.value).toFixed(2));
      if (
        inputName === "balance" ||
        inputName === "taxTotal" ||
        inputName === "total"
      ) {
        return;
      }
      setNewCostData((prevState) => {
        let updatedCostData = { ...prevState };
        updatedCostData[keyEvent.target.name] = Number(
          Number(keyEvent.target.value).toFixed(2)
        );
        if (inputName === "baseTotal") {
          updatedCostData.total = (
            inputValue * (1 + updatedCostData.taxRate / 100) +
            updatedCostData.shipping +
            updatedCostData.handling +
            updatedCostData.insurance -
            updatedCostData.shippingDiscount
          ).toFixed(2);
          updatedCostData.taxTotal = (
            inputValue *
            (updatedCostData.taxRate / 100)
          ).toFixed(2);
        } else if (inputName === "shipping") {
          updatedCostData.total = (
            updatedCostData.baseTotal * (1 + updatedCostData.taxRate / 100) +
            inputValue +
            updatedCostData.handling +
            updatedCostData.insurance -
            updatedCostData.shippingDiscount
          ).toFixed(2);
        } else if (inputName === "shippingDiscount") {
          updatedCostData.total = (
            updatedCostData.baseTotal * (1 + updatedCostData.taxRate / 100) +
            updatedCostData.shipping +
            updatedCostData.handling +
            updatedCostData.insurance -
            inputValue
          ).toFixed(2);
        } else if (inputName === "insurance") {
          updatedCostData.total = (
            updatedCostData.baseTotal * (1 + updatedCostData.taxRate / 100) +
            updatedCostData.shipping +
            updatedCostData.handling +
            inputValue -
            updatedCostData.shippingDiscount
          ).toFixed(2);
        } else if (inputName === "handling") {
          updatedCostData.total = (
            updatedCostData.baseTotal * (1 + updatedCostData.taxRate / 100) +
            updatedCostData.shipping +
            inputValue +
            updatedCostData.insurance -
            updatedCostData.shippingDiscount
          ).toFixed(2);
        } else if (inputName === "taxRate") {
          updatedCostData.total = (
            updatedCostData.baseTotal * (1 + inputValue / 100) +
            updatedCostData.shipping +
            updatedCostData.handling +
            updatedCostData.insurance -
            updatedCostData.shippingDiscount
          ).toFixed(2);
          updatedCostData.taxTotal = (
            updatedCostData.baseTotal *
            (inputValue / 100)
          ).toFixed(2);
        }
        updatedCostData.balance = (
          Number(updatedCostData.total) - updatedCostData.totalPaid
        ).toFixed(2);
        if (Number(updatedCostData.balance) !== 0) {
          updatedCostData.balanceFont = "neutral-danger";
        } else {
          updatedCostData.balanceFont = "neutral-primary";
        }
        return updatedCostData;
      });
    }
  };

  const onMouseLeave = (values) => {
    let inputName = values.target.name;
    let inputValue = Number(Number(values.target.value).toFixed(2));
    setNewCostData((prevState) => {
      let updatedCostData = { ...prevState };
      updatedCostData[values.target.name] = Number(
        Number(values.target.value).toFixed(2)
      );
      if (inputName === "baseTotal") {
        updatedCostData.total = (
          inputValue * (1 + updatedCostData.taxRate / 100) +
          updatedCostData.shipping +
          updatedCostData.handling +
          updatedCostData.insurance -
          updatedCostData.shippingDiscount
        ).toFixed(2);
        updatedCostData.taxTotal = (
          inputValue *
          (updatedCostData.taxRate / 100)
        ).toFixed(2);
      } else if (inputName === "shipping") {
        updatedCostData.total = (
          updatedCostData.baseTotal * (1 + updatedCostData.taxRate / 100) +
          inputValue +
          updatedCostData.handling +
          updatedCostData.insurance -
          updatedCostData.shippingDiscount
        ).toFixed(2);
      } else if (inputName === "shippingDiscount") {
        updatedCostData.total = (
          updatedCostData.baseTotal * (1 + updatedCostData.taxRate / 100) +
          updatedCostData.shipping +
          updatedCostData.handling +
          updatedCostData.insurance -
          inputValue
        ).toFixed(2);
      } else if (inputName === "insurance") {
        updatedCostData.total = (
          updatedCostData.baseTotal * (1 + updatedCostData.taxRate / 100) +
          updatedCostData.shipping +
          updatedCostData.handling +
          inputValue -
          updatedCostData.shippingDiscount
        ).toFixed(2);
      } else if (inputName === "handling") {
        updatedCostData.total = (
          updatedCostData.baseTotal * (1 + updatedCostData.taxRate / 100) +
          updatedCostData.shipping +
          inputValue +
          updatedCostData.insurance -
          updatedCostData.shippingDiscount
        ).toFixed(2);
      } else if (inputName === "taxRate") {
        updatedCostData.total = (
          updatedCostData.baseTotal * (1 + inputValue / 100) +
          updatedCostData.shipping +
          updatedCostData.handling +
          updatedCostData.insurance -
          updatedCostData.shippingDiscount
        ).toFixed(2);
        updatedCostData.taxTotal = (
          updatedCostData.baseTotal *
          (inputValue / 100)
        ).toFixed(2);
      }
      updatedCostData.balance = (
        Number(updatedCostData.total) - updatedCostData.totalPaid
      ).toFixed(2);
      if (Number(updatedCostData.balance) !== 0) {
        updatedCostData.balanceFont = "neutral-danger";
      } else {
        updatedCostData.balanceFont = "neutral-primary";
      }
      return updatedCostData;
    });
  };

  return (
    <React.Fragment>
      <Modal
        zIndex={2000}
        centered
        size="lg"
        isOpen={order.isOpen}
        toggle={toggleModal}
        contentClassName="modal-example-2 shadow-sm-dark border-0 bg-white"
      >
        <div className="hero-wrapper bg-composed-wrapper bg-deep-sky h-100 rounded-top">
          <div className="flex-grow-1 w-100 d-flex align-items-center">
            <div
              className="bg-composed-wrapper--image rounded-top opacity-3"
              style={{ backgroundImage: "url(" + hero4 + ")" }}
            />
            <div className="bg-composed-wrapper--content text-center pt-6">
              <div className="text-white">
                <h1 className="display-3 my-3 font-weight-bold">Company Name Goes Here</h1>
                <p className="font-size-lg mb-0 px-4 text-white-60">
                  Order #{order.id}
                </p>
              </div>
              <div className="shape-container-top-1" style={{ margin: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                  <path
                    fill="var(--white)"
                    fillOpacity="1"
                    d="M0,32L48,69.3C96,107,192,181,288,186.7C384,192,480,128,576,106.7C672,85,768,107,864,112C960,117,1056,107,1152,101.3C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                  ></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div
          className="bg-white d-flex justify-content-center align-items-center flex-column rounded pt-4 pt-lg-0"
          style={{ marginTop: "-120px" }}
        >
          <Col lg="10" xl="9" className="z-over py-5 mx-auto">
            <div className="px-2 py-3 py-lg-5">
              <Formik
                enableReinitialize={true}
                initialValues={order}
                onSubmit={(values) => {
                  handleSubmit(values);
                }}
                validationSchema={basicSchema}
              >
                <Form onKeyDown={onKeyDown}>
                  <div className="row d-flex justify-content-between">
                    <Col lg="6" xl="6" className="z-over py-1">
                      <div id="total">
                        <label className="font-weight-bold">Total</label>
                        <Button
                          type="button"
                          name="total"
                          className="form-control text-left"
                          color="neutral-primary"
                          style={{ marginBottom: "15px" }}
                        >
                          {newCostData.total}
                        </Button>
                      </div>
                      <div id="trackingCode">
                        <label className="font-weight-bold">
                          Tracking Number
                        </label>
                        <Field
                          type="text"
                          name="trackingCode"
                          className="form-control"
                          style={{ marginBottom: "15px" }}
                        ></Field>
                        <ErrorMessage
                          name="trackingCode"
                          component="div"
                          className="has-error"
                        />
                      </div>
                    </Col>
                    <Col lg="6" xl="6" className="z-over py-1">
                      <div id="statusId">
                        <label className="font-weight-bold">Order Status</label>
                        <Field
                          as="select"
                          name="statusId"
                          type="number"
                          className="form-control"
                          style={{ marginBottom: "15px" }}
                        >
                          <option value="1" label="Pending" />
                          <option value="4" label="Processing" />
                          <option value="2" label="Completed" />
                          <option value="3" label="Rejected" />
                          <option value="5" label="Cancelled" />
                        </Field>
                      </div>
                      <div id="trackingUrl">
                        <label className="font-weight-bold">Tracking URL</label>
                        <Field
                          type="text"
                          name="trackingUrl"
                          className="form-control"
                          style={{ marginBottom: "15px" }}
                        ></Field>
                        <ErrorMessage
                          name="trackingUrl"
                          component="div"
                          className="has-error"
                        />
                      </div>
                    </Col>
                  </div>
                  <hr />
                  <div className="row d-flex justify-content-between">
                    <Col lg="4" xl="4" className="z-over py-1">
                      <div id="totalPaid">
                        <label className="font-weight-bold">Amount Paid</label>
                        <Field
                          type="decimal"
                          name="totalPaid"
                          className="form-control"
                          style={{ marginBottom: "15px" }}
                          onMouseOut={(values) => {
                            onMouseLeave(values);
                          }}
                        ></Field>
                        <ErrorMessage
                          name="totalPaid"
                          component="div"
                          className="has-error"
                        />
                      </div>
                      <div id="baseTotal">
                        <label className="font-weight-bold">
                          Base Order Cost
                        </label>
                        <Field
                          type="decimal"
                          name="baseTotal"
                          className="form-control"
                          style={{ marginBottom: "15px" }}
                          onMouseOut={(values) => {
                            onMouseLeave(values);
                          }}
                        ></Field>
                        <ErrorMessage
                          name="baseTotal"
                          component="div"
                          className="has-error"
                        />
                      </div>
                      <div id="shipping">
                        <label className="font-weight-bold">Shipping</label>
                        <Field
                          type="decimal"
                          name="shipping"
                          className="form-control"
                          style={{ marginBottom: "15px" }}
                          onMouseOut={(values) => {
                            onMouseLeave(values);
                          }}
                        ></Field>
                        <ErrorMessage
                          name="shipping"
                          component="div"
                          className="has-error"
                        />
                      </div>
                    </Col>
                    <Col lg="4" xl="4" className="z-over py-1">
                      <div id="balance">
                        <label className="font-weight-bold">Balance</label>
                        <Button
                          type="button"
                          name="balance"
                          className="form-control text-left"
                          color={newCostData.balanceFont}
                          style={{ marginBottom: "15px" }}
                        >
                          {newCostData.balance}
                        </Button>
                      </div>
                      <div id="taxTotal">
                        <label className="font-weight-bold">Sales Tax</label>
                        <Button
                          type="button"
                          name="taxTotal"
                          className="form-control text-left"
                          color="neutral-primary"
                          style={{ marginBottom: "15px" }}
                        >
                          {newCostData.taxTotal}
                        </Button>
                      </div>
                      <div id="shippingDiscount">
                        <label className="font-weight-bold">
                          Shipping Discount
                        </label>
                        <Field
                          type="decimal"
                          name="shippingDiscount"
                          className="form-control"
                          style={{ marginBottom: "15px" }}
                          onMouseOut={(values) => {
                            onMouseLeave(values);
                          }}
                        ></Field>
                        <ErrorMessage
                          name="shippingDiscount"
                          component="div"
                          className="has-error"
                        />
                      </div>
                    </Col>
                    <Col lg="4" xl="4" className="z-over py-1">
                      <div id="insurance">
                        <label className="font-weight-bold">Insurance</label>
                        <Field
                          type="decimal"
                          name="insurance"
                          className="form-control"
                          style={{ marginBottom: "15px" }}
                          onMouseOut={(values) => {
                            onMouseLeave(values);
                          }}
                        ></Field>
                        <ErrorMessage
                          name="insurance"
                          component="div"
                          className="has-error"
                        />
                      </div>
                      <div id="taxRate">
                        <label className="font-weight-bold">
                          Sales Tax Rate (%)
                        </label>
                        <Field
                          type="decimal"
                          name="taxRate"
                          className="form-control"
                          style={{ marginBottom: "15px" }}
                          onMouseOut={(values) => {
                            onMouseLeave(values);
                          }}
                        ></Field>
                        <ErrorMessage
                          name="taxRate"
                          component="div"
                          className="has-error"
                        />
                      </div>
                      <div id="handling">
                        <label className="font-weight-bold">Handling</label>
                        <Field
                          type="decimal"
                          name="handling"
                          className="form-control"
                          style={{ marginBottom: "15px" }}
                          onMouseOut={(values) => {
                            onMouseLeave(values);
                          }}
                        ></Field>
                        <ErrorMessage
                          name="handling"
                          component="div"
                          className="has-error"
                        />
                      </div>
                    </Col>
                  </div>
                  <div className="text-center">
                    <Button
                      type="select"
                      className="btn-block text-uppercase font-weight-bold font-size-sm mt-4"
                      color="primary"
                      onSubmit={(values) => {
                        handleSubmit(values);
                      }}
                    >
                      Update
                    </Button>
                  </div>
                </Form>
              </Formik>
            </div>
          </Col>
        </div>
      </Modal>
    </React.Fragment>
  );
};

OrderEditModal.propTypes = {
  orderProp: PropTypes.shape({
    id: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    totalPaid: PropTypes.number.isRequired,
    baseTotal: PropTypes.number.isRequired,
    taxRate: PropTypes.number.isRequired,
    taxTotal: PropTypes.number.isRequired,
    handling: PropTypes.number.isRequired,
    shipping: PropTypes.number.isRequired,
    shippingDiscount: PropTypes.number.isRequired,
    insurance: PropTypes.number.isRequired,
    trackingCode: PropTypes.string,
    trackingUrl: PropTypes.string,
    statusId: PropTypes.number.isRequired,
    payerId: PropTypes.string,
    paymentId: PropTypes.string,
    paymentTypeId: PropTypes.number,
    shippingAddressId: PropTypes.number,
    isOpen: PropTypes.bool.isRequired,
  }),
  toggleModal: PropTypes.func,
};

export default OrderEditModal;
