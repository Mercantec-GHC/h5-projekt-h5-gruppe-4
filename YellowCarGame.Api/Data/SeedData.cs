using YellowCarGame.Api.Enums;
using YellowCarGame.Api.Models.Database;

namespace YellowCarGame.Api.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(AppDbContext db, IServiceScope serviceScope, CancellationToken cancellationToken)
        {
            if (!db.Users.Any(u => u.Role == Roles.Admin))
            {
                var user = new User
                {
                    Username = "admin"!,
                    HashedPassword = BCrypt.Net.BCrypt.HashPassword("admin"),
                    Role = Roles.Admin
                };

                db.Users.Add(user);
                await db.SaveChangesAsync(cancellationToken);
            }
        }
    }
}
