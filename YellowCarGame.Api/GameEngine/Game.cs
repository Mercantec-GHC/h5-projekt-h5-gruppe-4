using YellowCarGame.Api.Models.Database;

namespace YellowCarGame.Api.GameEngine
{
    public class Game(string id, string code)
    {
        public string Id { get; } = id;
        public string Code { get; } = code;
        public bool IsRunning { get; private set; } = true;

        public List<User> AllowedPlayers { get; } = new();
        public List<Player> Players { get; } = new();
        public List<Car> Cars { get; } = new();

        public GameState State { get; private set; } = GameState.Lobby;
        public TimeSpan GameTime { get; private set; } = TimeSpan.Zero;
        public int TimeLimitSeconds { get; private set; } = 60;

        public TimeSpan IdleTime { get; private set; } = TimeSpan.Zero;

        private readonly Random _random = new();
        private int _carsSinceLastYellow = 0;

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

        public List<GameEvent> Update(TimeSpan delta)
        {
            var events = new List<GameEvent>();

            if (State == GameState.Countdown)
            {
                // Simulate countdown
                if (GameTime >= TimeSpan.FromSeconds(3))
                {
                    State = GameState.Active;
                    GameTime = TimeSpan.Zero;

                    events.Add(new GameEvent
                    {
                        EventName = "GameStateChanged",
                        Payload = new GameStateChanged { NewState = State.ToString() }
                    });
                }
                else if (GameTime >= TimeSpan.FromSeconds(2))
                {
                    events.Add(new GameEvent
                    {
                        EventName = "Countdown",
                        Payload = new Countdown { SecondsLeft = 1 }
                    });
                }
                else if (GameTime >= TimeSpan.FromSeconds(1))
                {
                    events.Add(new GameEvent
                    {
                        EventName = "CountdownTick",
                        Payload = new Countdown { SecondsLeft = 2 }
                    });
                }
                else if (GameTime >= TimeSpan.FromSeconds(0))
                {
                    events.Add(new GameEvent
                    {
                        EventName = "CountdownTick",
                        Payload = new Countdown { SecondsLeft = 3 }
                    });
                }
            }
            else if (State == GameState.Active)
            {
                if (GameTime >= TimeSpan.FromSeconds(TimeLimitSeconds))
                {
                    State = GameState.Scoreboard;
                    events.Add(new GameEvent
                    {
                        EventName = "GameStateChanged",
                        Payload = new GameStateChanged { NewState = State.ToString() }
                    });
                }
                else
                {
                    if (_random.NextDouble() < 0.1)
                    {
                        CarColor color = _carsSinceLastYellow >= 10 ? CarColor.Yellow : (CarColor)_random.Next(0, Enum.GetValues<CarColor>().Length);
                        if (color == CarColor.Yellow) _carsSinceLastYellow = 0;

                        int lane = _random.Next(0, 4);
                        //bool distanceOk = Cars.All(c => c.Lane != lane || c.Speed * (GameTime.TotalSeconds - GameTime.TotalSeconds) > 1.0);

                        double speed = 2.0; //+ _random.NextDouble() * 3.0;

                        var car = new Car
                        {
                            Id = Guid.NewGuid().ToString(),
                            Lane = lane,
                            Speed = speed,
                            Color = color,
                            IsClaimed = false
                        };
                        Cars.Add(car);

                        events.Add(new GameEvent
                        {
                            EventName = "CarSpawned",
                            Payload = new CarSpawned
                            {
                                CarId = car.Id,
                                Lane = car.Lane,
                                Speed = car.Speed,
                                Color = car.Color.ToString()
                            }
                        });
                    }
                }
            }

            GameTime += delta;
            return events;
        }

        public bool Start()
        {
            if (State != GameState.Lobby)
                return false;

            foreach (var player in Players)
            {
                if (!player.IsReady)
                    return false;
            }

            State = GameState.Countdown;
            GameTime = TimeSpan.Zero;
            return true;
        }
    }

    public class Car
    {
        public string Id { get; set; }
        public int Lane { get; set; }
        public double Speed { get; set; }
        public CarColor Color { get; set; }
        public bool IsClaimed { get; set; }
    }

    public class Player
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string ConnectionId { get; set; }
        public int Score { get; set; }
        public bool IsReady { get; set; } = false;
    }

    public enum CarColor
    {
        Red,
        Green,
        Blue,
        Yellow
    }

    public class GameEvent
    {
        public string EventName { get; set; }
        public object Payload { get; set; }
    }
}
