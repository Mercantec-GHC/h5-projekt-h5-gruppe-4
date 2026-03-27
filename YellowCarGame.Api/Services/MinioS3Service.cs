using Minio;
using Minio.DataModel.Args;

namespace YellowCarGame.Api.Services
{
    public interface IS3Service
    {
        Task UploadAsync(string bucket, string objectName, Stream data, string contentType);
        Task<Stream> DownloadAsync(string bucket, string objectName);
        Task<bool> ExistsAsync(string bucket, string objectName);
        Task DeleteAsync(string bucket, string objectName);
        Task<string> GetPresignedUrlAsync(string bucket, string objectName, int expirySeconds = 600);
    }

    public class MinioS3Service(IMinioClient minio) : IS3Service
    {
        public async Task UploadAsync(string bucket, string objectName, Stream data, string contentType)
        {
            bool exists = await minio.BucketExistsAsync(
                new BucketExistsArgs().WithBucket(bucket)
            );

            if (!exists)
            {
                await minio.MakeBucketAsync(
                    new MakeBucketArgs().WithBucket(bucket)
                );
            }

            await minio.PutObjectAsync(
                new PutObjectArgs()
                    .WithBucket(bucket)
                    .WithObject(objectName)
                    .WithStreamData(data)
                    .WithObjectSize(data.Length)
                    .WithContentType(contentType)
            );
        }

        public async Task<Stream> DownloadAsync(string bucket, string objectName)
        {
            var ms = new MemoryStream();

            await minio.GetObjectAsync(
                new GetObjectArgs()
                    .WithBucket(bucket)
                    .WithObject(objectName)
                    .WithCallbackStream(stream =>
                    {
                        stream.CopyTo(ms);
                    })
            );

            ms.Position = 0;
            return ms;
        }

        public async Task<bool> ExistsAsync(string bucket, string objectName)
        {
            try
            {
                await minio.StatObjectAsync(
                    new StatObjectArgs()
                        .WithBucket(bucket)
                        .WithObject(objectName)
                );
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task DeleteAsync(string bucket, string objectName)
        {
            await minio.RemoveObjectAsync(
                new RemoveObjectArgs()
                    .WithBucket(bucket)
                    .WithObject(objectName)
            );
        }

        public async Task<string> GetPresignedUrlAsync(string bucket, string objectName, int expirySeconds = 600)
        {
            return await minio.PresignedGetObjectAsync(
                new PresignedGetObjectArgs()
                    .WithBucket(bucket)
                    .WithObject(objectName)
                    .WithExpiry(expirySeconds)
            );
        }
    }
}
