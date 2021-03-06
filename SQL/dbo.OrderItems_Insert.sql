-- =====================================================================================
-- Author:			Jonathan Price
-- Create date:		12/02/2021
-- Description:		Insert a single Order Item
-- Code Reviewer:	Chan Park


-- MODIFIED BY:		Jonathan Price	 
-- MODIFIED DATE:	1/7/2022	 
-- Code Reviewer:	Andrew Avitia
-- Note: Updated to modify inventory quantity after item add.  Also update order costs, but not the Total.
-- The Total represents how much the customer has paid.

-- MODIFIED BY:		Jonathan Price	 
-- MODIFIED DATE:	1/17/2022
-- Code Reviewer:	Victor Ibasco 
-- Note: Updated the Total Order Cost to update based on adding order items, updated the insert to use 
-- @ProductId as a parameter instead of @InventoryId to ensure consistence across World Print
-- =====================================================================================

ALTER proc [dbo].[OrderItems_Insert]
			@OrderId int
			,@ProductId int
			,@Quantity int
			,@CreatedBy int
			,@Id int OUTPUT

/* ---------------------- TEST CODE ---------------------------

DECLARE	@_Id int = 0

DECLARE @_OrderId int = 23
		,@_ProductId int = 7 
		,@_Quantity int = 13
		,@_CreatedBy int = 8

SELECT *
FROM dbo.Inventory
Where ProductId = @_ProductId

Select *
From dbo.OrderCosts
Where OrderId = @_OrderId

EXECUTE [dbo].[OrderItems_Insert]
		@_OrderId
		,@_ProductId
		,@_Quantity
		,@_CreatedBy
		,@_Id OUTPUT

SELECT *
FROM dbo.OrderItems
WHERE Id = @_Id

Select *
From dbo.OrderCosts
Where OrderId = @_OrderId

SELECT *
FROM dbo.Inventory
Where ProductId = @_ProductId

*/

as

BEGIN

INSERT INTO	[dbo].[OrderItems]
			([OrderId]
			,[InventoryId]
			,[Quantity]
			,[CreatedBy]
			,[ModifiedBy])

     SELECT
			@OrderId
			,i.Id
			,@Quantity
			,@CreatedBy
			,@CreatedBy
	FROM	dbo.Inventory as i
	WHERE	@ProductId = ProductId

	SET @Id = SCOPE_IDENTITY()

Declare @DatNow datetime2(7) = getutcdate()

UPDATE	dbo.Inventory
		Set ModifiedBy = @CreatedBy
			,DateModified = @DatNow
			,Quantity -= @Quantity
		Where @ProductId = ProductId

Update	oc
		Set BaseTotal = BaseTotal + (BasePrice * @Quantity)
			,TaxTotal = ROUND((BaseTotal + (BasePrice * @Quantity)) * TaxRate/100, 2) 
			,ModifiedBy = @CreatedBy
			,DateModified = @DatNow
		FROM dbo.OrderCosts as oc
			INNER JOIN dbo.OrderItems as oi
		on oc.OrderId = oi.OrderId
			INNER JOIN dbo.Inventory as i
		on oi.InventoryId = i.Id
		Where oi.Id IN (@Id)

Update	o
		Set Total = BaseTotal + TaxTotal + Handling + Shipping - ShippingDiscount + Insurance
			,ModifiedBy = @CreatedBy
			,DateModified = @DatNow
		FROM dbo.Orders as o
			INNER JOIN dbo.OrderCosts as oc
		on oc.OrderId = o.Id
			INNER JOIN dbo.OrderItems as oi
		on oi.OrderId = o.Id
		Where oi.Id IN (@Id)
	
END




