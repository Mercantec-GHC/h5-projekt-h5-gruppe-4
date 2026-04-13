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
            await _manager.RemovePlayerFromAllGames(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task JoinGame(string gameId, string userId)
        {
            if (_manager.TryGetGameById(gameId, out var game))
            {
                // Validate the userId and check if the user is allowed to join the game
                var guid = Guid.TryParse(userId, out var parsedId) ? parsedId : Guid.Empty;
                var user = game.AllowedPlayers.FirstOrDefault(p => p.Id == guid);
                if (user == null) return;

                // Add the player to the game
                var player = new Player
                {
                    UserId = userId,
                    UserName = user.Username,
                    ConnectionId = Context.ConnectionId
                };
                game.Players.Add(player);

                // Notify all clients in the game that a new player has joined
                await Clients.Group(gameId).SendAsync("PlayerJoined", new
                {
                    player.UserId,
                    player.UserName
                });

                // Send the current list of players to the newly joined player
                await Clients.Clients(Context.ConnectionId).SendAsync("AllPlayers", new
                {
                    Players = game.Players.Select(p => new
                    {
                        p.UserName,
                        p.UserId,
                        p.IsReady
                    }).ToList()
                });

                // Add the player to the SignalR group for the game
                await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
            }
        }

        public async Task LeaveGame(string gameId)
        {
            if (_manager.TryGetGameById(gameId, out var game))
            {
                // Find the player in the game by their connection ID
                var player = game.Players.FirstOrDefault(p => p.ConnectionId == Context.ConnectionId);
                if (player == null) return;

                // Notify all clients in the game that the player has left
                await Clients.Group(gameId).SendAsync("PlayerLeft", new
                {
                    player.UserId
                });

                // Remove the player from the SignalR group for the game
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);

                // Remove the player from the game
                game.Players.Remove(player);
            }
        }

        public async Task PlayerAction(string gameId, string action, string payload)
        {
            // Handle player actions and update the game state accordingly
            await _manager.HandlePlayerAction(gameId, Context.ConnectionId, action, payload);
        }
    }
}
