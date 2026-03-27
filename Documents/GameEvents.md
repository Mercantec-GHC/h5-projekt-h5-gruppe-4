 ```mermaid 

---
title: Game Events
---

classDiagram

    class NewGame {}

    class PlayerJoined {
        + string UserId
        + string UserName
    }

    class PlayerLeft {
        + string UserId
    }

    class TimeChanged {
        + int NewTime
    }

    class Countdown {
        + int Number
    }

    class GameStart {
        + int GameTime
    }

    class GameEnd {
        + List<Score> Scores
    }

    class Score {
        + string UserId
        + string UserName
        + int YellowCars
        + int WrongCars
    }

Score --> GameEnd

 ```
