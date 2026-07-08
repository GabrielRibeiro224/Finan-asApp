import { useState } from "react";

interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: "Entrada" | "Saída";
  categoria: string;
  data: string;
  usuarioEmail: string;
}

interface ExtratoProps {
  transacoes: Transacao[];
}

export default function Extrato({ transacoes }: ExtratoProps) {
  const [filtroTipo, setFiltroTipo] = useState<"Todos" | "Entrada" | "Saída">(
    "Todos",
  );
  const [filtroCategoria, setFiltroCategoria] = useState<string>("Todas");
  const [dataInicio, setDataInicio] = useState<string>("");
  const [dataFim, setDataFim] = useState<string>("");

  const transacoesFiltradas = transacoes.filter((t) => {
    const bateuTipo = filtroTipo === "Todos" || t.tipo === filtroTipo;
    const bateuCategoria =
      filtroCategoria === "Todas" || t.categoria === filtroCategoria;

    const dataTransacao = new Date(t.data).toISOString().split("T")[0];
    const bateuDataInicio = !dataInicio || dataTransacao >= dataInicio;
    const bateuDataFim = !dataFim || dataTransacao <= dataFim;

    return bateuTipo && bateuCategoria && bateuDataInicio && bateuDataFim;
  }); // <-- O filter termina aqui e a função 'Extrato' continua aberta!

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Extrato Detalhado
        </h2>
        <p className="text-slate-400 text-sm">
          Gerencie e filtre suas movimentações
        </p>
      </div>

      {/* FILTROS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#1e293b]/40 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
            Período Inicial
          </label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/60 rounded-xl p-2.5 text-white outline-none focus:border-indigo-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
            Período Final
          </label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/60 rounded-xl p-2.5 text-white outline-none focus:border-indigo-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
            Fluxo de Caixa
          </label>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as any)}
            className="w-full bg-slate-900 border border-slate-700/60 rounded-xl p-2.5 text-white outline-none focus:border-indigo-500 text-sm cursor-pointer"
          >
            <option value="Todos">Todos os fluxos</option>
            <option value="Entrada">Apenas Entradas (+)</option>
            <option value="Saída">Apenas Saídas (-)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">
            Filtrar Categoria
          </label>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/60 rounded-xl p-2.5 text-white outline-none focus:border-indigo-500 text-sm cursor-pointer"
          >
            <option value="Todas">Todas as categorias</option>
            <option value="Alimentação">Alimentação</option>
            <option value="Transporte">Transporte</option>
            <option value="Lazer">Lazer</option>
            <option value="Saúde">Saúde</option>
            <option value="Geral">Geral</option>
          </select>
        </div>
      </div>

      {/* TABELA */}
      <div className="bg-[#1e293b]/20 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-5">Data</th>
                <th className="p-5">Descrição</th>
                <th className="p-5">Fluxo</th>
                <th className="p-5">Categoria</th>
                <th className="p-5 text-right">Valor Líquido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm text-slate-300">
              {transacoesFiltradas.length > 0 ? (
                transacoesFiltradas.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-800/20 transition-all group"
                  >
                    <td className="p-5 text-slate-400 font-mono">
                      {new Date(t.data).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="p-5 font-medium text-white group-hover:text-indigo-400 transition-colors">
                      {t.descricao}
                    </td>
                    <td className="p-5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${t.tipo === "Entrada" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}
                      >
                        {t.tipo === "Entrada" ? "↑ Entrada" : "↓ Saída"}
                      </span>
                    </td>
                    <td className="p-5">
                      <span className="bg-slate-800 border border-slate-700/60 text-slate-300 px-3 py-1 rounded-xl text-xs font-medium">
                        {t.categoria || "Geral"}
                      </span>
                    </td>
                    <td
                      className={`p-5 text-right font-bold font-mono text-base ${t.tipo === "Entrada" ? "text-emerald-400" : "text-rose-400"}`}
                    >
                      {t.tipo === "Entrada" ? "+" : "-"} R$ {t.valor.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-10 text-center text-slate-500 italic"
                  >
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} // <--- Fechamento correto da função Extrato movido para cá!
