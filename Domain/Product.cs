using System;

namespace Sabio.Models.Domain
{
    public class Product
    {
        public int Id { get; set; }
        public string SKU { get; set; }
        public string Name { get; set; }
        public string Manufacturer { get; set; }
        public int Year { get; set; }
        public string Description { get; set; }
        public string Specifications { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public ProductCategory Category { get; set; }
        public LookUp SizeType { get; set; }
        public Color Color { get; set; }
        public LookUp ConditionType { get; set; }
        public string Material { get; set; }
        public bool IsVisible { get; set; }
        public bool IsActive { get; set; }
        public string PrimaryImage { get; set; }
        public User CreatedBy { get; set; }
        public User ModifiedBy { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }

    }
}
