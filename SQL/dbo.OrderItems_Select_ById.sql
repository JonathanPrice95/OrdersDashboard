-- =====================================================================================
-- Author:			Jonathan Price
-- Create date:		12/03/2021
-- Description:		Select Order Items by Order Id
-- Code Reviewer:	Chan Park


-- MODIFIED BY:		Jonathan Price
-- MODIFIED DATE:	12/04/2021
-- Code Reviewer:	Joshua Magie
-- Note: Review changes to Created By and Modified By to use middle tier User Mapper Function
-- =====================================================================================

ALTER proc [dbo].[OrderItems_Select_ById]
			@OrderId int


/* ---------------------- TEST CODE ---------------------------

DECLARE	@_OrderId int = 23

EXECUTE [dbo].[OrderItems_Select_ById]
		@_OrderId

*/

as

BEGIN

SELECT	oi.Id
		,oi.OrderId
		,oi.InventoryId
		,oi.Quantity
		,oi.DateAdded
		,oi.DateModified
		,oi.CreatedBy
		,upc.FirstName
		,upc.Mi
		,upc.LastName
		,upc.AvatarUrl
		,oi.ModifiedBy
		,upm.FirstName
		,upm.Mi
		,upm.LastName
		,upm.AvatarUrl
	FROM dbo.OrderItems as oi inner join dbo.UserProfiles as upc
		on oi.CreatedBy = upc.UserId
			inner join dbo.UserProfiles as upm
		on oi.ModifiedBy = upm.UserId
	Where oi.OrderId = @OrderId
	Order by oi.DateAdded asc

END


