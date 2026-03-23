namespace YellowCarGame.Api.Models.Dtos.Requests
{
    public record LoginRequest(string Username, string Password);
    public record RegisterRequest(string Username, string Password, string ConfirmPassword);
    public record RefreshTokenRequest(string RefreshToken);
    public record DeleteAccountRequest(string Password);
}
