-- ==============================================================
-- Author:			Jonathan Price
-- Create date:		12/13/2021
-- Description:		Select Orders By Order Status
-- Code Reviewer:	Lefeba Gougis

-- MODIFIED BY:		Jonathan Price 
-- MODIFIED DATE:	12/18/2021
-- Code Reviewer:	Bailey Johnson
-- Note:			Added Address and Payment Type Columns

-- MODIFIED BY:		Jonathan Price
-- MODIFIED DATE:	12/27/2021
-- Code Reviewer:	Jefferson Egalite
-- Note: Added Selects to utilize Location Mapper Service in .Net

-- MODIFIED BY:		Jonathan Price
-- MODIFIED DATE:	1/10/2022
-- Code Reviewer:	Andrew Avitia
-- Note: Added OrderCost Details

-- MODIFIED BY:		Jonathan Price
-- MODIFIED DATE:	1/17/2022
-- Code Reviewer:	Victor Ibasco
-- Note: Added TaxRate, Select Order Descending
-- ==============================================================



ALTER proc [dbo].[Orders_Select_ByStatusId_Paginated]
		@StatusId int
		,@PageIndex int
		,@PageSize int

/* ---------------------- TEST CODE ---------------------------

DECLARE @_StatusId int = 1 

DECLARE 
		@_PageIndex int = 0
		,@_PageSize int = 50

EXECUTE [dbo].[Orders_Select_ByStatusId_Paginated]
		@_StatusId
		,@_PageIndex
		,@_PageSize

*/

as

BEGIN

Declare @Offset int = @PageIndex * @PageSize

SELECT	o.Id
		,o.Total
		,o.TrackingCode
		,o.TrackingUrl
		,o.PayerId
		,o.PaymentId
		,o.PaymentTypeId
		,p.PaymentType
		,o.StatusId
		,os.[Status]
		,o.DateCreated
		,o.DateModified
		,o.CreatedBy
		,upc.FirstName
		,upc.Mi
		,upc.LastName
		,upc.AvatarUrl
		,o.ModifiedBy
		,upm.FirstName
		,upm.Mi
		,upm.LastName
		,upm.AvatarUrl
		,l.Id as ShippingAddressId
		,lt.Id as LocationTypeId
		,lt.[Name] as ShippingAddressType
		,l.LineOne
		,l.LineTwo
		,l.City
		,l.Zip
		,s.Id as StateId
		,s.[Name] as State
		,l.Latitude
		,l.Longitude
		,l.CreatedBy
		,lupc.FirstName
		,lupc.Mi
		,lupc.LastName
		,lupc.AvatarUrl
		,l.ModifiedBy
		,lupm.FirstName
		,lupm.Mi
		,lupm.LastName
		,lupm.AvatarUrl
		,COALESCE ([oc].[TotalPaid], 0) as TotalPaid
		,COALESCE ([oc].[BaseTotal], 0) as BaseTotal
		,COALESCE ([oc].[TaxTotal], 0) as TaxTotal
		,COALESCE ([oc].[TaxRate], 0) as TaxRate
		,COALESCE ([oc].[Handling], 0) as Handling
		,COALESCE ([oc].[Shipping], 0) as Shipping
		,COALESCE ([oc].[ShippingDiscount], 0) as ShippingDiscount
		,COALESCE ([oc].[Insurance], 0) as Insurance
		,TotalCount = COUNT(1) OVER()
	FROM dbo.Orders as o inner join dbo.UserProfiles as upc
		on o.CreatedBy = upc.UserId
			inner join dbo.UserProfiles as upm
		on o.ModifiedBy = upm.UserId
			inner join dbo.OrdersStatus as os
		on o.StatusId = os.Id
			inner join dbo.Locations as l
		on o.ShippingAddressId = l.Id
			inner join dbo.States as s
		on l.StateId = s.Id
			inner join dbo.LocationTypes as lt
		on l.LocationTypeId = lt.Id
			inner join dbo.PaymentTypes as p
		on o.PaymentTypeId = p.Id
			inner join dbo.UserProfiles as lupc
		on l.CreatedBy = lupc.UserId
			inner join dbo.UserProfiles as lupm
		on l.ModifiedBy = lupm.UserId
			left join [dbo].[OrderCosts] as oc
		on o.Id = oc.OrderId
	WHERE StatusId = @StatusId
	Order by o.Id DESC

OFFSET @Offset ROWS

FETCH NEXT @PageSize ROWS ONLY;

END
