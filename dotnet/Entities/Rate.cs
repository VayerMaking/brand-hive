using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace dotnet.Entities
{
    public class Rate
    {
        public int Id { get; set; }
        public int sellerId { get; set; }
        public AppUser seller { get; set; }
        public int clientId { get; set; }
        public AppUser client { get; set; }
        public int score { get; set; }

    }
}