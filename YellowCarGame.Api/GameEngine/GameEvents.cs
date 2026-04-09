namespace YellowCarGame.Api.GameEngine
{
    public class PlayerJoined
    {
        public string UserId { get; set; }
        public string PlayerName { get; set; }
    }

    public class PlayerLeft
    {
        public string UserId { get; set; }
    }

    public class PlayerReady
    {
        public string UserId { get; set; }
    }

    public class PlayerNotReady
    {
        public string UserId { get; set; }
    }

    public class GameTimeChanged
    {
        public int TotalSeconds { get; set; }
    }

    public class GameStateChanged
    {
        public string NewState { get; set; }
    }

    public class Countdown
    {
        public int SecondsLeft { get; set; }
    }

    public class GameStart
    {
        public int TimeLimitSeconds { get; set; }
    }

    public class CarSpawned
    {
        public string CarId { get; set; }
        public int Lane { get; set; }
        public double Speed { get; set; }
        public string Color { get; set; }
    }

    public class CarClaimed
    {
        public string CarId { get; set; }
        public string UserId { get; set; }
    }

    public class ScoreUpdated
    {
        public string UserId { get; set; }
        public int NewScore { get; set; }
    }

    public class GameEnd
    {
        List<Score> FinalScores { get; set; } = [];
    }

    public class Score
    {
        public string UserId { get; set; }
        public string PlayerName { get; set; }
        public int YellowCars { get; set; }
        public int WrongCars { get; set; }
    }
}
