/****** Object:  UserDefinedTableType [dbo].[ShoppingCartItems]    Script Date: 1/25/2022 5:42:19 PM ******/
CREATE TYPE [dbo].[ShoppingCartItems] AS TABLE(
	[OrderId] [int] NOT NULL,
	[ProductId] [int] NOT NULL,
	[Quantity] [int] NOT NULL,
	[CreatedBy] [int] NOT NULL,
	[ModifiedBy] [int] NOT NULL
)
GO


