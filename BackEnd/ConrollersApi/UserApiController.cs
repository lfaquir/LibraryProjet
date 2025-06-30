using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using WebApplication1.Data;
using WebApplication1.Models;

//[Authorize]
[ApiController]
[Route("api/users")]
public class UserApiController : Controller
{
    private readonly AppDbContext _context;
    private readonly ILogger<UserApiController> _logger;
    public UserApiController(AppDbContext context, ILogger<UserApiController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _context.users.ToListAsync();
        _logger.LogInformation("Recovered users: {@Users}", users);
        Console.WriteLine("users : " + users);
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUser(int id)
    {
        var user = await _context.users.FirstOrDefaultAsync(x => x.Id == id);
        if (user == null)
        {
            return NotFound();
        }
        return Ok(user);
    }

    [AllowAnonymous]
    [HttpGet("{id}/image")]
    public async Task<IActionResult> GetImage(int id)
    {
        var user = await _context.users.FindAsync(id);
        if (user == null || user.ImageData == null)
            return NotFound();

        return File(user.ImageData, user.ContentType ?? "image/jpeg");
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
            return BadRequest("User ID not found in token.");

        var user = await _context.users
            .Where(u => u.Id == int.Parse(userIdClaim))
            .Select(u => new {
                u.UserName,
                u.UserEmail,
                u.Role,
                ImageData = u.ImageData != null ? Convert.ToBase64String(u.ImageData) : null,
                u.ContentType
            })
            .FirstOrDefaultAsync();

        if (user == null)
            return NotFound("User not found");

        return Ok(user);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _context.users.FirstOrDefaultAsync(x => x.Id == id);
        Console.WriteLine("user : ", user);
        if (user == null)
        {
            return NotFound();
        }
        _context.users.Remove(user);
        await _context.SaveChangesAsync();
        return Ok(user);
    }

    [HttpPost("registre")]
    public async Task<IActionResult> Register([FromForm] UserDto request, [FromForm] IFormFile? image)
    {
        if (request == null || image == null)
        {
            return BadRequest("Invalid data.");
        }

        var userExists = await _context.users.AnyAsync(u => u.UserName == request.Username);
        if (userExists) return BadRequest("User already exists.");

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

        var user = new User
        {
            UserName = request.Username,
            UserEmail = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role,
            ImageFileName = fileName,
            ContentType = contentType,
            ImageData = imageData
        };

        try
        {
            _context.users.Add(user);
            var result = await _context.SaveChangesAsync();
            Console.WriteLine("Nombre de lignes enregistrées : " + result);

            return Ok("User registered successfully.");

        }
        catch (Exception ex)
        {
            Console.WriteLine("Erreur lors de l'enregistrement : " + ex.Message);
            return StatusCode(500, "Erreur serveur lors de l'enregistrement de l'utilisateur.");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, [FromForm] UserDto userDto, [FromForm] IFormFile? image)
    {
        var user = await _context.users.FindAsync(id);

        if (user == null)
        {
            return NotFound("User not found.");
        }

        user.UserName = userDto.Username;
        user.UserEmail = userDto.Email;

        if (!string.IsNullOrWhiteSpace(userDto.Password))
        {
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);
        }

        user.Role = userDto.Role;

        if (image != null && image.Length > 0)
        {
            using var memoryStream = new MemoryStream();
            await image.CopyToAsync(memoryStream);
            user.ImageData = memoryStream.ToArray();
            user.ImageFileName = image.FileName;
            user.ContentType = image.ContentType;
        }

        try
        {
            await _context.SaveChangesAsync();
            return Ok(new { message = "User updated successfully." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors de la mise à jour de l'utilisateur");
            return StatusCode(500, "Erreur serveur : " + ex.Message);
        }
    }

}