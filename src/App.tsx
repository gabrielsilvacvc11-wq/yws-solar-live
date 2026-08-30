import { useMemo, useState } from "react";

const WA = "https://wa.me/5562991758807";
const IMG = {
  house: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
  houseDusk: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  comercial: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
  industrial: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=80",
  rural: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=900&q=80",
  tech: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
};
const TIPO = ["Residencial", "Comercial", "Industrial", "Rural"];
const money = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function App() {
  const [page, setPage] = useState<"sim" | "res" | "sol" | "go">("sim");
  const [step, setStep] = useState(1);
  const [tab, setTab] = useState(0);
  const [endereco, setEndereco] = useState("");
  const [tipo, setTipo] = useState("Residencial");
  const [conta, setConta] = useState(350);
  const [kwh, setKwh] = useState(450);
  const [moradores, setMoradores] = useState("3");
  const [ac, setAc] = useState("Sim");

  const r = useMemo(() => {
    const consumo = kwh > 0 ? kwh : Math.round(conta / 0.82);
    const irr = 5.42;
    const pr = 0.76;
    const kwp = Math.max(1.3, consumo / (irr * 30.4 * pr));
    const ger = Math.round(kwp * irr * 30.4 * pr);
    const eco = Math.round(ger * 0.82);
    const mods = Math.max(4, Math.ceil((kwp * 1000) / 450));
    const area = Math.round(mods * 2.3);
    const inv = Math.max(3, Math.round(kwp));
    const custo = Math.round(kwp * 4800);
    const pay = eco > 0 ? custo / (eco * 12) : 0;
    return { consumo, kwp, ger, eco, ano: eco * 12, mods, area, inv, pay, anualKwh: ger * 12 };
  }, [conta, kwh]);

  const msg = encodeURIComponent(
    `Olá YWS! Simulei no site.\nEndereço: ${endereco || "não informado"}\nTipo: ${tipo}\nConta: ${money(conta)}\nConsumo: ${r.consumo} kWh\nSistema: ${r.kwp.toFixed(2)} kWp / ${r.mods} módulos\nEconomia mensal: ${money(r.eco)}\nQuero proposta.`
  );

  const gerarPdf = () => {
    const html = `<html><head><title>Proposta YWS</title></head><body style="font-family:Arial;padding:32px"><h1>Proposta YWS Solar</h1><p>${endereco || "Goiás"} · ${tipo}</p><h2>${money(r.eco)} / mês</h2><p>Economia anual ${money(r.ano)}</p><p>Sistema ${r.kwp.toFixed(2)} kWp · ${r.mods} módulos 450W · inversor ${r.inv} kW</p><p>Geração ${r.ger} kWh/mês · payback ${r.pay.toFixed(1)} anos</p><p>WhatsApp (62) 99175-8807</p></body></html>`;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.print();
  };

  return (
    <>
      <nav className="nav">
        <a className="brand" href="#" onClick={() => setPage("sim")}><span className="mark">⚡</span> YWS Solar</a>
        <div className="links">
          <a className={page === "sim" ? "active" : ""} href="#" onClick={() => { setPage("sim"); setStep(1); }}>Simulador</a>
          <a className={page === "res" ? "active" : ""} href="#" onClick={() => setPage("res")}>Resultados</a>
          <a className={page === "sol" ? "active" : ""} href="#" onClick={() => setPage("sol")}>Soluções</a>
          <a className={page === "go" ? "active" : ""} href="#" onClick={() => setPage("go")}>Goiás</a>
        </div>
        <a className="wa" href={WA} target="_blank" rel="noreferrer">WhatsApp</a>
      </nav>

      {page === "sim" && (
        <div className="page">
          <div className="hero-head">
            <h1>Simulador</h1>
            <p>Descubra quanto você pode economizar com energia solar na sua residência ou empresa.</p>
            <div className="steps">
              {[["1","Localização"],["2","Consumo"],["3","Sistema"],["4","Resultado"]].map(([n,t], i) => (
                <div key={n} className={`step ${step === i + 1 ? "on" : ""} ${step > i + 1 ? "done" : ""}`}>
                  <div className="dot">{n}</div>{t}
                </div>
              ))}
            </div>
          </div>
          {step === 1 && (
            <div className="card">
              <h2>1. Onde será instalado o sistema?</h2>
              <p style={{ color: "#8ea0b5" }}>Informe o endereço do local para análise solar precisa.</p>
              <label>CEP ou endereço</label>
              <input placeholder="Ex: 01310-100 ou Av. Paulista, 1000" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
              <label>Tipo de imóvel</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>{TIPO.map((t) => <option key={t}>{t}</option>)}</select>
              <button className="gold" onClick={() => setStep(2)}>Próximo passo →</button>
            </div>
          )}
          {step === 2 && (
            <div className="card">
              <h2>2. Sua conta de energia</h2>
              <div className="grid2">
                <div><label>Valor médio da conta (R$)</label><input type="number" value={conta} onChange={(e) => setConta(Number(e.target.value))} /></div>
                <div><label>Consumo médio mensal (kWh)</label><input type="number" value={kwh} onChange={(e) => setKwh(Number(e.target.value))} /></div>
              </div>
              <h3 style={{ marginTop: 22 }}>Informações adicionais (opcional)</h3>
              <div className="grid2">
                <div><label>Número de moradores</label><select value={moradores} onChange={(e) => setMoradores(e.target.value)}>{["1","2","3","4","5+"].map((n) => <option key={n}>{n}</option>)}</select></div>
                <div><label>Tem ar-condicionado?</label><select value={ac} onChange={(e) => setAc(e.target.value)}><option>Sim</option><option>Não</option></select></div>
              </div>
              <button className="gold" onClick={() => setStep(3)}>Próximo passo →</button>
            </div>
          )}
          {step === 3 && (
            <div className="card">
              <h2>3. Sistema recomendado</h2>
              <p style={{ color: "#8ea0b5" }}>Com base no consumo de {r.consumo} kWh/mês em {tipo.toLowerCase()}.</p>
              <div className="kpi">
                <div><span>Potência</span><b>{r.kwp.toFixed(2)} kWp</b></div>
                <div><span>Módulos 450W</span><b>{r.mods}</b></div>
                <div><span>Inversor</span><b>{r.inv} kW</b></div>
                <div><span>Área</span><b>{r.area} m²</b></div>
              </div>
              <button className="gold" onClick={() => { setStep(4); setPage("res"); }}>Ver resultado →</button>
            </div>
          )}
          <div className="card note" style={{ marginTop: 14 }}>
            <div>🔒 Simulação 100% gratuita<br /><small>Sem compromisso e sem cartão de crédito</small></div>
            <div>👤 Análise personalizada<br /><small>Estudo completo para o seu perfil</small></div>
          </div>
        </div>
      )}

      {page === "res" && (
        <div className="page">
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <h1 style={{ fontFamily: "Instrument Serif, Georgia, serif", fontWeight: 400, fontSize: 42, margin: 0 }}>Resultado da sua simulação</h1>
            <p style={{ color: "#8ea0b5" }}>Confira o projeto ideal para você e comece a economizar.</p>
          </div>
          <div className="result-top">
            <div className="card">
              <span className="badge">Sistema recomendado</span>
              <p style={{ color: "#8ea0b5", marginBottom: 6 }}>Sua economia mensal estimada</p>
              <div className="money">{money(r.eco)}</div>
              <p>Economia anual <b>{money(r.ano)}</b></p>
              <span className="badge">Retorno do investimento: {r.pay.toFixed(1)} anos</span>
            </div>
            <img className="photo" src={IMG.house} alt="Casa com painéis solares" />
          </div>
          <div className="kpi">
            <div><span>Potência do sistema</span><b>{r.kwp.toFixed(2)} kWp</b></div>
            <div><span>Produção mensal</span><b>{r.ger} kWh</b></div>
            <div><span>Quantidade de módulos</span><b>{r.mods} módulos</b></div>
            <div><span>Vida útil do sistema</span><b>+25 anos</b></div>
          </div>
          <div className="split">
            <div className="card">
              <h3>Detalhes do sistema</h3>
              <div className="row"><span>Painéis solares</span><b>{r.mods} módulos de 450W</b></div>
              <div className="row"><span>Inversor</span><b>1 inversor de {r.inv} kW</b></div>
              <div className="row"><span>Área necessária</span><b>{r.area} m²</b></div>
              <div className="row"><span>Produção anual</span><b>{r.anualKwh.toLocaleString("pt-BR")} kWh</b></div>
              <div className="row"><span>Economia anual</span><b>{money(r.ano)}</b></div>
              <div className="row"><span>Garantia dos equipamentos</span><b>12 anos</b></div>
              <div className="row"><span>Garantia de produção</span><b>25 anos</b></div>
            </div>
            <div className="card">
              <h3>Projeção de economia</h3>
              <svg viewBox="0 0 320 180" width="100%" height="180">
                <line x1="30" y1="150" x2="300" y2="150" stroke="#35587d" />
                <polyline fill="none" stroke="#64748b" strokeWidth="2" points="30,90 80,88 130,86 180,84 230,82 280,80" />
                <polyline fill="none" stroke="#22c55e" strokeWidth="3" points="30,90 80,78 130,62 180,46 230,32 280,18" />
                <rect x="150" y="48" width="92" height="28" rx="8" fill="#f5c518" />
                <text x="196" y="66" textAnchor="middle" fontSize="10" fontWeight="700">Ponto de retorno {r.pay.toFixed(1)} anos</text>
              </svg>
            </div>
          </div>
          <div className="card cta-box">
            <div>
              <h3>Pronto para transformar energia em economia?</h3>
              <p style={{ color: "#8ea0b5" }}>Fale com um de nossos especialistas e receba seu orçamento personalizado.</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a className="btn-g" href={`${WA}?text=${msg}`} target="_blank" rel="noreferrer">Falar no WhatsApp</a>
                <button className="btn-o" onClick={gerarPdf}>Gerar proposta em PDF</button>
              </div>
            </div>
            <img className="tech" src={IMG.tech} alt="Especialista YWS" />
          </div>
        </div>
      )}

      {page === "sol" && (
        <div className="page">
          <div className="hero-head">
            <h1>Soluções completas<br />para todos os tipos de projetos</h1>
            <p>A energia solar ideal para sua casa, empresa ou propriedade.</p>
          </div>
          <div className="tabs">
            {TIPO.map((t, i) => <button key={t} className={tab === i ? "on" : ""} onClick={() => setTab(i)}>{t}</button>)}
          </div>
          <div className="card sol-grid">
            <img src={[IMG.houseDusk, IMG.comercial, IMG.industrial, IMG.rural][tab]} alt={TIPO[tab]} />
            <div>
              <h2>Soluções {TIPO[tab].toLowerCase()}s</h2>
              <p style={{ color: "#8ea0b5" }}>Reduza sua conta de energia e valorize o imóvel.</p>
              <ul className="checks">
                <li>✔ Economia de até 95% na conta de luz</li>
                <li>✔ Instalação rápida e sem obras</li>
                <li>✔ Equipamentos de alta qualidade</li>
                <li>✔ Financiamento facilitado</li>
              </ul>
              <button className="gold" style={{ maxWidth: 220 }} onClick={() => { setTipo(TIPO[tab]); setPage("sim"); setStep(1); }}>Simular meu projeto</button>
            </div>
          </div>
          <div className="three">
            {([[IMG.comercial,"Comercial","Soluções para empresas que buscam economia e sustentabilidade."],[IMG.industrial,"Industrial","Reduza custos operacionais e garanta energia limpa para sua produção."],[IMG.rural,"Rural","Energia confiável para suas atividades no campo."]] as const).map(([img, t, d]) => (
              <div className="card" key={t}>
                <img src={img} alt={t} />
                <h3>{t}</h3>
                <p style={{ color: "#8ea0b5" }}>{d}</p>
                <a href="#" style={{ color: "#f5c518" }} onClick={() => { setTipo(t); setPage("sim"); }}>Simular projeto →</a>
              </div>
            ))}
          </div>
          <div className="stats">
            <div><b>+500</b>Projetos realizados</div>
            <div><b>+2MWp</b>Potência instalada</div>
            <div><b>+95%</b>Clientes satisfeitos</div>
            <div><b>+5 anos</b>De experiência</div>
          </div>
          <div className="card cta-box" style={{ marginTop: 14 }}>
            <div>
              <b>Atendemos todo o estado de Goiás</b>
              <p style={{ color: "#8ea0b5", margin: 0 }}>Equipe especializada pronta para te atender</p>
            </div>
            <a className="btn-g" href={WA} target="_blank" rel="noreferrer">Falar no WhatsApp</a>
          </div>
        </div>
      )}

      {page === "go" && (
        <div className="page">
          <div className="hero-head">
            <h1>Goiás tem sol o ano inteiro</h1>
            <p>Irradiação de 5,3 a 5,7 kWh/m²/dia — uma das melhores do Brasil.</p>
          </div>
          <div className="card">
            <p>O simulador usa médias do Atlas Solar e do INMET.</p>
            <button className="gold" style={{ maxWidth: 260 }} onClick={() => setPage("sim")}>Simular agora</button>
          </div>
        </div>
      )}
    </>
  );
}
