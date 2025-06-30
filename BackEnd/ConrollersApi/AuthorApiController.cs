using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using WebApplication1.Data;
using WebApplication1.Models;


[Authorize]
[ApiController]
[Route("api/authors")]
public class AuthorApiController : Controller
{
    private readonly AppDbContext _context;
    private readonly ILogger<AuthorApiController> _logger;

    public AuthorApiController(AppDbContext context, ILogger<AuthorApiController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var authors = await _context.authors.ToListAsync();
        _logger.LogInformation("Recovered Authors: {@Authors}", authors);
        return Ok(authors);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Details(int id)
    {
        var author = await _context.authors.FirstOrDefaultAsync(a => a.Id == id);

        if (author == null)
            return NotFound();

        return Ok(author);
    }

    [AllowAnonymous]
    [HttpGet("{id}/image")]
    public async Task<IActionResult> GetImage(int id)
    {
        var author = await _context.authors.FindAsync(id);
        if (author == null || author.ImageData == null)
            return NotFound();

        return File(author.ImageData, author.ContentType ?? "image/jpeg");
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] string authorName, [FromForm] IFormFile? image)
    {
        var existingAuthor = await _context.authors
            .AnyAsync(a => a.AuthorName.ToLower() == authorName.ToLower());

        if (existingAuthor)
        {
            ModelState.AddModelError("AuthorName", "The author already exists.");
            return BadRequest(ModelState);
        }

        byte[]? imageData = null;
        string? fileName = null;
        string? contentType = null;

         if (image != null && image.Length > 0)
        {
            using var ms = new MemoryStream();
            await image.CopyToAsync(ms);
            imageData = ms.ToArray();
            fileName = image.FileName;
            contentType = image.ContentType;
        }

        var author = new Author
        {
            AuthorName = authorName,
            ImageFileName = fileName,
            ContentType = contentType,
            ImageData = imageData
        };

        await _context.authors.AddAsync(author);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Details), new { id = author.Id }, author);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id){
        var existingAuthor = await _context.authors.FirstOrDefaultAsync(a => a.Id == id);

        if(existingAuthor == null){
            return NotFound();
        }

        _context.authors.Remove(existingAuthor);
        await _context.SaveChangesAsync();

        return Ok(existingAuthor);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAuthor(int id, [FromForm] string authorName, [FromForm] IFormFile? image)
    {
        var author = await _context.authors.FindAsync(id);

        if (author == null)
        {
            return NotFound("Author not found.");
        }

        author.AuthorName = authorName;

        if (image != null && image.Length > 0)
        {
            using var memoryStream = new MemoryStream();
            await image.CopyToAsync(memoryStream);
            author.ImageData = memoryStream.ToArray();
            author.ImageFileName = image.FileName;
            author.ContentType = image.ContentType;
        }

        try
        {
            await _context.SaveChangesAsync();
            return Ok(new { message = "Author updated successfully." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating author");
            _logger.LogInformation("AuthorName reçu : {AuthorName}", authorName);
            return StatusCode(500, "Error server : " + ex.Message);
        } 
    }
}
