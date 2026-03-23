using Microsoft.AspNetCore.SignalR;

namespace YellowCarGame.Api.GameEngine
{
    public class GameHub : Hub
    {
        private readonly GameManager _manager;

        public GameHub(GameManager manager)
        {
            _manager = manager;
        }

        public override Task OnConnectedAsync()
        {
            Console.WriteLine("CLIENT CONNECTED");
            return base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            _manager.RemovePlayerFromAllGames(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinGame(string gameId)
        {
            if (_manager.TryGetGameById(gameId, out var game))
            {
                game.Players.Add(Context.ConnectionId);
                await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
            }
        }

        public async Task LeaveGame(string gameId)
        {
            if (_manager.TryGetGameById(gameId, out var game))
            {
                game.Players.Remove(Context.ConnectionId);
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);
            }
        }

        public Task PlayerAction(string gameId, string actionJson)
        {
            _manager.HandlePlayerAction(gameId, Context.ConnectionId, actionJson);
            return Task.CompletedTask;
        }
    }

}
