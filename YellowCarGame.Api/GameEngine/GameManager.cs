using Microsoft.AspNetCore.SignalR;
using YellowCarGame.Api.Helpers;

namespace YellowCarGame.Api.GameEngine
{
    public class GameManager(IHubContext<GameHub> hub)
    {
        private readonly Dictionary<string, Game> _games = new();
        private readonly Dictionary<string, string> _codeToId = new();

        public IReadOnlyDictionary<string, Game> Games => _games;

        public Game CreateGame()
        {
            var id = Guid.NewGuid().ToString();
            var code = CodeGenerator.GenerateCode();

            var game = new Game(id, code);
            _games[id] = game;
            _codeToId[code] = id;

            Console.WriteLine($"Game with id {id} was created.");

            return game;
        }

        public bool TryGetGameById(string id, out Game? game)
        => _games.TryGetValue(id, out game);

        public bool TryGetGameByCode(string code, out Game? game)
        {
            if (_codeToId.TryGetValue(code, out var id))
                return _games.TryGetValue(id, out game);

            game = null;
            return false;
        }

        public bool StopGame(string id)
        {
            if (!_games.TryGetValue(id, out var game))
                return false;

            // 1. Fortæl alle klienter at spillet stopper
            hub.Clients.Group(id).SendAsync("GameStopped", new
            {
                reason = "No players for 1 minute"
            });

            // 2. Fjern alle spillere fra SignalR-gruppen
            foreach (var player in game.Players.ToList())
            {
                hub.Groups.RemoveFromGroupAsync(player, id);
            }

            // 3. Fjern spillet fra GameManager
            _games.Remove(id);

            // 4. Fjern kode-mapping
            var code = _codeToId.FirstOrDefault(x => x.Value == id).Key;
            if (code != null)
                _codeToId.Remove(code);

            return true;
        }


        public void RemovePlayerFromAllGames(string connectionId)
        {
            foreach (var game in _games.Values)
                game.Players.Remove(connectionId);
        }

        public void HandlePlayerAction(string gameId, string connectionId, string actionJson)
        {
            // Her kan I parse JSON og reagere på spillerens input
            // fx lane change, speed change, powerups osv.
        }
    }
}
