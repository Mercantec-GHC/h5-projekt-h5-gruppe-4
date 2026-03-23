using YellowCarGame.Api.Enums;

namespace YellowCarGame.Api.Models.Database
{
    public class User : Common
    {
        public string Username { get; set; }
        public string HashedPassword { get; set; }

        public bool IsDisabled { get; set; } = false;

        public Roles Role { get; set; } = Roles.User;
    }
}
