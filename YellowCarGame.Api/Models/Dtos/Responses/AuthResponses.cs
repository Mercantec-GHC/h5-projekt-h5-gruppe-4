using YellowCarGame.Api.Enums;
using YellowCarGame.Api.Models.Database;

namespace YellowCarGame.Api.Models.Dtos.Responses
{
    public record LoginResponse(string JwtToken, int ExpiresIn, string RefreshToken);
    public record RegisterResponse(Guid UserId);

    public class UserInfoResponse
    {
        public Guid Id { get; }
        public string Username { get; }
        public string Role { get; }

        public UserInfoResponse(User user)
        {
            Id = user.Id;
            Username = user.Username;
            Role = user.Role.ToString();
        }

        public User MapUser()
        {
            return new User
            {
                Id = Id,
                Username = Username,
                Role = Enum.Parse<Roles>(Role)
            };
        }
    }
}
