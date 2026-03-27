using Microsoft.EntityFrameworkCore;
using YellowCarGame.Api.Data;
using YellowCarGame.Api.Models.Database;

namespace YellowCarGame.Api.Repositories
{
    public interface IUserRepository
    {
        /// <summary>
        /// Asynchronously retrieves a user by their unique identifier, optionally including related entities in the
        /// query.
        /// </summary>
        /// <param name="id">The unique identifier of the user to retrieve.</param>
        /// <param name="include">An optional function to specify related entities to include in the query. If null, only the user entity is
        /// retrieved.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the user with the specified
        /// identifier, or null if no user is found.</returns>
        public Task<User?> GetByIdAsync(Guid id, Func<IQueryable<User>, IQueryable<User>>? include = null);

        /// <summary>
        /// Asynchronously retrieves a user by their unique identifier, optionally including related entities in the
        /// query.
        /// </summary>
        /// <param name="id">The unique identifier of the user to retrieve. Cannot be null or empty.</param>
        /// <param name="include">An optional function to specify related entities to include in the query. If null, only the user entity is
        /// retrieved.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the user with the specified
        /// identifier, or null if no user is found.</returns>
        public Task<User?> GetByIdAsync(string id, Func<IQueryable<User>, IQueryable<User>>? include = null);

        /// <summary>
        /// Asynchronously retrieves a user by their username.
        /// </summary>
        /// <param name="username">The username of the user to retrieve. Cannot be null or empty.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains the user associated with the
        /// specified username, or null if no such user exists.</returns>
        public Task<User?> GetByUsernameAsync(string username);

        /// <summary>
        /// Creates a new user asynchronously.
        /// </summary>
        /// <param name="user">The user to create. Cannot be null.</param>
        /// <returns>A task that represents the asynchronous create operation.</returns>
        public Task CreateAsync(User user);

        /// <summary>
        /// Updates the specified user with new information asynchronously.
        /// </summary>
        /// <param name="user">The user entity containing updated information. Cannot be null.</param>
        /// <returns>A task that represents the asynchronous update operation.</returns>
        public Task UpdateAsync(User user);

        /// <summary>
        /// Deletes the specified user from the system asynchronously.
        /// </summary>
        /// <param name="user">The user to be deleted. Cannot be null.</param>
        /// <returns>A task that represents the asynchronous delete operation.</returns>
        public Task DeleteAsync(User user);
    }

    public class UserRepository(AppDbContext dbContext) : IUserRepository
    {
        public async Task<User?> GetByIdAsync(
            Guid id,
            Func<IQueryable<User>, IQueryable<User>>? include = null)
        {
            IQueryable<User> query = dbContext.Users;

            if (include != null)
                query = include(query);

            return await query.FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User?> GetByIdAsync(
            string id,
            Func<IQueryable<User>, IQueryable<User>>? include = null)
        {
            if (Guid.TryParse(id, out var userId))
            {
                return await GetByIdAsync(userId, include);
            }
            
            throw new ArgumentException("Invalid user ID format. Expected a GUID string.", nameof(id));
        }

        public async Task<User?> GetByUsernameAsync(string username)
        {
            return await dbContext.Users.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task CreateAsync(User user)
        {
            await dbContext.Users.AddAsync(user);
            await dbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(User user)
        {
            dbContext.Users.Update(user);
            await dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(User user)
        {
            if (!user.IsDisabled)
                throw new InvalidOperationException("Cannot delete an active user. Please disable the user first.");

            dbContext.Users.Remove(user);
            await dbContext.SaveChangesAsync();
        }
    }
}
