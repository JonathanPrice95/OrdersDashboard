-- ==============================================================
-- Author:			Jonathan Price
-- Create date:		1/2/2022
-- Description:		Update Order Cost
-- Code Reviewer:	Neftaly Perez


-- MODIFIED BY:		Jonathan Price 
-- MODIFIED DATE:	1/13/2022 
-- Code Reviewer:	Victor Ibasco
-- Note:  Added Total Paid and Tax Rate
-- ==============================================================

ALTER proc [dbo].[OrderCosts_Update]
		@TotalPaid money
		,@BaseTotal money
		,@TaxTotal money
		,@TaxRate decimal(18, 3)
		,@Handling money
		,@Shipping money
		,@ShippingDiscount money
		,@Insurance money
		,@ModifiedBy int
		,@OrderId int

/* ---------------------- TEST CODE ---------------------------

DECLARE	@_OrderId int = 23

DECLARE 
		@_TotalPaid money = 20
		,@_BaseTotal money = 19.95
		,@_TaxTotal money = 1
		,@_TaxRate decimal(18, 3) = 7.25
		,@_Handling money = 0.50
		,@_Shipping money = 0.50
		,@_ShippingDiscount money = 2
		,@_Insurance money = 3
		,@_ModifiedBy int = 8502

SELECT *
FROM dbo.OrderCosts
WHERE OrderId = @_OrderId

EXECUTE [dbo].[OrderCosts_Update]
		@_TotalPaid
		,@_BaseTotal
		,@_TaxTotal
		,@_TaxRate
		,@_Handling
		,@_Shipping
		,@_ShippingDiscount
		,@_Insurance
		,@_ModifiedBy
		,@_OrderId

SELECT *
FROM dbo.OrderCosts
WHERE OrderId = @_OrderId

*/

as

BEGIN

Declare @DatNow datetime2(7) = getutcdate()

UPDATE [dbo].[OrderCosts]
	SET DateModified = @DatNow
		,TotalPaid = @TotalPaid
		,BaseTotal = @BaseTotal
        ,TaxTotal = @TaxTotal
		,TaxRate = @TaxRate
        ,Handling = @Handling
        ,Shipping = @Shipping
		,ShippingDiscount = @ShippingDiscount
        ,Insurance = @Insurance
        ,ModifiedBy = @ModifiedBy
	WHERE OrderId = @OrderId

END


