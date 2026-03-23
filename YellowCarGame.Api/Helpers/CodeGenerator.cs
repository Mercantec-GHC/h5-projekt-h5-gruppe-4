namespace YellowCarGame.Api.Helpers
{
    public static class CodeGenerator
    {
        private static readonly Random _random = new();

        public static string GenerateCode(int length = 4)
        {
            const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[_random.Next(s.Length)]).ToArray());
        }
    }

}
