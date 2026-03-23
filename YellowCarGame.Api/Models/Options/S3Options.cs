namespace YellowCarGame.Api.Models.Options
{
    public class S3Options
    {
        public string Endpoint { get; set; }
        public bool UseSSL { get; set; } = true;
        public string AccessKey { get; set; }
        public string SecretKey { get; set; }
    }
}
