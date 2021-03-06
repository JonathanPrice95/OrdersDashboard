-- =====================================================================================
-- Author:			Jonathan Price
-- Create date:		12/19/2021
-- Description:		Select Order Item Details by Order Id
-- Code Reviewer:	Bailey Johnson


-- MODIFIED BY:		Jonathan Price
-- MODIFIED DATE:	12/28/2021
-- Code Reviewer:	Jefferson Egalite
-- Note:			Reorganized to use the Product Mapper in dotnet
-- =====================================================================================

ALTER proc [dbo].[OrderDetails_Select_ByOrderId]
			@OrderId int


/* ---------------------- TEST CODE ---------------------------

DECLARE	@_OrderId int = 25

EXECUTE [dbo].[OrderDetails_Select_ByOrderId]
		@_OrderId

*/

as

BEGIN

SELECT	oi.Id
		,oi.OrderId
		,oi.InventoryId
		,oi.Quantity
		,i.BasePrice as UnitCost
		,oi.DateAdded
		,oi.DateModified
		,oi.CreatedBy
		,upc.FirstName
		,upc.Mi
		,upc.LastName
		,upc.AvatarUrl
		,uc.Email as CreatedByEmail
		,oi.ModifiedBy
		,upm.FirstName
		,upm.Mi
		,upm.LastName
		,upm.AvatarUrl
		,um.Email as ModifiedByEmail
		,p.Id as ProductId
		,p.SKU as SKU
		,p.[Name] as ProductName
		,p.Manufacturer
		,p.[Year]
		,p.[Description]
		,p.Specifications
		,i.Quantity as InventoryQuantity
		,i.BasePrice as UnitCostDuplicate
		,pcat.Id as ProductCategoryId
		,pcat.[Name] as ProductCategoryName
		,pcat.[Description] as ProductCategoryDescription
		,pst.Id as SizeId
		,pst.[Name] as Size
		,c.Id as ColorId
		,c.[Name] as Color
		,c.Hex
		,pct.Id as ConditionId
		,pct.[Name] as Condition
		,p.Material 
		,p.[IsVisible]
		,p.[IsActive]
		,p.PrimaryImage as [Image]
		,uppc.UserId as ProductCreatedBy
		,uppc.FirstName
		,uppc.Mi
		,uppc.LastName
		,uppc.AvatarUrl
		,uppm.UserId as ProductModifiedBy
		,uppm.FirstName
		,uppm.Mi
		,uppm.LastName
		,uppm.AvatarUrl
		,p.DateCreated as ProductDateCreated
		,p.DateModified	as ProductDateModified
		,oc.TotalPaid
		,oc.BaseTotal
		,oc.TaxTotal
		,oc.Handling
		,oc.Shipping
		,oc.ShippingDiscount
		,oc.Insurance
	FROM dbo.OrderItems as oi inner join dbo.Orders as o
		on oi.OrderId = o.Id
			inner join dbo.UserProfiles as upc
		on oi.CreatedBy = upc.UserId
			inner join dbo.UserProfiles as upm
		on oi.ModifiedBy = upm.UserId
			inner join dbo.Users as uc
		on o.CreatedBy = uc.Id
			inner join dbo.Users as um
		on o.CreatedBy = um.Id
			inner join dbo.Inventory as i
		on oi.InventoryId = i.Id
			inner join dbo.Products as p
		on i.ProductId = p.Id
			inner join dbo.ProductSizeTypes as pst
		on p.ProductSizeTypeId = pst.Id
			inner join dbo.Colors as c
		on p.ColorId = c.Id
			inner join dbo.ProductConditionTypes as pct
		on p.ConditionTypeId = pct.Id
			inner join dbo.ProductCategoryV2 as pcat
		on p.CategoryId = pcat.Id
			inner join [dbo].[UserProfiles] as uppc
		on p.CreatedBy = uppc.UserId 
			inner join [dbo].[UserProfiles] as uppm
		on p.ModifiedBy = uppm.UserId
			left join [dbo].[OrderCosts] as oc
		on oi.OrderId = oc.OrderId
	Where oi.OrderId = @OrderId
	Order by oi.DateAdded asc

END


