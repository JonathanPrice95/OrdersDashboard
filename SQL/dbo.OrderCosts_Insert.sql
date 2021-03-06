-- ==============================================================
-- Author:			Jonathan Price
-- Create date:		1/2/2022
-- Description:		Insert Order Cost
-- Code Reviewer:	Neftaly Perez

-- Note: @Id is not an OUTPUT Parameter due to PARENT PROC "dbo.Orders_InsertByShoppingCart" requirement for OrderId to be the OUTPUT
-- Note: @TaxRate is hardcoded based on TaxTotal/BaseTotal


-- MODIFIED BY:		 Jonathan Price
-- MODIFIED DATE:	 1/13/2022
-- Code Reviewer:	 Victor Ibasco
-- Note: Hardcoded the tax rate until we can get this from the front end
-- ==============================================================

ALTER proc [dbo].[OrderCosts_Insert]
		@OrderId int
		,@Total money
		,@BaseTotal money
		,@TaxTotal money
		,@Handling money
		,@Shipping money
		,@ShippingDiscount money
		,@Insurance money
		,@CreatedBy int
		,@Id int 

/* ---------------------- TEST CODE ---------------------------

DECLARE	@_Id int = 0

DECLARE 
		@_OrderId int = 23
		,@_Total money = 22.95
		,@_BaseTotal money = 22.95
		,@_TaxTotal money = 0
		,@_Handling money = 0
		,@_Shipping money = 0
		,@_ShippingDiscount money = 0
		,@_Insurance money = 0
		,@_CreatedBy int = 8502

EXECUTE [dbo].[OrderCosts_Insert]
		@_OrderId
		,@_Total
		,@_BaseTotal
		,@_TaxTotal
		,@_Handling
		,@_Shipping
		,@_ShippingDiscount
		,@_Insurance
		,@_CreatedBy
		,@_Id

SELECT *
FROM dbo.OrderCosts
Where Id = (SELECT max(id) From dbo.OrderCosts)

*/

as

BEGIN

Declare @TaxRate decimal(18, 3) = 100 * (@TaxTotal/@BaseTotal)

INSERT INTO [dbo].[OrderCosts]
           ([OrderId]
		   ,[TotalPaid]
		   ,[BaseTotal]
           ,[TaxTotal]
		   ,[TaxRate]
           ,[Handling]
           ,[Shipping]
           ,[ShippingDiscount]
           ,[Insurance]
           ,[CreatedBy]
           ,[ModifiedBy])
     VALUES
           (@OrderId
		   ,@Total
		   ,@BaseTotal
           ,@TaxTotal
		   ,@TaxRate
           ,@Handling
           ,@Shipping
           ,@ShippingDiscount
           ,@Insurance
           ,@CreatedBy
           ,@CreatedBy)

	SET @Id = SCOPE_IDENTITY()

END
