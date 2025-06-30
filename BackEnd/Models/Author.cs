using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Models{
    public class Author
    {

        public int Id { get; set; }

        [Required(ErrorMessage = "The 'Author Name' field is required.")]
        public required string AuthorName { get; set; }
        
        public string? ImageFileName { get; set; }
        public string? ContentType { get; set; }
        public byte[]? ImageData { get; set; }
    }
}


