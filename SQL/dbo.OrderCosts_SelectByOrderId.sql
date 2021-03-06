-- ==============================================================
-- Author:			Jonathan Price
-- Create date:		1/2/2022
-- Description:		Select Order Costs
-- Code Reviewer:	Neftaly Perez


-- MODIFIED BY:		 
-- MODIFIED DATE:	 
-- Code Reviewer: 
-- Note:  
-- ==============================================================

ALTER proc [dbo].[OrderCosts_SelectByOrderId]
		@OrderId int

/* ---------------------- TEST CODE ---------------------------

DECLARE	@_OrderId int = 23

EXECUTE [dbo].[OrderCosts_SelectByOrderId]
		@_OrderId

*/

as

BEGIN

SELECT	oc.OrderId
		,oc.BaseTotal
		,oc.TaxTotal
		,oc.Handling
		,oc.Shipping
		,oc.ShippingDiscount
		,oc.Insurance
		,(oc.BaseTotal + oc. TaxTotal + oc. Handling + oc.Shipping - oc.ShippingDiscount + oc.Insurance) as Total
		,oc.DateCreated
		,oc.DateModified
		,oc.CreatedBy
		,upc.FirstName
		,upc.Mi
		,upc.LastName
		,upc.AvatarUrl
		,oc.ModifiedBy
		,upm.FirstName
		,upm.Mi
		,upm.LastName
		,upm.AvatarUrl
	FROM dbo.OrderCosts as oc inner join dbo.UserProfiles as upc
		on oc.CreatedBy = upc.UserId
			inner join dbo.UserProfiles as upm
		on oc.ModifiedBy = upm.UserId
	WHERE oc.OrderId = @OrderId

END


