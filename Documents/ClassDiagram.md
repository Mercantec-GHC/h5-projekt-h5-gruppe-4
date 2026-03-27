 ```mermaid 

---
title: Class Diagram
---

classDiagram

    class Roles {
        User
        Admin
    }

    class Common {
        + Guid Id
        + DateTime CreatedAt
        + DateTime UpdatedAt
    }

    class User {
        + string Username
        + string HashedPassword
        + bool IsDisabled
        + Roles Role
    }

    class RefreshToken {
        + Guid UserId
        + User User
        + string Token
        + DateTime ExpiresAt
        + bool IsRevoked
    }

Common --|> User
Common --|> RefreshToken

RefreshToken --> User

Roles --> User