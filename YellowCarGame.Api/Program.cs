using Swagger.Bootstrap;
using YellowCarGame.Api.Data;
using YellowCarGame.Api.Extensions;

namespace YellowCarGame.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.AddServiceDefaults();

            // Add services to the container.
            builder.Services.AddDbContext<AppDbContext>();

            // Swagger configuration
            builder.Services.AddSwaggerGen();
            builder.Services.AddSwaggerBootstrap(options =>
            {
                options.UseExperimentalFeatures = true;
                options.UseAuthentication = true;
                options.loginOptions.LoginEndpoint = "/auth";
            });

            // Custom services
            builder.Services.AddJwtAuthentication(builder.Configuration);
            builder.Services.AddS3Connetion(builder.Configuration);
            builder.Services.AddApiRepositories();
            builder.Services.AddApiServices();
            builder.Services.AddGameEngine();

            builder.Services.AddControllers();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            var app = builder.Build();

            app.UseCors("AllowAll");

            app.MapDefaultEndpoints();

            if (app.Environment.IsDevelopment())
            {
                // Enable Swagger in development environment using Swagger.Bootstrap.
                app.UseSwagger();
                app.UseSwaggerBootstrap();
            }

            // Configure the HTTP request pipeline.
            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            // Custom middleware
            app.UseGameEngine();

            app.Run();
        }
    }
}
