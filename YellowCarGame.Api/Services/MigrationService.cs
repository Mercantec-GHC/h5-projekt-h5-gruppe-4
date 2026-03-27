using Microsoft.EntityFrameworkCore;
using YellowCarGame.Api.Data;

namespace YellowCarGame.Api.Services
{
    public class MigrationService : IHostedService
    {
        private readonly IServiceProvider services;
        private readonly ILogger<MigrationService> logger;

        public MigrationService(IServiceProvider services, ILogger<MigrationService> logger)
        {
            this.services = services;
            this.logger = logger;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            const int maxRetries = 10;
            var delay = TimeSpan.FromSeconds(5);

            for (int attempt = 1; attempt <= maxRetries; attempt++)
            {
                try
                {
                    using var scope = services.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                    logger.LogInformation("Running migrations...");
                    if (db.Database.GetPendingMigrations().Any())
                        await db.Database.MigrateAsync(cancellationToken);
                    else
                        logger.LogInformation("No pending migrations.");

                    logger.LogInformation("Running seed-data...");
                    await SeedData.InitializeAsync(db, scope, cancellationToken);

                    logger.LogInformation("Migrations and seed-data done.");
                    return;
                }
                catch (Exception ex)
                {
                    logger.LogWarning(ex, "Migration/seed failed (attempt {Attempt}/{Max}).", attempt, maxRetries);

                    if (attempt == maxRetries)
                        throw;

                    await Task.Delay(delay, cancellationToken);
                }
            }
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
