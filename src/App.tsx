import { useEffect, useMemo, useRef, useState } from "react";
import { Chart } from "chart.js/auto";

const WA = "https://wa.me/5562991758807";
const HERO =
  "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=2000&q=80";
const FIELD =
  "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1800&q=80";

const PRESETS = [
  { id: 0, nome: "Residencial", desc: "Goiânia e região", consumo: 350, sujeira: 12, cobertura: 90, orientacao: 0.95 },
  { id: 1, nome: "Comercial", desc: "Telhado metálico", consumo: 800, sujeira: 5, cobertura: 85, orientacao: 0.95 },
  { id: 2, nome: "Rural", desc: "Mais poeira no campo", consumo: 250, sujeira: 28, cobertura: 95, orientacao: 0.88 },
];

const CIDADES = [
  { id: 0, name: "Goiânia", irr: 5.42 },
  { id: 1, name: "Anápolis", irr: 5.45 },
  { id: 2, name: "Aparecida de Goiânia", irr: 5.4 },
  { id: 3, name: "Trindade", irr: 5.43 },
  { id: 4, name: "Senador Canedo", irr: 5.41 },
];

const SEASON = [1.08, 1.05, 1.02, 0.95, 0.88, 0.82, 0.84, 0.92, 1, 1.06, 1.08, 1.1];

export default function App() {
  const [preset, setPreset] = useState(0);
  const [consumo, setConsumo] = useState(350);
  const [cidade, setCidade] = useState(0);
  const [potencia, setPotencia] = useState(4.8);
  const [sujeira, setSujeira] = useState(12);
  const [cobertura, setCobertura] = useState(90);
  const [orientacao, setOrientacao] = useState(0.95);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  const r = useMemo(() => {
    const irr = CIDADES[cidade].irr;
    const pr = 0.76 * orientacao * (1 - sujeira / 100);
    const rec = Math.max(0.5, (consumo * (cobertura / 100)) / (irr * 30.4 * pr));
    const kwp = Math.max(0.5, potencia || rec);
    const ger = Math.round(kwp * irr * 30.4 * pr);
    const eco = Math.round(ger * 0.82);
    const custo = Math.round(kwp * 4800);
    return {
      kwp: kwp.toFixed(1),
      rec: rec.toFixed(1),
      ger,
      eco,
      ano: eco * 12,
      pay: eco > 0 ? (custo / (eco * 12)).toFixed(1) : "-",
      co2: ((ger * 12 * 0.45) / 1000).toFixed(1),
    };
  }, [consumo, cidade, potencia, sujeira, cobertura, orientacao]);

  useEffect(() => {
    if (!canvasRef.current) return;
    chartRef.current?.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        datasets: [
          { label: "Consumo", data: SEASON.map((f) => Math.round(consumo * f)), backgroundColor: "#94a3b8", borderRadius: 6 },
          { label: "Geração", data: SEASON.map((f) => Math.round(r.ger * f)), backgroundColor: "#0ea5e9", borderRadius: 6 },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top" } } },
    });
  }, [consumo, r.ger]);

  const apply = (id: number) => {
    const p = PRESETS[id];
    setPreset(id);
    setConsumo(p.consumo);
    setSujeira(p.sujeira);
    setCobertura(p.cobertura);
    setOrientacao(p.orientacao);
  };

  const msg = encodeURIComponent(
    `Olá YWS! Simulei no site:\n• ${consumo} kWh/mês em ${CIDADES[cidade].name}\n• ${r.kwp} kWp (recomendado ${r.rec})\n• Geração ${r.ger} kWh/mês\n• Economia anual R$ ${r.ano.toLocaleString("pt-BR")}\nQuero um orçamento.`
  );

  return (
    <>
      <nav className="nav">
        <a className="brand" href="/">
          <span className="brand-mark">⚡</span>
          YWS Solar
        </a>
        <div className="nav-links">
          <a href="#simulador">Simulador</a>
          <a href="#resultados">Resultados</a>
          <a href="#campo">Goiás</a>
        </div>
        <a className="wa" href={WA} target="_blank" rel="noreferrer">WhatsApp</a>
      </nav>

      <header className="hero">
        <div className="hero-media">
          <img src={HERO} alt="Usina solar sob o céu aberto" />
        </div>
        <div className="hero-inner">
          <div>
            <div className="kicker">Goiás · sol o ano inteiro</div>
            <h1>
              Energia que<br />nasce da <em>paisagem</em><br />goiana.
            </h1>
            <p className="lead">Simule seu sistema com irradiação real de Goiás e fale com a YWS no WhatsApp.</p>
            <div className="actions">
              <a className="btn btn-sun" href="#simulador">Calcular meu potencial</a>
              <a className="btn btn-ghost" href={WA} target="_blank" rel="noreferrer">Falar no WhatsApp</a>
            </div>
          </div>
          <aside className="glass">
            <h3>Média em Goiânia</h3>
            <div className="big">R$ 1.840</div>
            <div>economia mensal estimada</div>
            <div className="grid3">
              <div className="cell"><b>5.4</b>kWh/m²</div>
              <div className="cell"><b>76%</b>PR</div>
              <div className="cell"><b>4.2</b>anos</div>
            </div>
          </aside>
        </div>
      </header>

      <section className="section" id="simulador">
        <div className="wrap">
          <div className="eyebrow">Passo 1</div>
          <h2>Configure o sistema</h2>
          <div className="presets">
            {PRESETS.map((p) => (
              <button key={p.id} className={`preset ${preset === p.id ? "active" : ""}`} onClick={() => apply(p.id)}>
                <strong>{p.nome}</strong><br /><small>{p.desc}</small>
              </button>
            ))}
          </div>
          <div className="panel">
            <div>
              <label>Consumo mensal (kWh)</label>
              <input type="number" value={consumo} onChange={(e) => setConsumo(Number(e.target.value))} />
              <div style={{ height: 18 }} />
              <label>Cidade</label>
              <select value={cidade} onChange={(e) => setCidade(Number(e.target.value))}>
                {CIDADES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <div style={{ height: 18 }} />
              <label>Potência do sistema (kWp)</label>
              <input type="number" step="0.1" value={potencia} onChange={(e) => setPotencia(Number(e.target.value))} />
              <p className="hint">Recomendado para o consumo: {r.rec} kWp</p>
            </div>
            <div>
              <div className="row"><label>Sujeira</label><span>{sujeira}%</span></div>
              <input type="range" min={0} max={40} value={sujeira} onChange={(e) => setSujeira(Number(e.target.value))} />
              <div style={{ height: 18 }} />
              <div className="row"><label>Cobertura</label><span>{cobertura}%</span></div>
              <input type="range" min={50} max={100} step={5} value={cobertura} onChange={(e) => setCobertura(Number(e.target.value))} />
              <div style={{ height: 18 }} />
              <div className="row"><label>Orientação</label><span>{Math.round(orientacao * 100)}%</span></div>
              <input type="range" min={70} max={100} value={Math.round(orientacao * 100)} onChange={(e) => setOrientacao(Number(e.target.value) / 100)} />
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="resultados" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="eyebrow">Passo 2</div>
          <h2>Resultado da simulação</h2>
          <div className="metrics">
            <div className="metric"><span>POTÊNCIA</span><b>{r.kwp}</b>kWp</div>
            <div className="metric"><span>GERAÇÃO</span><b>{r.ger}</b>kWh/mês</div>
            <div className="metric"><span>ECONOMIA</span><b>R$ {r.eco.toLocaleString("pt-BR")}</b></div>
            <div className="metric"><span>PAYBACK</span><b>{r.pay}</b>anos</div>
            <div className="metric"><span>CO₂</span><b>{r.co2}</b>t/ano</div>
          </div>
          <div className="chart-box"><canvas ref={canvasRef} /></div>
        </div>
      </section>

      <section className="band" id="campo">
        <img src={FIELD} alt="Painéis solares em campo aberto" />
        <div className="wrap">
          <div className="eyebrow" style={{ color: "#f4d27a" }}>Por que Goiás</div>
          <h2>Uma das melhores irradiações do país</h2>
          <p style={{ maxWidth: 560, opacity: 0.88 }}>O simulador usa médias do Atlas Solar e do INMET. Temperatura, orientação e sujeira já entram no cálculo.</p>
          <div className="facts">
            <div className="fact"><b>5,3–5,7 kWh/m²</b><p>irradiação média diária no estado</p></div>
            <div className="fact"><b>Até 30%</b><p>de perda quando o painel está sujo</p></div>
            <div className="fact"><b>(62) 99175-8807</b><p>orçamento e visita técnica</p></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="cta">
            <div>
              <h2>Quer transformar a conta de luz?</h2>
              <p style={{ opacity: 0.75, margin: 0 }}>A YWS avalia o telhado e envia a proposta pelo WhatsApp.</p>
            </div>
            <a className="btn btn-sun" href={`${WA}?text=${msg}`} target="_blank" rel="noreferrer">Enviar simulação</a>
          </div>
          <footer>YWS Soluções Elétricas · Energia solar e elétrica em Goiás</footer>
        </div>
      </section>
    </>
  );
}
