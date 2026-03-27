 ```mermaid 

---
title: Game Events
---

classDiagram
    direction LR

    class NewGame {}

    class PlayerJoined {
        + string UserId
        + string PlayerName
    }

    class PlayerLeft {
        + string UserId
    }

    class PlayerReady {
        + string UserId 
    }

    class PlayerNotReady {
        + string UserId 
    }

    class GameTimeChanged {
        + int TotalSeconds
    }

    class GameStateChanged {
        + string NewState
    }

    class Countdown {
        + int SecondsLeft
    }

    class GameStart {
        + int TimeLimitSeconds
    }

    class CarSpawned {
        + string CarId
        + int Lane
        + double Speed
        + string Color
    }

    class ScoreUpdated {
        + string UserId
        + int NewScore
    }

    class GameEnd {
        + List<Score> FinalScores
    }

    class Score {
        + string UserId
        + string UserName
        + int YellowCars
        + int WrongCars
    }

GameEnd --> Score

 ```
