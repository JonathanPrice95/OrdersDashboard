using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class OrderCost
    {
        public decimal TotalPaid { get; set; }
        public decimal BaseTotal { get; set; }
        public decimal TaxTotal { get; set; }
        public decimal TaxRate { get; set; }
        public decimal Handling { get; set; }
        public decimal Shipping { get; set; }
        public decimal ShippingDiscount { get; set; }
        public decimal Insurance { get; set; }
    }
}
