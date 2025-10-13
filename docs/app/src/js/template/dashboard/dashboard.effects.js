import { exportSessionPDF } from '/src/js/dashboard/session-report.js';

export function initDashboard(root = document) {
  const $ = (sel) => root.querySelector(sel);

  const el = {
    angle: $('#m-angle'), vel: $('#m-vel'), cur: $('#m-cur'), temp: $('#m-temp'),
    bAngle: $('#b-angle'), bVel: $('#b-vel'), bCur: $('#b-cur'), bTemp: $('#b-temp'),
    chartAngle: $('#chart-angle'), chartVel: $('#chart-vel'),
    statSessions: $('#stat-sessions'), statTime: $('#stat-time'), statLog: $('#stat-log'),
    btnStart: $('#btn-start'), btnStop: $('#btn-stop'), btnEmg: $('#btn-emg'),
    pZero: $('#p-zero'), pAngle: $('#p-angle'), pReps: $('#p-reps'),
  };

  // ===== Charts (canvas puro) =====
  function makeChart(canvas, color) {
    const ctx = canvas.getContext('2d');
    canvas.width  = canvas.clientWidth  * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    const data=[]; const push=v=>{data.push(v); if(data.length>60) data.shift();};
    const draw=()=>{
      const cw=canvas.clientWidth, ch=canvas.clientHeight;
      ctx.clearRect(0,0,cw,ch);
      ctx.globalAlpha=0.2; ctx.strokeStyle='#64748b';
      ctx.beginPath(); ctx.moveTo(0,ch-0.5); ctx.lineTo(cw,ch-0.5); ctx.stroke(); ctx.globalAlpha=1;
      if(data.length<2) return;
      const max=Math.max(...data,1), min=Math.min(...data,0), range=Math.max(max-min,1);
      ctx.strokeStyle=color; ctx.lineWidth=2; ctx.beginPath();
      data.forEach((v,i)=>{ const x=(i/59)*(cw-2)+1; const y=ch-((v-min)/range)*(ch-6)-3; i?ctx.lineTo(x,y):ctx.moveTo(x,y); });
      ctx.stroke();
    };
    return { push, draw, canvas };
  }
  const brand=(getComputedStyle(document.documentElement).getPropertyValue('--brand')||'#094559').trim();
  const chartA=makeChart(el.chartAngle,brand);
  const chartV=makeChart(el.chartVel,'#3b82f6');

  // ===== Sessão / estados =====
  const newId = ()=>'sess_'+Math.random().toString(36).slice(2,10);
  let session={ id:null, start:null, end:null, params:{}, samples:[], events:[] };
  let running=false, paused=false, sessionsCount=0, seconds=0;
  const resetTimer=()=>{ seconds=0; el.statTime.textContent='0min 0s'; };
  const beginSession=()=>{
    session={
      id:newId(), start:Date.now(), end:null,
      params:{ angle: el.pAngle?.value ?? null, reps: el.pReps?.value ?? null,
               mode: root.querySelector('input[name="modo"]:checked')?.value ?? 'desconhecido' },
      samples:[], events:[{ ts:Date.now(), msg:`Início • alvo=${el.pAngle.value}° • reps=${el.pReps.value}` }]
    };
    resetTimer();
  };
  const endSession=(reason='Finalizada')=>{
    if(!session.start || session.end) return;
    session.end=Date.now();
    session.events.push({ ts:Date.now(), msg:reason });
    exportSessionPDF(session, chartA.canvas, chartV.canvas);
  };

  function setUI(){
    // mensagem
    if(!session.start) el.statLog.textContent='Pronto para iniciar.';
    else if(running && !paused) el.statLog.textContent=`Exercício em execução • alvo=${el.pAngle.value}° • reps=${el.pReps.value}`;
    else if(running && paused)  el.statLog.textContent='Pausado';
    else if(session.end)        el.statLog.textContent='Sessão finalizada.';
    else                        el.statLog.textContent='Sessão pronta.';

    // botão principal (Iniciar/Pausar/Retomar)
    if(!session.start || session.end){
      el.btnStart.textContent='Iniciar';
      el.btnStart.classList.remove('bg-amber-500'); el.btnStart.classList.add('bg-emerald-600');
      el.btnStop.disabled = true;
      el.btnEmg.disabled  = true;
    } else if(running && !paused){
      el.btnStart.textContent='Pausar';
      el.btnStart.classList.remove('bg-emerald-600'); el.btnStart.classList.add('bg-amber-500');
      el.btnStop.disabled = false;
      el.btnEmg.disabled  = false;
    } else if(running && paused){
      el.btnStart.textContent='Retomar';
      el.btnStart.classList.remove('bg-amber-500'); el.btnStart.classList.add('bg-emerald-600');
      el.btnStop.disabled = false;
      el.btnEmg.disabled  = false;
    }
  }

  // ===== Telemetria MOCADA =====
  let t=0;
  function tick(){
    t+=0.1;
    const angle=Math.round(45+35*Math.sin(t));
    const vel  =Math.round(15+12*Math.cos(0.8*t));
    const cur  =+(2+1.5*Math.abs(Math.sin(0.7*t))).toFixed(1);
    const temp =Math.round(35+8*Math.abs(Math.sin(0.3*t)));

    el.angle.textContent=`${angle}°`;
    el.vel.textContent  =`${vel} °/s`;
    el.cur.textContent  =`${cur} A`;
    el.temp.textContent =`${temp} °C`;

    el.bAngle.style.width=`${Math.min(Math.abs(angle)/90*100,100)}%`;
    el.bVel.style.width  =`${Math.min(vel/40*100,100)}%`;
    el.bCur.style.width  =`${Math.min(cur/5*100,100)}%`;
    el.bTemp.style.width =`${Math.min((temp-20)/60*100,100)}%`;

    chartA.push(angle); chartA.draw();
    chartV.push(vel);   chartV.draw();

    if(running && !paused && session.start && !session.end){
      session.samples.push({ ts:Date.now(), angle, vel, cur, temp });
      seconds++; el.statTime.textContent=`${Math.floor(seconds/60)}min ${seconds%60}s`;
    }
  }
  const loop=setInterval(tick,120);

  // ===== Controles =====
  el.btnStart.addEventListener('click', ()=>{
    // Iniciar / Pausar / Retomar
    if(!session.start || session.end){
      beginSession();
      sessionsCount++; el.statSessions.textContent=sessionsCount;
      running=true; paused=false;
    } else if(running && !paused){
      paused=true; session.events.push({ ts:Date.now(), msg:'Pausado' });
    } else if(running && paused){
      paused=false; session.events.push({ ts:Date.now(), msg:'Retomado' });
    }
    setUI();
  });

  el.btnStop.addEventListener('click', ()=>{
    if(!session.start || session.end) return;
    running=false; paused=false;
    endSession('Parada pelo usuário');
    setUI();
  });

  el.btnEmg.addEventListener('click', ()=>{
    if(!session.start || session.end) return;
    running=false; paused=false;
    endSession('PARADA DE EMERGÊNCIA');
    setUI();
  });

  el.pZero?.addEventListener('click', ()=>{
    if(session.start && !session.end) session.events.push({ ts:Date.now(), msg:'Zerar posição' });
    el.statLog.textContent='Posição zero calibrada';
  });

  setUI();
  return ()=>clearInterval(loop);
}
