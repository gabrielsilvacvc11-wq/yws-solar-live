import { useMemo, useState } from "react";

const WA = "https://wa.me/5562991758807";
const TIPOS = ["Casa", "Apartamento", "Comércio", "Indústria", "Rural"];
const CONTAS = [300, 500, 800, 1000, 1500, 2000];
const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

type Step = "form" | "result" | "lead";

export default function App() {
  const [step, setStep] = useState<Step>("form");
  const [endereco, setEndereco] = useState("");
  const [tipo, setTipo] = useState("Casa");
  const [conta, setConta] = useState(500);
  const [nome, setNome] = useState("");
  const [fone, setFone] = useState("");

  const r = useMemo(() => {
    const consumo = Math.max(180, Math.round((conta || 350) / 0.82));
    const kwp = Math.max(1.2, consumo / (5.2 * 30.4 * 0.78));
    const ger = Math.round(kwp * 5.2 * 30.4 * 0.78);
    const eco = Math.round(ger * 0.82 * 100) / 100;
    const mods = Math.max(4, Math.ceil((kwp * 1000) / 630));
    const pay = eco > 0 ? (kwp * 4800) / (eco * 12) : 0;
    const co2 = Math.round((ger * 12 * 0.075) * 10) / 10;
    return { consumo, kwp, ger, eco, ano: eco * 12, v25: eco * 12 * 25, mods, pay, co2 };
  }, [conta]);

  const base = `${endereco || "Goiás"} · ${tipo} · conta ${brl(conta)} · ${r.kwp.toFixed(2)} kWp · ${r.mods} painéis · economia ${brl(r.ano)}/ano`;
  const msgEsp = encodeURIComponent(`Olá YWS! Quero falar com um especialista.\n${base}`);
  const msgProj = encodeURIComponent(`Olá YWS! Quero meu projeto.\n${nome} · ${fone}\n${base}`);

  return (
    <div className="shell">
      <header className="top">
        <div className="brand">
          <span className="mark" aria-hidden>⚡</span>
          <div>YWS Solar<small>ENERGIA INTELIGENTE</small></div>
        </div>
        <p className="tag">Um futuro mais sustentável <b>começa com você.</b></p>
      </header>

      <main className="stage">
        <section className="left">
          <h5>ENERGIA SOLAR</h5>
          <h1>Mais que energia, é um <span>futuro melhor.</span></h1>
          <p>A YWS Solar oferece soluções completas em energia solar, unindo tecnologia, economia e sustentabilidade.</p>
          <img className="bulb" alt="Painéis solares e energia YWS" src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80" />
        </section>

        <aside className="card" aria-live="polite">
          <div className="logo-row"><span className="mark" style={{ width: 28, height: 28, fontSize: 14 }}>⚡</span> YWS Solar</div>

          {step === "form" && (
            <>
              <h2>Descubra quanto você pode economizar</h2>
              <p className="hint">Faça uma simulação rápida do seu projeto solar.</p>
              <label htmlFor="cep">CEP ou endereço</label>
              <input id="cep" className="inp" placeholder="Ex: 74900-000 ou Rua, número" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
              <label>Tipo de imóvel</label>
              <div className="chips">{TIPOS.map((t) => <button type="button" key={t} className={tipo === t ? "chip on" : "chip"} onClick={() => setTipo(t)}>{t}</button>)}</div>
              <label>Valor médio da conta de energia</label>
              <div className="chips">{CONTAS.map((v) => <button type="button" key={v} className={conta === v ? "chip on" : "chip"} onClick={() => setConta(v)}>{v >= 2000 ? "R$ 2.000+" : brl(v)}</button>)}</div>
              <input className="inp" style={{ marginTop: 8 }} type="number" min={0} value={conta} onChange={(e) => setConta(Number(e.target.value))} aria-label="Digitar valor da conta" />
              <button className="go" onClick={() => setStep("result")}>Simular meu projeto →</button>
              <p className="note">Sem cadastro · resultado na hora</p>
            </>
          )}

          {step === "result" && (
            <>
              <h2>Seu projeto estimado</h2>
              <p className="hint">{tipo} · {endereco || "Goiás"}</p>
              <div>Economia anual estimada</div>
              <div className="money">{brl(r.ano)}</div>
              <div className="bar" aria-hidden><span /></div>
              <p>Seu projeto pode gerar até <b>{r.ger.toLocaleString("pt-BR")} kWh/mês</b>.</p>
              <div className="kpis">
                <div><b>{r.consumo} kWh</b>Consumo mensal</div>
                <div><b>{r.kwp.toFixed(2)} kWp</b>Sistema recomendado</div>
                <div><b>{r.mods}</b>Painéis estimados</div>
                <div><b>{brl(r.eco)}</b>Economia / mês</div>
                <div><b>{brl(r.v25)}</b>Em 25 anos</div>
                <div><b>{r.co2} t</b>CO₂ evitado / ano</div>
              </div>
              <p className="note">Estimativa. O projeto final depende de visita e análise técnica.</p>
              <div className="rowbtns">
                <button className="go" onClick={() => setStep("lead")}>Quero meu projeto</button>
                <a className="ghost" href={`${WA}?text=${msgEsp}`} target="_blank" rel="noreferrer">Falar com um especialista</a>
              </div>
              <button className="ghost" style={{ width: "100%", marginTop: 8 }} onClick={() => setStep("form")}>Nova simulação</button>
            </>
          )}

          {step === "lead" && (
            <>
              <h2>Quero meu projeto</h2>
              <p className="hint">Passamos esses dados para o especialista fechar o orçamento.</p>
              <label htmlFor="nome">Nome</label>
              <input id="nome" className="inp" value={nome} onChange={(e) => setNome(e.target.value)} />
              <label htmlFor="fone">WhatsApp</label>
              <input id="fone" className="inp" value={fone} onChange={(e) => setFone(e.target.value)} placeholder="(62) 9xxxx-xxxx" />
              <a className="go" href={`${WA}?text=${msgProj}`} target="_blank" rel="noreferrer">Enviar para o especialista →</a>
              <button className="ghost" style={{ width: "100%", marginTop: 8 }} onClick={() => setStep("result")}>Voltar ao resultado</button>
            </>
          )}
        </aside>
      </main>

      <footer className="foot">
        <div><b>Energia Solar</b>Economia na sua conta de luz.</div>
        <div><b>Sustentabilidade</b>Um planeta melhor para as próximas gerações.</div>
        <div><b>Segurança</b>Tecnologia e confiança em cada projeto.</div>
        <div><b>Suporte Especializado</b>Estamos sempre com você.</div>
      </footer>
    </div>
  );
}
