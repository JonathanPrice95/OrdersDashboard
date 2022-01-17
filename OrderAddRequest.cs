using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Sabio.Models.Requests.Orders
{
    public class OrderAddRequest
    {
        [Required]
        [Range(0, int.MaxValue)]
        public decimal Total { get; set; }

        [StringLength(100, MinimumLength = 0)]
        public string TrackingCode { get; set; }

        [StringLength(200, MinimumLength = 0)]
        public string TrackingUrl { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int ShippingAddressId { get; set; }

        [Required]
        [StringLength(200, MinimumLength = 1)]
        public string PayerId { get; set; }

        [Required]
        [StringLength(255, MinimumLength = 1)]
        public string PaymentId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int PaymentTypeId { get; set; }
        
    }
}
