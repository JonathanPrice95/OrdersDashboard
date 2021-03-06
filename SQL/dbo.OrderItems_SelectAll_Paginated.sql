-- =====================================================================================
-- Author:			Jonathan Price
-- Create date:		12/03/2021
-- Description:		Select All Order Items (Paginated)
-- Code Reviewer:	Chan Park


-- MODIFIED BY:		Jonathan Price 
-- MODIFIED DATE:	12/04/2021
-- Code Reviewer:	Joshua Magie
-- Note: Review changes to Created By and Modified By to use middle tier User Mapper Function
-- =====================================================================================

ALTER proc [dbo].[OrderItems_SelectAll_Paginated]
			@PageIndex int
			,@PageSize int

/* ---------------------- TEST CODE ---------------------------

DECLARE @_PageIndex int = 0
		,@_PageSize int = 3

EXECUTE [dbo].[OrderItems_SelectAll_Paginated]
		@_PageIndex
		,@_PageSize

*/

as

BEGIN

DECLARE @Offset int = @PageIndex * @PageSize

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
		,TotalCount = COUNT(1) OVER()
	FROM dbo.OrderItems as oi inner join dbo.UserProfiles as upc
		on oi.CreatedBy = upc.UserId
			inner join dbo.UserProfiles as upm
		on oi.ModifiedBy = upm.UserId
	Order by oi.OrderId desc

OFFSET @Offset ROWS

FETCH NEXT @PageSize ROWS ONLY;

END


