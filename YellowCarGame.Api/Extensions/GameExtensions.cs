using YellowCarGame.Api.GameEngine;

namespace YellowCarGame.Api.Extensions
{
    public static class GameExtensions
    {
        public static void AddGameEngine(this IServiceCollection services)
        {
            services.AddSignalR();
            services.AddSingleton<GameManager>();
            services.AddHostedService<GameLoopService>();
        }

        public static void UseGameEngine(this WebApplication app)
        {
            app.UseWebSockets();
            app.MapHub<GameHub>("/game/hub");
        }
    }
}
