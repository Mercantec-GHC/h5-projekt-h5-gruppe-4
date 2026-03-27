using YellowCarGame.Api.Repositories;
using YellowCarGame.Api.Services;

namespace YellowCarGame.Api.Extensions
{
    public static class ServiceExtensions
    {
        public static void AddApiRepositories(this IServiceCollection services)
        {
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        }

        public static void AddApiServices(this IServiceCollection services)
        {
            services.AddHostedService<MigrationService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IUserContext, UserContext>();
        }
    }
}
