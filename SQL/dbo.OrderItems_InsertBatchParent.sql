-- ==============================================================
-- Author:			Jonathan Price
-- Create date:		1/1/2022
-- Description:		Insert Batch Order Items Parent
-- Code Reviewer:	 


-- MODIFIED BY:		 
-- MODIFIED DATE:	 
-- Code Reviewer: 
-- Note:  
-- ==============================================================

ALTER proc [dbo].[OrderItems_InsertBatchParent]
		@BatchItems dbo.ShoppingCartItems READONLY

as

/****************** Test Code ----------------------------

Select *
from dbo.OrderItems
Order by Id desc

Declare @NewOrderItems dbo.ShoppingCartItems
Declare @Id int = 0

INSERT into @NewOrderItems (OrderId, ProductId, Quantity, CreatedBy, ModifiedBy)
Values		(131, 6, 10, 8557, 8557),
			(131, 10, 10, 8557, 8557),
			(131, 92, 10, 8557, 8557),
			(131, 93, 10, 8557, 8557)

Execute dbo.OrderItems_InsertBatchParent
			@NewOrderItems

Select *
from dbo.OrderItems
Order by Id desc

*/

BEGIN

	Execute dbo.OrderItems_InsertBatch
			@BatchItems

END
