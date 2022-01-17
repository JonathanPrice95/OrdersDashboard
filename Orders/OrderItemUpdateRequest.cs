using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Requests.Orders
{
    public class OrderItemUpdateRequest : OrderItemAddRequest, IModelIdentifier
    {
        public int Id { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int InventoryId { get; set; }
    }
}
