 ```mermaid 

---
title: ER Diagram
---

erDiagram
    User ||--o{ RefreshToken : includes
    User {
        uuid Id
        string Username
        string HashedPassword
        bool IsDisabled
        string Role
        datetime CreatedAt
        datetime UpdatedAt
    }

    RefreshToken {
        uuid Id
        uuid UserId
        string Token
        datetime ExpiresAt
        bool IsRevoked
        datetime CreatedAt
        datetime UpdatedAt
    }