import { useEffect, useMemo, useState } from "react";
import Particles from "./Particles";

const WA = "https://wa.me/5562991758807";
const YURI = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80";
const TIPOS = ["Casa", "Comércio", "Indústria", "Rural"] as const;
const CONTAS = [300, 500, 800, 1000, 1500, 2000];
const ICO: Record<string, string> = { Casa: "🏠", Comércio: "🏬", Indústria: "🏭", Rural: "🌾" };
const PHRASES = ["Analisando o potencial solar da sua região...", "Calculando seu consumo...", "Dimensionando seu sistema..."];
const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
type View = "home" | "form" | "analyze" | "size" | "flow" | "result" | "lead";

function Count({ to, money = false }: { to: number; money?: boolean }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(to); return; }
    const t0 = performance.now();
    let id = 0;
    const run = (now: number) => {
      const p = Math.min(1, (now - t0) / 1100);
      setV(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) id = requestAnimationFrame(run);
    };
    id = requestAnimationFrame(run);
    return () => cancelAnimationFrame(id);
  }, [to]);
  return <>{money ? brl(v) : Math.round(v).toLocaleString("pt-BR")}</>;
}

export default function App() {
  const [view, setView] = useState<View>("home");
  const [endereco, setEndereco] = useState("");
  const [tipo, setTipo] = useState("Casa");
  const [conta, setConta] = useState(800);
  const [nome, setNome] = useState("");
  const [fone, setFone] = useState("");
  const [phrase, setPhrase] = useState(0);
  const [panels, setPanels] = useState(0);
  const [billShow, setBillShow] = useState(800);
  const found = endereco.trim().length >= 8;

  const r = useMemo(() => {
    const consumo = Math.max(180, Math.round((conta || 350) / 0.82));
    const kwp = Math.max(1.2, consumo / (5.2 * 30.4 * 0.78));
    const ger = Math.round(kwp * 5.2 * 30.4 * 0.78);
    const eco = Math.round(ger * 0.82 * 100) / 100;
    const mods = Math.max(4, Math.min(16, Math.ceil((kwp * 1000) / 630)));
    const after = Math.max(80, Math.round(conta - eco));
    return { consumo, kwp, ger, eco, ano: eco * 12, v25: eco * 12 * 25, mods, after };
  }, [conta]);

  useEffect(() => {
    if (view !== "analyze") return;
    setPhrase(0);
    const a = window.setTimeout(() => setPhrase(1), 900);
    const b = window.setTimeout(() => setPhrase(2), 1800);
    const c = window.setTimeout(() => setView("size"), 2800);
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); };
  }, [view]);

  useEffect(() => {
    if (view !== "size") return;
    setPanels(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1; setPanels(i);
      if (i >= r.mods) { clearInterval(id); window.setTimeout(() => setView("flow"), 700); }
    }, 180);
    return () => clearInterval(id);
  }, [view, r.mods]);

  useEffect(() => {
    if (view !== "flow") return;
    const id = window.setTimeout(() => setView("result"), 2200);
    return () => clearTimeout(id);
  }, [view]);

  useEffect(() => {
    if (view !== "analyze") return;
    setBillShow(conta);
    const steps = [conta, Math.round(conta * 0.55), r.after];
    let i = 0;
    const id = window.setInterval(() => { i += 1; if (i < steps.length) setBillShow(steps[i]); else clearInterval(id); }, 700);
    return () => clearInterval(id);
  }, [view, conta, r.after]);

  const base = `${endereco || "Goiás"} · ${tipo} · conta ${brl(conta)} · ${r.kwp.toFixed(2)} kWp · ${r.mods} painéis · economia ${brl(r.ano)}/ano`;
  const msgEsp = encodeURIComponent(`Olá YWS! Quero falar com um especialista.\n${base}`);
  const msgProj = encodeURIComponent(`Olá YWS! Quero meu projeto.\n${nome} · ${fone}\n${base}`);

  const House = ({ glow }: { glow?: boolean }) => (
    <svg className={`house ${glow ? "live" : ""}`} viewBox="0 0 280 160" aria-hidden>
      <rect x="40" y="78" width="200" height="70" rx="6" fill="#161616" stroke="#3d3d3d" />
      <polygon points="30,78 140,18 250,78" fill="#1c1c1c" stroke="#d4b24a" />
      {Array.from({ length: r.mods }).map((_, i) => {
        const col = i % 8; const row = Math.floor(i / 8);
        return <rect key={i} className={i < panels || view === "flow" || view === "result" || view === "lead" ? "pv on" : "pv"} x={70 + col * 16} y={36 + row * 12} width="14" height="10" rx="1" />;
      })}
      <rect x="118" y="108" width="28" height="40" fill="#0e0e0e" stroke="#d4b24a" />
      <rect className="win" x="58" y="96" width="28" height="18" rx="2" />
      <rect className="win" x="194" y="96" width="28" height="18" rx="2" />
      {glow && <path className="flow-line" d="M140 42 L140 88 L168 88 L168 118" />}
    </svg>
  );

  return (
    <div className="shell">
      <Particles />
      <header className="top">
        <button className="brand" onClick={() => setView("home")}>
          <span className="mark">⚡</span>
          <div>YWS Solar<small>ENERGIA INTELIGENTE</small></div>
        </button>
        <p className="tag">Mais energia para um <b>futuro melhor.</b></p>
      </header>

      {view === "home" && (
        <main className="home">
          <section className="home-copy">
            <p className="say">Yuri, da YWS Solar</p>
            <h1>Oi, eu sou o Yuri.<br />Vamos <span>transformar o sol em economia.</span></h1>
            <p>Sem cadastro. Você informa o endereço, o tipo do imóvel e a conta de luz. Eu mostro o sistema nascendo no telhado.</p>
            <button className="go energy" onClick={() => setView("form")}>Simular meu projeto →</button>
            <p className="note">Resultado estimado em poucos segundos</p>
          </section>
          <aside className="yuri-wrap">
            <img className="yuri" src="/yuri.webp" alt="Yuri, personagem da YWS Solar, em frente à casa com painéis" onError={(e) => { (e.currentTarget as HTMLImageElement).src = YURI; }} />
          </aside>
        </main>
      )}

      {view !== "home" && (
        <main className="stage">
          <section className="left">
            <h5>{ICO[tipo]} {tipo}</h5>
            <h1>Seu sistema <span>sendo criado.</span></h1>
            <House glow={view === "flow" || view === "result" || view === "lead"} />
            {(view === "size" || view === "flow" || view === "result") && <p className="hint">{panels || r.mods} painéis · {r.kwp.toFixed(2)} kWp</p>}
          </section>
          <aside className="card">
            {view === "form" && (
              <>
                <h2>Me conta sobre o seu imóvel</h2>
                <p className="hint">Yuri usa isso para estimar o sistema.</p>
                <label>CEP ou endereço</label>
                <input className="inp" value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="74900-000 ou Rua, número" />
                {found && <p className="ok">📍 Localização encontrada</p>}
                <label>Tipo de imóvel</label>
                <div className="chips">{TIPOS.map((t) => <button type="button" key={t} className={tipo === t ? "chip on" : "chip"} onClick={() => setTipo(t)}>{ICO[t]} {t}</button>)}</div>
                <label>Valor médio da conta</label>
                <div className="bill">Hoje você paga cerca de <b>{brl(conta)}/mês</b></div>
                <div className="chips">{CONTAS.map((v) => <button type="button" key={v} className={conta === v ? "chip on" : "chip"} onClick={() => setConta(v)}>{v >= 2000 ? "R$ 2.000+" : brl(v)}</button>)}</div>
                <button className="go energy" onClick={() => setView("analyze")}>Calcular sistema →</button>
              </>
            )}
            {view === "analyze" && (
              <div className="analyze">
                <div className="sun" />
                <h2>{PHRASES[phrase]}</h2>
                <div className="bill drop">{brl(billShow)}/mês</div>
              </div>
            )}
            {view === "size" && (<><h2>Dimensionando</h2><p className="money">{r.kwp.toFixed(2)} kWp</p><p>{panels} de {r.mods} painéis</p><p>{r.ger} kWh/mês</p></>)}
            {view === "flow" && (<><h2>Energia em fluxo</h2><p>Painéis → Inversor → Casa</p><div className="path"><i /><i /><i /><i /></div></>)}
            {view === "result" && (
              <>
                <div className="yuri-mini">
                  <img src="/yuri.webp" alt="Yuri" onError={(e) => { (e.currentTarget as HTMLImageElement).src = YURI; }} />
                  <p>Gostou da economia? Vamos transformar essa simulação em um projeto real.</p>
                </div>
                <div className="money"><Count to={r.eco} money /></div>
                <p>economia / mês · <Count to={r.ano} money /> / ano · 25 anos <Count to={r.v25} money /></p>
                <div className="cmp"><span>Sem solar {brl(conta)}</span><span>Com solar {brl(r.after)}</span></div>
                <div className="bars"><b style={{ height: "88%" }} /><b className="low" style={{ height: `${Math.max(12, (r.after / conta) * 88)}%` }} /></div>
                <div className="kpis">
                  <div><b>{r.kwp.toFixed(2)} kWp</b>Sistema</div>
                  <div><b>{r.mods}</b>Painéis</div>
                  <div><b>{r.ger}</b>kWh/mês</div>
                  <div><b>{r.consumo}</b>Consumo</div>
                </div>
                <p className="note">Estimativa. O projeto final depende de análise técnica.</p>
                <div className="rowbtns">
                  <button className="go" onClick={() => setView("lead")}>Quero meu projeto</button>
                  <a className="ghost" href={`${WA}?text=${msgEsp}`} target="_blank" rel="noreferrer">Falar com um especialista</a>
                </div>
              </>
            )}
            {view === "lead" && (
              <>
                <h2>Quero meu projeto</h2>
                <label>Nome</label><input className="inp" value={nome} onChange={(e) => setNome(e.target.value)} />
                <label>WhatsApp</label><input className="inp" value={fone} onChange={(e) => setFone(e.target.value)} />
                <a className="go" href={`${WA}?text=${msgProj}`} target="_blank" rel="noreferrer">Enviar para o especialista →</a>
              </>
            )}
          </aside>
        </main>
      )}
    </div>
  );
}
