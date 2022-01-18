using System.ComponentModel.DataAnnotations;

namespace dotnet.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string username { get; set; }
        [Required]
        public string firstName { get; set; }
        [Required]
        public string lastName { get; set; }
        [Required]
        public string password {get; set; }
        
    }
}