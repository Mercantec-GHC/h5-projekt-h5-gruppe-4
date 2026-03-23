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
            return StatusCode(418);
        }


        [HttpGet, Authorize]
        public async Task<ActionResult<UserInfoResponse>> UserInfo()
        {
            return Ok(await authService.GetUserInfoAsync());
        }

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

        [HttpGet("avatar"), Authorize]
        public async Task<ActionResult> GetAvatar()
        {
            return await GetAvatar(null);
        }

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

        [HttpDelete("avatar"), Authorize]
        public async Task<ActionResult> RemoveAvatar()
        {
            return await RemoveAvatar(null);
        }

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
