using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Models;


[Authorize]
[ApiController]
[Route("api/books")]
public class BookApiController: Controller{

    private readonly AppDbContext _context;
    private readonly ILogger<BookApiController> _logger;

    public BookApiController(AppDbContext context, ILogger<BookApiController> logger){
        _context = context;
        _logger = logger;
    }


    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var books = await _context.books
            .Include(b => b.Author)
            .Select(b => new Book
            {
                Id = b.Id,
                Title = b.Title,
                Description = b.Description,
                AuthorId = b.AuthorId,
                AuthorName = b.Author != null ? b.Author.AuthorName : string.Empty
            })
            .ToListAsync();

        _logger.LogInformation("Recovered Books: {@Books}", books);
        return Ok(books);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Details(int id)
    {
        var book = await _context.books.Include(b => b.Author).Where(a => a.Id == id)
        .Select(a => new Book
        {
            Id = a.Id,
            Title = a.Title,
            AuthorId = a.AuthorId,
            Description = a.Description,
            AuthorName = a.Author != null ? a.Author.AuthorName : string.Empty,
            ImageData = a.ImageData,
            ImageFileName = a.ImageFileName,
            ContentType = a.ContentType
        })
        .FirstOrDefaultAsync();

        if (book == null)
            return NotFound();

        return Ok(book);
    }

    [AllowAnonymous]
    [HttpGet("{id}/image")]
    public async Task<IActionResult> GetImage(int id)
    {
        var book = await _context.books.FindAsync(id);
        if (book == null || book.ImageData == null)
            return NotFound();

        return File(book.ImageData, book.ContentType ?? "image/jpeg");
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Book book)
    {
        try
        {
            var newBook = new Book
            {
                Title = book.Title,
                Description = book.Description,
                AuthorId = book.AuthorId
            };

            _context.books.Add(newBook);
            await _context.SaveChangesAsync();

            return Ok(newBook);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating a book");
            return StatusCode(500, "Internal Server Error");
        }
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id){
        var existingBook = await _context.books.FirstOrDefaultAsync(a => a.Id == id );
        if (existingBook==null){
            return NotFound();
        }

        _context.books.Remove(existingBook);
        await _context.SaveChangesAsync();

        return Ok(existingBook);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBook(int id, [FromForm] Book bookDto, [FromForm] IFormFile? image)
    {
        var book = await _context.books.FindAsync(id);

        if (book == null)
        {
            return NotFound("Book not found.");
        }

        book.Title = bookDto.Title;
        book.Description = bookDto.Description;
        book.AuthorId = bookDto.AuthorId;

        if (image != null && image.Length > 0)
        {
            using var memoryStream = new MemoryStream();
            await image.CopyToAsync(memoryStream);
            book.ImageData = memoryStream.ToArray();
            book.ImageFileName = image.FileName;
            book.ContentType = image.ContentType;
        }

        try
        {
            await _context.SaveChangesAsync();
            return Ok(new { message = "Book updated successfully." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updationg book");
            return StatusCode(500, "Error server : " + ex.Message);
        }
    }

}