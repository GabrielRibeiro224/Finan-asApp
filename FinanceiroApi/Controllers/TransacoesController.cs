using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinanceiroApi.Models;

namespace FinanceiroApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransacoesController(AppDbContext context)
    {
        _context = context;
    }

    // Método GET para as transacoes
    [HttpGet("{email}")]
    public async Task<ActionResult<IEnumerable<Transacao>>> GetTransacoes(string email)
    {
        return await _context.Transacoes
        .Where(t => t.UsuarioEmail == email)
        .ToListAsync();

    }

    [HttpPost]
    public async Task<ActionResult<Transacao>> PostTransacao([FromBody] Transacao transacao)
    {
        try
        {
            transacao.Id = 0;

            _context.Transacoes.Add(transacao);
            await _context.SaveChangesAsync();

            return StatusCode(201, transacao);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao salvar: {ex.Message}");
            return StatusCode(500, "Erro interno ao salvar transação");
        }
    }

    [HttpDelete("limpar/{email}")]
    public async Task<IActionResult> LimparTudo(string email)
    {
        try
        {
            var transacoesUsuario = _context.Transacoes.Where(t => t.UsuarioEmail == email);

            if (transacoesUsuario.Any())
            {
                _context.Transacoes.RemoveRange(transacoesUsuario);
                await _context.SaveChangesAsync();
            }
            return Ok(new { message = "Histórico limpo com sucesso!" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Erro ao limpar banco: {ex.Message}");
            return StatusCode(500, "Erro interno ao limpar os dados");
        }
    }

}