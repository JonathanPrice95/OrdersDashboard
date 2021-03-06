-- ==============================================================
-- Author:			Jonathan Price
-- Create date:		1/1/2022
-- Description:		Insert Batch Order Items
-- Code Reviewer:	 


-- MODIFIED BY:		 
-- MODIFIED DATE:	 
-- Code Reviewer: 
-- Note:  
-- ==============================================================

ALTER proc [dbo].[OrderItems_InsertBatch]
		@BatchItems dbo.ShoppingCartItems READONLY

as

/****************** Test Code ----------------------------

Select *
from dbo.OrderItems
Order by Id desc

Declare @NewOrderItems dbo.ShoppingCartItems
Declare @Id int = 0

INSERT into @NewOrderItems (OrderId, ProductId, Quantity, CreatedBy, ModifiedBy)
Values		(132, 100, 15, 8557, 8557),
			(132, 101, 10, 8557, 8557)

Execute dbo.OrderITems_InsertBatch
			@NewOrderItems

Select *
from dbo.OrderItems
Order by Id desc

*/

BEGIN

Declare @IdOrderItemsResults as Table (Id int, InventoryId int)

INSERT into dbo.OrderItems	(OrderId		
							, InventoryId
							, Quantity
							, CreatedBy
							, ModifiedBy
							)

OUTPUT	INSERTED.Id
		,INSERTED.InventoryId

INTO	@IdOrderItemsResults
		(Id
		,InventoryId
		)

SELECT	bi.OrderId
		,i.Id
		,bi.Quantity
		,bi.CreatedBy
		,bi.ModifiedBy
FROM @BatchItems as bi
		inner join dbo.Inventory as i
	on bi.ProductId = i.ProductId

SELECT	Id	
		,InventoryId
FROM @IdOrderItemsResults

END

