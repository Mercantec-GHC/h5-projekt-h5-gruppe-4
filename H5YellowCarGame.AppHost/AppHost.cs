var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("yellow-car-game")
    .WithDataVolume()
    .WithPgWeb();

var database = postgres.AddDatabase("PostgresDb");

builder.AddProject<Projects.YellowCarGame_Api>("yellowcargame-api")
    .WithReference(database)
    .WaitFor(database);

builder.Build().Run();
