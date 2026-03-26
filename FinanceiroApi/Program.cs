using Microsoft.EntityFrameworkCore;
using FinanceiroApi; // Garanta que o namespace do seu AppDbContext está aqui

var builder = WebApplication.CreateBuilder(args);

// --- COLE ESTA LINHA AQUI ---
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=financeiro.db"));

// ----------------------------

// Se você já tiver outras configurações como Controllers ou CORS, elas ficam aqui abaixo
builder.Services.AddControllers();

var app = builder.Build();

// Configurações do App (CORS, MapControllers, etc)
app.UseCors("AllowReact");
app.UseCors(policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.MapControllers();

app.Run();