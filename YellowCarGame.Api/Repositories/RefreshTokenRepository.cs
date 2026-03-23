using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using YellowCarGame.Api.Data;
using YellowCarGame.Api.Models.Database;

namespace YellowCarGame.Api.Repositories
{
    public interface IRefreshTokenRepository
    {
        /// <summary>
        /// Asynchronously generates an authentication token for the specified user.
        /// </summary>
        /// <param name="user">The user for whom to generate the authentication token. Cannot be null.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the generated authentication
        /// token as a string.</returns>
        public Task<string> GenerateTokenAsync(User user);

        /// <summary>
        /// Asynchronously validates the specified refresh token and retrieves the associated user, if valid.
        /// </summary>
        /// <param name="refreshToken">The refresh token to validate. Cannot be null or empty.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the associated user if the token
        /// is valid; otherwise, null.</returns>
        public Task<User?> ValidateTokenAsync(string refreshToken);
    }

    public class RefreshTokenRepository(AppDbContext dbContext) : IRefreshTokenRepository
    {
        public async Task<string> GenerateTokenAsync(User user)
        {
            while (true)
            {
                var randomNumber = new byte[32];
                using (var rng = RandomNumberGenerator.Create())
                {
                    rng.GetBytes(randomNumber);
                    var token = Convert.ToBase64String(randomNumber);
                    if (await dbContext.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == token) is null)
                    {
                        await SaveTokenAsync(user, token);
                        return token;
                    }
                }
            }
        }

        public async Task<User?> ValidateTokenAsync(string refreshToken)
        {
            // Check if the refresh token is provided
            if (string.IsNullOrEmpty(refreshToken)) return null;

            // Check if the refresh token exists, is not revoked, and has not expired
            var token = await dbContext.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.Token == refreshToken && !rt.IsRevoked && rt.ExpiresAt > DateTime.UtcNow);
            
            if (token == null)
                return null;

            // Revoke the used refresh token
            token.IsRevoked = true;
            await dbContext.SaveChangesAsync();

            return token.User;
        }

        private async Task SaveTokenAsync(User user, string token)
        {
            var refreshToken = new RefreshToken
            {
                Token = token,
                UserId = user.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            };
            dbContext.RefreshTokens.Add(refreshToken);
            await dbContext.SaveChangesAsync();
        }
    }
}
