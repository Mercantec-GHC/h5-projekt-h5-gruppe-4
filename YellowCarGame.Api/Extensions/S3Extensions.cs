using Minio;
using YellowCarGame.Api.Models.Options;
using YellowCarGame.Api.Services;

namespace YellowCarGame.Api.Extensions
{
    public static class S3Extensions
    {
        public static IServiceCollection AddS3Connetion(this IServiceCollection services, IConfiguration configuration)
        {
            var options = configuration.GetSection("S3").Get<S3Options>();
            if (options is null)
                throw new InvalidOperationException("S3 configuration is missing or invalid.");

            services.AddSingleton<IMinioClient>(sp =>
                new MinioClient()
                    .WithEndpoint(options.Endpoint)
                    .WithCredentials(options.AccessKey, options.SecretKey)
                    .WithSSL(options.UseSSL)
                    .Build()
            );

            services.AddScoped<IS3Service, MinioS3Service>();

            return services;
        }
    }
}
