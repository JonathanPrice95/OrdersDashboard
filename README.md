# Orders Dashboard
- Front End: React.js
- Middle Tier: .Net Core/C#
- Back End: Microsoft SQL

# SUMMARY
The orders dashboard contains the following features:
- A Dashboard Table with Order #/Date, Customer, Order Amount, Payment Info, Tracking #, and Status.  The pagination includes three preset values of 5, 15, and 30 orders per page.  The search bar will query an order # or a customer name.  The order status filter includes Pending, Completed, Rejected, Processing, and Cancelled.
- Actions available to an Administrative User include Deleting an Order, Updating an Order, or Modifying the Order Details.

An admin user can modify the following data on an order:
- Order Status, Tracking Number, Tracking URL, Amount Paid, Order Base Cost, Shipping, Shipping Discount, Insurance, Sales Tax Rate, and Handling.
- Computed fields include Total, Balance, and Sales Tax

The Order Details Modal includes the following data:
- Order #, Status, Customer, Order Date, Cost, Amount Paid, Payment Info, Tracking Info, and Shipping Address.
- The Modal includes Order Item Cards with a picture of the item, quantity, Product Id, SKU, Unit Cost, Color/Hex, Size, Style, Style Description, Material, Manufacturer, Year, Condition, Inventory Id, Inventory Quantity, Produc Description, and Specifications using a scroll bar.

An admin user can modify the quantity ordered for each item, remove an item, or add a new item by Product Id and Quantity using the Order Details Modal.

# COMPONENTS
- Orders.jsx as a Class Component
- OrderCard as a Function Component using Props
- OrderEditModal as a Functional Component using Props, Hooks, Formik, and Yup Validation
- OrderDetailsCard as a Functional Component using Props and Hooks
- OrderDetailsModal as a Functional Component using Props, Hooks, and Validation

