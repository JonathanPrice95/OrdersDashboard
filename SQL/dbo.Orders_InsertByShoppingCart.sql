-- ==============================================================
-- Author:			Jonathan Price
-- Create date:		1/2/2022
-- Description:		Insert Location, Order, Order Costs, Payment, Batch Items, Empty Shopping Cart, and Adjust Inventory Quantity
-- Code Reviewer:	Neftaly Perez


-- MODIFIED BY:		 
-- MODIFIED DATE:	 
-- Code Reviewer: 
-- Note:  
-- ==============================================================



ALTER proc [dbo].[Orders_InsertByShoppingCart]
		@Id int OUTPUT
		,@LocationTypeId int
		,@LineOne nvarchar(255)
		,@LineTwo nvarchar(255)
		,@City nvarchar(255)
		,@ZIP nvarchar(50)
		,@StateShort varchar(2) 
		,@Latitude float
		,@Longitude float
		,@CreatedBy int

		,@Total money
		,@TrackingCode varchar(100)
		,@TrackingUrl varchar(200)
		,@PayerId varchar(200)
		,@PaymentId varchar(200)
		,@PaymentTypeId int

		,@BaseTotal money
		,@TaxTotal money
		,@Handling money
		,@Shipping money
		,@ShippingDiscount money
		,@Insurance money

		,@ReferenceUrl varchar(200)
		,@PayerEmail varchar(200)
		,@PayerFirstName varchar(50)
		,@PayerLastName varchar(50)
		,@PaymentStatus varchar(200)
		,@PaymentStatusId varchar(200)

		,@BatchItems dbo.ShoppingCartItems READONLY

/* ---------------------- TEST CODE ---------------------------

Declare	@_Id int = 0
Declare @_OrderId int = 0
Declare @NewOrderItems dbo.ShoppingCartItems

INSERT into @NewOrderItems (OrderId, ProductId, Quantity, CreatedBy, ModifiedBy)
Values		(0, 6, 2, 8502, 8502),
			(0, 10, 5, 8502, 8502),
			(0, 92, 10, 8502, 8502),
			(0, 93, 20, 8502, 8502)

DECLARE 
		@_LocationTypeId int = 3
		,@_LineOne nvarchar(255) = '123 Main Street'
		,@_LineTwo nvarchar(255) = 'Apt B'
		,@_City nvarchar(255) = 'Camas'
		,@_ZIP nvarchar(50) = '98607'
		,@_StateShort varchar(2) = 'WA' 
		,@_Latitude float = 0
		,@_Longitude float = 0
		,@_CreatedBy int = 8502

		,@_Total money = 19.95
		,@_TrackingCode varchar(100) = ''
		,@_TrackingUrl varchar(200) = ''
		,@_PayerId varchar(200) = 'Test Payer ID'
		,@_PaymentId varchar(200) = 'Test Payment ID'
		,@_PaymentTypeId int = 1
		
		,@_BaseTotal money = 18.50
		,@_TaxTotal money = 1.01
		,@_Handling money = 2
		,@_Shipping money = 0.49
		,@_ShippingDiscount money = 1
		,@_Insurance money = 3

		,@_ReferenceUrl varchar(200) = 'https://www.testreference.comly'
		,@_PayerEmail varchar(200)	= 'testemail@test.comly'
		,@_PayerFirstName varchar(50) = 'Adam'
		,@_PayerLastName varchar(50) = 'Smith'
		,@_PaymentStatus varchar(200) = 'Complete'
		,@_PaymentStatusId varchar(200) = 'PAYPALSTATUSID'

SELECT Id, ProductId, Quantity, DateModified, ModifiedBy
FROM dbo.Inventory
Order by Id

EXECUTE [dbo].[Orders_InsertByShoppingCart]
		@_Id OUTPUT
		,@_LocationTypeId
		,@_LineOne
		,@_LineTwo
		,@_City
		,@_ZIP
		,@_StateShort 
		,@_Latitude
		,@_Longitude
		,@_CreatedBy

		,@_Total
		,@_TrackingCode
		,@_TrackingUrl
		,@_PayerId
		,@_PaymentId
		,@_PaymentTypeId

		,@_BaseTotal
		,@_TaxTotal
		,@_Handling
		,@_Shipping
		,@_ShippingDiscount
		,@_Insurance

		,@_ReferenceUrl
		,@_PayerEmail
		,@_PayerFirstName
		,@_PayerLastName
		,@_PaymentStatus
		,@_PaymentStatusId

		,@NewOrderItems

SELECT *
FROM dbo.Locations
Where Id = (SELECT max(id) From dbo.Locations)

SELECT *
FROM dbo.Orders
Where Id = @_Id

SELECT *
FROM dbo.OrderCosts
Where OrderId = @_Id

SELECT *
FROM dbo.Payments
Where OrderId = @_Id

SELECT *
FROM dbo.OrderItems
Where OrderId = @_Id

Select *
FROM dbo.ShoppingCart
Where CreatedBy = @_CreatedBy

SELECT Id, ProductId, Quantity, DateModified, ModifiedBy
FROM dbo.Inventory
Order by Id

*/

as

BEGIN

Declare @StateId as int

SET @StateId =	(SELECT s.Id as StateId
				FROM dbo.States as s
				WHERE s.Code = @StateShort)

EXECUTE	dbo.Locations_Insert
			@Id OUT
			,@LocationTypeId
			,@LineOne
			,@LineTwo
			,@City
			,@Zip
			,@StateId
			,@Latitude
			,@Longitude
			,@CreatedBy

Declare @ShippingAddressId int = @Id

EXECUTE dbo.Orders_Insert_V2
		@Total
		,@TrackingCode
		,@TrackingUrl
		,@ShippingAddressId
		,@PayerId
		,@PaymentId
		,@PaymentTypeId
		,@CreatedBy
		,@Id OUTPUT 

Declare @OrderId int = @Id

EXECUTE dbo.OrderCosts_Insert
		@OrderId
		,@Total
		,@BaseTotal
		,@TaxTotal
		,@Handling
		,@Shipping
		,@ShippingDiscount
		,@Insurance
		,@CreatedBy
		,@Id

EXECUTE dbo.Payments_Insert
		@OrderId
		,@PaymentId
		,@PayerId
		,@ReferenceUrl
		,@PayerEmail
		,@PayerFirstName
		,@PayerLastName
		,@PaymentStatus
		,@PaymentStatusId
		,@CreatedBy
		,@Id

Declare @IdOrderItemsResults as Table (Id int, InventoryId int, Quantity int, CreatedBy int)

INSERT into dbo.OrderItems	(OrderId		
							,InventoryId
							,Quantity
							,CreatedBy
							,ModifiedBy
							)

OUTPUT	INSERTED.Id
		,INSERTED.InventoryId
		,INSERTED.Quantity
		,INSERTED.CreatedBy

INTO	@IdOrderItemsResults
		(Id
		,InventoryId
		,Quantity
		,CreatedBy
		)

SELECT	@OrderId
		,i.Id
		,bi.Quantity
		,bi.CreatedBy
		,bi.ModifiedBy
FROM	@BatchItems as bi
			inner join dbo.Inventory as i
		on bi.ProductId = i.ProductId

SELECT	Id	
		,InventoryId
FROM	@IdOrderItemsResults

EXECUTE dbo.ShoppingCart_DeleteByUser 
		@CreatedBy

UPDATE dbo.Inventory
	   Set	ModifiedBy = ioir.CreatedBy
			,Quantity -= ioir.Quantity
	   From @IdOrderItemsResults as ioir
	   Where ioir.InventoryId = dbo.Inventory.Id

END
