using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YellowCarGame.Api.Models.Dtos.Requests;
using YellowCarGame.Api.Models.Dtos.Responses;
using YellowCarGame.Api.Services;

namespace YellowCarGame.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        /// <summary>
        /// Authenticates a user based on the provided login credentials.
        /// </summary>
        /// <param name="dto">The login request containing the user's credentials. Cannot be null.</param>
        /// <returns>An HTTP 200 response with a login result if authentication succeeds; otherwise, an appropriate error
        /// response such as HTTP 400 for invalid input or HTTP 401 for unauthorized access.</returns>
        [HttpPost]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest dto)
        {
            try
            {
                return Ok(await authService.LoginAsync(dto));
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        /// <summary>
        /// Generates a new access token and refresh token pair using the provided refresh token request.
        /// </summary>
        /// <param name="dto">The refresh token request containing the current refresh token and related authentication information.
        /// Cannot be null.</param>
        /// <returns>An ActionResult containing a LoginResponse with the new access and refresh tokens if the operation succeeds;
        /// otherwise, an error response indicating the reason for failure.</returns>
        [HttpPost("Refresh")]
        public async Task<ActionResult<LoginResponse>> Refresh(RefreshTokenRequest dto)
        {
            try
            {
                return Ok(await authService.RefreshAsync(dto));
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        [HttpPost("Register")]
        public async Task<ActionResult<RegisterResponse>> Register(RegisterRequest dto)
        {
            return StatusCode(501);
        }

        /// <summary>
        /// Retrieves information about the currently authenticated user.
        /// </summary>
        /// <remarks>This endpoint requires the caller to be authenticated. The returned user information
        /// is based on the current authentication context.</remarks>
        /// <returns>An <see cref="ActionResult{T}"/> containing a <see cref="UserInfoResponse"/> with details about the
        /// authenticated user.</returns>
        [HttpGet, Authorize]
        public async Task<ActionResult<UserInfoResponse>> UserInfo()
        {
            return Ok(await authService.GetUserInfoAsync());
        }

        /// <summary>
        /// Uploads a new avatar image for the authenticated user.
        /// </summary>
        /// <param name="file">The image file to upload as the user's avatar. Must be a valid, non-null file in a supported image format.</param>
        /// <returns>A 201 Created result if the avatar is uploaded successfully; otherwise, a 400 Bad Request or 401
        /// Unauthorized result depending on the error.</returns>
        [HttpPost("avatar"), Authorize]
        public async Task<ActionResult> UploadAvatar(IFormFile file)
        {
            try
            {
                await authService.UploadAvatarAsync(file);
                return Created();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        /// <summary>
        /// Retrieves the avatar image for the currently authenticated user.
        /// </summary>
        /// <remarks>This endpoint requires authentication. The avatar returned is associated with the
        /// user making the request.</remarks>
        /// <returns>An <see cref="ActionResult"/> containing the avatar image for the authenticated user. Returns a suitable
        /// HTTP response if the avatar is not available.</returns>
        [HttpGet("avatar"), Authorize]
        public async Task<ActionResult> GetAvatar()
        {
            return await GetAvatar(null);
        }

        /// <summary>
        /// Retrieves the avatar image for the specified user as a PNG file.
        /// </summary>
        /// <param name="userId">The unique identifier of the user whose avatar is to be retrieved. If null, the avatar for the currently
        /// authenticated user is returned.</param>
        /// <returns>An HTTP response containing the user's avatar image as a PNG file. Returns a 400 Bad Request if the user ID
        /// is invalid, 401 Unauthorized if the caller is not authorized, or 404 Not Found if the avatar does not exist.</returns>
        [HttpGet("avatar/{userId}")]
        public async Task<ActionResult> GetAvatar(string? userId = null)
        {
            try
            {
                var stream = await authService.GetAvatarAsync(userId);

                return File(stream, "image/png");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }
            catch (FileNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Removes the current user's avatar image.
        /// </summary>
        /// <remarks>This endpoint requires authentication. The user's avatar will be deleted if one
        /// exists; otherwise, the operation has no effect.</remarks>
        /// <returns>An <see cref="ActionResult"/> indicating the result of the avatar removal operation.</returns>
        [HttpDelete("avatar"), Authorize]
        public async Task<ActionResult> RemoveAvatar()
        {
            return await RemoveAvatar(null);
        }

        /// <summary>
        /// Removes the avatar image associated with the specified user.
        /// </summary>
        /// <remarks>This action is restricted to users with the Admin role. If the specified user does
        /// not have an avatar, the method returns a Bad Request response.</remarks>
        /// <param name="userId">The unique identifier of the user whose avatar is to be removed. Can be null to indicate the current user.</param>
        /// <returns>An HTTP 204 No Content response if the avatar is successfully removed; otherwise, an HTTP 400 Bad Request
        /// response if the avatar does not exist.</returns>
        [HttpDelete("avatar/{userId}"), Authorize(Roles = "Admin")]
        public async Task<ActionResult> RemoveAvatar(string? userId)
        {
            try
            {
                await authService.RemoveAvatarAsync(userId);

                return NoContent();
            }
            catch (FileNotFoundException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
