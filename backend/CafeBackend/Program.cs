using System.Linq.Expressions;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddSwaggerGen();
builder.Services.AddEndpointsApiExplorer();

//Load my .env
Env.Load();
string dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD")
?? throw new Exception("DB_PASSWORD not found in .env");

//DI Repo

//DI ApplicationDbContext

var app = builder.Build();


app.UseHttpsRedirection();

app.UseSwaggerUI();

app.UseSwagger();

app.Run();

