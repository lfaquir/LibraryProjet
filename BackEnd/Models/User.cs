using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication1.Models{
    public class User
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public required string UserName { get; set; }

        [Required]
        public required string PasswordHash { get; set; }

        [Required]
        [EmailAddress]
        public required string UserEmail { get; set; }
        public required string Role { get; set; } 
        public string? ImageFileName { get; set; }
        public string? ContentType { get; set; }
        public byte[]? ImageData { get; set; }
        
    }
}