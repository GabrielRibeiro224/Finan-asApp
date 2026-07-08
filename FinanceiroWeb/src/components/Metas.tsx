import { useState } from "react";
import { PlusCircle, Target, X, Edit2, Trash2 } from "lucide-react";

// 1. A INTERFACE PRECISA FICAR NO TOPO (Antes do componente usar)
interface Meta {
  id: number;
  objetivo: string;
  alvo: number;
  guardado: number;
  categoria: string;
}

export default function Metas() {
  // 2. ESTADO DA LISTA TIPADO CORRETAMENTE COMO ARRAY DE METAS
  const [metas, setMetas] = useState<Meta[]>([
    {
      id: 1,
      objetivo: "Upgrade de PC (RTX 3050)",
      alvo: 1500,
      guardado: 600,
      categoria: "Hardware",
    },
    {
      id: 2,
      objetivo: "Cursos de Cloud Computing",
      alvo: 300,
      guardado: 300,
      categoria: "Educação",
    },
    {
      id: 3,
      objetivo: "Reserva de Emergência",
      alvo: 2000,
      guardado: 400,
      categoria: "Geral",
    },
  ]);

  // 3. ESTADOS PARA CRIAR NOVA META
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const [objetivo, setObjetivo] = useState("");
  const [alvo, setAlvo] = useState("");
  const [guardado, setGuardado] = useState("");
  const [categoria, setCategoria] = useState("Geral");

  // 4. ESTADOS PARA EDITAR META EXISTENTE (Permite Meta ou null)
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [metaEmEdicao, setMetaEmEdicao] = useState<Meta | null>(null);
  const [editObjetivo, setEditObjetivo] = useState("");
  const [editAlvo, setEditAlvo] = useState("");
  const [editGuardado, setEditGuardado] = useState("");

  // Função para salvar nova meta
  const salvarMeta = (e: React.FormEvent) => {
    e.preventDefault();
    const novaMeta: Meta = {
      id: Date.now(),
      objetivo,
      alvo: parseFloat(alvo),
      guardado: parseFloat(guardado) || 0,
      categoria,
    };
    setMetas([...metas, novaMeta]);
    setObjetivo("");
    setAlvo("");
    setGuardado("");
    setCategoria("Geral");
    setModalCriarAberto(false);
  };

  // Abrir o modal com os dados atuais da meta selecionada
  const iniciarEdicao = (meta: Meta) => {
    setMetaEmEdicao(meta);
    setEditObjetivo(meta.objetivo);
    setEditAlvo(meta.alvo.toString());
    setEditGuardado(meta.guardado.toString());
    setModalEditarAberto(true);
  };

  // Aplicar as alterações da meta editada
  const atualizarMeta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!metaEmEdicao) return;

    setMetas(
      metas.map((m) =>
        m.id === metaEmEdicao.id
          ? {
              ...m,
              objetivo: editObjetivo,
              alvo: parseFloat(editAlvo),
              guardado: parseFloat(editGuardado) || 0,
            }
          : m,
      ),
    );
    setModalEditarAberto(false);
    setMetaEmEdicao(null);
  };

  // Função para excluir uma meta
  const excluirMeta = (id: number, objetivoMeta: string) => {
    const confirmou = window.confirm(
      `Deseja mesmo excluir a meta "${objetivoMeta}"?`,
    );
    if (confirmou) {
      setMetas(metas.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Metas de Poupança
          </h2>
          <p className="text-slate-400 text-sm">
            Planeje seus objetivos de médio e longo prazo
          </p>
        </div>
        <button
          onClick={() => setModalCriarAberto(true)}
          className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 text-sm transition-all shadow-lg shadow-indigo-500/10 hover:-translate-y-0.5"
        >
          <PlusCircle size={18} /> Nova Meta
        </button>
      </div>

      {/* GRID DE METAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metas.map((meta) => {
          const porcentagem = Math.min((meta.guardado / meta.alvo) * 100, 100);

          return (
            <div
              key={meta.id}
              className="bg-[#1e293b]/30 border border-slate-800 p-6 rounded-3xl backdrop-blur-md flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 relative"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-slate-800/80 border border-slate-700/50 p-3 rounded-2xl text-indigo-400">
                    <Target size={22} />
                  </div>

                  {/* BOTÕES DE AÇÃO */}
                  <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => iniciarEdicao(meta)}
                      title="Editar meta"
                      className="text-slate-400 hover:text-indigo-400 p-1.5 rounded-lg hover:bg-slate-800 transition-all"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => excluirMeta(meta.id, meta.objetivo)}
                      title="Excluir meta"
                      className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className="text-lg font-bold text-white truncate flex-1">
                    {meta.objetivo}
                  </h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-800/80 text-slate-400 px-2 py-0.5 rounded-md h-fit whitespace-nowrap">
                    {meta.categoria}
                  </span>
                </div>

                <p className="text-sm text-slate-400 mb-6">
                  Alvo:{" "}
                  <span className="text-white font-semibold">
                    R$ {meta.alvo.toFixed(2)}
                  </span>
                </p>
              </div>

              {/* BARRA DE PROGRESSO */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-500">Progresso</span>
                  <span
                    className={
                      porcentagem === 100
                        ? "text-emerald-400 animate-pulse"
                        : "text-indigo-400"
                    }
                  >
                    {porcentagem.toFixed(0)}%
                  </span>
                </div>

                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      porcentagem === 100
                        ? "bg-emerald-500 shadow-lg shadow-emerald-500/20"
                        : "bg-indigo-500"
                    }`}
                    style={{ width: `${porcentagem}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-xs pt-1 text-slate-400 font-mono">
                  <span>R$ {meta.guardado.toFixed(2)}</span>
                  <span>
                    {meta.alvo - meta.guardado <= 0
                      ? "Meta Alcançada!"
                      : `Faltam R$ ${(meta.alvo - meta.guardado).toFixed(2)}`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: NOVA META */}
      {modalCriarAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] border border-slate-700 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setModalCriarAberto(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-bold text-white mb-6">Nova Meta</h3>
            <form onSubmit={salvarMeta} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                  Descrição do Objetivo
                </label>
                <input
                  type="text"
                  required
                  value={objetivo}
                  onChange={(e) => setObjetivo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                  placeholder="Ex: Comprar Notebook Novo"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    Valor Alvo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={alvo}
                    onChange={(e) => setAlvo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                    placeholder="3000.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    Já guardado (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={guardado}
                    onChange={(e) => setGuardado(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                  Categoria
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                >
                  <option value="Geral">Geral</option>
                  <option value="Hardware">Hardware / PC</option>
                  <option value="Educação">Educação</option>
                  <option value="Lazer">Lazer / Viagem</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setModalCriarAberto(false)}
                  className="flex-1 bg-slate-800 text-white font-bold py-3 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/20"
                >
                  Confirmar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR META */}
      {modalEditarAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e293b] border border-slate-700 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => {
                setModalEditarAberto(false);
                setMetaEmEdicao(null);
              }}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-2xl font-bold text-white mb-6">Editar Meta</h3>
            <form onSubmit={atualizarMeta} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                  Título do Objetivo
                </label>
                <input
                  type="text"
                  required
                  value={editObjetivo}
                  onChange={(e) => setEditObjetivo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    Valor Alvo (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editAlvo}
                    onChange={(e) => setEditAlvo(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                    Valor Guardado (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editGuardado}
                    onChange={(e) => setEditGuardado(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setModalEditarAberto(false);
                    setMetaEmEdicao(null);
                  }}
                  className="flex-1 bg-slate-800 text-white font-bold py-3 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/20"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
