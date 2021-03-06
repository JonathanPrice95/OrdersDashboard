-- =====================================================================================
-- Author:			Jonathan Price
-- Create date:		12/03/2021
-- Description:		Delete Order Items by Id (PK)
-- Code Reviewer:	Chan Park


-- MODIFIED BY:		Jonathan Price 
-- MODIFIED DATE:	1/7/2022 
-- Code Reviewer:	Andrew Avitia
-- Note: Updated to modify inventory quantity upon item delete
-- =====================================================================================

ALTER proc [dbo].[OrderItems_Delete_ById]
			@Id int
			,@ModifiedBy int


/* ---------------------- TEST CODE ---------------------------

DECLARE	@_Id int = 284
		,@_ModifiedBy int = 8

Select *
From dbo.Inventory as i
		INNER JOIN OrderItems as oi
	ON oi.InventoryId = i.Id
	Where oi.Id IN (@_Id)

Select *
From dbo.OrderCosts as oc
		INNER JOIN OrderItems as oi
	ON oc.OrderId = oi.OrderId
	Where oi.Id IN (@_Id)

Select *
From dbo.OrderItems
Where Id = @_Id

EXECUTE [dbo].[OrderItems_Delete_ById]
		@_Id
		,@_ModifiedBy

Select TOP 1 *
From dbo.Inventory 
Order by DateModified desc

Select TOP 1 *
From dbo.OrderCosts as oc
Order by DateModified desc

Select *
From dbo.OrderItems
Where Id = @_Id

*/

as

BEGIN

Declare @DatNow datetime2(7) = getutcdate()

UPDATE	i
		Set ModifiedBy = @ModifiedBy
			,DateModified = @DatNow
			,Quantity += oi.Quantity
		FROM dbo.Inventory as i
			INNER JOIN dbo.OrderItems as oi
		on i.Id = oi.InventoryId
		Where oi.Id IN (@Id)

Update	oc
		Set BaseTotal = CASE WHEN (BaseTotal - (oi.Quantity * i.BasePrice)) < 0 
									THEN 0 
						ELSE		BaseTotal - (oi.Quantity * i.BasePrice) 
									END
			,TaxTotal = CASE WHEN	ROUND((BaseTotal - (oi.Quantity * i.BasePrice)) * oc.TaxRate/100, 2) < 0 
									THEN 0
						ELSE		ROUND((BaseTotal - (oi.Quantity * i.BasePrice)) * oc.TaxRate/100, 2) 
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
		Set Total = oc.BaseTotal + oc.TaxTotal + oc.Handling + oc.Shipping - oc.ShippingDiscount + oc.Insurance
			,ModifiedBy = @ModifiedBy
			,DateModified = @DatNow
		FROM dbo.Orders as o
			INNER JOIN dbo.OrderCosts as oc
		on oc.OrderId = o.Id
			INNER JOIN dbo.OrderItems as oi
		on oi.OrderId = o.Id
		Where oi.Id IN (@Id)

DELETE FROM dbo.OrderItems 
		Where Id = @Id

END


