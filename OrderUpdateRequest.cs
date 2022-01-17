using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Requests.Orders
{
    public class OrderUpdateRequest : OrderAddRequest, IModelIdentifier
    {
        public int Id { get; set; }
        public int StatusId { get; set; }
        [Required]
        [Range(0, int.MaxValue)]
        public decimal TotalPaid { get; set; }
        [Required]
        [Range(0, int.MaxValue)]
        public decimal BaseTotal { get; set; }
        [Required]
        [Range(0, int.MaxValue)]
        public decimal TaxTotal { get; set; }
        [Required]
        [Range(0, int.MaxValue)]
        public decimal TaxRate { get; set; }
        [Required]
        [Range(0, int.MaxValue)]
        public decimal Handling { get; set; }
        [Required]
        [Range(0, int.MaxValue)]
        public decimal Shipping { get; set; }
        [Required]
        [Range(0, int.MaxValue)]
        public decimal ShippingDiscount { get; set; }
        [Required]
        [Range(0, int.MaxValue)]
        public decimal Insurance { get; set; }


    }
}
