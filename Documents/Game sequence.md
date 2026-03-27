
```mermaid

sequenceDiagram
    participant Client as Klient (Browser/App)
    participant Frontend as Website / Frontend
    participant API as Backend API
    participant Game as Game Engine

    Client->>Frontend: HTTP GET / (Hent website)
    Frontend-->>Client: Returner HTML/CSS/JS

    Client->>Frontend: Trigger API-kald via JS (Start Game)
    Frontend->>API: HTTP POST /Game/Start
    API->>Game: Starts a new game
    Game-->>API: Returns game Id and Join Code
    API-->>Frontend: Returns Join Code
    Frontend-->>Client: Returns Join Code

    Client->>Frontend: Trigger API-kald via JS (Join Game)
    Frontend->>API: HTTP POST /Game/Join (UserId og Join Code)
    API->>Game: Adds the user to the game
    API-->>Frontend: Returns Status Code: 201
    Frontend-->>Client: Returns Status Code: 201
    Client->>API: Connects over SignalR websocket (UserId og Join Code)
    API->>Game: Adds the user to the list of joined players
    
    Client->>API: Signals game to start
    API->>Game: Sets the game state to Running
    API-->>Client: Broadcasts game start to all clients

    Game-->>API: Adds new game event
    API-->>Client: Broadcasts events to all clients

    Game-->>API: Game end
    API-->>Client: Broadcasts game end to all clients

