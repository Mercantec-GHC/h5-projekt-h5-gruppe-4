using System.ComponentModel.DataAnnotations;
using YellowCarGame.Api.Attributes;
using YellowCarGame.Api.Models.Database;

namespace YellowCarGame.Api.Models.Dtos.Requests
{
    public class LoginRequest
    {
        [Required(ErrorMessage = "Username is required.")]
        [Length(3, 20, ErrorMessage = "Username must be between 3 and 20 characters long.")]
        [RegularExpression("^[a-z0-9]+$", ErrorMessage = "Usernames can only contain lowercase letters and numbers.")]
        public string Username { get; init; }

        [Required(ErrorMessage = "Password is required.")]
        [ConfigRegex("PasswordRegex", ErrorMessage = "Password does not meet requirements.")]
        public string Password { get; init; }
    }

    public class RefreshTokenRequest
    {
        [Required(ErrorMessage = "Refresh token is required.")]
        [RegularExpression("^[a-zA-Z0-9+/]+={0,2}$", ErrorMessage = "Invalid refresh token format.")]
        public string RefreshToken { get; init; }
    }

    public class DeleteAccountRequest
    {
        [Required(ErrorMessage = "Password is required to delete the account.")]
        public string Password { get; init; }
    }

    public class RegisterRequest
    {
        [Required(ErrorMessage = "Username is required.")]
        [Length(3, 20, ErrorMessage = "Username must be between 3 and 20 characters long.")]
        [RegularExpression("^[a-z0-9]+$", ErrorMessage = "Usernames can only contain lowercase letters and numbers.")]
        public string Username { get; init; }

        [Required(ErrorMessage = "Password is required.")]
        [ConfigRegex("PasswordRegex", ErrorMessage = "Password does not meet requirements.")]
        public string Password { get; init; }

        [Compare("Password", ErrorMessage = "Passwords do not match.")]
        public string ConfirmPassword { get; init; }

        /// <summary>
        /// Converts the current object to a new instance of the User class with the username and a hashed password.
        /// </summary>
        /// <remarks>The password is hashed using the BCrypt algorithm to enhance security. The returned
        /// User object is suitable for storage or authentication scenarios where plain-text passwords should not be
        /// used.</remarks>
        /// <returns>A new User object containing the username and a securely hashed password derived from the current object's
        /// properties.</returns>
        public User ToUser()
        {
            return new User
            {
                Username = Username,
                HashedPassword = BCrypt.Net.BCrypt.HashPassword(Password)
            };
        }
    }
}
