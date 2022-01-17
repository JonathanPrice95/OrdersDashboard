import React from "react";
import { Badge, Button } from "reactstrap";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function OrderCard(props) {
  const order = props.orderProp;

  const onOrderClick = function () {
    props.onOrderClick(order);
  };
  const onEditClick = function (e) {
    e.stopPropagation();
    props.onEditClick(order);
  };
  const onDeleteClick = function (e) {
    e.stopPropagation();
    props.onDeleteClick(order);
  };

  return (
    <tr>
      <td className="px-4">
        <div className="d-flex align-items-center">
          <div>
            <div className="font-size-sm font-weight-bold">{order.id}</div>
            <div className="font-size-sm opacity-7">{order.dateCreated}</div>
          </div>
        </div>
      </td>
      <td className="text-left">
        <div>
          <div className="font-size-sm font-weight-bold">
            {order.createdBy.firstName} {order.createdBy.lastName}
          </div>
        </div>
      </td>
      <td className="text-left">
        <div className="font-size-sm font-weight-bold">
          ${order.total.toFixed(2)}
        </div>
      </td>
      <td className="text-left">
        <div>
          <div className="font-size-sm font-weight-bold">{order.paymentId}</div>
          <div className="font-size-sm">PayPal</div>
        </div>
      </td>
      <td className="text-left">
        <div className="font-size-sm font-weight-bold">
          {order.trackingCode}
        </div>
        <div className="font-size-sm opacity-7">{order.trackingUrl}</div>
      </td>
      <td className="text-center">
        <Badge className={order.statusTextColor} color={order.statusColor}>
          {order.status}
        </Badge>
      </td>
      <td className="text-center">
        <Button
          onClick={onOrderClick}
          color="neutral-primary"
          className="mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center"
        >
          <FontAwesomeIcon icon={["fas", "search"]} className="font-size-sm" />
        </Button>
        <Button
          onClick={onEditClick}
          color="neutral-first"
          className="mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center"
        >
          <FontAwesomeIcon icon={["far", "edit"]} className="font-size-sm" />
        </Button>
        <Button
          onClick={onDeleteClick}
          color="neutral-danger"
          className="mx-1 shadow-none d-30 border-0 p-0 d-inline-flex align-items-center justify-content-center"
        >
          <FontAwesomeIcon icon={["fas", "times"]} className="font-size-sm" />
        </Button>
      </td>
    </tr>
  );
}

OrderCard.propTypes = {
  orderProp: PropTypes.shape({
    id: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    trackingCode: PropTypes.string,
    trackingUrl: PropTypes.string,
    dateCreated: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    paymentId: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    statusColor: PropTypes.string.isRequired,
    statusTextColor: PropTypes.string.isRequired,
    createdBy: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    }),
  }),
  onOrderClick: PropTypes.func,
  onEditClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
};

export default OrderCard;
