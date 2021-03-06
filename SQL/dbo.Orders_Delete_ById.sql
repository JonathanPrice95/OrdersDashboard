-- ==============================================================
-- Author:			Jonathan Price
-- Create date:		12/03/2021
-- Description:		Delete Orders by Id
-- Code Reviewer:	Chan Park


-- MODIFIED BY:		Jonathan Price
-- MODIFIED DATE:	12/07/2021
-- Code Reviewer:	Daniel Walton
-- Note: Modified proc to delete Orders-UserId bridge table record

-- MODIFIED BY:		Jonathan Price
-- MODIFIED DATE:	1/7/2022
-- Code Reviewer:	Andrew Avitia 
-- Note: Modified proc to delete Order Costs and Payments prior to Order, modify inventory, & modifies all costs to 0.  
-- The Total cost is not changed; however, the Order and OrderCosts are deleted.  They should probably be made inactive instead.
-- ==============================================================



ALTER proc [dbo].[Orders_Delete_ById]
		@Id int
		,@ModifiedBy int


/* ---------------------- TEST CODE ---------------------------

DECLARE @_Id int = 175
		,@_ModifiedBy int = 8

Select *
FROM dbo.Inventory

SELECT *
FROM dbo.Orders
Where Id = @_Id

SELECT *
FROM dbo.OrderItems
Where OrderId = @_Id

SELECT *
FROM dbo.UserOrders
Where OrderId = @_Id

SELECT *
FROM dbo.OrderCosts
Where OrderId = @_Id

SELECT *
FROM dbo.Payments
Where OrderId = @_Id

EXECUTE [dbo].[Orders_Delete_ById]
		@_Id
		,@_ModifiedBy

Select *
FROM dbo.Inventory

SELECT *
FROM dbo.Orders
Where Id = @_Id

SELECT *
FROM dbo.OrderItems
Where OrderId = @_Id

SELECT *
FROM dbo.UserOrders
Where OrderId = @_Id

SELECT *
FROM dbo.OrderCosts
Where OrderId = @_Id

SELECT *
FROM dbo.Payments
Where OrderId = @_Id


*/

as

BEGIN

Declare @IdOrderItems as Table (InventoryId int, Quantity int)

Declare @DatNow datetime2(7) = getutcdate()

Insert INTO @IdOrderItems	(InventoryId
							,Quantity
							)

				SELECT		oi.InventoryId
							,oi.Quantity
				From dbo.OrderItems as oi
				Where oi.OrderId = @Id

UPDATE	dbo.Inventory
		Set ModifiedBy = @ModifiedBy
			,DateModified = @DatNow
			,Quantity += ioi.Quantity
		From @IdOrderItems as ioi
		Where ioi.InventoryId = dbo.Inventory.Id

Update	dbo.OrderCosts
		Set BaseTotal = 0
			,TaxTotal = 0
			,Handling = 0
			,Shipping = 0
			,ShippingDiscount = 0
			,Insurance = 0
			,ModifiedBy = @ModifiedBy
			,DateModified = @DatNow
		Where OrderId = @Id

DELETE FROM dbo.OrderItems
	WHERE OrderId = @Id

DELETE FROM dbo.UserOrders
	WHERE OrderId = @Id

DELETE FROM dbo.OrderCosts
	WHERE OrderId = @Id

DELETE FROM dbo.Payments
	WHERE OrderId = @Id

DELETE FROM dbo.Orders
	WHERE Id = @Id

END
