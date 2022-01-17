using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class OrderDetail : OrderItem
    {
        public Product Product { get; set; }
        public decimal UnitCost { get; set; }
        public string CreatedByEmail { get; set; }
        public string ModifiedByEmail { get; set; }

    }
}
