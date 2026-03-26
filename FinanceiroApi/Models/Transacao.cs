using System.ComponentModel.DataAnnotations;

namespace FinanceiroApi.Models;

public class Transacao
{
    [Key] // Define como Chave Primária no banco de dados
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Descricao { get; set; } = string.Empty;

    [Required]
    public decimal Valor { get; set; }

    [Required]
    public DateTime Data { get; set; } = DateTime.Now;

    // "Entrada" (Salário, Freelance) ou "Saída" (Mercado, Luz)
    [Required]
    public string Tipo { get; set; } = "Saída";

    // Categoria para os gráficos (Alimentação, Lazer, Transporte)
    public string Categoria { get; set; } = "Geral";

    // O e-mail do usuário logado via Google (Crucial para a segurança!)
    [Required]
    public string UsuarioEmail { get; set; } = string.Empty;
}