using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class OrderItem
    {
        public int Id { get; set; }

        public int OrderId { get; set; }

        public int InventoryId { get; set; }

        public int Quantity { get; set; }

        public DateTime DateAdded { get; set; }

        public DateTime DateModified { get; set; }

        public User CreatedBy { get; set; }

        public User ModifiedBy { get; set; }
    }
}
