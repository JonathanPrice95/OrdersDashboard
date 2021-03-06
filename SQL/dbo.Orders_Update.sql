-- ==============================================================
-- Author:			Jonathan Price
-- Create date:		12/03/2021
-- Description:		Update Orders & PaymentTypes
-- Code Reviewer:	Chan Park


-- MODIFIED BY:		Jonathan Price
-- MODIFIED DATE:	12/13/2021
-- Code Reviewer:	Lefeba Gougis
-- Note: Added Status Id as a parameter

-- MODIFIED BY:		Jonathan Price
-- MODIFIED DATE:	1/13/2022
-- Code Reviewer:	Victor Ibasco
-- Note: Added Order Cost Information

-- MODIFIED BY:		Jonathan Price
-- MODIFIED DATE:	1/17/2022
-- Code Reviewer:	Victor Ibasco 
-- Note: Updates Inventory Upon Order Status Change
-- ==============================================================

ALTER proc [dbo].[Orders_Update]
		@Total money
		,@TrackingCode varchar(100)
		,@TrackingUrl varchar(200)
		,@ShippingAddressId int
		,@PayerId varchar(200)
		,@PaymentId varchar(200)
		,@PaymentTypeId int
		,@StatusId int
		,@TotalPaid money
		,@BaseTotal money
		,@TaxTotal money
		,@TaxRate decimal(18, 3)
		,@Handling money
		,@Shipping money
		,@ShippingDiscount money
		,@Insurance money
		,@ModifiedBy int
		,@Id int

/* ---------------------- TEST CODE ---------------------------

DECLARE	@_Id int = 184

DECLARE 
		@_Total money = 188
		,@_TrackingCode varchar(100) = ''
		,@_TrackingUrl varchar(200) = ''
		,@_ShippingAddressId int = 115
		,@_PayerId varchar(200) = 'P-ID-3333'
		,@_PaymentId varchar(200) = 'PAY-ID-7777'
		,@_PaymentTypeId int = 1
		,@_StatusId int = 3
		,@_TotalPaid money = 188
		,@_BaseTotal money = 165.98
		,@_TaxTotal money = 12.03
		,@_TaxRate decimal(18, 3) = 7.25
		,@_Handling money = 10
		,@_Shipping money = 9.95
		,@_ShippingDiscount money = 5
		,@_Insurance money = 2
		,@_ModifiedBy int = 3

SELECT *
FROM dbo.Orders
WHERE Id = @_Id

SELECT *
FROM dbo.OrderCosts
WHERE OrderId = @_Id

Select *
FROM dbo.Inventory as i
	INNER JOIN dbo.OrderItems as oi
on oi.InventoryId = i.Id
WHERE OrderId = @_Id

EXECUTE [dbo].[Orders_Update]
		@_Total
		,@_TrackingCode
		,@_TrackingUrl
		,@_ShippingAddressId
		,@_PayerId
		,@_PaymentId
		,@_PaymentTypeId
		,@_StatusId
		,@_TotalPaid 
		,@_BaseTotal
		,@_TaxTotal
		,@_TaxRate
		,@_Handling
		,@_Shipping
		,@_ShippingDiscount
		,@_Insurance
		,@_ModifiedBy
		,@_Id


SELECT *
FROM dbo.Orders
WHERE Id = @_Id

SELECT *
FROM dbo.OrderCosts
WHERE OrderId = @_Id

Select *
FROM dbo.Inventory as i
	INNER JOIN dbo.OrderItems as oi
on oi.InventoryId = i.Id
WHERE OrderId = @_Id

*/

as

BEGIN

Declare @DatNow datetime2(7) = getutcdate()

Declare @CurrentStatusId as Table (OrderId int, CurrentStatus int)

INSERT	INTO @CurrentStatusId	(OrderId, CurrentStatus)
		SELECT	@Id
				,o.StatusId
		FROM dbo.Orders as o
		WHERE Id = @Id

UPDATE	i
	Set ModifiedBy = @ModifiedBy
		,DateModified = @DatNow 
		,Quantity = (i.Quantity - oi.Quantity)		
	FROM dbo.Inventory as i
		INNER JOIN dbo.OrderItems as oi
	on i.Id = oi.InventoryId
		INNER JOIN @CurrentStatusId as csi
	on oi.OrderId = csi.OrderId
	Where oi.OrderId IN (@Id) AND @StatusId IN (1, 2, 4) AND csi.CurrentStatus IN (3, 5)

UPDATE	i
	Set ModifiedBy = @ModifiedBy
		,DateModified = @DatNow 
		,Quantity = (i.Quantity + oi.Quantity)		
	FROM dbo.Inventory as i
		INNER JOIN dbo.OrderItems as oi
	on i.Id = oi.InventoryId
		INNER JOIN @CurrentStatusId as csi
	on oi.OrderId = csi.OrderId
	Where oi.OrderId IN (@Id) AND @StatusId IN (3, 5) AND csi.CurrentStatus IN (1, 2, 4)

UPDATE	[dbo].[Orders]
	SET	DateModified = @DatNow
		,Total = @Total
		,TrackingCode = @TrackingCode
		,TrackingUrl = @TrackingUrl
		,ShippingAddressId = @ShippingAddressId
		,PayerId = @PayerId
		,PaymentId = @PaymentId
		,PaymentTypeId = @PaymentTypeId
		,StatusId = @StatusId
		,ModifiedBy = @ModifiedBy
	WHERE Id = @Id

	EXECUTE [dbo].[OrderCosts_Update]
		@TotalPaid 
		,@BaseTotal
		,@TaxTotal
		,@TaxRate
		,@Handling
		,@Shipping
		,@ShippingDiscount
		,@Insurance
		,@ModifiedBy
		,@Id

END
