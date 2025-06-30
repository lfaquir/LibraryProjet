using System.Text.Json.Serialization;

public class UserDto
{
    public int? Id { get; set; }
    public required string Username { get; set; }

    [JsonPropertyName("email")]
    public required string Email { get; set; }

    [JsonPropertyName("password")]
    public required string Password { get; set; }
    public required string Role { get; set; }
    
}