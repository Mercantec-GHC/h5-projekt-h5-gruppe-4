using Microsoft.AspNetCore.Mvc;
using YellowCarGame.Api.GameEngine;

namespace YellowCarGame.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameController : ControllerBase
    {
        private readonly GameManager _manager;

        public GameController(GameManager manager)
        {
            _manager = manager;
        }

        // POST: api/game/start
        [HttpPost("start")]
        public IActionResult StartGame()
        {
            var game = _manager.CreateGame();
            return Ok(new { gameId = game.Id, code = game.Code });
        }

        // GET: api/game
        [HttpGet]
        public IActionResult ListGames()
        {
            var games = _manager.Games.Values.Select(g => new {
                g.Id,
                g.Code,
                PlayerCount = g.Players.Count,
                g.IsRunning,
                g.State
            });

            return Ok(games);
        }

        // GET: api/game/join/{code}
        [HttpGet("join/{code}")]
        public IActionResult JoinByCode(string code)
        {
            if (_manager.TryGetGameByCode(code, out var game))
                return Ok(new { gameId = game.Id });

            return NotFound(new { message = "Game not found" });
        }

        // DELETE: api/game/{id}
        [HttpDelete("{id}")]
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
