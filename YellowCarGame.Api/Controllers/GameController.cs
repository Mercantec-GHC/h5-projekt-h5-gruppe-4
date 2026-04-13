using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YellowCarGame.Api.GameEngine;
using YellowCarGame.Api.Services;

namespace YellowCarGame.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameController : ControllerBase
    {
        private readonly GameManager _manager;
        private readonly IUserContext userContext;

        public GameController(GameManager manager, IUserContext userContext)
        {
            _manager = manager;
            this.userContext = userContext;
        }

        // POST: api/game/start
        [HttpPost("start"), Authorize]
        public async Task<ActionResult> StartGame()
        {
            var user = await userContext.GetCurrentUserAsync();
            if (user == null)
                return StatusCode(500);

            var game = _manager.CreateGame();

            if (!game.AllowedPlayers.Contains(user))
                game.AllowedPlayers.Add(user);

            return Ok(new { gameId = game.Id, code = game.Code, userId = user.Id });
        }

        // GET: api/game
        [HttpGet, Authorize]
        public IActionResult ListGames()
        {
            var games = _manager.Games.Values.Select(g => new {
                g.Id,
                g.Code,
                PlayerCount = g.Players.Count,
                Players = g.Players
                    .Select(p => new {
                        p.UserId,
                        p.UserName,
                        p.ConnectionId,
                        p.IsReady })
                    .ToList(),
                g.IsRunning,
                g.State
            });

            return Ok(games);
        }

        // GET: api/game/join/{code}
        [HttpGet("join/{code}"), Authorize(Roles = "Admin")]
        public async Task<ActionResult> JoinByCode(string code)
        {
            var user = await userContext.GetCurrentUserAsync();
            if (user == null)
                return StatusCode(500);

            if (_manager.TryGetGameByCode(code, out var game))
            {
                if (!game.AllowedPlayers.Contains(user))
                    game.AllowedPlayers.Add(user);

                return Ok(new { gameId = game.Id, userId = user.Id });
            }

            return NotFound(new { message = "Game not found" });
        }

        // DELETE: api/game/{id}
        [HttpDelete("{id}"), Authorize(Roles = "Admin")]
        public IActionResult StopGame(string id)
        {
            if (_manager.StopGame(id))
            {
                Console.WriteLine($"Game with id {id} was forcefully stopped.");
                return Ok(new { message = "Game stopped", gameId = id });
            }

            return NotFound(new { message = "Game not found" });
        }
    }
}
