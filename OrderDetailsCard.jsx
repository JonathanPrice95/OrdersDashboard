import React, { useState } from "react";
import { Card, Button, Input } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const _logger = debug.extend("OrderDetailsCard");

function OrderDetailsCard(props) {
  const orderItem = props.orderItemProp;

  const [orderItemData, setOrderItemData] = useState({
    quantity: orderItem.quantity,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    _logger("New Value:", value);
    setOrderItemData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onEditClick = function (e) {
    e.stopPropagation();
    props.onEditClick(orderItem, orderItemData);
  };

  const onDeleteClick = function (e) {
    e.stopPropagation();
    props.onDeleteClick(orderItem);
  };

  return (
    <Card className="col-4 card-box-hover-rise p-1 mb-1 align-content-center">
      <div className="bg-composed-wrapper bg-arielle-smile">
        <div className="bg-composed-wrapper--image bg-premium-dark opacity-2" />
        <div className="bg-composed-wrapper--content text-center text-light p-3">
          <img
            className="card-img-top"
            src={orderItem.product.primaryImage}
            alt="t-shirt"
          />
          <h5 className="mt-2 font-size-xl font-weight-bold">
            {orderItem.product.name}
          </h5>
          <div className="d-flex justify-content-between">
            <h5 className="mt-2 font-size-xl">Quantity</h5>
            <Input
              type="number"
              name="quantity"
              className="col-3 mb-0 mr-4 pl-2 pr-1 d-40 font-size-lg opacity-8"
              style={{ textAlign: "right" }}
              value={orderItemData.quantity}
              onChange={handleChange}
            ></Input>
            <span>
              <Button
                onClick={onEditClick}
                color="primary"
                className="mx-1 shadow-none d-40 border-0 p-0 d-inline-flex align-items-center justify-content-center"
              >
                <FontAwesomeIcon
                  icon={["far", "edit"]}
                  className="font-size-sm"
                />
              </Button>
              <Button
                onClick={onDeleteClick}
                color="danger"
                className="mx-1 shadow-none d-40 border-0 p-0 d-inline-flex align-items-center justify-content-center opacity-10"
              >
                <FontAwesomeIcon
                  icon={["fas", "times"]}
                  className="font-size-sm"
                />
              </Button>
            </span>
          </div>
        </div>
      </div>
      <div className="table-alternate-spaced mb-0 shadow-overflow">
        <div className="thead-light text-capitalize font-size-sm font-weight-bold">
          <div>
            <h6 className="text-left pt-2 pl-3">
              Order Item #{orderItem.id} Details
            </h6>
          </div>
        </div>
        <div className="divider" />
        <PerfectScrollbar
          className="scroll-area-sm"
          options={{ wheelPropagation: false }}
        >
          <div className="divider" />
          <div className="pt-2 pl-3 pr-3 d-flex justify-content-between font-size-sm">
            <h6 className="font-weight-bold">Product ID</h6>
            <h6 className="font-size-sm">{orderItem.product.id}</h6>
          </div>
          <div className="divider" />
          <div className="pt-2 pl-3 pr-3 d-flex justify-content-between font-size-sm">
            <h6 className="font-weight-bold">SKU</h6>
            <h6 className="font-size-sm">{orderItem.product.sku}</h6>
          </div>
          <div className="divider" />
          <div className="pt-2 pl-3 pr-3 d-flex justify-content-between font-size-sm">
            <h6 className="font-weight-bold">Unit Cost</h6>
            <h6 className="font-size-sm">${orderItem.unitCost}</h6>
          </div>
          <div className="divider" />
          <div className="pt-2 pl-3 pr-3 d-flex justify-content-between font-size-sm">
            <h6 className="font-weight-bold">Color/Hex</h6>
            <h6 className="font-size-sm">
              {orderItem.product.color.name}/{orderItem.product.color.hex}
            </h6>
          </div>
          <div className="divider" />
          <div className="pt-2 pl-3 pr-3 d-flex justify-content-between font-size-sm">
            <h6 className="font-weight-bold">Size</h6>
            <h6 className="font-size-sm">{orderItem.product.sizeType.name}</h6>
          </div>
          <div className="divider" />
          <div className="pt-2 pl-3 pr-3 d-flex justify-content-between font-size-sm">
            <h6 className="font-weight-bold">Style</h6>
            <h6 className="font-size-sm">{orderItem.product.category.name}</h6>
          </div>
          <div className="divider" />
          <div className="pt-2 pl-3 pr-3 d-flex justify-content-between font-size-sm">
            <h6 className="font-weight-bold">Style Description</h6>
            <h6 className="pl-3 font-size-sm text-right">
              {orderItem.product.category.description}
            </h6>
          </div>
          <div className="divider" />
          <div className="pt-2 pl-3 pr-3 d-flex justify-content-between font-size-sm">
            <h6 className="font-weight-bold">Material</h6>
            <h6 className="font-size-sm">{orderItem.product.material}</h6>
          </div>
          <div className="divider" />
          <div className="pt-2 pl-3 pr-3 d-flex justify-content-between font-size-sm">
            <h6 className="font-weight-bold">Manufacturer</h6>
            <h6 className="font-size-sm">{orderItem.product.manufacturer}</h6>
          </div>
          <div className="divider" />
          <div className="pt-2 pl-3 pr-3 d-flex justify-content-between font-size-sm">
            <h6 className="font-weight-bold">Year</h6>
            <h6 className="font-size-sm">{orderItem.product.year}</h6>
          </div>
          <div className="divider" />
          <div className="pt-2 pl-3 pr-3 d-flex justify-content-between font-size-sm">
            <h6 className="font-weight-bold">Condition</h6>
            <h6 className="font-size-sm">
              {orderItem.product.conditionType.name}
            </h6>
          </div>

          <div className="divider" />
          <div className="pt-2 pl-3 pr-3 d-flex justify-content-between font-size-sm">
            <h6 className="font-weight-bold">Inventory ID</h6>
            <h6 className="font-size-sm">{orderItem.inventoryId}</h6>
          </div>
          <div className="divider" />
          <div className="pt-2 pl-3 pr-3 d-flex justify-content-between font-size-sm">
            <h6 className="font-weight-bold">Quantity in Inventory</h6>
            <h6 className="font-size-sm">{orderItem.product.quantity}</h6>
          </div>
          <div className="divider" />
          <div className="pt-2 pl-3 pr-3 d-flex justify-content-between font-size-sm">
            <h6 className="font-weight-bold">Product Description</h6>
            <h6 className="pl-3 font-size-sm text-right">
              {orderItem.product.description}
            </h6>
          </div>
          <div className="divider" />
          <div className="pt-2 pl-3 pr-3 d-flex justify-content-between font-size-sm">
            <h6 className="font-weight-bold">Specifications</h6>
            <h6 className="pl-3 font-size-sm text-right">
              {orderItem.product.specifications}
            </h6>
          </div>
        </PerfectScrollbar>
      </div>
    </Card>
  );
}

OrderDetailsCard.propTypes = {
  orderItemProp: PropTypes.shape({
    id: PropTypes.number.isRequired,
    unitCost: PropTypes.number.isRequired,
    inventoryId: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    product: PropTypes.shape({
      id: PropTypes.number.isRequired,
      sku: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      manufacturer: PropTypes.string.isRequired,
      year: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      specifications: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      material: PropTypes.string.isRequired,
      primaryImage: PropTypes.string.isRequired,
      category: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      }),
      sizeType: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
      color: PropTypes.shape({
        name: PropTypes.string.isRequired,
        hex: PropTypes.string.isRequired,
      }),
      conditionType: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    }),
  }),

  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
};

export default OrderDetailsCard;
