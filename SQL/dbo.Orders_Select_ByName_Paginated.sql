-- ==============================================================
-- Author:			Jonathan Price
-- Create date:		12/16/2021
-- Description:		Select Orders By Customer Name
-- Code Reviewer:	Bailey Johnson


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
-- Note: Added TaxRate, Select Order by Descending
-- ==============================================================



ALTER proc [dbo].[Orders_Select_ByName_Paginated]
		@Name varchar(101)
		,@PageIndex int
		,@PageSize int

/* ---------------------- TEST CODE ---------------------------

DECLARE @_Name varchar(101) = 'Walton Jones' 

DECLARE 
		@_PageIndex int = 0
		,@_PageSize int = 25

EXECUTE [dbo].[Orders_Select_ByName_Paginated]
		@_Name
		,@_PageIndex
		,@_PageSize

*/

as

BEGIN

Declare @NameOne varchar(50) = null
Declare @NameTwo varchar(50) = null

		SET @NameOne = SUBSTRING(@Name, 0, PATINDEX('% %', @Name))
		SET @Name = SUBSTRING(@Name, LEN(@NameOne + ' ') + 1, LEN(@Name))

		SET @NameTwo = @Name

		SET @NameOne = REPLACE(@NameOne, ' ', '');
		SET @NameTwo = REPLACE(@NameTwo, ' ', '');

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
	WHERE	(upc.FirstName = @NameOne) OR 
			(upc.FirstName = @NameTwo) OR 
			(upc.LastName = @NameOne) OR 
			(upc.LastName = @NameTwo)
	Order by o.Id DESC

OFFSET @Offset ROWS

FETCH NEXT @PageSize ROWS ONLY;

END
