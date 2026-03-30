 ```mermaid 

---
title: Game Events
---

classDiagram
    direction LR

    class StartGame-Client {}

    class NewGame-Server {}

    class OnHostChanged-Server {
        + string UserId
    }

    class GetPlayers-Client {}

    class AllPlayers-Server {
        + List<PlayerJoined>
    }

    class PlayerJoined-Server {
        + string UserId
        + string PlayerName
    }

    class PlayerLeft-Server {
        + string UserId
    }

    class SetReadyStatus-Client {
        + string UserId
        + bool Ready
    }

    class PlayerReady-Server {
        + string UserId 
    }

    class PlayerNotReady-Server {
        + string UserId 
    }

    class ChangeGameTime-Client {
        + int TotalSeconds
    }

    class GameTimeChanged-Server {
        + int TotalSeconds
    }

    class GameStateChanged-Server {
        + string NewState
    }

    class Countdown-Server {
        + int SecondsLeft
    }

    class GameStart-Server {
        + int TimeLimitSeconds
    }

    class CarSpawned-Server {
        + string CarId
        + int Lane
        + double Speed
        + string Color
    }

    class ScoreUpdated-Server {
        + string UserId
        + int NewScore
    }

    class GameEnd-Server {
        + List<Score> FinalScores
    }

    class Score {
        + string UserId
        + string UserName
        + int YellowCars
        + int WrongCars
    }

    class GameState {
        + Lobby
        + CountDown
        + Running
        + Scoreboard
    }

GameEnd-Server --> Score
GameStateChanged-Server --> GameState

 ```
