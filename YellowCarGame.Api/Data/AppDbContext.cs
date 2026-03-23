using Microsoft.EntityFrameworkCore;
using YellowCarGame.Api.Models.Database;

namespace YellowCarGame.Api.Data
{
    public class AppDbContext : DbContext
    {
        private readonly IConfiguration configuration;

        public DbSet<User> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options, IConfiguration configuration) : base(options)
        {
            this.configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            optionsBuilder.UseNpgsql(configuration.GetConnectionString("PostgresDb"));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User entity configuration
            // Unique index on Username
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            // Index on IsMarkedForDeletion for efficient querying of users marked for deletion
            modelBuilder.Entity<User>()
                .HasIndex(u => u.IsDisabled);

            // Store the Role enum as a string in the database for better readability and maintainability
            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            // RefreshToken entity configuration
            // Unique index on Token to ensure no duplicate refresh tokens
            modelBuilder.Entity<RefreshToken>()
                .HasIndex(rt => rt.Token)
                .IsUnique();

            // Index on ExpiresAt for efficient querying of expired tokens
            modelBuilder.Entity<RefreshToken>()
                .HasIndex(u => u.ExpiresAt);

            // Index on IsRevoked for efficient querying of revoked tokens
            modelBuilder.Entity<RefreshToken>()
                .HasIndex(u => u.IsRevoked);

            // Configure the relationship between RefreshToken and User
            modelBuilder.Entity<RefreshToken>()
                .HasOne(rt => rt.User)
                .WithMany()
                .HasForeignKey(rt => rt.UserId);
        }
    }
}
