namespace YellowCarGame.Api.GameEngine
{
    public class Game(string id, string code)
    {
        public string Id { get; } = id;
        public string Code { get; } = code;
        public bool IsRunning { get; private set; } = true;

        public List<string> Players { get; } = new();
        public List<Car> Cars { get; } = new();

        public GameState State { get; private set; } = GameState.Lobby;

        public TimeSpan IdleTime { get; private set; } = TimeSpan.Zero;

        private readonly Random _random = new();

        public void Stop()
        {
            IsRunning = false;
        }

        public void UpdateIdle(TimeSpan delta)
        {
            if (Players.Count == 0)
                IdleTime += delta;
            else
                IdleTime = TimeSpan.Zero;
        }

        public bool ShouldStop => IdleTime > TimeSpan.FromSeconds(30);

        public List<GameEvent> Update()
        {
            var events = new List<GameEvent>();

            if (_random.NextDouble() < 0.1)
            {
                var car = new Car
                {
                    Id = Guid.NewGuid().ToString(),
                    Lane = _random.Next(0, 3),
                    Speed = 2.0 + _random.NextDouble() * 3.0,
                    Color = $"#{_random.Next(0x1000000):X6}"
                };

                Cars.Add(car);

                events.Add(new GameEvent
                {
                    EventName = "CarSpawned",
                    Payload = car
                });
            }

            return events;
        }
    }

    public class Car
    {
        public string Id { get; set; }
        public int Lane { get; set; }
        public double Speed { get; set; }
        public string Color { get; set; }
        public bool IsClaimed { get; set; }
    }

    public class GameEvent
    {
        public string EventName { get; set; }
        public object Payload { get; set; }
    }
}
