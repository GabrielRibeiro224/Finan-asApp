import { useState } from "react";
import { User, Shield, Monitor, RefreshCw, CheckCircle } from "lucide-react";

interface GoogleUser {
  name: string;
  given_name: string;
  picture: string;
  email: string;
}

// 1. Atualizamos a interface para receber os estados do App.tsx
interface ConfigProps {
  usuario: GoogleUser | null;
  darkMode: boolean;
  setDarkMode: (valor: boolean) => void;
  alertasGasto: boolean;
  setAlertasGasto: (valor: boolean) => void;
}

export default function Configuracoes({
  usuario,
  darkMode,
  setDarkMode,
  alertasGasto,
  setAlertasGasto,
}: ConfigProps) {
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // 2. FUNÇÃO REAL QUE SALVA NO LOCALSTORAGE DO NAVEGADOR
  const guardarConfiguracoes = () => {
    setSalvando(true);

    setTimeout(() => {
      // Salva como string dentro do navegador do usuário
      localStorage.setItem("gabrielpay_darkmode", darkMode.toString());
      localStorage.setItem("gabrielpay_alertas", alertasGasto.toString());

      setSalvando(false);
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    }, 800); // Efeitozinho maroto de carregamento
  };

  return (
    <div className="space-y-8 p-6 max-w-4xl">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Configurações do Sistema
        </h2>
        <p className="text-slate-400 text-sm">
          Gerencie suas preferências e dados do perfil
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* COLUNA ESQUERDA: PERFIL DO USUÁRIO */}
        <div className="md:col-span-1 bg-[#1e293b]/30 border border-slate-800 p-6 rounded-3xl backdrop-blur-md flex flex-col items-center text-center justify-center">
          {usuario ? (
            <>
              <img
                src={usuario.picture}
                alt="Foto do Perfil"
                className="w-24 h-24 rounded-full border-4 border-indigo-500/30 mb-4 shadow-xl shadow-indigo-500/10"
              />
              <h3 className="text-lg font-bold text-white">{usuario.name}</h3>
              <p className="text-xs text-slate-500 font-mono mt-1 break-all w-full">
                {usuario.email}
              </p>
              <span className="mt-4 text-[10px] font-black tracking-wider uppercase bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">
                Conta Google Ativa
              </span>
            </>
          ) : (
            <>
              <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-4 border border-slate-700">
                <User size={40} />
              </div>
              <h3 className="text-lg font-bold text-slate-400">
                Modo Visitante
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Faça login para salvar seus dados em nuvem.
              </p>
            </>
          )}
        </div>

        {/* COLUNA DIREITA: FORMULÁRIOS E OPÇÕES */}
        <div className="md:col-span-2 space-y-6">
          {/* SEÇÃO: PREFERÊNCIAS DE INTERFACE (Reflexo da imagem image_a35485.png) */}
          <div className="bg-[#1e293b]/20 border border-slate-800 p-6 rounded-3xl backdrop-blur-md space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <Monitor className="text-indigo-400" size={18} />
              <h4 className="font-bold text-sm text-slate-300 uppercase tracking-wider">
                Aparência & Avisos
              </h4>
            </div>

            {/* INTERFACE DARK MODE */}
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="text-sm font-semibold text-white">
                  Interface Dark Mode
                </p>
                <p className="text-xs text-slate-500">
                  Otimiza a paleta de cores para ambientes escuros.
                </p>
              </div>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="w-5 h-5 accent-indigo-500 cursor-pointer rounded"
              />
            </div>

            {/* ALERTAS DE LIMITE */}
            <div className="flex justify-between items-center py-2 border-t border-slate-800/50">
              <div>
                <p className="text-sm font-semibold text-white">
                  Alertas de Limite de Gastos
                </p>
                <p className="text-xs text-slate-500">
                  Avisa quando uma categoria passar de 80% do teto.
                </p>
              </div>
              <input
                type="checkbox"
                checked={alertasGasto}
                onChange={(e) => setAlertasGasto(e.target.checked)}
                className="w-5 h-5 accent-indigo-500 cursor-pointer rounded"
              />
            </div>
          </div>

          {/* SEÇÃO: DETALHES TÉCNICOS */}
          <div className="bg-[#1e293b]/20 border border-slate-800 p-6 rounded-3xl backdrop-blur-md space-y-3 text-xs text-slate-400">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-1 text-sm text-slate-300 font-bold uppercase tracking-wider">
              <Shield className="text-indigo-400" size={18} />
              <span>Dados da Aplicação</span>
            </div>
            <div className="flex justify-between font-mono">
              <span>Ambiente:</span>
              <span className="text-emerald-400 font-bold">
                Localhost (Development)
              </span>
            </div>
            <div className="flex justify-between font-mono">
              <span>Configurações Locais:</span>
              <span className="text-indigo-400 font-semibold">
                LocalStorage Ativo
              </span>
            </div>
          </div>

          {/* BOTÃO SALVAR ALTERAÇÕES */}
          <div className="flex items-center gap-4 justify-end">
            {sucesso && (
              <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle size={16} /> Configurações salvas no navegador!
              </span>
            )}
            <button
              onClick={guardarConfiguracoes}
              disabled={salvando}
              className="bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/10"
            >
              {salvando ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
