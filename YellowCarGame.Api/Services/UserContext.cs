using System.Security.Claims;
using YellowCarGame.Api.Models.Database;
using YellowCarGame.Api.Repositories;

namespace YellowCarGame.Api.Services
{
    public interface IUserContext
    {
        /// <summary>
        /// Asynchronously retrieves the currently signed-in user, if any.
        /// </summary>
        /// <param name="include">An optional function to include related entities in the query. If specified, this function is applied to the
        /// user query to customize which related data is loaded.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the signed-in user if one is
        /// available; otherwise, null.</returns>
        public Task<User?> GetCurrentUserAsync(Func<IQueryable<User>, IQueryable<User>>? include = null);
    }

    public class UserContext(IUserRepository userRepository, IHttpContextAccessor httpContextAccessor) : IUserContext
    {
        public async Task<User?> GetCurrentUserAsync(Func<IQueryable<User>, IQueryable<User>>? include = null)
        {
            var contextUser = httpContextAccessor.HttpContext?.User;

            if (contextUser?.Identity != null && contextUser.Identity.IsAuthenticated)
            {
                var userId = contextUser.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                    return null;

                if (Guid.TryParse(userId, out var id))
                {
                    var user = await userRepository.GetByIdAsync(id, include);

                    return user;
                }
            }

            return null;
        }
    }
}
