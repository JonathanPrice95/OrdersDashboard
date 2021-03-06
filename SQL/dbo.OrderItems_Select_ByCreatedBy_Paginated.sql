-- =====================================================================================
-- Author:			Jonathan Price
-- Create date:		12/03/2021
-- Description:		Select Order Items by Created By (Paginated)
-- Code Reviewer:


-- MODIFIED BY:		Jonathan Price		 
-- MODIFIED DATE:	12/04/2021 
-- Code Reviewer:	Joshua Magie
-- Note: Review changes to Created By and Modified By to use middle tier User Mapper Function
-- =====================================================================================

ALTER proc [dbo].[OrderItems_Select_ByCreatedBy_Paginated]
			@CreatedBy int
			,@PageIndex int
			,@PageSize int

/* ---------------------- TEST CODE ---------------------------

DECLARE	@_CreatedBy int = 1

DECLARE @_PageIndex int = 0
		,@_@PageSize int = 10

EXECUTE [dbo].[OrderItems_Select_ByCreatedBy_Paginated]
		@_CreatedBy
		,@_PageIndex
		,@_@PageSize

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
	Where oi.CreatedBy = @CreatedBy
	Order by oi.CreatedBy desc

OFFSET @Offset ROWS

FETCH NEXT @PageSize ROWS ONLY;

END


