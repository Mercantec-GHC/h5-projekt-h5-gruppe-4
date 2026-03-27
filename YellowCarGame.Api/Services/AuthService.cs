using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using YellowCarGame.Api.Helpers;
using YellowCarGame.Api.Models.Database;
using YellowCarGame.Api.Models.Dtos.Requests;
using YellowCarGame.Api.Models.Dtos.Responses;
using YellowCarGame.Api.Repositories;

namespace YellowCarGame.Api.Services
{
    public interface IAuthService
    {
        /// <summary>
        /// Authenticates a user asynchronously using the provided login request data.
        /// </summary>
        /// <param name="dto">The login request containing user credentials and any additional authentication information required for
        /// login. Cannot be null.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a LoginResponse with
        /// authentication details if the login is successful.</returns>
        public Task<LoginResponse> LoginAsync(LoginRequest dto);

        /// <summary>
        /// Asynchronously refreshes the authentication token using the specified refresh token request.
        /// </summary>
        /// <param name="dto">The refresh token request containing the necessary information to obtain a new authentication token. Cannot
        /// be null.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a LoginResponse with the new
        /// authentication token and related information.</returns>
        public Task<LoginResponse> RefreshAsync(RefreshTokenRequest dto);

        /// <summary>
        /// Registers a new user account using the specified registration details.
        /// </summary>
        /// <param name="dto">An object containing the user's registration information. Cannot be null.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a RegisterResponse with the
        /// outcome of the registration attempt.</returns>
        public Task<RegisterResponse> RegisterAsync(RegisterRequest dto);

        /// <summary>
        /// Asynchronously retrieves information about the currently authenticated user.
        /// </summary>
        /// <returns></returns>
        public Task<UserInfoResponse> GetUserInfoAsync();

        /// <summary>
        /// Asynchronously changes the user's password using the specified password change request.
        /// </summary>
        /// <param name="dto">An object containing the current and new password information required to perform the password change.
        /// Cannot be null.</param>
        /// <returns>A task that represents the asynchronous password change operation.</returns>
        public Task ChangePasswordAsync(PasswordChangeRequest dto);

        /// <summary>
        /// Asynchronously uploads a user avatar image from the specified file.
        /// </summary>
        /// <remarks>The file should be a supported image format, such as JPEG or PNG. The method does not
        /// save the file if it does not meet validation requirements.</remarks>
        /// <param name="file">The file containing the avatar image to upload. Must be a valid, non-null image file.</param>
        /// <returns>A task that represents the asynchronous upload operation.</returns>
        public Task UploadAvatarAsync(IFormFile file);

        /// <summary>
        /// Asynchronously retrieves the avatar image stream for the specified user.
        /// </summary>
        /// <param name="userId">The unique identifier of the user whose avatar is to be retrieved. If null, retrieves the avatar for the
        /// current user.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a stream of the user's avatar
        /// image. The stream is positioned at the beginning.</returns>
        public Task<Stream> GetAvatarAsync(string? userId = null);

        /// <summary>
        /// Removes the avatar associated with the specified user asynchronously.
        /// </summary>
        /// <param name="userId">The unique identifier of the user whose avatar is to be removed. If null, the current user's avatar is
        /// removed.</param>
        /// <returns>A task that represents the asynchronous remove operation.</returns>
        public Task RemoveAvatarAsync(string? userId = null);
    }

    public class AuthService(IUserRepository userRepository, IRefreshTokenRepository tokenRepository, IJwtService jwtService, IUserContext userContext, IS3Service s3) : IAuthService
    {
        public async Task<LoginResponse> LoginAsync(LoginRequest dto)
        {
            var user = await userRepository.GetByUsernameAsync(dto.Username)
                ?? throw new UnauthorizedAccessException("Invalid username or password.");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.HashedPassword))
                throw new UnauthorizedAccessException("Invalid username or password.");

            return await CreateLoginResponse(user);
        }

        public async Task<LoginResponse> RefreshAsync(RefreshTokenRequest dto)
        {
            var user = await tokenRepository.ValidateTokenAsync(dto.RefreshToken) 
                ?? throw new UnauthorizedAccessException("Invalid refresh token.");
            
            return await CreateLoginResponse(user);
        }

        public async Task<RegisterResponse> RegisterAsync(RegisterRequest dto)
        {
            if (await userRepository.GetByUsernameAsync(dto.Username) is not null)
                throw new ArgumentException("Username already exists.");

            var user = dto.ToUser();
            await userRepository.CreateAsync(user);

            return new RegisterResponse(user.Id);
        }

        public async Task<UserInfoResponse> GetUserInfoAsync()
        {
            var user = await userContext.GetCurrentUserAsync()
                ?? throw new UnauthorizedAccessException("User not authenticated.");

            return new UserInfoResponse(user);
        }

        public async Task ChangePasswordAsync(PasswordChangeRequest dto)
        {
            var user = await userContext.GetCurrentUserAsync() 
                ?? throw new UnauthorizedAccessException("User not authenticated.");

            if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.HashedPassword))
                throw new UnauthorizedAccessException("Current password is incorrect.");

            user.HashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            await userRepository.UpdateAsync(user);
        }

        public async Task UploadAvatarAsync(IFormFile file)
        {
            // File presence check
            if (file is null || file.Length == 0)
                throw new ArgumentException("File is required.", nameof(file));

            // File size check
            const long maxSize = 10 * 1024 * 1024;
            if (file.Length > maxSize)
                throw new ArgumentException("File size exceeds 10 MB limit");

            var user = await userContext.GetCurrentUserAsync() 
                ?? throw new UnauthorizedAccessException("User not authenticated.");

            // 1. Læs filen som byte[]
            using var ms = new MemoryStream();
            await file.CopyToAsync(ms);
            var bytes = ms.ToArray();

            // MIME-type check
            if (file.ContentType != "image/png")
                throw new ArgumentException("Unsupported image type");

            // 2. Valider at det er et billede
            if (!ImageHelper.IsImage(bytes, i => i.AllowPng = true))
                throw new ArgumentException("File must be of type png.", nameof(file));

            // 3. Brug ImageSharp til at manipulere billedet
            ms.Position = 0;
            using var image = Image.Load(ms);

            //  Crop to centered square
            int size = Math.Min(image.Width, image.Height);
            int x = (image.Width - size) / 2;
            int y = (image.Height - size) / 2;

            // Define crop rectangle
            var cropRect = new Rectangle(x, y, size, size);

            // Perform crop and resize
            image.Mutate(m => m.Crop(cropRect)
                .Resize(new ResizeOptions
                {
                    Mode = ResizeMode.Stretch,
                    Size = new Size(512, 512)
                })
            );

            // Gem det manipulerede billede i en ny stream
            var output = new MemoryStream();
            await image.SaveAsPngAsync(output);
            output.Position = 0;

            // 4. Upload til MinIO via din service
            await s3.UploadAsync(
                bucket: "avatars",
                objectName: $"{user.Id}.png",
                data: output,
                contentType: "image/png"
            );
        }

        public async Task<Stream> GetAvatarAsync(string? userId = null)
        {
            var user = userId is null
                ? await userContext.GetCurrentUserAsync() ?? throw new UnauthorizedAccessException("User not authenticated.")
                : await userRepository.GetByIdAsync(userId) ?? throw new ArgumentException("User not found.", nameof(userId));

            var filename = $"{user.Id}.png";
            var bucket = "avatars";

            if (!await s3.ExistsAsync(bucket, filename))
                throw new FileNotFoundException("Avatar not found.");

            return await s3.DownloadAsync(bucket, filename);
        }

        public async Task RemoveAvatarAsync(string? userId = null)
        {
            var user = userId is null
                ? await userContext.GetCurrentUserAsync() ?? throw new UnauthorizedAccessException("User not authenticated.")
                : await userRepository.GetByIdAsync(userId) ?? throw new ArgumentException("User not found.", nameof(userId));

            var filename = $"{user.Id}.png";
            var bucket = "avatars";

            if (!await s3.ExistsAsync(bucket, filename))
                throw new FileNotFoundException("Avatar not found.");

            await s3.DeleteAsync(bucket, filename);
        }

        // Helper method to create a LoginResponse for a given user
        private async Task<LoginResponse> CreateLoginResponse(User user)
        {
            var jwtToken = jwtService.GenerateJwtToken(user);
            var refreshToken = await tokenRepository.GenerateTokenAsync(user);
            int expiresIn = 3600;

            return new LoginResponse(jwtToken, expiresIn, refreshToken);
        }
    }
}
