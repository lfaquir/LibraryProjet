using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebApplication1.Models;
using WebApplication1.Data;
using Microsoft.EntityFrameworkCore;



    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // [HttpPost("registre")]
        // public IActionResult Register(RegistreDto request)
        // {
        //     var userExists = _context.users.FirstOrDefault(u => u.UserName == request.Username);
        //     if (userExists != null) return BadRequest("User already exists.");

        //     var user = new User
        //     {
        //         UserName = request.Username,
        //         UserEmail = request.Email,
        //         PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
        //         Role = request.Role
        //     };

        //     try{
        //         _context.users.Add(user);
        //     var result = _context.SaveChanges();
        //     Console.WriteLine("Nombre de lignes enregistrées : " + result);

        //     return Ok("User registered successfully.");

        //     }catch(Exception ex){
        //         Console.WriteLine("Erreur lors de l'enregistrement : " + ex.Message);
        //         return StatusCode(500, "Erreur serveur lors de l'enregistrement de l'utilisateur.");
        //     }
            
        // }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            Console.WriteLine($"Reçu : Email = {loginDto.Email}, Password = {loginDto.Password}");

            var user = await _context.users.FirstOrDefaultAsync(u => u.UserEmail == loginDto.Email);
            
            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                
                return Unauthorized("Invalid credentials");

            var token = CreateToken(user);

            return Ok(new { token });
        }

        private string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.UserEmail),
                new Claim("role", user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

