using Microsoft.AspNetCore.SignalR;

namespace YellowCarGame.Api.GameEngine
{
    public class GameLoopService : BackgroundService
    {
        private readonly GameManager _manager;
        private readonly IHubContext<GameHub> _hub;

        public GameLoopService(GameManager manager, IHubContext<GameHub> hub)
        {
            _manager = manager;
            _hub = hub;
        }

        protected override async Task ExecuteAsync(CancellationToken token)
        {
            var tick = TimeSpan.FromMilliseconds(100); // 10 Hz

            while (!token.IsCancellationRequested)
            {
                foreach (var game in _manager.Games.Values)
                {
                    if (!game.IsRunning)
                        continue;

                    game.UpdateIdle(tick);

                    if (game.ShouldStop)
                    {
                        _manager.StopGame(game.Id);
                        Console.WriteLine($"Game with id {game.Id} was stopped, because of no players.");
                        continue;
                    }

                    var events = game.Update();

                    foreach (var evt in events)
                    {
                        await _hub.Clients.Group(game.Id)
                            .SendAsync(evt.EventName, evt.Payload, token);
                    }

                }
                await Task.Delay(tick, token);
            }
        }
    }
}
