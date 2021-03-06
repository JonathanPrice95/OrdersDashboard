-- =====================================================================================
-- Author:			Jonathan Price
-- Create date:		12/03/2021
-- Description:		Update a single Order Item
-- Code Reviewer:	Chan Park


-- MODIFIED BY:		Jonathan Price	 
-- MODIFIED DATE:	1/7/2022
-- Code Reviewer:	Andrew Avitia
-- Note: Updated to modify inventory quantity after item quantity update.  Also update order costs, but not the Total.
-- The Total represents how much the customer has paid.

-- MODIFIED BY:		Jonathan Price	 
-- MODIFIED DATE:	1/13/2022
-- Code Reviewer:	Victor Ibasco
-- Note: Updated the Total Order Cost to update based on updates to an order item, and Product Id to the AddOrderItemRequest
-- in .Net to ensure consistency across the World Print application for the customer; however, the update proc still uses
-- inventoryId and so the productId is included as a parameter, but unused in the Update Order Item proc.
-- =====================================================================================

ALTER proc [dbo].[OrderItems_Update]
			@OrderId int
			,@ProductId int
			,@Quantity int
			,@ModifiedBy int
			,@InventoryId int
			,@Id int

/* ---------------------- TEST CODE ---------------------------

DECLARE	@_Id int = 385

DECLARE @_OrderId int = 23
		,@_ProductId int = 5
		,@_Quantity int = 3
		,@_ModifiedBy int = 8
		,@_InventoryId int = 7

SELECT *
FROM dbo.OrderItems
WHERE Id = @_Id

SELECT *
FROM dbo.Inventory
Where Id = @_InventoryId

SELECT *
FROM dbo.OrderCosts
Where OrderId = @_OrderId

SELECT *
FROM dbo.Orders as o
		INNER JOIN dbo.OrderItems as oi
	on oi.OrderId = o.Id
Where oi.Id IN (@_Id)

EXECUTE [dbo].[OrderItems_Update]
		@_OrderId
		,@_ProductId
		,@_Quantity
		,@_ModifiedBy
		,@_InventoryId
		,@_Id

SELECT *
FROM dbo.OrderItems
WHERE Id = @_Id

SELECT *
FROM dbo.Inventory
Where Id = @_InventoryId

SELECT *
FROM dbo.OrderCosts
Where OrderId = @_OrderId

SELECT *
FROM dbo.Orders as o
		INNER JOIN dbo.OrderItems as oi
	on oi.OrderId = o.Id
Where oi.Id IN (@_Id)

*/

as

BEGIN

DECLARE @DatNow datetime2(7) = getutcdate()

UPDATE	i
		Set ModifiedBy = @ModifiedBy
			,DateModified = @DatNow
			,Quantity = (i.Quantity + oi.Quantity - @Quantity)
		FROM dbo.Inventory as i
			INNER JOIN dbo.OrderItems as oi
		on i.Id = oi.InventoryId
		Where oi.Id IN (@Id)

Update	oc
		Set BaseTotal = CASE WHEN	(BaseTotal + (BasePrice * @Quantity) - (BasePrice * oi.Quantity)) < 0
									THEN 0
						ELSE		BaseTotal + (BasePrice * @Quantity) - (BasePrice * oi.Quantity)
									END
			,TaxTotal = CASE WHEN	((BaseTotal + (BasePrice * @Quantity) - (BasePrice * oi.Quantity)) * TaxRate / 100) < 0
									THEN 0
						ELSE		ROUND((BaseTotal + (BasePrice * @Quantity) - (BasePrice * oi.Quantity)) * TaxRate / 100, 2)
									END
			,ModifiedBy = @ModifiedBy
			,DateModified = @DatNow
		FROM dbo.OrderCosts as oc
			INNER JOIN dbo.OrderItems as oi
		on oc.OrderId = oi.OrderId
			INNER JOIN dbo.Inventory as i
		on oi.InventoryId = i.Id
		Where oi.Id IN (@Id)

Update	o
		Set Total = oc.BaseTotal + oc.TaxTotal + Handling + Shipping - ShippingDiscount + Insurance
			,ModifiedBy = @ModifiedBy
			,DateModified = @DatNow
		FROM dbo.Orders as o
			INNER JOIN dbo.OrderCosts as oc
		on oc.OrderId = o.Id
			INNER JOIN dbo.OrderItems as oi
		on oi.OrderId = o.Id
		Where oi.Id IN (@Id)

UPDATE [dbo].[OrderItems]
		SET	[DateModified] = @DatNow
			,[OrderId] = @OrderId
			,[InventoryId] = @InventoryId
			,[Quantity] = @Quantity
			,[ModifiedBy] = @ModifiedBy
		WHERE Id = @Id

END


