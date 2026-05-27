import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

import {
  Wallet,
  Trash2,
  TrendingUp,
  TrendingDown,
  Plus,
  LogOut,
  ArrowUpCircle,
  ArrowDownCircle,
  PlusCircle,
  LayoutDashboard,
  History,
  PiggyBank,
  Settings,
} from "lucide-react";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

interface GoogleUser {
  name: string;
  given_name: string;
  picture: string;
  email: string;
}

interface GoogleResponse {
  credential?: string;
}

interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  tipo: string;
  categoria: string;
  usuarioEmail: string;
}

interface DadoGrafico {
  name: string;
  valor: number;
}

function App() {
  const [usuario, setUsuario] = useState<GoogleUser | null>(null);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [categoria, setCategoria] = useState("Geral");

  // Estados do formulário
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("Saída");

  const buscarTransacoes = async () => {
    if (!usuario?.email) return;
    try {
      const response = await fetch(
        `http://localhost:5010/api/transacoes/${usuario.email}`,
      );
      if (!response.ok) throw new Error("Erro na requisição");
      const dados = await response.json();
      setTransacoes(dados);
    } catch (error) {
      console.error("Erro na API:", error);
    }
  };

  useEffect(() => {
    if (usuario) {
      buscarTransacoes();
    } else {
      setTransacoes([]); // Se deslogar, apaga a lista da tela!
    }
  }, [usuario]);

  const salvarTransacao = async (e: React.FormEvent) => {
    e.preventDefault();

    const novaTransacao = {
      descricao,
      valor: parseFloat(valor),
      tipo,
      categoria,
      data: new Date().toISOString(),
      usuarioEmail: usuario?.email,
    };

    try {
      const response = await fetch("http://localhost:5010/api/transacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // Corrigido aqui!
        body: JSON.stringify(novaTransacao),
      });

      if (response.ok) {
        setModalAberto(false);
        setDescricao("");
        setValor("");
        await buscarTransacoes(); // Atualiza a lista
      } else {
        const erroTexto = await response.text();
        alert(`Erro do Servidor (500): ${erroTexto}`);
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const limparHistorico = async () => {
    if (!usuario?.email) return;

    const confirmou = window.confirm(
      "Tem certeza que deseja apagar todo o seu histórico financeiro?",
    );
    if (!confirmou) return;

    try {
      const response = await fetch(
        `http://localhost:5010/api/transacoes/limpar/${usuario.email}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setTransacoes([]);
        alert("HIstórico limpo com sucesso!");
      } else {
        alert("Erro ao limpar o histórico no servidor.");
      }
    } catch (error) {
      alert("Erro de conexão: " + error);
      console.error("Erro na requisição de limpeza:", error);
    }
  };

  const loginSucesso = (credentialResponse: GoogleResponse) => {
    if (credentialResponse.credential) {
      const decoded = jwtDecode<GoogleUser>(credentialResponse.credential);
      setUsuario(decoded);
    }
  };

  const totalEntradas = transacoes
    .filter((t) => t.tipo === "Entrada")
    .reduce((acc, curr) => acc + curr.valor, 0);

  const totalSaidas = transacoes
    .filter((t) => tipo === "Saída")
    .reduce((acc, curr) => acc + curr.valor, 0);

  const saldoTotal = totalEntradas - totalSaidas;

  const dadosGrafico = transacoes
    .filter((t) => t.tipo === "Saída")
    .reduce((acc: DadoGrafico[], curr) => {
      const categoriaExistente = acc.find(
        (item) => item.name === curr.categoria,
      );
      if (categoriaExistente) {
        categoriaExistente.valor += curr.valor;
      } else {
        acc.push({ name: curr.categoria, valor: curr.valor });
      }
      return acc;
    }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-72 bg-[#1e293b]/50 backdrop-blur-xl border-r border-slate-800 p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-indigo-500 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <Wallet className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase">
              Gabriel<span className="text-indigo-400">Pay</span>
            </h1>
          </div>

          <nav className="space-y-2">
            <NavItem
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              active
            />
            <NavItem icon={<History size={20} />} label="Extrato" />
            <NavItem icon={<PiggyBank size={20} />} label="Metas" />
            <NavItem icon={<Settings size={20} />} label="Configurações" />
          </nav>
        </div>

        {!usuario ? (
          <div className="mt-10">
            <GoogleLogin
              onSuccess={loginSucesso}
              onError={() => console.log("Erro no Login")}
              theme="filled_blue"
              shape="pill"
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 mt-10 bg-slate-800/50 backdrop-blur-md rounded-2xl border border-white/10 transition-all hover:bg-slate-800">
            <img
              src={usuario.picture}
              alt="Foto"
              className="w-10 h-10 rounded-full border border-indigo-500/50"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">
                {usuario.name}
              </p>
              <button
                onClick={() => setUsuario(null)}
                className="text-xs text-rose-400 font-semibold hover:text-rose-300"
              >
                Sair da conta
              </button>
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight">
              {usuario ? `Olá, ${usuario.given_name}!` : "Painel de Controle"}
            </h2>
            <p className="text-slate-400 mt-1 font-medium">
              Bem-vindo de volta ao seu centro financeiro.
            </p>
          </div>
          <button
            onClick={() => setModalAberto(true)}
            className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 px-6 rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-indigo-500/20 hover:-translate-y-1"
          >
            <PlusCircle size={22} /> Adicionar Gasto
          </button>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <FinanceCard
            title="Entradas"
            value={`R$ ${totalEntradas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            icon={<ArrowUpCircle className="text-emerald-400" />}
            color="emerald"
          />
          <FinanceCard
            title="Saídas"
            value={`R$ ${totalSaidas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            icon={<ArrowDownCircle className="text-rose-400" />}
            color="rose"
          />
          <FinanceCard
            title="Saldo em Conta"
            value={`R$ ${saldoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            icon={<Wallet className="text-indigo-400" />}
            color="indigo"
            highlight
          />
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <section className="bg-[#1e293b]/40 border border-slate-800 p-8 rounded-4xl">
            <h3 className="text-xl font-bold mb-8 text-white">Fluxo Semanal</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    dadosGrafico.length > 0
                      ? dadosGrafico
                      : [{ name: "Sem dados", valor: 0 }]
                  }
                >
                  <defs>
                    {/* Criando um gradiente para a barra ficar moderna */}
                    <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#334155" }}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />

                  <Bar
                    dataKey="valor"
                    fill="url(#colorValor)"
                    radius={[10, 10, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="bg-[#1e293b]/40 border border-slate-800 p-8 rounded-4xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-white">
                Atividade Recente
              </h3>
              {transacoes.length > 0 && (
                <button
                  onClick={limparHistorico}
                  className="text-slate-500 hover:text-rose-400 p-2 rounded-xl hover:bg-rose-500/10 transition-all flex items-center gap-2 text-sm font-semibold"
                >
                  <Trash2 size={18} />
                  <span>Limpar Tudo</span>
                </button>
              )}
            </div>
            <div className="space-y-6">
              {transacoes.length > 0 ? (
                transacoes.map((t) => (
                  <TransactionRow
                    key={t.id}
                    title={t.descricao}
                    date={new Date(t.data).toLocaleDateString("pt-BR")}
                    value={`${t.tipo === "Saída" ? "-" : "+"} R$ ${t.valor.toFixed(2)}`}
                    type={t.tipo === "Saída" ? "out" : "in"}
                  />
                ))
              ) : (
                <div className="text-center py-10 opacity-50">
                  <p>Nenhuma transação real encontrada para {usuario?.name}.</p>
                  <p className="text-xs">
                    Tente adicionar um gasto no botão acima!
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
            Categoria
          </label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
          >
            <option value="Alimentação">Alimentação</option>
            <option value="Lazer">Lazer</option>
            <option value="Transporte">Transporte</option>
            <option value="Saúde">Saúde</option>
            <option value="Geral">Geral</option>
          </select>
        </div>
      </main>

      {/* MODAL (Agora fora dos componentes menores) */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] border border-slate-700 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">
              Nova Transação
            </h3>
            <form onSubmit={salvarTransacao} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                  Descrição
                </label>
                <input
                  type="text"
                  required
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                  placeholder="Ex: Almoço em Niterói"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                    Tipo
                  </label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                  >
                    <option value="Saída">Saída</option>
                    <option value="Entrada">Entrada</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/20 transition-all"
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// COMPONENTES AUXILIARES
function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <a
      href="#"
      className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-semibold ${active ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
    >
      {icon} <span>{label}</span>
    </a>
  );
}

function FinanceCard({
  title,
  value,
  icon,
  highlight = false,
}: FinanceCardProps) {
  return (
    <article
      className={`p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer backdrop-blur-md hover:scale-[1.03] ${highlight ? "bg-indigo-600/80 border-indigo-400 text-white" : "bg-[#1e293b]/40 border-slate-800 text-slate-200"}`}
    >
      <div className="flex justify-between items-start mb-6">
        <p
          className={`font-bold uppercase tracking-wider text-[10px] ${highlight ? "text-indigo-200" : "text-slate-500"}`}
        >
          {title}
        </p>
        <div
          className={`p-3 rounded-2xl ${highlight ? "bg-white/20" : "bg-slate-800/50"}`}
        >
          {icon}
        </div>
      </div>
      <p className="text-3xl font-black tracking-tight">{value}</p>
    </article>
  );
}

function TransactionRow({ title, date, value, type }: TransactionProps) {
  return (
    <div className="flex justify-between items-center group">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${type === "in" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}
        >
          {type === "in" ? "+" : "-"}
        </div>
        <div>
          <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">
            {title}
          </p>
          <p className="text-sm text-slate-500">{date}</p>
        </div>
      </div>
      <p
        className={`font-black ${type === "in" ? "text-emerald-400" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}

// Interfaces de Props
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}
interface FinanceCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  highlight?: boolean;
}
interface TransactionProps {
  title: string;
  date: string;
  value: string;
  type: "in" | "out";
}

export default App;
