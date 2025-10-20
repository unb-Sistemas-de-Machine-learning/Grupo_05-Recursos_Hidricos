import jsPDF from "jspdf";

export function exportSessionPDF(session, angleCanvas, velCanvas) {
  if (!session?.start) { alert("Inicie a sessão antes de exportar."); return; }
  if (!session?.end) {
    const ok = confirm("Sessão ainda em andamento. Encerrar agora e exportar?");
    if (!ok) return; session.end = Date.now();
  }

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40; let y = margin;

  const fmtDate = (ts) => new Date(ts).toLocaleString();
  const durMs = session.end - session.start;
  const durFmt = `${Math.floor(durMs/60000)} min ${Math.round((durMs%60000)/1000)} s`;

  doc.setFont("helvetica","bold"); doc.setFontSize(16);
  doc.text("Relatório da Sessão — Órtese Motorizada de Joelho (UnB/FCTE)", margin, y); y += 26;

  doc.setFontSize(10); doc.setTextColor(110);
  doc.text(`ID da sessão: ${session.id}`, margin, y); y += 16; doc.setTextColor(0);

  doc.setFont("helvetica","normal"); doc.setFontSize(12);
  doc.text(`Início: ${fmtDate(session.start)}`, margin, y); y += 16;
  doc.text(`Fim: ${fmtDate(session.end)}`, margin, y); y += 16;
  doc.text(`Duração: ${durFmt}`, margin, y); y += 22;

  doc.setFont("helvetica","bold"); doc.text("Parâmetros do exercício:", margin, y); y += 16;
  doc.setFont("helvetica","normal");
  doc.text(`• Modo: ${session.params?.mode ?? "-"}`, margin+16, y); y += 14;
  doc.text(`• Ângulo alvo: ${session.params?.angle ?? "-"}°`, margin+16, y); y += 14;
  doc.text(`• Repetições planejadas: ${session.params?.reps ?? "-"}`, margin+16, y); y += 22;

  const arr = k => session.samples.map(s=>+s[k]||0);
  const mini=a=>a.length?Math.min(...a):0, maxi=a=>a.length?Math.max(...a):0, mean=a=>a.length?(a.reduce((x,y)=>x+y,0)/a.length):0;
  const angles=arr("angle"), vels=arr("vel"), curs=arr("cur"), temps=arr("temp");

  doc.setFont("helvetica","bold"); doc.text("Resumo das medições:", margin, y); y += 16;
  doc.setFont("helvetica","normal");
  doc.text(`Ângulo (°):   min ${mini(angles)} | máx ${maxi(angles)} | média ${mean(angles).toFixed(1)}`, margin+16, y); y += 14;
  doc.text(`Velocidade (°/s):   min ${mini(vels)} | máx ${maxi(vels)} | média ${mean(vels).toFixed(1)}`, margin+16, y); y += 14;
  doc.text(`Corrente (A):   min ${mini(curs)} | máx ${maxi(curs)} | média ${mean(curs).toFixed(1)}`, margin+16, y); y += 14;
  doc.text(`Temperatura (°C):   min ${mini(temps)} | máx ${maxi(temps)} | média ${mean(temps).toFixed(1)}`, margin+16, y); y += 22;

  const addCanvas = (c,label)=>{
    if(!c) return;
    const img = c.toDataURL("image/png", 0.92);
    const pageW = doc.internal.pageSize.getWidth();
    const maxW = pageW - margin*2;
    const ratio = c.clientHeight / c.clientWidth || 0.45;
    const w = maxW, h = w * ratio;
    if (y + h + 60 > doc.internal.pageSize.getHeight()) { doc.addPage(); y = margin; }
    doc.setFont("helvetica","bold"); doc.text(label, margin, y); y += 12;
    doc.addImage(img, "PNG", margin, y, w, h, undefined, "FAST"); y += h + 18;
  };
  addCanvas(angleCanvas, "Ângulo (°) vs Tempo");
  addCanvas(velCanvas,   "Velocidade (°/s) vs Tempo");

  if (session.events?.length) {
    if (y + 60 > doc.internal.pageSize.getHeight()) { doc.addPage(); y = margin; }
    doc.setFont("helvetica","bold"); doc.text("Eventos registrados:", margin, y); y += 16;
    doc.setFont("helvetica","normal");
    session.events.forEach(ev=>{ doc.text(`• ${new Date(ev.ts).toLocaleTimeString()} — ${ev.msg}`, margin+16, y); y+=14; });
  }

  doc.setFontSize(9); doc.setTextColor(120);
  doc.text("Gerado automaticamente pelo protótipo — UnB/FCTE", margin, doc.internal.pageSize.getHeight()-20);

  const iso = new Date(session.start).toISOString().slice(0,19).replace(/[:T]/g,'-');
  doc.save(`relatorio_sessao_${iso}.pdf`);
}
