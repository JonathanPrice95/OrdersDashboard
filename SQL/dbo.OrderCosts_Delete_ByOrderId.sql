-- ==============================================================
-- Author:			Jonathan Price
-- Create date:		1/2/2022
-- Description:		Delete Order Costs by Order Id
-- Code Reviewer:	Neftaly Perez


-- MODIFIED BY:		 
-- MODIFIED DATE:	 
-- Code Reviewer:	 
-- Note:  
-- ==============================================================



ALTER proc [dbo].[OrderCosts_Delete_ByOrderId]
		@OrderId int


/* ---------------------- TEST CODE ---------------------------

DECLARE @_OrderId int = 155 

SELECT *
FROM dbo.OrderCosts
Where OrderId = @_OrderId

EXECUTE [dbo].[OrderCosts_Delete_ByOrderId]
		@_OrderId

SELECT *
FROM dbo.OrderCosts
Where OrderId = @_OrderId

*/

as

BEGIN

DELETE FROM dbo.OrderCosts
	WHERE OrderId = @OrderId

END
