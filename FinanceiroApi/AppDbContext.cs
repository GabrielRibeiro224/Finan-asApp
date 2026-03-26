using Microsoft.EntityFrameworkCore;
using FinanceiroApi.Models; // ADICIONE ESTA LINHA AQUI!

namespace FinanceiroApi;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Transacao> Transacoes { get; set; }
}