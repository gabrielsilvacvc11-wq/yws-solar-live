import { useMemo, useState } from "react";
const WA = "https://wa.me/5562991758807";
const TIPO = ["Residencial", "Comercial", "Industrial", "Rural"];
const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export default function App() {
  const [endereco, setEndereco] = useState("");
  const [tipo, setTipo] = useState("Residencial");
  const [conta, setConta] = useState(450);
  const [done, setDone] = useState(false);
  const r = useMemo(() => {
    const consumo = Math.max(180, Math.round((conta || 350) / 0.82));
    const kwp = Math.max(1.2, consumo / (5.2 * 30.4 * 0.78));
    const ger = Math.round(kwp * 5.2 * 30.4 * 0.78);
    const eco = Math.round(ger * 0.82 * 100) / 100;
    const mods = Math.max(4, Math.ceil((kwp * 1000) / 630));
    const pay = eco > 0 ? (kwp * 4800) / (eco * 12) : 0;
    return { consumo, kwp, ger, eco, ano: eco * 12, mods, pay };
  }, [conta]);
  const msg = encodeURIComponent(`Olá YWS! Simulação: ${endereco || "Goiás"} · ${tipo} · conta ${brl(conta)} · ${r.kwp.toFixed(2)} kWp · economia ${brl(r.ano)}/ano`);
  return (
    <div className="shell">
      <header className="top">
        <div className="brand">
          <span className="mark">⚡</span>
          <div>YWS Solar<small>ENERGIA INTELIGENTE</small></div>
        </div>
        <div className="tag">Um futuro mais sustentável <b>começa com você.</b></div>
      </header>
      <section className="stage">
        <div className="left">
          <h5>ENERGIA SOLAR</h5>
          <h1>Mais que energia, é um <span>futuro melhor.</span></h1>
          <p>A YWS Solar oferece soluções completas em energia solar, unindo tecnologia, economia e sustentabilidade.</p>
          <img className="bulb" alt="Energia YWS" src="https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80" />
        </div>
        <aside className="card">
          <div className="logo-row"><span className="mark" style={{ width: 28, height: 28, fontSize: 14 }}>⚡</span> YWS Solar</div>
          {!done ? (
            <>
              <h2>Simule seu projeto</h2>
              <p className="hint">Descubra quanto você pode economizar com energia solar.</p>
              <label>CEP ou endereço</label>
              <input className="inp" placeholder="Ex: 74900-000 ou Rua, número" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
              <label>Tipo de imóvel</label>
              <select className="inp" value={tipo} onChange={(e) => setTipo(e.target.value)}>{TIPO.map((t) => <option key={t}>{t}</option>)}</select>
              <label>Valor médio da conta de luz</label>
              <input className="inp" type="number" min={0} value={conta} onChange={(e) => setConta(Number(e.target.value))} />
              <button className="go" onClick={() => setDone(true)}>Simular meu projeto →</button>
              <p className="note">Sem cadastro · resultado na hora</p>
            </>
          ) : (
            <>
              <h2>Resultado da simulação</h2>
              <p className="hint">{tipo} · {endereco || "Goiás"}</p>
              <div>Sua economia projetada</div>
              <div className="money">{brl(r.ano)} / ano</div>
              <div className="kpis">
                <div><b>{r.kwp.toFixed(2)} kWp</b>Potência</div>
                <div><b>{r.ger} kWh</b>Geração / mês</div>
                <div><b>{brl(r.eco)}</b>Economia / mês</div>
                <div><b>{r.pay.toFixed(1)} anos</b>Payback · {r.mods} módulos</div>
              </div>
              <div className="rowbtns">
                <a className="go" style={{ display: "grid", placeItems: "center", textDecoration: "none" }} href={`${WA}?text=${msg}`} target="_blank" rel="noreferrer">Falar no WhatsApp</a>
                <button className="ghost" onClick={() => setDone(false)}>Nova simulação</button>
              </div>
              <p className="note">Sem cadastro · resultado na hora</p>
            </>
          )}
        </aside>
      </section>
      <footer className="foot">
        <div><b>Energia Solar</b>Economia na sua conta de luz.</div>
        <div><b>Sustentabilidade</b>Um planeta melhor para as próximas gerações.</div>
        <div><b>Segurança</b>Tecnologia e confiança em cada projeto.</div>
        <div><b>Suporte Especializado</b>Estamos sempre com você.</div>
      </footer>
    </div>
  );
}
