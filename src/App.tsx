import { useMemo, useState } from "react";
const WA = "https://wa.me/5562991758807";
const IMG = {
  house: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
  aerial: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1400&q=80",
  comercial: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  industrial: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80",
  rural: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
  team: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
  tech: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=600&q=80",
  dusk: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
};
const TIPO = ["Residencial", "Comercial", "Industrial", "Rural"];
const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
type Page = "home" | "sim" | "sol" | "quem" | "contato" | "res";
export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [step, setStep] = useState(1);
  const [endereco, setEndereco] = useState("");
  const [tipo, setTipo] = useState("Residencial");
  const [conta, setConta] = useState(0);
  const [kwh, setKwh] = useState(450);
  const r = useMemo(() => {
    const consumo = kwh > 0 ? kwh : Math.max(180, Math.round((conta || 350) / 0.82));
    const irr = 5.2; const pr = 0.78;
    const kwp = Math.max(1.2, consumo / (irr * 30.4 * pr));
    const ger = Math.round(kwp * irr * 30.4 * pr);
    const eco = Math.round(ger * 0.82 * 100) / 100;
    const mods = Math.max(4, Math.ceil((kwp * 1000) / 630));
    const area = Math.round(mods * 3.4);
    const inv = Math.max(3, Math.round(kwp));
    const pay = eco > 0 ? (kwp * 4800) / (eco * 12) : 0;
    return { consumo, kwp, ger, eco, ano: eco * 12, mods, area, inv, pay };
  }, [conta, kwh]);
  const msg = encodeURIComponent(`Olá YWS! Quero falar com um especialista.\n${endereco || "Goiás"} · ${tipo}\nConta ${brl(conta || 0)} · ${r.consumo} kWh\nSistema ${r.kwp.toFixed(2)} kWp · ${r.mods} módulos 630W\nEconomia ${brl(r.ano)}/ano`);
  const pdf = () => {
    const w = window.open("", "_blank"); if (!w) return;
    w.document.write(`<html><body style="font-family:Arial;padding:32px"><h1>Proposta YWS Solar</h1><p>${tipo} · ${endereco || "Goiás"}</p><h2>${brl(r.ano)} / ano</h2><p>${r.kwp.toFixed(2)} kWp · ${r.mods} x 630W</p><p>Payback ${r.pay.toFixed(1)} anos</p><p>(62) 99175-8807</p></body></html>`);
    w.document.close(); w.print();
  };
  return (
    <>
      <nav className="nav">
        <a className="brand" href="#" onClick={() => setPage("home")}><span className="logo">☀</span> YWS Solar</a>
        <div className="menu">
          {([["home","Início"],["sim","Simulador"],["sol","Soluções"],["quem","Quem somos"],["contato","Contato"]] as const).map(([id, t]) => (
            <a key={id} className={page === id || (page === "res" && id === "sim") ? "on" : ""} href="#" onClick={() => { setPage(id); if (id === "sim") setStep(1); }}>{t}</a>
          ))}
        </div>
        <a className="cta" href={`${WA}?text=${msg}`} target="_blank" rel="noreferrer">Falar com especialista</a>
      </nav>
      {page === "home" && (
        <>
          <section className="hero"><div className="hero-in">
            <h1>Energia solar inteligente para um <span>futuro sustentável</span></h1>
            <p>Reduza sua conta de energia em até 95% com soluções completas em energia solar fotovoltaica.</p>
            <div className="hero-actions">
              <button className="cta" onClick={() => setPage("sim")}>Simular meu projeto</button>
              <a className="cta ghost" href={WA} target="_blank" rel="noreferrer">Falar com especialista</a>
            </div>
            <div className="pills">
              <div>⚡ Economia garantida<br />Reduza até 95% na conta</div>
              <div>Sustentabilidade<br />Energia limpa e renovável</div>
              <div>Valorização do imóvel<br />Aumente o valor de mercado</div>
              <div>Instalação completa<br />Cuidamos de todo o processo</div>
            </div>
          </div></section>
          <section className="sec"><div className="wrap">
            <h2>Soluções completas em energia solar</h2>
            <p className="sub">Projetos personalizados para residências, comércios, indústrias e propriedades rurais.</p>
            <div className="cards4">
              {([[IMG.house,"Residencial","Soluções ideais para sua casa."],[IMG.comercial,"Comercial","Reduza custos e aumente a competitividade."],[IMG.industrial,"Industrial","Grandes sistemas para máxima eficiência."],[IMG.rural,"Rural","Energia confiável no campo."]] as const).map(([img,t,d]) => (
                <article className="mini" key={t}><img src={img} alt={t} /><h3>{t}</h3><p style={{color:"#5b6b7c",fontSize:14}}>{d}</p></article>
              ))}
            </div>
            <div className="center"><button className="outline" onClick={() => setPage("sol")}>Ver todas as soluções</button></div>
          </div></section>
          <section className="why">
            <div className="wrap why-grid">
              <img src={IMG.dusk} alt="Casa com energia solar" />
              <div>
                <h2 style={{textAlign:"left"}}>Por que escolher a YWS Solar?</h2>
                <ul>
                  <li>Equipe especializada e certificada</li>
                  <li>Equipamentos de alta qualidade</li>
                  <li>Garantia estendida em todos os sistemas</li>
                  <li>Suporte completo do projeto à instalação</li>
                  <li>Financiamento facilitado</li>
                </ul>
              </div>
            </div>
            <div className="wrap stats">
              <div><b>+500</b>Projetos realizados</div>
              <div><b>+2MWp</b>Potência instalada</div>
              <div><b>+95%</b>Clientes satisfeitos</div>
              <div><b>+5 anos</b>Garantia média</div>
            </div>
          </section>
        </>
      )}
      {page === "sim" && (
        <>
          <section className="sim-hero">
            <h1>Simulador de Energia Solar</h1>
            <p>Descubra quanto você pode economizar com energia solar.</p>
            <div className="steps">{["Localização","Consumo","Sistema","Resultado"].map((t,i)=>(<div className={`st ${step===i+1?"on":""}`} key={t}><b>{i+1}</b>{t}</div>))}</div>
          </section>
          <section className="sec" style={{paddingTop:28}}>
            <div className="wrap sim-box">
              <div className="form">
                {step===1 && (<><h2 style={{textAlign:"left",fontSize:22}}>1. Onde será instalado?</h2>
                  <p style={{color:"#5b6b7c"}}>Informe o endereço do local para análise solar precisa.</p>
                  <label>CEP ou endereço</label>
                  <input placeholder="Ex: 01310-100 ou Av. Paulista, 1000" value={endereco} onChange={(e)=>setEndereco(e.target.value)} />
                  <label>Tipo de imóvel</label>
                  <select value={tipo} onChange={(e)=>setTipo(e.target.value)}>{TIPO.map(t=><option key={t}>{t}</option>)}</select>
                  <label>Sua conta de energia</label>
                  <input type="number" value={conta} onChange={(e)=>setConta(Number(e.target.value))} />
                  <button className="cta" style={{width:"100%",marginTop:18,background:"#1d4ed8",color:"#fff"}} onClick={()=>setStep(2)}>Próximo passo →</button></>)}
                {step===2 && (<><h2 style={{textAlign:"left",fontSize:22}}>2. Consumo</h2>
                  <label>Consumo médio mensal (kWh)</label>
                  <input type="number" value={kwh} onChange={(e)=>setKwh(Number(e.target.value))} />
                  <button className="cta" style={{width:"100%",marginTop:18,background:"#1d4ed8",color:"#fff"}} onClick={()=>setStep(3)}>Próximo passo →</button></>)}
                {step===3 && (<><h2 style={{textAlign:"left",fontSize:22}}>3. Sistema</h2>
                  <p>{r.kwp.toFixed(2)} kWp · {r.mods} módulos de 630W · inversor {r.inv} kW</p>
                  <button className="cta" style={{width:"100%",marginTop:18,background:"#1d4ed8",color:"#fff"}} onClick={()=>setPage("res")}>Ver resultado →</button></>)}
              </div>
              <div className="photo-wrap">
                <img src={IMG.aerial} alt="Telhado com painéis" />
                <div className="float"><b>Análise Solar</b><ul><li>Irradiação média 5,2 kWh/m²/dia</li><li>Horas de sol pico 4,8 h/dia</li><li>Potencial Excelente</li></ul></div>
              </div>
            </div>
            <div className="wrap" style={{marginTop:48}}>
              <h2>Como funciona o simulador?</h2>
              <div className="how">{[["1. Informações","Você informa consumo e localização"],["2. Análise Solar","Avaliamos o potencial do local"],["3. Dimensionamento","Calculamos o sistema ideal"],["4. Resultado","Você recebe a projeção de economia"]].map(([t,d])=>(<div key={t}><div className="ico">✦</div><b>{t}</b><p>{d}</p></div>))}</div>
            </div>
            <div className="wrap" style={{marginTop:36}}>
              <div className="band">
                <div><h3>Ainda tem dúvidas?</h3><p>Fale com nossos especialistas e receba uma consultoria personalizada.</p><a className="cta" href={WA} target="_blank" rel="noreferrer">Falar com especialista</a></div>
                <img src={IMG.team} alt="Especialistas YWS" />
              </div>
            </div>
          </section>
        </>
      )}
      {page === "res" && (
        <section className="sec"><div className="wrap">
          <h2>Resultado da Simulação</h2>
          <p className="sub">Confira os resultados personalizados para o seu projeto.</p>
          <div className="split" style={{marginBottom:14}}>
            <div className="white"><div>Sua economia projetada</div>
              <div className="money">{brl(r.ano)} <small style={{fontSize:16}}>/ano</small></div>
              <p>Economia de 95% na sua conta de energia</p>
              <span style={{background:"#dcfce7",color:"#166534",padding:"4px 8px",borderRadius:999,fontSize:13}}>Retorno do investimento em {r.pay.toFixed(1)} anos</span>
            </div>
            <img src={IMG.house} alt="Sistema instalado" style={{width:"100%",height:220,objectFit:"cover",borderRadius:16}} />
          </div>
          <div className="kpis">
            <div><b>{r.kwp.toFixed(2)} kWp</b><span>Potência do sistema</span></div>
            <div><b>{r.ger.toLocaleString("pt-BR")} kWh</b><span>Energia gerada / mês</span></div>
            <div><b>{brl(r.eco)}</b><span>Economia mensal</span></div>
            <div><b>+25 anos</b><span>Produção garantida</span></div>
          </div>
          <div className="split" style={{marginTop:14}}>
            <div className="white"><h3>Detalhes do sistema</h3>
              <div className="row"><span>Painéis solares</span><b>{r.mods} módulos de 630W</b></div>
              <div className="row"><span>Inversor</span><b>1 inversor de {r.inv} kW</b></div>
              <div className="row"><span>Área necessária</span><b>{r.area} m²</b></div>
              <div className="row"><span>Produção anual</span><b>{(r.ger*12).toLocaleString("pt-BR")} kWh</b></div>
              <div className="row"><span>Garantia dos equipamentos</span><b>12 anos</b></div>
              <div className="row"><span>Garantia de produção</span><b>25 anos</b></div>
            </div>
            <div className="white"><h3>Projeção de retorno</h3>
              <svg viewBox="0 0 320 180" width="100%" height="180">
                <line x1="30" y1="150" x2="300" y2="150" stroke="#d5deea" />
                <polyline fill="none" stroke="#94a3b8" strokeWidth="2" points="30,92 90,90 150,88 210,86 270,84" />
                <polyline fill="none" stroke="#22c55e" strokeWidth="3" points="30,92 90,78 150,58 210,38 270,20" />
                <rect x="148" y="46" width="92" height="26" rx="8" fill="#f5b400" />
                <text x="194" y="63" textAnchor="middle" fontSize="10" fontWeight="700">Ponto de retorno {r.pay.toFixed(1)} anos</text>
              </svg>
            </div>
          </div>
          <div className="next" style={{marginTop:14}}>
            <div className="white"><h3>Próximos passos</h3>
              <p>✔ Orçamento detalhado gratuito</p><p>✔ Visita técnica sem compromisso</p>
              <p>✔ Projeto personalizado</p><p>✔ Financiamento facilitado</p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <a className="cta" href={`${WA}?text=${msg}`} target="_blank" rel="noreferrer">Falar com especialista</a>
                <button className="outline" onClick={pdf}>Baixar proposta em PDF</button>
              </div>
            </div>
            <div className="dark"><div><h3>Pronto para começar a economizar?</h3><p>Nossa equipe está pronta para tornar seu projeto realidade.</p></div><img src={IMG.tech} alt="Especialista YWS" /></div>
          </div>
          <p className="sub" style={{marginTop:28}}>Trabalhamos com Canadian Solar · Jinko · Growatt · WEG · LONGi</p>
        </div></section>
      )}
      {page === "sol" && (
        <section className="sec"><div className="wrap">
          <h2>Soluções</h2>
          <p className="sub">Residencial, comercial, industrial e rural em todo o estado de Goiás.</p>
          <div className="cards4">{([[IMG.house,"Residencial"],[IMG.comercial,"Comercial"],[IMG.industrial,"Industrial"],[IMG.rural,"Rural"]] as const).map(([img,t])=>(<article className="mini" key={t}><img src={img} alt={t} /><h3>{t}</h3><button className="outline" onClick={()=>{setTipo(t);setPage("sim");}}>Simular projeto</button></article>))}</div>
        </div></section>
      )}
      {(page==="quem"||page==="contato") && (
        <section className="sec"><div className="wrap" style={{maxWidth:720}}>
          <h2>{page==="quem"?"Quem somos":"Contato"}</h2>
          <p className="sub">YWS Soluções Elétricas — energia solar e elétrica em Goiás.</p>
          <p>WhatsApp (62) 99175-8807</p>
          <a className="cta" href={WA} target="_blank" rel="noreferrer">Falar com especialista</a>
        </div></section>
      )}
      <footer>
        <div className="wrap ft">
          <div><h4>YWS Solar</h4><p>Soluções completas em energia solar fotovoltaica em Goiás.</p></div>
          <div><h4>Navegação</h4><p>Início<br />Simulador<br />Soluções</p></div>
          <div><h4>Soluções</h4><p>Residencial<br />Comercial<br />Industrial<br />Rural</p></div>
          <div><h4>Contato</h4><p>(62) 99175-8807<br />Goiás · Brasil</p></div>
        </div>
        <div className="foot">© 2026 YWS Solar. Todos os direitos reservados.</div>
      </footer>
    </>
  );
}
