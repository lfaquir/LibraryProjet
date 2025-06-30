using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;

[ApiController]
[Route("api/statistics")]
public class StatisticsApiController : Controller
{
    private readonly AppDbContext _context;
    private readonly ILogger<StatisticsApiController> _logger;
    public StatisticsApiController(AppDbContext context, ILogger<StatisticsApiController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetStatistics()
    {
        var bookStat = await _context.books.CountAsync();
        Console.WriteLine("nombre de livre = "+ bookStat);

        var authorStat = await _context.authors.CountAsync();
        var userStat = await _context.users.CountAsync();

        return Ok(
            new
            {
                books = bookStat,
                authors = authorStat,
                users = userStat
            }
        );
    }
}