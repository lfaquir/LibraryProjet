using System.ComponentModel.DataAnnotations.Schema;
using System.Xml.Serialization;

namespace WebApplication1.Models{
    public class Book
    {
        public int Id { get; set; }
        public required string Title { get; set; } = string.Empty;
        public required string Description { get; set; } = string.Empty;
        public int AuthorId { get; set; }

        [NotMapped] // ⬅ très important
        public string? AuthorName { get; set; }
        public Author? Author { get; set; }
        public string? ImageFileName { get; set; }
        public string? ContentType { get; set; }
        public byte[]? ImageData { get; set; }
    }
}


