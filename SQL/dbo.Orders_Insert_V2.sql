-- ==============================================================
-- Author:			Cameron Gibson
-- Create date:		11/01/2021
-- Description:		Insert Orders & PaymentTypes
-- Code Reviewer:	Chan Park


-- MODIFIED BY:		Jonathan Price
-- MODIFIED DATE:	12/2/2021
-- Code Reviewer: 
-- Note: ShippingAddressId references Id column of dbo.Locations

-- MODIFIED BY:		BradLee Webster
-- MODIFIED DATE:	12/7/2021
-- Code Reviewer: 
-- Note:			Added the execution of the UserOrder insert proc to
--					add the order Id and user Id to a bridge table.

-- ==============================================================



ALTER proc [dbo].[Orders_Insert_V2]
		@Total money
		,@TrackingCode varchar(100)
		,@TrackingUrl varchar(200)
		,@ShippingAddressId int
		,@PayerId varchar(200)
		,@PaymentId varchar(200)
		,@PaymentTypeId int
		,@CreatedBy int
		,@Id int OUTPUT

/* ---------------------- TEST CODE ---------------------------

DECLARE	@_Id int = 0

DECLARE 
		@_Total money = 19.95
		,@_TrackingCode varchar(100) = ''
		,@_TrackingUrl varchar(200) = ''
		,@_ShippingAddressId int = 26
		,@_PayerId varchar(200) = 'P-ID-2222'
		,@_PaymentId varchar(200) = 'PAY-ID-7171'
		,@_PaymentTypeId int = 1
		,@_CreatedBy int = 8502

EXECUTE [dbo].[Orders_Insert_V2]
		@_Total
		,@_TrackingCode
		,@_TrackingUrl
		,@_ShippingAddressId
		,@_PayerId
		,@_PaymentId
		,@_PaymentTypeId
		,@_CreatedBy
		,@_Id OUTPUT

SELECT *
FROM dbo.Orders
WHERE Id = @_Id

SELECT *
FROM dbo.UserOrders
WHERE OrderId = @_Id

DELETE 
FROM dbo.UserOrders
WHERE OrderId = @_Id

DELETE
FROM dbo.Orders
WHERE Id = @_Id

SELECT *
FROM dbo.Orders
WHERE Id = @_Id

SELECT *
FROM dbo.UserOrders
WHERE OrderId = @_Id


*/

as

BEGIN

INSERT INTO [dbo].[Orders]
           ([Total]
		   ,[TrackingCode]
		   ,[TrackingUrl]
		   ,[ShippingAddressId]
		   ,[PayerId]
           ,[PaymentId]
           ,[PaymentTypeId]
           ,[CreatedBy]
           ,[ModifiedBy])
	 VALUES
           (@Total
		   ,@TrackingCode
		   ,@TrackingUrl
		   ,@ShippingAddressId
		   ,@PayerId
           ,@PaymentId
           ,@PaymentTypeId
           ,@CreatedBy
           ,@CreatedBy)

	SET @Id = SCOPE_IDENTITY()

EXECUTE dbo.UserOrders_Insert	 @CreatedBy
								,@Id

END
