using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class Order : OrderCost
    {
        public int Id { get; set; }
        public decimal Total { get; set; }
        public string TrackingCode { get; set; }
        public string TrackingUrl { get; set; }
        public Location Location { get; set; }
        public string PayerId { get; set; }
        public string PaymentId { get; set; }
        public int PaymentTypeId { get; set; }
        public string PaymentType { get; set; }
        public int StatusId { get; set; }
        public string Status { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public User CreatedBy { get; set; }
        public User ModifiedBy { get; set; }

    }
}
