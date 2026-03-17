import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════ THEME ══════════════ */
const T = {
  bg:"#F5F5F2", bg1:"#EDEDEA", bg2:"#E4E4E0", bg3:"#D8D8D4",
  border:"#D0CFC8", borderHi:"#B8B7AE",
  primary:"#7C7D52", primaryDim:"#5E5F3E", primaryGlow:"rgba(124,125,82,0.15)",
  gray:"#888880", grayHi:"#555550",
  text:"#111111", textDim:"#2A2A28", white:"#111111",
  secondary:"#666660",
};

/* ══════════════ DATA ══════════════ */
const NAV_ITEMS = ["Home","About","Skills","Experience","Projects","Achievements","Contact"];

const SKILLS = [
  { cat:"Frontend Frameworks", items:["React.js","Next.js","Vite","Flutter","Bootstrap","Tailwind CSS"], icon:"◈", color:"#7C7D52", pct:90 },
  { cat:"Languages",           items:["JavaScript","Python","HTML5","CSS"],               icon:"◆", color:"#444440",  pct:85 },
  { cat:"Backend & APIs",      items:["Node.js","REST APIs","WebSockets","Socket.io"],      icon:"⬡", color:"#7C7D52", pct:75 },
  { cat:"Databases",           items:["MongoDB","MySQL","SQL","Firebase"],                               icon:"▣", color:"#888880",  pct:70 },
  { cat:"DevOps & Tools",      items:["Git","GitHub","VS Code","Postman"],                 icon:"⚙", color:"#7C7D52", pct:80 },
  { cat:"Telematics & Maps",   items:["Google Maps API","OpenStreetMap","GPS Integration","Fleet Telematics","Real-time Tracking"], icon:"◉", color:"#444440", pct:85 },
];

const EXPERIENCES = [
  { company:"Outdid Unified Private Limited", role:"Software Developer Intern", period:"Aug 2025 – Present", type:"Full-time Internship", location:"Remote / On-site", color:"#7C7D52",
    summary:"Leading development of enterprise-grade IoT dashboards and mobile applications for fleet management, EV monitoring, and inventory control.",
    projects:[
      { name:"Vehicle Tracking System (VTS)", tech:["React","Vite","Socket.io","Google Maps API","REST"], color:"#7C7D52",
        bullets:["Engineered a web-based fleet management dashboard with real-time GPS vehicle monitoring across 100+ vehicles","Built route history playback, trip analytics, driver performance insights, and geofence-based alert system","Implemented multi-tier RBAC: Super Admin, Operator Admin — managing users, devices, vehicles & permissions","Integrated live telematics data via Socket.io achieving sub-200ms latency for vehicle position updates","Optimized React rendering performance using memoization and virtualization for large fleet datasets"] },
      { name:"Parent School Bus Tracker", tech:["Flutter","Dart","WebSocket","REST API"], color:"#444440",
        bullets:["Developed cross-platform Flutter app for parents to monitor school bus routes in real time","Implemented live ETA prediction engine, stop-by-stop alerts, and pickup/drop confirmation notifications","Integrated secure JWT authentication with role-based dashboards for parents and school administrators","Delivered reliable real-time positional updates across Android devices using WebSocket streams"] },
      { name:"Inventory Management System", tech:["Flutter","Dart","REST","WebSocket"], color:"#888880",
        bullets:["Built end-to-end mobile inventory application with product tracking and automated stock management","Implemented stock in/out workflows, dashboard KPI monitoring, and intelligent low-stock alert thresholds","Integrated real-time data synchronization via WebSocket with in-app chat for warehouse team communication","Applied secure authentication and fine-grained role-based access control ensuring data security"] },
      { name:"Battery Management System (BMS)", tech:["Next.js","WebSocket","Chart.js","REST"], color:"#7C7D52",
        bullets:["Developed Next.js EV battery dashboard visualizing SOC, SOH, voltage, temperature, and status events","Integrated WebSocket streams for real-time battery alerts, fault indication, and diagnostic insights","Collaborated with firmware and backend teams ensuring accurate telemetry data mapping","Designed responsive chart components for time-series battery performance analysis"] },
      { name:"ionHive EV Admin Portal", tech:["React","REST API","CSS Modules"], color:"#444440",
        bullets:["Revamped entire admin UI — updated module views, table components, and configuration screens","Improved operator efficiency by 40% through redesigned UX workflows and cleaner navigation","Resolved critical UI inconsistencies and enhanced component responsiveness across all device breakpoints"] },
    ]},
  { company:"Accent Techno Soft", role:"Full Stack Developer", period:"May 2024 – Jun 2024", type:"Internship", location:"On-site", color:"#444440",
    summary:"Built a full-stack crime record management system automating police department workflows with secure access controls.",
    projects:[
      { name:"Online Crime Record Management System", tech:["HTML","CSS","JavaScript","MySQL","PHP"], color:"#444440",
        bullets:["Designed and developed a full-stack system to digitize and automate police record management operations","Built complete CRUD operations for FIR registration, case tracking, officer assignment, and status updates","Implemented role-based authentication — Admin, Officer, and Viewer access levels with audit logging","Optimized MySQL queries and schema design for efficient record retrieval across large datasets"] },
    ]},
  { company:"CodSoft", role:"Python Programmer", period:"Feb 2024 – Mar 2024", type:"Internship", location:"Remote", color:"#888880",
    summary:"Developed interactive Python GUI applications focused on clean architecture, usability, and modular code design.",
    projects:[
      { name:"Python Application Suite", tech:["Python","Tkinter","SQLite"], color:"#888880",
        bullets:["Built To-Do List application with task categories, priority levels, deadlines, and persistent storage","Developed Contact Manager with search, edit, import/export CSV, and local database (SQLite) integration","Applied MVC architecture pattern for clean separation of UI, logic, and data layers","Gained expertise in Python GUI development, event-driven programming, and application state management"] },
    ]},
];

const PROJECTS = [
  { name:"Vehicle Tracking System",   desc:"Enterprise-grade fleet management dashboard with real-time GPS monitoring, geofencing, route analytics, and telematics for 100+ vehicles.", tech:["React","Vite","Socket.io","Google Maps","REST API"], status:"Production", type:"Web App",     highlight:true,  num:"01" },
  { name:"Battery Management System", desc:"EV battery monitoring dashboard visualizing SOC, SOH, voltage, temperature, and fault diagnostics with live WebSocket data feeds.",          tech:["Next.js","WebSocket","Chart.js","REST API"],          status:"Production", type:"Dashboard",  highlight:false, num:"02" },
  { name:"Inventory Management App",  desc:"Cross-platform Flutter app for product tracking, stock management, real-time data sync, and team chat built for warehouse operations.",    tech:["Flutter","Dart","WebSocket","REST API"],              status:"Production", type:"Mobile App", highlight:false, num:"03" },
  { name:"Crime Record Management",   desc:"Full-stack web system automating police record operations with FIR management, case tracking, and secure role-based access control.",      tech:["HTML","CSS","JavaScript","MySQL"],                     status:"Completed", type:"Web App",    highlight:false, num:"04" },
  { name:"Microblogging Platform",    desc:"Social platform for creating and engaging with posts — like, comment, follow — built with a clean, responsive React interface.",            tech:["React.js","CSS","LocalStorage"],                      status:"Completed", type:"Web App",    highlight:false, num:"05" },
  { name:"Python GUI Suite",          desc:"Collection of desktop productivity tools including To-Do Manager and Contact Book using Tkinter and SQLite with MVC architecture.",        tech:["Python","Tkinter","SQLite"],                          status:"Completed", type:"Desktop App",highlight:false, num:"06" },
];

const ACHIEVEMENTS = [
  { icon:"🥇", title:"Gold Badge — Python",  org:"HackerRank",            year:"2024",      desc:"Achieved Gold-level certification by solving complex algorithmic problems in Python, demonstrating proficiency in data structures and algorithms.",    color:"#7C7D52" },
  { icon:"🏆", title:"SIH Ideathon 2024",    org:"Smart India Hackathon", year:"2024",      desc:"Proposed innovative ed-tech solutions for nomadic communities at the national-level Smart India Hackathon, advancing to the final evaluation round.", color:"#444440" },
  { icon:"⚡", title:"SIH Thiruvizha 2024",  org:"36-Hour Hackathon",     year:"2024",      desc:"Successfully developed and deployed a complete e-learning web application within a 36-hour intensive hackathon sprint as part of a cross-functional team.", color:"#888880" },
  { icon:"🎓", title:"B.Tech — 7.75 CGPA",   org:"KGiSL Inst. of Tech.",  year:"2021–2025", desc:"Graduated with distinction in Information Technology, maintaining a 7.75 CGPA across 4 years while simultaneously building real-world projects.",      color:"#7C7D52" },
];

const WHAT_I_DO = [
  { icon:"🖥️", title:"Frontend Development",   desc:"Building high-performance web interfaces using React, Next.js, and Vite with real-time data visualizations and responsive design systems." },
  { icon:"📱", title:"Mobile Development",      desc:"Crafting cross-platform mobile apps with Flutter for Android that deliver native-like performance with seamless real-time integrations." },
  { icon:"🔌", title:"API & Real-time Systems", desc:"Integrating REST APIs, WebSockets, and Socket.io to build live-updating dashboards and telematics systems with sub-200ms latency." },
  { icon:"🗺️", title:"Geospatial Applications", desc:"Developing GPS-powered fleet tracking and location-based services using Google Maps API, OpenStreetMap, and telematics data pipelines." },
];

/* ══════════════ HOOKS ══════════════ */
function useInView(ref, threshold=0.12) {
  const [vis,setVis]=useState(false);
  useEffect(()=>{
    const io=new IntersectionObserver(([e])=>{if(e.isIntersecting)setVis(true);},{threshold});
    if(ref.current)io.observe(ref.current);
    return ()=>io.disconnect();
  },[]);
  return vis;
}
function useMediaQuery(q){
  const [m,setM]=useState(false);
  useEffect(()=>{const mql=window.matchMedia(q);setM(mql.matches);const h=e=>setM(e.matches);mql.addEventListener("change",h);return()=>mql.removeEventListener("change",h);},[q]);
  return m;
}
function useTypewriter(words,speed=75){
  const [display,setDisplay]=useState("");const [wi,setWi]=useState(0);const [ci,setCi]=useState(0);const [del,setDel]=useState(false);
  useEffect(()=>{
    const w=words[wi];
    const t=setTimeout(()=>{
      if(!del&&ci<w.length){setDisplay(w.slice(0,ci+1));setCi(c=>c+1);}
      else if(!del)setTimeout(()=>setDel(true),2000);
      else if(del&&ci>0){setDisplay(w.slice(0,ci-1));setCi(c=>c-1);}
      else{setDel(false);setWi(i=>(i+1)%words.length);}
    },del?40:speed);
    return()=>clearTimeout(t);
  },[ci,del,wi]);
  return display;
}

/* ══════════════ PARTICLE CANVAS ══════════════ */
function ParticleBg(){
  const ref=useRef();
  useEffect(()=>{
    const c=ref.current,ctx=c.getContext("2d");
    let W=c.width=window.innerWidth,H=c.height=window.innerHeight;
    let mx=W/2,my=H/2,txMx=W/2,txMy=H/2,scrollOff=0;
    const resize=()=>{W=c.width=window.innerWidth;H=c.height=window.innerHeight;buildGrid();};
    const mm=e=>{txMx=e.clientX;txMy=e.clientY;};
    const ms=()=>{scrollOff=window.scrollY;};
    window.addEventListener("resize",resize);
    window.addEventListener("mousemove",mm);
    window.addEventListener("scroll",ms,{passive:true});
    const lerp=(a,b,n)=>a+(b-a)*n;
    const COLS=5,ROWS=4;
    const buildGrid=()=>{
      nodes.length=0;
      for(let r=0;r<ROWS;r++)for(let c2=0;c2<COLS;c2++){
        nodes.push({bx:(c2/(COLS-1))*W,by:(r/(ROWS-1))*H,ox:Math.random()*60-30,oy:Math.random()*60-30,phase:Math.random()*Math.PI*2,spd:0.003+Math.random()*.004,amp:30+Math.random()*35});
      }
    };
    const nodes=[];buildGrid();
    const orbs=[
      {bx:.18,by:.2,r:340,phase:0,spd:.0022,amp:.12,a:.07},
      {bx:.78,by:.72,r:300,phase:2.1,spd:.0018,amp:.10,a:.055},
      {bx:.5,by:.5,r:260,phase:1.0,spd:.0030,amp:.08,a:.04},
      {bx:.88,by:.18,r:200,phase:3.4,spd:.0025,amp:.09,a:.045},
      {bx:.12,by:.82,r:220,phase:4.8,spd:.0020,amp:.11,a:.04},
    ];
    const NDUST=80;
    const dust=Array.from({length:NDUST},()=>({x:Math.random()*1,y:Math.random()*1,vx:(Math.random()-.5)*.00018,vy:-(Math.random()*.00025+.00008),r:.6+Math.random()*1.1,o:.06+Math.random()*.12,tw:Math.random()*Math.PI*2,ts:.012+Math.random()*.018}));
    const BEAMS=4;
    const beams=Array.from({length:BEAMS},(_,i)=>({x:W*(0.1+i*.25),angle:-Math.PI*.35+i*.04,w:1+Math.random(),phase:i*1.6,spd:.0012+i*.0003,alpha:.022+Math.random()*.012}));
    let ripples=[];
    const onClick=e=>{const bx=e.clientX,by=e.clientY;[.45,.28,.14].forEach((o,i)=>ripples.push({x:bx,y:by,r:0,o,dec:.012-.003*i,del:i*14}));};
    window.addEventListener("click",onClick);
    let raf,t=0;
    const draw=()=>{
      t+=1;ctx.clearRect(0,0,W,H);
      mx=lerp(mx,txMx,.04);my=lerp(my,txMy,.04);
      nodes.forEach(n=>{n.phase+=n.spd;n.x=n.bx+n.ox+Math.sin(n.phase)*n.amp;n.y=n.by+n.oy+Math.cos(n.phase*.7)*n.amp*.8;});
      for(let r=0;r<ROWS-1;r++){for(let c2=0;c2<COLS-1;c2++){const tl=nodes[r*COLS+c2],tr=nodes[r*COLS+c2+1],bl=nodes[(r+1)*COLS+c2],br=nodes[(r+1)*COLS+c2+1];const cx2=(tl.x+tr.x+bl.x+br.x)/4,cy2=(tl.y+tr.y+bl.y+br.y)/4;const alpha=.018+.008*Math.sin(tl.phase);ctx.beginPath();ctx.moveTo(tl.x,tl.y-scrollOff*.04);ctx.quadraticCurveTo(cx2,cy2-scrollOff*.04,br.x,br.y-scrollOff*.04);ctx.quadraticCurveTo(cx2,cy2-scrollOff*.04,bl.x,bl.y-scrollOff*.04);ctx.closePath();ctx.strokeStyle=`rgba(124,125,82,${alpha})`;ctx.lineWidth=.5;ctx.stroke();if(r>0&&r<ROWS-2&&c2>0&&c2<COLS-2){ctx.fillStyle=`rgba(124,125,82,${alpha*.35})`;ctx.fill();}}}
      const DLINES=12;
      for(let i=0;i<DLINES;i++){const yBase=(i+1)/(DLINES+1)*H,yShift=Math.sin(t*.003+i*.55)*8,alpha=.025+.012*Math.sin(t*.002+i*.8);const g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,"rgba(124,125,82,0)");g.addColorStop(.15,`rgba(124,125,82,${alpha})`);g.addColorStop(.5,`rgba(124,125,82,${alpha*1.6})`);g.addColorStop(.85,`rgba(124,125,82,${alpha})`);g.addColorStop(1,"rgba(124,125,82,0)");ctx.beginPath();ctx.moveTo(0,yBase+yShift-scrollOff*.05);ctx.lineTo(W,yBase+yShift-scrollOff*.05);ctx.strokeStyle=g;ctx.lineWidth=.6;ctx.stroke();}
      beams.forEach(b=>{b.phase+=b.spd;const brightness=.5+.5*Math.sin(b.phase),alpha=b.alpha*brightness,len=H*2.2,bx=b.x+Math.sin(b.phase*.4)*60,ex=bx+Math.cos(b.angle)*len,ey=Math.sin(b.angle)*len;const g=ctx.createLinearGradient(bx,-50,ex,ey);g.addColorStop(0,`rgba(124,125,82,0)`);g.addColorStop(.1,`rgba(124,125,82,${alpha})`);g.addColorStop(.5,`rgba(124,125,82,${alpha*.7})`);g.addColorStop(.9,`rgba(124,125,82,${alpha*.3})`);g.addColorStop(1,"rgba(124,125,82,0)");const hw=b.w*18,nx=Math.sin(b.angle+Math.PI/2),ny=Math.cos(b.angle+Math.PI/2);ctx.beginPath();ctx.moveTo(bx-nx*hw,-50);ctx.lineTo(bx+nx*hw,-50);ctx.lineTo(ex+nx*hw,ey+H);ctx.lineTo(ex-nx*hw,ey+H);ctx.closePath();ctx.fillStyle=g;ctx.fill();});
      orbs.forEach(o=>{o.phase+=o.spd;const ox=o.bx*W+Math.sin(o.phase)*o.amp*W,oy=o.by*H+Math.cos(o.phase*.8)*o.amp*H,oy2=oy-scrollOff*.06,mousePull=.015,finalX=ox+(mx-W/2)*mousePull,finalY=oy2+(my-H/2)*mousePull;const g=ctx.createRadialGradient(finalX,finalY,0,finalX,finalY,o.r);g.addColorStop(0,`rgba(124,125,82,${o.a})`);g.addColorStop(.45,`rgba(124,125,82,${o.a*.5})`);g.addColorStop(1,"rgba(124,125,82,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(finalX,finalY,o.r,0,Math.PI*2);ctx.fill();});
      const mxd=mx,myd=my;const spot=ctx.createRadialGradient(mxd,myd,0,mxd,myd,280);spot.addColorStop(0,"rgba(124,125,82,0.085)");spot.addColorStop(.35,"rgba(124,125,82,0.03)");spot.addColorStop(.7,"rgba(124,125,82,0.008)");spot.addColorStop(1,"rgba(124,125,82,0)");ctx.fillStyle=spot;ctx.fillRect(0,0,W,H);const core=ctx.createRadialGradient(mxd,myd,0,mxd,myd,60);core.addColorStop(0,"rgba(124,125,82,0.06)");core.addColorStop(1,"rgba(124,125,82,0)");ctx.fillStyle=core;ctx.fillRect(0,0,W,H);
      dust.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=1;if(p.x>1)p.x=0;if(p.y<0){p.y=1;p.x=Math.random();}p.tw+=p.ts;const px=p.x*W,py=p.y*H-scrollOff*.03,tw=p.o*(0.4+0.6*Math.abs(Math.sin(p.tw)));ctx.beginPath();ctx.arc(px,py,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(124,125,82,${tw})`;ctx.fill();if(p.r>1.3){const g=ctx.createRadialGradient(px,py,0,px,py,p.r*5);g.addColorStop(0,`rgba(124,125,82,${tw*.25})`);g.addColorStop(1,"rgba(124,125,82,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(px,py,p.r*5,0,Math.PI*2);ctx.fill();}});
      ripples=ripples.filter(r=>r.o>0);ripples.forEach(r=>{if(r.del>0){r.del--;return;}r.r+=3;r.o-=r.dec;ctx.beginPath();ctx.arc(r.x,r.y,r.r,0,Math.PI*2);ctx.strokeStyle=`rgba(124,125,82,${r.o})`;ctx.lineWidth=.8;ctx.stroke();});
      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);window.removeEventListener("mousemove",mm);window.removeEventListener("scroll",ms);window.removeEventListener("click",onClick);};
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",opacity:1}}/>;
}

/* ══════════════ MAGNETIC CURSOR ══════════════ */
function Cursor(){
  const dp=useRef({x:-200,y:-200}),rp=useRef({x:-200,y:-200});
  const dEl=useRef(),rEl=useRef(),lEl=useRef(),trailRef=useRef([]);
  const trailEls=useRef([]);
  useEffect(()=>{
    let raf;
    const mm=e=>{dp.current={x:e.clientX,y:e.clientY};const hov=e.target.closest("[data-c]");if(dEl.current){dEl.current.style.opacity=hov?"0":"1";}if(rEl.current){rEl.current.style.width=hov?"52px":"28px";rEl.current.style.height=hov?"52px":"28px";rEl.current.style.borderColor=hov?T.primary:`${T.primary}88`;rEl.current.style.background=hov?`${T.primary}14`:"transparent";}if(lEl.current)lEl.current.textContent=hov?(hov.getAttribute("data-c")||""):"";trailRef.current.push({x:e.clientX,y:e.clientY,t:Date.now()});if(trailRef.current.length>8)trailRef.current.shift();};
    window.addEventListener("mousemove",mm);
    const anim=()=>{rp.current.x+=(dp.current.x-rp.current.x)*.12;rp.current.y+=(dp.current.y-rp.current.y)*.12;if(dEl.current)dEl.current.style.transform=`translate(${dp.current.x}px,${dp.current.y}px) translate(-50%,-50%)`;if(rEl.current)rEl.current.style.transform=`translate(${rp.current.x}px,${rp.current.y}px) translate(-50%,-50%)`;trailEls.current.forEach((el,i)=>{const pt=trailRef.current[trailRef.current.length-1-i];if(el&&pt){el.style.transform=`translate(${pt.x}px,${pt.y}px) translate(-50%,-50%)`;el.style.opacity=`${(0.06*(trailEls.current.length-i)/trailEls.current.length)}`;}});raf=requestAnimationFrame(anim);};
    raf=requestAnimationFrame(anim);
    return()=>{window.removeEventListener("mousemove",mm);cancelAnimationFrame(raf);};
  },[]);
  const base={position:"fixed",top:0,left:0,zIndex:99999,pointerEvents:"none",borderRadius:"50%"};
  return(<>
    {Array.from({length:6}).map((_,i)=>(<div key={i} ref={el=>trailEls.current[i]=el} style={{...base,width:6-i*.5,height:6-i*.5,background:T.primary,transition:"opacity .1s"}} />))}
    <div ref={dEl} style={{...base,width:6,height:6,background:T.primary,boxShadow:`0 0 10px ${T.primary}`,transition:"opacity .2s"}} />
    <div ref={rEl} style={{...base,width:28,height:28,border:`1.5px solid ${T.primary}88`,display:"flex",alignItems:"center",justifyContent:"center",transition:"width .3s,height .3s,background .25s,border-color .25s"}}>
      <span ref={lEl} style={{fontSize:7,color:T.primary,fontFamily:"'Outfit',sans-serif",letterSpacing:.8,textTransform:"uppercase",fontWeight:700}} />
    </div>
  </>);
}

/* ══════════════ REVEAL ══════════════ */
function Reveal({children,d=0,y=40,x=0,scale=true,style={}}){
  const ref=useRef();const vis=useInView(ref);
  return(
    <div ref={ref} style={{opacity:vis?1:0,transform:vis?`translateY(0) translateX(0) scale(1)`:`translateY(${y}px) translateX(${x}px) scale(${scale?0.96:1})`,transition:`opacity .9s cubic-bezier(.16,1,.3,1) ${d}s,transform .9s cubic-bezier(.16,1,.3,1) ${d}s`,...style}}>{children}</div>
  );
}

/* ══════════════ COUNTER ══════════════ */
function Counter({to,suffix="",label,color}){
  const [v,setV]=useState(0);const ref=useRef();const vis=useInView(ref);
  const col=color||T.primary;
  useEffect(()=>{if(!vis)return;let s=0;const step=to/60;const t=setInterval(()=>{s+=step;if(s>=to){setV(to);clearInterval(t);}else setV(Math.floor(s));},20);return()=>clearInterval(t);},[vis]);
  return(
    <div ref={ref} style={{textAlign:"center",position:"relative"}}>
      <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:52,fontWeight:800,lineHeight:1,letterSpacing:-2,color:col,textShadow:`0 0 40px ${col}66,0 0 80px ${col}22`}} className="counter-num">{v}{suffix}</div>
      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:T.gray,letterSpacing:4,textTransform:"uppercase",marginTop:10}}>{label}</div>
    </div>
  );
}

/* ══════════════ SECTION HEADER ══════════════ */
function SecHead({tag,title,sub}){
  const ref=useRef();const vis=useInView(ref);
  return(
    <div ref={ref} style={{marginBottom:72}}>
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16,opacity:vis?1:0,transform:vis?"translateX(0)":"translateX(-24px)",transition:"opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1)"}}>
        <div style={{display:"flex",gap:4}}><div style={{width:16,height:2,background:T.primary,borderRadius:2,boxShadow:`0 0 8px ${T.primary}`}}/><div style={{width:6,height:2,background:`${T.primary}55`,borderRadius:2}}/><div style={{width:3,height:2,background:`${T.primary}33`,borderRadius:2}}/></div>
        <span style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:T.primary,letterSpacing:5,textTransform:"uppercase",fontWeight:700}}>{tag}</span>
      </div>
      <h2 style={{fontFamily:"'Clash Display',sans-serif",fontSize:"clamp(28px,5vw,62px)",fontWeight:700,color:T.white,lineHeight:1.04,letterSpacing:-1.5,marginBottom:sub?18:0,opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(20px)",transition:"opacity .9s cubic-bezier(.16,1,.3,1) .1s,transform .9s cubic-bezier(.16,1,.3,1) .1s"}}>{title}</h2>
      {sub&&<p style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(14px,2vw,19px)",color:T.gray,maxWidth:580,lineHeight:1.85,opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(14px)",transition:"opacity .9s cubic-bezier(.16,1,.3,1) .2s,transform .9s cubic-bezier(.16,1,.3,1) .2s"}}>{sub}</p>}
    </div>
  );
}

/* ══════════════ SKILL BAR ══════════════ */
function SkillBar({pct,color,delay}){
  const ref=useRef();const vis=useInView(ref);
  return(
    <div ref={ref} style={{height:2,background:T.bg3,borderRadius:4,overflow:"visible",marginTop:14,position:"relative"}}>
      <div style={{height:"100%",width:vis?`${pct}%`:"0%",background:`linear-gradient(90deg,${color}44,${color})`,borderRadius:4,transition:`width 1.4s cubic-bezier(.16,1,.3,1) ${delay}s`,boxShadow:`0 0 12px ${color}66`,position:"relative"}}>
        <div style={{position:"absolute",right:-1,top:-3,width:8,height:8,borderRadius:"50%",background:color,boxShadow:`0 0 14px ${color},0 0 28px ${color}88`,opacity:vis?1:0,transition:`opacity .3s ${delay+1.2}s`}}/>
      </div>
    </div>
  );
}

/* ══════════════ EXP CARD ══════════════ */
function ExpCard({exp,idx}){
  const [open,setOpen]=useState(idx===0);
  const [selProj,setSelProj]=useState(0);
  const ref=useRef();const vis=useInView(ref);
  const proj=exp.projects[selProj];
  return(
    <div ref={ref} style={{opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(40px)",border:`1px solid ${open?exp.color+"33":T.border}`,background:open?`${T.bg1}`:"transparent",borderRadius:16,overflow:"hidden",boxShadow:open?`0 0 60px ${exp.color}06,inset 0 1px 0 ${exp.color}10`:"none",transition:`opacity .9s cubic-bezier(.16,1,.3,1) ${idx*.12}s,transform .9s cubic-bezier(.16,1,.3,1) ${idx*.12}s,border-color .4s,background .4s,box-shadow .4s`}}>
      <div data-c={open?"Close":"Open"} onClick={()=>setOpen(o=>!o)} style={{padding:"24px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,cursor:"none"}} className="exp-header">
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
            <span style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:exp.color,background:`${exp.color}12`,border:`1px solid ${exp.color}35`,padding:"3px 12px",borderRadius:100,letterSpacing:2,textTransform:"uppercase",fontWeight:700,whiteSpace:"nowrap"}}>{exp.type}</span>
            <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:T.gray,whiteSpace:"nowrap"}}>{exp.period}</span>
            <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:T.gray,whiteSpace:"nowrap"}}>📍 {exp.location}</span>
          </div>
          <h3 style={{fontFamily:"'Clash Display',sans-serif",fontSize:"clamp(16px,2.5vw,21px)",fontWeight:700,color:T.white,marginBottom:5,wordBreak:"break-word"}}>{exp.company}</h3>
          <p style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:exp.color,fontWeight:600,letterSpacing:.8}}>{exp.role}</p>
        </div>
        <div style={{width:38,height:38,borderRadius:"50%",border:`1.5px solid ${open?exp.color:T.borderHi}`,display:"flex",alignItems:"center",justifyContent:"center",color:open?exp.color:T.gray,fontSize:18,transition:"all .4s cubic-bezier(.16,1,.3,1)",transform:open?"rotate(45deg)":"rotate(0)",background:open?`${exp.color}12`:"transparent",boxShadow:open?`0 0 18px ${exp.color}33`:"none",flexShrink:0}}>+</div>
      </div>
      <div style={{maxHeight:open?2000:0,overflow:"hidden",transition:"max-height .8s cubic-bezier(.16,1,.3,1)"}}>
        <div style={{padding:"0 20px 28px"}}>
          <p style={{fontFamily:"'Outfit',sans-serif",fontSize:13.5,color:T.gray,lineHeight:1.85,marginBottom:22,paddingTop:18,borderTop:`1px solid ${T.border}`}}>{exp.summary}</p>
          {exp.projects.length>1&&(
            <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:22}}>
              {exp.projects.map((p,i)=>(
                <button key={p.name} onClick={()=>setSelProj(i)} style={{fontFamily:"'Outfit',sans-serif",fontSize:11,padding:"6px 14px",borderRadius:8,border:`1px solid ${i===selProj?p.color:T.border}`,background:i===selProj?`${p.color}14`:T.bg,color:i===selProj?p.color:T.gray,cursor:"none",transition:"all .3s cubic-bezier(.16,1,.3,1)",fontWeight:600,letterSpacing:.5,boxShadow:i===selProj?`0 0 16px ${p.color}22`:"none"}}>{p.name}</button>
              ))}
            </div>
          )}
          <div style={{background:T.bg,border:`1px solid ${T.border}`,borderLeft:`2px solid ${proj.color}`,borderRadius:10,padding:"20px 18px",boxShadow:`0 0 30px ${proj.color}06`,animation:"fadeIn .4s ease both"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:14,flexWrap:"wrap"}}>
              <span style={{fontFamily:"'Clash Display',sans-serif",fontSize:15,fontWeight:700,color:T.white}}>{proj.name}</span>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {proj.tech.map(t=>(<span key={t} style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:proj.color,background:`${proj.color}10`,border:`1px solid ${proj.color}22`,padding:"2px 9px",borderRadius:100,letterSpacing:.5}}>{t}</span>))}
              </div>
            </div>
            <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:10}}>
              {proj.bullets.map((b,i)=>(
                <li key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  <span style={{color:proj.color,fontSize:11,marginTop:4,flexShrink:0}}>▹</span>
                  <span style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:T.textDim,lineHeight:1.75}}>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════ TILT CARD ══════════════ */
function TiltCard({children,style={},className=""}){
  const ref=useRef();
  const onMove=useCallback(e=>{const r=ref.current.getBoundingClientRect();const x=((e.clientX-r.left)/r.width-.5)*14;const y=((e.clientY-r.top)/r.height-.5)*-14;ref.current.style.transform=`perspective(800px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;ref.current.style.setProperty("--mx",((e.clientX-r.left)/r.width*100)+"%");ref.current.style.setProperty("--my",((e.clientY-r.top)/r.height*100)+"%");},[]);
  const onLeave=useCallback(()=>{ref.current.style.transform="perspective(800px) rotateX(0) rotateY(0) scale(1)";},[]);
  return(<div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={className} style={{transition:"transform .5s cubic-bezier(.16,1,.3,1)",willChange:"transform",...style}}>{children}</div>);
}

/* ══════════════ FIELD — top-level so it never remounts on ContactForm re-render ══════════════ */
function Field({ id, label, type="text", rows, placeholder, value, onChange, onBlur, touched, errors }){
  const [focused, setFocused] = useState(false);
  const hasErr = touched[id] && errors[id];

  const inputBase = {
    width:"100%", fontFamily:"'Outfit',sans-serif", fontSize:14, color:T.text,
    background:T.bg, border:`1px solid ${T.border}`, borderRadius:10,
    padding:"13px 16px", outline:"none",
    transition:"border-color .25s,box-shadow .25s",
    cursor:"text", appearance:"none", WebkitAppearance:"none", resize:"none",
  };
  const inputFocus = { borderColor:`${T.primary}88`, boxShadow:`0 0 0 3px ${T.primary}18` };
  const inputErr   = { borderColor:"#E07070", boxShadow:"0 0 0 3px rgba(224,112,112,0.12)" };

  const style = { ...inputBase, ...(focused ? inputFocus : {}), ...(hasErr ? inputErr : {}) };
  const common = {
    id, name:id, value, onChange,
    onBlur: (e) => { setFocused(false); onBlur(e); },
    onFocus: () => setFocused(true),
    placeholder, style,
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
      <label htmlFor={id} style={{ fontFamily:"'Outfit',sans-serif", fontSize:12, fontWeight:600, color:T.grayHi, letterSpacing:.5 }}>
        {label} <span style={{ color:T.primary }}>*</span>
      </label>
      {rows
        ? <textarea {...common} rows={rows} style={{ ...style, lineHeight:1.7 }} />
        : <input    {...common} type={type} />
      }
      {hasErr && (
        <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:11, color:"#C05050", display:"flex", alignItems:"center", gap:4 }}>
          <span style={{ fontSize:10 }}>⚠</span>{errors[id]}
        </span>
      )}
    </div>
  );
}

/* ══════════════ CONTACT FORM ══════════════ */
const EMAILJS_SERVICE_ID  = "service_v82d6nl";
const EMAILJS_TEMPLATE_ID = "template_5v21vkb";
const EMAILJS_PUBLIC_KEY  = "V1ZV_nJ48V-uddoBH";

function ContactForm(){
  const [form,setForm]=useState({name:"",email:"",subject:"",message:""});
  const [status,setStatus]=useState("idle");
  const [touched,setTouched]=useState({});

  useEffect(()=>{
    if(window.emailjs) return;
    const s=document.createElement("script");
    s.src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload=()=>window.emailjs.init(EMAILJS_PUBLIC_KEY);
    document.head.appendChild(s);
  },[]);

  const handleChange = useCallback(e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }, []);

  const handleBlur = useCallback(e => {
    setTouched(t => ({ ...t, [e.target.name]: true }));
  }, []);

  const validate = () => {
    const errs={};
    if(!form.name.trim())          errs.name="Name is required";
    if(!form.email.trim())         errs.email="Email is required";
    else if(!/\S+@\S+\.\S+/.test(form.email)) errs.email="Enter a valid email";
    if(!form.subject.trim())       errs.subject="Subject is required";
    if(!form.message.trim())       errs.message="Message is required";
    else if(form.message.trim().length<10) errs.message="Message must be at least 10 characters";
    return errs;
  };
  const errors  = validate();
  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = async () => {
    setTouched({name:true,email:true,subject:true,message:true});
    if(!isValid) return;
    if(!window.emailjs){ setStatus("error"); return; }
    setStatus("sending");
    try {
      await window.emailjs.send(
        "service_v82d6nl",
        "template_5v21vkb",
        { name:form.name, email:form.email, message:form.message },
        "V1ZV_nJ48V-uddoBH"
      );
      setStatus("success");
      setForm({name:"",email:"",subject:"",message:""});
      setTouched({});
      setTimeout(()=>setStatus("idle"),5000);
    } catch(err){
      console.error(err);
      setStatus("error");
      setTimeout(()=>setStatus("idle"),5000);
    }
  };

  return(
    <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:18,padding:"32px 28px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${T.primary}88,transparent)`}}/>
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:T.primary,letterSpacing:4,textTransform:"uppercase",fontWeight:700,marginBottom:6}}>Send a Message</div>
        <p style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:T.gray,lineHeight:1.7}}>Fill in the form below and I'll get back to you within 24 hours.</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}} className="form-row-2col">
          <Field id="name"    label="Your Name"      placeholder="Akalya A"                            value={form.name}    onChange={handleChange} onBlur={handleBlur} touched={touched} errors={errors}/>
          <Field id="email"   label="Email Address"  type="email" placeholder="you@example.com"        value={form.email}   onChange={handleChange} onBlur={handleBlur} touched={touched} errors={errors}/>
        </div>
        <Field id="subject"   label="Subject"        placeholder="Project enquiry / Job opportunity…"  value={form.subject} onChange={handleChange} onBlur={handleBlur} touched={touched} errors={errors}/>
        <Field id="message"   label="Message"        rows={5} placeholder="Hi Akalya, I'd love to discuss…" value={form.message} onChange={handleChange} onBlur={handleBlur} touched={touched} errors={errors}/>
        <button
          data-c="Send"
          onClick={handleSubmit}
          disabled={status==="sending"}
          style={{
            marginTop:4,padding:"13px 32px",borderRadius:50,border:"none",
            background:status==="success"?"#4A7C5E":status==="error"?"#9C4A4A":T.primary,
            color:"#fff",fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,
            letterSpacing:.5,cursor:status==="sending"?"not-allowed":"none",
            display:"flex",alignItems:"center",justifyContent:"center",gap:10,
            boxShadow:`0 6px 28px ${T.primary}44`,
            transition:"background .4s,transform .3s,box-shadow .3s",
            transform:status==="sending"?"scale(0.98)":"scale(1)",
            opacity:status==="sending"?.75:1,
            alignSelf:"flex-start",
          }}
          className="send-btn"
        >
          {status==="sending"&&(<span style={{width:14,height:14,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"spinRing .7s linear infinite"}}/>)}
          {status==="idle"    && <>Send Message <span style={{fontSize:16}}>→</span></>}
          {status==="sending" && "Sending…"}
          {status==="success" && <>✓ Message Sent!</>}
          {status==="error"   && <>✕ Failed — Retry</>}
        </button>
        {status==="success"&&(
          <div style={{background:"rgba(74,124,94,0.1)",border:"1px solid rgba(74,124,94,0.3)",borderRadius:10,padding:"12px 16px",fontFamily:"'Outfit',sans-serif",fontSize:13,color:"#4A7C5E",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>✅</span>
            Your message was sent successfully! I'll reply within 24 hours.
          </div>
        )}
        {status==="error"&&(
          <div style={{background:"rgba(156,74,74,0.1)",border:"1px solid rgba(156,74,74,0.3)",borderRadius:10,padding:"12px 16px",fontFamily:"'Outfit',sans-serif",fontSize:13,color:"#9C4A4A",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>❌</span>
            Something went wrong. Please email directly at{" "}
            <a href="mailto:aakalya603@gmail.com" style={{color:"#9C4A4A",fontWeight:700}}>aakalya603@gmail.com</a>
          </div>
        )}
      </div>
      {(EMAILJS_SERVICE_ID==="YOUR_SERVICE_ID")&&(
        <div style={{marginTop:18,background:"rgba(124,125,82,0.08)",border:"1px dashed rgba(124,125,82,0.4)",borderRadius:10,padding:"12px 16px",fontFamily:"'Outfit',sans-serif",fontSize:12,color:T.gray,lineHeight:1.7}}>
          ⚙️ <strong style={{color:T.primary}}>Setup required:</strong> Replace <code>YOUR_SERVICE_ID</code>, <code>YOUR_TEMPLATE_ID</code>, and <code>YOUR_PUBLIC_KEY</code> with your{" "}
          <a href="https://www.emailjs.com" target="_blank" rel="noopener" style={{color:T.primary,fontWeight:600}}>EmailJS</a> credentials.
        </div>
      )}
    </div>
  );
}

/* ══════════════ MAIN PORTFOLIO ══════════════ */
export default function Portfolio(){
  const [activeNav,setActiveNav]=useState("Home");
  const [scrollY,setScrollY]=useState(0);
  const [menuOpen,setMenuOpen]=useState(false);
  const [loaded,setLoaded]=useState(false);
  const isMobile=useMediaQuery("(max-width:768px)");
  const isTablet=useMediaQuery("(max-width:1024px)");
  const typed=useTypewriter(["Full Stack Developer","Software Developer","React Developer","Junior Application Developer","Frontend Developer"]);

  useEffect(()=>{setTimeout(()=>setLoaded(true),100);},[]);

  useEffect(()=>{
    const onScroll=()=>{setScrollY(window.scrollY);const ids=NAV_ITEMS.map(n=>n.toLowerCase().replace(" ",""));const y=window.scrollY+140;let cur="Home";ids.forEach(id=>{const el=document.getElementById(id);if(el&&el.offsetTop<=y)cur=id.charAt(0).toUpperCase()+id.slice(1);});setActiveNav(cur);};
    window.addEventListener("scroll",onScroll,{passive:true});
    return()=>window.removeEventListener("scroll",onScroll);
  },[]);

  const go=id=>{document.getElementById(id.toLowerCase())?.scrollIntoView({behavior:"smooth"});setMenuOpen(false);};

  const downloadResume=()=>{
    const html=`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>Akalya A — Resume</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;background:#fff;color:#111;font-size:13px;line-height:1.6;padding:40px 48px;max-width:820px;margin:0 auto}h1{font-size:28px;font-weight:800;letter-spacing:-0.5px;margin-bottom:2px}.tagline{font-size:14px;color:#7C7D52;font-weight:600;margin-bottom:4px}.contacts{font-size:12px;color:#555;margin-bottom:18px;display:flex;flex-wrap:wrap;gap:6px 18px}hr{border:none;border-top:1.5px solid #7C7D52;margin:14px 0 18px}h2{font-size:12px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#7C7D52;margin-bottom:10px;margin-top:20px}.row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:2px}.role{font-size:13.5px;font-weight:700}.org{font-size:13px;color:#444;font-weight:600}.date{font-size:11.5px;color:#888;white-space:nowrap}.chip{font-size:11px;background:#f2f2ef;border:1px solid #ddd;padding:2px 9px;border-radius:4px;color:#444}.chip-hi{background:#7C7D5210;border-color:#7C7D5240;color:#7C7D52}.proj-name{font-size:13px;font-weight:700;margin-top:10px;margin-bottom:2px}ul{padding-left:16px;margin-top:6px}li{margin-bottom:3px;font-size:12.5px;color:#333}.two-col{display:grid;grid-template-columns:1fr 1fr;gap:0 32px}.skill-row{display:flex;justify-content:space-between;margin-bottom:4px}</style></head><body><h1>Akalya A</h1><div class="tagline">Full Stack Developer · React · Next.js · Flutter · Node.js</div><div class="contacts"><span>📧 aakalya603@gmail.com</span><span>📍 Coimbatore, Tamil Nadu</span></div><hr/><h2>Experience</h2><div class="row"><span><span class="role">Software Developer Intern</span></span><span class="date">Aug 2025 – Present</span></div><div class="org">Outdid Unified Private Limited · Remote / On-site</div><div class="proj-name">Vehicle Tracking System <span class="chip chip-hi">React</span><span class="chip chip-hi">Socket.io</span><span class="chip chip-hi">Google Maps</span></div><ul><li>Real-time GPS fleet dashboard for 100+ vehicles with route history and geofence alerts</li><li>Sub-200ms telematics via Socket.io; multi-tier RBAC for users, devices, vehicles</li></ul><div class="proj-name">Battery Management System <span class="chip chip-hi">Next.js</span><span class="chip chip-hi">WebSocket</span></div><ul><li>EV battery dashboard visualizing SOC, SOH, voltage and temperature with real-time fault diagnostics</li></ul><div class="proj-name">Inventory Management + School Bus Tracker <span class="chip chip-hi">Flutter</span><span class="chip chip-hi">Dart</span></div><ul><li>Cross-platform apps with live ETA prediction, stock management, KPI monitoring, and team chat</li></ul><div class="row" style="margin-top:14px"><span><span class="role">Full Stack Developer</span></span><span class="date">May 2024 – Jun 2024</span></div><div class="org">Accent Techno Soft · On-site</div><ul><li>Full-stack crime record system with FIR management and role-based auth using HTML/CSS/JS/MySQL/PHP</li></ul><div class="row" style="margin-top:14px"><span><span class="role">Python Programmer</span></span><span class="date">Feb 2024 – Mar 2024</span></div><div class="org">CodSoft · Remote</div><ul><li>To-Do List and Contact Manager apps with Tkinter and SQLite using MVC architecture</li></ul><h2>Skills</h2><div class="two-col"><div><div class="skill-row"><span style="font-weight:600">Frontend</span><span style="color:#666">React.js, Next.js, Vite, Tailwind</span></div><div class="skill-row"><span style="font-weight:600">Mobile</span><span style="color:#666">Flutter, Dart</span></div><div class="skill-row"><span style="font-weight:600">Languages</span><span style="color:#666">JavaScript, Python, HTML5, CSS</span></div></div><div><div class="skill-row"><span style="font-weight:600">Backend</span><span style="color:#666">Node.js, REST, WebSockets, Socket.io</span></div><div class="skill-row"><span style="font-weight:600">Databases</span><span style="color:#666">MongoDB, MySQL, Firebase</span></div><div class="skill-row"><span style="font-weight:600">Tools</span><span style="color:#666">Git, GitHub, Postman, VS Code</span></div></div></div><h2>Achievements</h2><ul><li><strong>Gold Badge — Python</strong> · HackerRank 2024</li><li><strong>SIH Ideathon 2024</strong> · Smart India Hackathon finalist</li><li><strong>SIH Thiruvizha 2024</strong> · 36-hour hackathon — built full e-learning app</li></ul><h2>Education</h2><div class="row"><span><span class="role">B.Tech — Information Technology</span></span><span class="date">June 2021 – May 2025</span></div><div class="org">KGiSL Institute of Technology, Coimbatore · CGPA: 7.75</div></body></html>`;
    const blob=new Blob([html],{type:"text/html"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="Akalya_A_Resume.html";document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);
  };

  useEffect(()=>{
    document.title="Akalya A — Full Stack Developer";
    const favicon=document.querySelector("link[rel='icon']")||document.createElement("link");
    favicon.rel="icon";favicon.type="image/svg+xml";
    favicon.href=`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%237C7D52'/><stop offset='100%25' stop-color='%235E5F3E'/></linearGradient></defs><rect width='100' height='100' rx='20' fill='%23F5F5F2'/><rect x='3' y='3' width='94' height='94' rx='18' fill='none' stroke='%237C7D52' stroke-width='2'/><text x='50' y='68' text-anchor='middle' font-family='Georgia,serif' font-size='58' font-weight='900' fill='url(%23g)'>A</text><line x1='28' y1='78' x2='72' y2='78' stroke='%237C7D52' stroke-width='3' stroke-linecap='round'/></svg>`;
    document.head.appendChild(favicon);
  },[]);

  return(
    <div style={{background:T.bg,color:T.text,fontFamily:"'Outfit',sans-serif",minHeight:"100vh",width:"100vw",maxWidth:"100vw",cursor:"none",overflowX:"hidden"}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
      <Cursor/>
      <ParticleBg/>

      {/* Ambient background */}
      <div style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-5%",left:"-12%",width:560,height:560,borderRadius:"50%",background:`radial-gradient(circle,${T.primary}0a,transparent 60%)`,filter:"blur(120px)",animation:"floatY 10s ease-in-out infinite"}}/>
        <div style={{position:"absolute",bottom:"-8%",right:"-10%",width:500,height:500,borderRadius:"50%",background:`radial-gradient(circle,${T.primary}08,transparent 60%)`,filter:"blur(110px)",animation:"floatY 8s ease-in-out 2s infinite"}}/>
        <div style={{position:"absolute",top:"38%",left:"28%",width:380,height:380,borderRadius:"50%",background:`radial-gradient(circle,${T.primary}05,transparent 60%)`,filter:"blur(90px)",animation:"floatX 12s ease-in-out 1s infinite"}}/>
        <div style={{position:"absolute",top:0,left:0,width:320,height:320,background:`radial-gradient(circle at 0% 0%,${T.primary}08,transparent 65%)`}}/>
        <div style={{position:"absolute",top:0,right:0,width:260,height:260,background:`radial-gradient(circle at 100% 0%,${T.primary}06,transparent 65%)`}}/>
        <div style={{position:"absolute",bottom:0,left:0,width:260,height:260,background:`radial-gradient(circle at 0% 100%,${T.primary}06,transparent 65%)`}}/>
        <div style={{position:"absolute",bottom:0,right:0,width:300,height:300,background:`radial-gradient(circle at 100% 100%,${T.primary}07,transparent 65%)`}}/>
      </div>

      <style>{`
        @import url('https://api.fontshare.com/v2/css?f[]=clash-display@700,600,500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{background:${T.bg}!important;width:100%;max-width:100vw;min-height:100vh;overflow-x:hidden}
        #root{background:${T.bg}!important;width:100%;max-width:100vw;min-height:100vh}
        html{scroll-behavior:smooth}
        ::selection{background:${T.primary}35;color:${T.primary}}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:${T.bg}}
        ::-webkit-scrollbar-thumb{background:${T.primary}88;border-radius:4px}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes spinRing{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes spinRev{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.9)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-22px)}}
        @keyframes floatX{0%,100%{transform:translateX(0)}50%{transform:translateX(14px)}}
        @keyframes gradShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
        @keyframes scanLine{0%{top:-60%}100%{top:160%}}
        @keyframes borderPulse{0%,100%{border-color:${T.primary}40;box-shadow:0 0 0 transparent}50%{border-color:${T.primary}99;box-shadow:0 0 30px ${T.primary}22}}
        @keyframes rotateGlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes rippleOut{0%{transform:scale(1);opacity:.5}100%{transform:scale(2.6);opacity:0}}
        @keyframes iconBounce{0%,100%{transform:translateY(0) scale(1)}35%{transform:translateY(-10px) scale(1.15)}65%{transform:translateY(-4px) scale(1.06)}}
        @keyframes glint{0%{transform:translateX(-120%) skewX(-20deg)}100%{transform:translateX(220%) skewX(-20deg)}}
        @keyframes popIn{0%{transform:scale(0.8) translateY(10px);opacity:0}60%{transform:scale(1.05) translateY(-2px)}100%{transform:scale(1) translateY(0);opacity:1}}
        .grad-text{background:linear-gradient(140deg,${T.text} 0%,${T.primary} 48%,${T.text} 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:gradShift 5s ease infinite}
        .skill-card{position:relative;overflow:hidden;transition:all .4s cubic-bezier(.16,1,.3,1)}
        .skill-card::before{content:'';position:absolute;top:-80%;left:0;right:0;height:50%;background:linear-gradient(180deg,${T.primary}10,transparent);animation:scanLine 5s linear infinite;pointer-events:none}
        .skill-card:hover{transform:translateY(-6px) scale(1.01);box-shadow:0 20px 56px ${T.primary}14,0 0 0 1.5px ${T.primary}33!important;border-color:${T.primary}55!important}
        .proj-card{position:relative;overflow:hidden;transition:all .45s cubic-bezier(.16,1,.3,1)!important}
        .proj-card::before{content:'';position:absolute;inset:0;background:radial-gradient(500px circle at var(--mx,50%) var(--my,50%),${T.primary}14,transparent 60%);opacity:0;transition:opacity .35s;pointer-events:none;z-index:0}
        .proj-card:hover::before{opacity:1}
        .proj-card:hover{border-color:${T.primary}66!important;transform:translateY(-10px) scale(1.015)!important;box-shadow:0 36px 90px ${T.primary}1e,0 0 0 1.5px ${T.primary}33!important}
        .proj-card:hover .proj-num{color:${T.primary}!important;transform:scale(1.15);display:inline-block}
        .proj-card:hover .proj-title{color:${T.primary}!important}
        .ach-card{position:relative;overflow:hidden;transition:all .42s cubic-bezier(.16,1,.3,1)}
        .ach-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,${T.primary}07,transparent 60%);opacity:0;transition:opacity .4s;pointer-events:none}
        .ach-card::after{content:'';position:absolute;top:0;left:-120%;width:55%;height:100%;background:linear-gradient(90deg,transparent,${T.primary}14,transparent);transform:skewX(-15deg);transition:left .65s ease}
        .ach-card:hover::before{opacity:1}
        .ach-card:hover::after{left:190%}
        .ach-card:hover{transform:translateY(-9px) scale(1.02);border-color:var(--ac)!important;box-shadow:0 24px 70px rgba(0,0,0,.13),0 0 0 1.5px var(--ac)!important}
        .ach-card:hover .ach-icon{animation:iconBounce .65s cubic-bezier(.16,1,.3,1)!important}
        .what-card{transition:all .38s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden}
        .what-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,${T.primary}07,transparent 70%);opacity:0;transition:opacity .4s;pointer-events:none}
        .what-card::after{content:'';position:absolute;bottom:0;left:0;height:2px;width:0;background:${T.primary};transition:width .45s cubic-bezier(.16,1,.3,1)}
        .what-card:hover::before{opacity:1}
        .what-card:hover::after{width:100%}
        .what-card:hover{border-color:${T.primary}88!important;background:${T.bg2}!important;transform:translateY(-7px) scale(1.01);box-shadow:0 20px 56px ${T.primary}16}
        .what-card:hover .wi{animation:iconBounce .65s cubic-bezier(.16,1,.3,1)!important;display:inline-block}
        .skill-chip{transition:all .22s cubic-bezier(.16,1,.3,1);cursor:default;position:relative;overflow:hidden}
        .skill-chip::after{content:'';position:absolute;inset:0;background:${T.primary};transform:scaleX(0);transform-origin:left;transition:transform .25s cubic-bezier(.16,1,.3,1);border-radius:6px;z-index:-1}
        .skill-chip:hover::after{transform:scaleX(1)}
        .skill-chip:hover{color:#fff!important;border-color:${T.primary}!important;transform:translateY(-4px) scale(1.08);box-shadow:0 6px 18px ${T.primary}28}
        .cta-a{position:relative;overflow:hidden;transition:all .42s cubic-bezier(.16,1,.3,1)}
        .cta-a:hover{box-shadow:0 16px 56px ${T.primary}55!important;transform:translateY(-5px) scale(1.03)!important;filter:brightness(1.08)}
        .cta-b{transition:all .38s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden}
        .cta-b:hover{border-color:${T.primary}66!important;color:${T.text}!important;transform:translateY(-5px) scale(1.03)!important;box-shadow:0 12px 40px rgba(0,0,0,.10)!important;background:rgba(245,245,242,0.9)!important}
        .cta-dl{transition:all .38s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden}
        .cta-dl:hover{border-color:${T.primary}66!important;color:${T.text}!important;transform:translateY(-5px) scale(1.03)!important;box-shadow:0 12px 40px rgba(0,0,0,.10)!important}
        .soc-link{transition:all .3s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden}
        .soc-link::before{content:'';position:absolute;inset:0;background:${T.primary};transform:scaleY(0);transform-origin:bottom;transition:transform .3s cubic-bezier(.16,1,.3,1);z-index:-1;border-radius:10px}
        .soc-link:hover::before{transform:scaleY(1)}
        .soc-link:hover{color:#fff!important;border-color:${T.primary}!important;transform:translateY(-5px) scale(1.1) rotate(-3deg)!important;box-shadow:0 10px 28px ${T.primary}38!important}
        .nav-pill{transition:color .2s,transform .25s,background .2s}
        .nav-pill:hover{color:${T.primary}!important;transform:translateY(-2px)}
        .nav-pill.active{color:${T.text}!important;font-weight:700}
        .nav-pill.active::before{content:'';position:absolute;inset:0;background:${T.primary}20;border:1px solid ${T.primary}66;border-radius:30px;z-index:-1}
        .nav-pill.active::after{content:'';position:absolute;bottom:2px;left:50%;transform:translateX(-50%);width:14px;height:1.5px;background:${T.primary};border-radius:2px}
        .hire-cta{transition:all .38s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden}
        .hire-cta::before{content:'';position:absolute;top:50%;left:50%;width:0;height:0;background:${T.primaryDim};border-radius:50%;transform:translate(-50%,-50%);transition:width .5s,height .5s;z-index:0}
        .hire-cta span{position:relative;z-index:2}
        .hire-cta:hover::before{width:300px;height:300px}
        .hire-cta:hover{box-shadow:0 8px 32px ${T.primary}50!important;transform:scale(1.07) translateY(-2px)!important;color:#fff!important}
        .contact-card{transition:all .38s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden}
        .contact-card::before{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,${T.primary},transparent);transform:scaleX(0);transition:transform .4s cubic-bezier(.16,1,.3,1)}
        .contact-card::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,${T.primary}07,transparent);opacity:0;transition:opacity .4s}
        .contact-card:hover::before{transform:scaleX(1)}
        .contact-card:hover::after{opacity:1}
        .contact-card:hover{border-color:${T.primary}66!important;transform:translateY(-6px) scale(1.02);box-shadow:0 16px 48px ${T.primary}16}
        .exp-header{transition:background .3s}
        .exp-header:hover{background:${T.primary}07!important}
        .ripple-badge{position:relative}
        .ripple-badge::before,.ripple-badge::after{content:'';position:absolute;inset:-5px;border-radius:100px;border:1px solid ${T.primary}44;animation:rippleOut 2.5s ease-out infinite;pointer-events:none}
        .ripple-badge::after{animation-delay:1.25s}
        .info-card{transition:all .32s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden}
        .info-card::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,${T.primary}88,transparent);transform:scaleX(0);transition:transform .4s cubic-bezier(.16,1,.3,1)}
        .info-card:hover::after{transform:scaleX(1)}
        .info-card:hover{border-color:${T.primary}66!important;transform:translateY(-4px) scale(1.025);box-shadow:0 10px 32px ${T.primary}14}
        .stat-cell{transition:all .3s cubic-bezier(.16,1,.3,1);position:relative;cursor:default}
        .stat-cell:hover{transform:scale(1.08) translateY(-3px)}
        .stat-cell:hover .counter-num{animation:popIn .4s cubic-bezier(.16,1,.3,1) both}
        .tech-tag{transition:all .22s cubic-bezier(.16,1,.3,1);cursor:default}
        .tech-tag:hover{transform:translateY(-3px) scale(1.1);box-shadow:0 4px 14px ${T.primary}20}
        .edu-card{transition:all .4s cubic-bezier(.16,1,.3,1)}
        .edu-card:hover{transform:translateY(-6px);box-shadow:0 24px 64px rgba(0,0,0,.10),0 0 0 1.5px ${T.primary}44!important}
        .about-p{transition:color .3s}
        .about-p:hover{color:${T.textDim}!important}
        .footer-logo{transition:all .3s cubic-bezier(.16,1,.3,1)}
        .footer-logo:hover{transform:scale(1.15) rotate(10deg);box-shadow:0 0 18px ${T.primary}55!important}
        .footer-row{transition:border-color .3s}
        input,textarea{cursor:text!important;}
        .send-btn:hover:not(:disabled){box-shadow:0 16px 56px ${T.primary}55!important;transform:translateY(-3px) scale(1.03)!important;filter:brightness(1.08)}
        @media(max-width:600px){.form-row-2col{grid-template-columns:1fr!important}}
        @media(max-width:1024px){
          .about-grid-inner{grid-template-columns:1fr 1fr!important}
          .about-col-7{grid-column:span 1!important}
          .about-col-5{grid-column:span 1!important}
          .about-col-12{grid-column:span 2!important}
          .edu-cred-grid{grid-template-columns:1fr 1fr!important}
        }
        @media(max-width:900px){
          .orbital-rings{display:none!important}
          .floating-tech{display:none!important}
          .section-pad{padding:80px 5%!important}
          .hero-section{padding-left:4%!important;padding-right:4%!important}
        }
        @media(max-width:768px){
          .deskNav,.status-badge{display:none!important}
          .mbBtn{display:flex!important}
          .orbital-rings{display:none!important}
          .floating-tech{display:none!important}
          .about-grid-inner{display:flex!important;flex-direction:column!important;gap:12px!important}
          .about-col-7,.about-col-5,.about-col-12{grid-column:unset!important;width:100%!important}
          .contact-details-grid{grid-template-columns:1fr!important}
          .edu-cred-grid{grid-template-columns:1fr!important}
          .stats-row{flex-direction:column!important;gap:0!important;width:100%!important}
          .stat-cell{border-right:none!important;border-bottom:1px solid ${T.border}!important;padding-bottom:20px!important;padding-top:20px!important}
          .stat-cell:last-child{border-bottom:none!important}
          .counter-num{font-size:42px!important}
          .section-pad{padding:64px 4%!important}
          .hero-section{padding-top:120px!important;padding-bottom:60px!important;padding-left:4%!important;padding-right:4%!important}
          .footer-row{flex-direction:column!important;gap:10px!important;align-items:flex-start!important}
          .hero-cta-group{flex-direction:row!important;flex-wrap:wrap!important;justify-content:center!important;gap:8px!important}
          .hero-cta-group > *{flex:1 1 auto!important;max-width:calc(50% - 4px)!important;justify-content:center!important;text-align:center!important;display:flex!important;padding:10px 14px!important;font-size:13px!important;white-space:nowrap!important}
          .hero-stats-wrap{flex-direction:column!important}
          .hero-social{justify-content:center!important;flex-wrap:wrap!important}
          .role-capsule{display:none!important}
          .what-grid{grid-template-columns:1fr!important}
          .ach-grid{grid-template-columns:1fr!important}
          .proj-grid{grid-template-columns:1fr!important}
          .skills-grid{grid-template-columns:1fr!important}
          .exp-header{padding:20px 16px!important}
          .contact-grid{grid-template-columns:1fr!important}
          .contact-socials{flex-direction:column!important;width:100%!important}
          .contact-socials > *{width:100%!important;text-align:center!important;justify-content:center!important;display:flex!important}
          .sec-head-mb{margin-bottom:48px!important}
          .cgpa-num{font-size:58px!important}
          .logo-text{display:none!important}
          .scroll-indicator{display:none!important}
          .avail-badge{margin-bottom:24px!important}
          .hero-desc{font-size:14px!important;margin-bottom:32px!important}
        }
        @media(max-width:420px){
          .hero-section{padding-left:3%!important;padding-right:3%!important}
          .section-pad{padding:56px 3%!important}
          .exp-header{padding:16px 14px!important}
          .counter-num{font-size:36px!important}
          .hero-cta-group > *{max-width:100%!important;width:100%!important;flex:1 1 100%!important}
        }
      `}</style>

      {/* ══ NAV ══ */}
      <header style={{position:"fixed",top:0,left:0,right:0,zIndex:9000,padding:isMobile?"12px 4%":"16px 5%",pointerEvents:"none",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div onClick={()=>go("Home")} data-c="" style={{pointerEvents:"all",cursor:"none",display:"flex",alignItems:"center",gap:10,background:"rgba(245,245,242,0.88)",backdropFilter:"blur(28px)",border:`1px solid ${scrollY>40?T.primary+"44":T.border}`,borderRadius:50,padding:"7px 18px 7px 8px",boxShadow:scrollY>40?`0 4px 28px rgba(0,0,0,0.12),0 0 0 1px ${T.primary}22`:`0 2px 16px rgba(0,0,0,0.07),inset 0 1px 0 rgba(255,255,255,0.8)`,transition:"all .4s cubic-bezier(.16,1,.3,1)"}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:`${T.primary}18`,border:`1.5px solid ${T.primary}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 12px ${T.primary}66`,flexShrink:0,position:"relative"}}>
            <div style={{position:"absolute",inset:-3,borderRadius:"50%",border:`1px solid ${T.primary}22`,animation:"spinRing 8s linear infinite"}}/>
            <span style={{fontFamily:"'Clash Display',sans-serif",fontSize:13,color:T.primary,fontWeight:700}}>A</span>
          </div>
          <div className="logo-text">
            <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:17,color:T.white,fontWeight:700,lineHeight:1,letterSpacing:.5}}>Akalya<span style={{color:T.primary}}>.</span></div>
            <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:T.gray,letterSpacing:3,textTransform:"uppercase",marginTop:1}}>Developer</div>
          </div>
        </div>
        {!isMobile&&(
          <nav className="deskNav" style={{pointerEvents:"all",display:"flex",alignItems:"center",gap:1,background:"rgba(245,245,242,0.88)",backdropFilter:"blur(28px)",border:`1px solid ${T.border}`,borderRadius:50,padding:"5px 6px",boxShadow:`0 4px 28px rgba(0,0,0,0.09),inset 0 1px 0 rgba(255,255,255,0.7)${scrollY>40?`,0 0 0 1px ${T.primary}22`:""}`,transition:"box-shadow .4s"}}>
            {NAV_ITEMS.map(n=>(
              <button key={n} onClick={()=>go(n)} className={`nav-pill ${activeNav===n?"active":""}`}
                style={{background:"none",border:"none",fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:activeNav===n?600:400,letterSpacing:.3,color:activeNav===n?T.text:T.gray,cursor:"none",padding:"7px 16px",borderRadius:50,transition:"color .2s",position:"relative",zIndex:0}}>
                {n}
              </button>
            ))}
          </nav>
        )}
        <div style={{pointerEvents:"all",display:"flex",alignItems:"center",gap:10}}>
          {!isMobile&&(
            <div className="status-badge" style={{display:"flex",alignItems:"center",gap:7,background:"rgba(245,245,242,0.88)",backdropFilter:"blur(20px)",border:`1px solid ${T.border}`,borderRadius:50,padding:"7px 16px",boxShadow:`0 2px 12px rgba(0,0,0,0.06),inset 0 1px 0 rgba(255,255,255,0.7)`}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:T.primary,boxShadow:`0 0 8px ${T.primary}`,animation:"pulse 2s infinite"}}/>
              <span style={{fontFamily:"'Outfit',sans-serif",fontSize:14,color:T.grayHi,fontWeight:500,letterSpacing:.5}}>Open to Work</span>
            </div>
          )}
          <button onClick={()=>go("Contact")} className="hire-cta" data-c=""
            style={{background:T.primary,color:"#fff",border:"none",padding:isMobile?"9px 18px":"10px 24px",borderRadius:50,fontFamily:"'Outfit',sans-serif",fontSize:isMobile?13:15,fontWeight:700,cursor:"none",letterSpacing:.5,boxShadow:`0 0 24px ${T.primary}44,0 4px 16px ${T.primary}33`}}>
            <span>{isMobile?"Hire":"Hire Me ↗"}</span>
          </button>
          {isMobile&&(
            <button className="mbBtn" onClick={()=>setMenuOpen(o=>!o)}
              style={{display:"flex",flexDirection:"column",gap:4.5,padding:"9px 11px",background:"rgba(245,245,242,0.88)",backdropFilter:"blur(20px)",border:`1px solid ${menuOpen?T.primary:T.border}`,borderRadius:12,cursor:"pointer",pointerEvents:"all",transition:"border-color .3s"}}>
              {[0,1,2].map(i=>(
                <span key={i} style={{display:"block",width:18,height:1.5,background:menuOpen?T.primary:T.grayHi,borderRadius:2,transition:"all .3s",transform:menuOpen?(i===0?"rotate(45deg) translate(4px,4px)":i===1?"scaleX(0)":"rotate(-45deg) translate(4px,-4px)"):"none",opacity:menuOpen&&i===1?0:1}}/>
              ))}
            </button>
          )}
        </div>
      </header>

      {/* Mobile menu */}
      {isMobile&&menuOpen&&(
        <div style={{position:"fixed",inset:0,zIndex:8999,background:"rgba(245,245,242,0.98)",backdropFilter:"blur(24px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,animation:"fadeIn .3s ease"}}>
          {NAV_ITEMS.map((n,i)=>(
            <button key={n} onClick={()=>go(n)} style={{background:"none",border:"none",fontFamily:"'Clash Display',sans-serif",fontSize:"clamp(26px,8vw,34px)",fontWeight:700,color:activeNav===n?T.primary:T.grayHi,cursor:"pointer",padding:"10px 50px",borderRadius:12,transition:"color .2s",animation:`fadeUp .4s ease ${i*.06}s both`,letterSpacing:-0.5}}>{n}</button>
          ))}
        </div>
      )}

      {/* ══════════════ HERO ══════════════ */}
      <section id="home" className="hero-section" style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",paddingTop:"130px",paddingBottom:"80px",paddingLeft:"6%",paddingRight:"6%",position:"relative",zIndex:1,textAlign:"center",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-58%)",width:"min(720px,90vw)",height:"min(520px,60vw)",borderRadius:"50%",background:`radial-gradient(ellipse at center,${T.primary}0e 0%,${T.primary}05 40%,transparent 70%)`,filter:"blur(70px)",pointerEvents:"none",zIndex:0}}/>
        <div style={{position:"absolute",top:"28%",left:"10%",width:280,height:280,borderRadius:"50%",background:`radial-gradient(circle,${T.primary}07,transparent 70%)`,filter:"blur(80px)",pointerEvents:"none",zIndex:0}}/>
        <div style={{position:"absolute",top:"38%",right:"8%",width:240,height:240,borderRadius:"50%",background:`radial-gradient(circle,${T.primary}06,transparent 70%)`,filter:"blur(70px)",pointerEvents:"none",zIndex:0}}/>
        <div className="orbital-rings" style={{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none",zIndex:0,animation:"floatY 7s ease-in-out infinite"}}>
          <div style={{position:"absolute",inset:-30,borderRadius:"50%",background:`conic-gradient(from 0deg,transparent 0%,${T.primary}15 25%,transparent 50%,${T.primary}08 75%,transparent 100%)`,animation:"rotateGlow 8s linear infinite",filter:"blur(8px)"}}/>
          <div style={{width:560,height:560,borderRadius:"50%",border:`1px solid ${T.border}`,position:"relative",animation:"spinRing 90s linear infinite"}}>
            {[0,45,90,135,180,225,270,315].map(deg=>(
              <div key={deg} style={{position:"absolute",top:"50%",left:"50%",width:5,height:5,borderRadius:"50%",background:T.primary,opacity:.5,transform:`rotate(${deg}deg) translateX(279px) translateY(-50%)`,boxShadow:`0 0 10px ${T.primary},0 0 20px ${T.primary}88`}}/>
            ))}
          </div>
          <div style={{position:"absolute",inset:80,borderRadius:"50%",border:`1px solid ${T.primary}10`,animation:"spinRev 55s linear infinite"}}/>
          <div style={{position:"absolute",inset:155,borderRadius:"50%",border:`1px solid ${T.primary}07`}}/>
          <div style={{position:"absolute",inset:240,borderRadius:"50%",border:`1px dashed ${T.primary}12`,animation:"spinRing 30s linear infinite"}}/>
        </div>
        {[{label:"React.js",top:"22%",left:"6%",delay:"0s"},{label:"Flutter",top:"62%",left:"4%",delay:"0.8s"},{label:"Socket.io",top:"20%",right:"5%",delay:"0.4s"},{label:"Next.js",top:"66%",right:"6%",delay:"1.2s"}].map(({label,top,left,right,delay})=>(
          <div key={label} className="floating-tech" style={{position:"absolute",top,left,right,fontFamily:"'Outfit',sans-serif",fontSize:11,color:T.primary,fontWeight:600,letterSpacing:.8,background:`${T.primary}0a`,border:`1px solid ${T.primary}22`,borderRadius:100,padding:"5px 14px",animation:`floatY 5s ease-in-out ${delay} infinite`,opacity:.6,zIndex:1,pointerEvents:"none",backdropFilter:"blur(8px)"}}>{label}</div>
        ))}
        <div style={{position:"absolute",top:"18%",left:"50%",transform:"translateX(-50%)",width:"min(500px,68%)",height:"1px",background:`linear-gradient(90deg,transparent,${T.primary}20,transparent)`,zIndex:1,pointerEvents:"none",opacity:loaded?1:0,transition:"opacity 1.2s .2s"}}/>
        <div style={{width:"100%",maxWidth:660,position:"relative",zIndex:2,display:"flex",flexDirection:"column",alignItems:"center"}}>
          <div className="ripple-badge avail-badge" style={{display:"inline-flex",alignItems:"center",gap:9,background:`${T.primary}0c`,border:`1px solid ${T.primary}28`,borderRadius:100,padding:"7px 22px",marginBottom:40,backdropFilter:"blur(12px)",opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(20px)",transition:"opacity .8s .1s,transform .8s cubic-bezier(.16,1,.3,1) .1s"}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:T.primary,boxShadow:`0 0 10px ${T.primary},0 0 18px ${T.primary}66`,animation:"pulse 2s ease-in-out infinite"}}/>
            <span style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:T.primary,fontWeight:600,letterSpacing:2}}>Available for Opportunities</span>
          </div>
          <p style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(12px,1.6vw,17px)",fontWeight:300,color:T.gray,letterSpacing:5,textTransform:"uppercase",marginBottom:8,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(14px)",transition:"opacity .9s .18s,transform .9s cubic-bezier(.16,1,.3,1) .18s"}}>Hi, I'm</p>
          <div style={{position:"relative",marginBottom:10,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(30px)",transition:"opacity .9s .25s,transform .9s cubic-bezier(.16,1,.3,1) .25s"}}>
            <div style={{position:"absolute",inset:"-30px -60px",borderRadius:"50%",background:`radial-gradient(ellipse,${T.primary}12,transparent 65%)`,filter:"blur(28px)",pointerEvents:"none",zIndex:0}}/>
            <h1 className="grad-text" style={{fontFamily:"'Clash Display',sans-serif",fontSize:"clamp(54px,11.5vw,134px)",fontWeight:700,lineHeight:.88,letterSpacing:-3.5,position:"relative",zIndex:1}}>Akalya. A</h1>
          </div>
          <div style={{width:72,height:1,background:`linear-gradient(90deg,transparent,${T.primary}88,transparent)`,marginBottom:22,opacity:loaded?1:0,transition:"opacity 1s .4s"}}/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:20,minHeight:40,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(16px)",transition:"opacity .9s .38s,transform .9s cubic-bezier(.16,1,.3,1) .38s"}}>
            <span style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(15px,2.2vw,24px)",color:T.textDim,fontWeight:300,letterSpacing:.4}}>{typed}</span>
            <span style={{display:"inline-block",width:2,height:"1em",background:T.primary,animation:"blink 1s step-end infinite",borderRadius:2,boxShadow:`0 0 10px ${T.primary}`}}/>
          </div>
          <div className="role-capsule" style={{display:"inline-flex",alignItems:"center",gap:0,background:T.bg1,border:`1px solid ${T.border}`,borderRadius:100,padding:"9px 6px",marginBottom:30,backdropFilter:"blur(16px)",boxShadow:`0 2px 20px rgba(0,0,0,0.06),inset 0 1px 0 rgba(255,255,255,0.6)`,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(14px)",transition:"opacity .9s .44s,transform .9s cubic-bezier(.16,1,.3,1) .44s",flexWrap:"wrap",justifyContent:"center"}}>
            {["Full Stack Developer","React • Flutter","Real-time Systems","Open to Work ●"].map((label,i,arr)=>(
              <span key={label} style={{display:"inline-flex",alignItems:"center"}}>
                <span style={{fontFamily:"'Outfit',sans-serif",fontSize:12,fontWeight:i===3?700:i===0?600:400,letterSpacing:.6,color:i===3?T.primary:i===0?T.textDim:T.gray,padding:"2px 14px",whiteSpace:"nowrap"}}>{label}</span>
                {i<arr.length-1&&<span style={{width:1,height:14,background:T.border,display:"inline-block",flexShrink:0}}/>}
              </span>
            ))}
          </div>
          <p className="hero-desc" style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(14px,1.8vw,16px)",lineHeight:1.95,color:T.gray,maxWidth:520,marginBottom:44,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(16px)",transition:"opacity .9s .5s,transform .9s cubic-bezier(.16,1,.3,1) .5s",padding:"0 4px"}}>
            B.Tech graduate specializing in real-time web &amp; mobile apps. From GPS fleet dashboards to EV battery monitors — I build production-grade software that ships and scales.
          </p>
          <div className="hero-cta-group" style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginBottom:42,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(16px)",transition:"opacity .9s .56s,transform .9s cubic-bezier(.16,1,.3,1) .56s",width:"100%"}}>
            <button onClick={()=>go("Experience")} className="cta-a" data-c="View"
              style={{background:T.primary,border:`1.5px solid ${T.primary}`,color:"#fff",padding:"11px 28px",borderRadius:50,fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,cursor:"none",position:"relative",zIndex:0,letterSpacing:.5,boxShadow:`0 6px 28px ${T.primary}44,0 2px 8px ${T.primary}22`,whiteSpace:"nowrap",flexShrink:0}}>
              View My Work →
            </button>
            <a href="mailto:aakalya603@gmail.com" className="cta-b" data-c="Email"
              style={{background:"rgba(245,245,242,0.55)",backdropFilter:"blur(16px)",border:`1px solid ${T.border}`,color:T.grayHi,padding:"11px 28px",borderRadius:50,fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:500,cursor:"none",textDecoration:"none",display:"inline-flex",alignItems:"center",justifyContent:"center",letterSpacing:.3,boxShadow:`inset 0 1px 0 rgba(255,255,255,0.7),0 2px 12px rgba(0,0,0,0.06)`,whiteSpace:"nowrap",flexShrink:0}}>
              Let's Connect
            </a>
            <button onClick={downloadResume} className="cta-dl" data-c="Resume"
              style={{background:"transparent",border:`1px solid ${T.border}`,color:T.gray,padding:"11px 24px",borderRadius:50,fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:500,cursor:"none",display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,letterSpacing:.3,position:"relative",zIndex:0,overflow:"hidden",backdropFilter:"blur(10px)",boxShadow:`inset 0 1px 0 rgba(255,255,255,0.5)`,whiteSpace:"nowrap",flexShrink:0}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Resume
            </button>
          </div>
          <div className="hero-social" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14,marginBottom:56,opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(12px)",transition:"opacity .9s .62s,transform .9s cubic-bezier(.16,1,.3,1) .62s",flexWrap:"wrap"}}>
            <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:T.gray,letterSpacing:2.5,textTransform:"uppercase"}}>Find me on</span>
            <div style={{width:24,height:1,background:T.border}}/>
            {[["GH","https://github.com"],["LI","https://linkedin.com"],["HR","https://hackerrank.com"]].map(([l,h])=>(
              <a key={l} href={h} target="_blank" rel="noopener" className="soc-link" data-c={l}
                style={{width:40,height:40,borderRadius:10,border:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif",fontSize:11,color:T.gray,fontWeight:700,textDecoration:"none",cursor:"none",position:"relative",zIndex:0,background:"rgba(245,245,242,0.55)",backdropFilter:"blur(10px)",boxShadow:`inset 0 1px 0 rgba(255,255,255,0.6)`,flexShrink:0}}>
                {l}
              </a>
            ))}
          </div>
          <div style={{width:"100%",height:1,background:`linear-gradient(90deg,transparent,${T.border},transparent)`,marginBottom:38,opacity:loaded?0.7:0,transition:"opacity 1s .7s"}}/>
          <div className="stats-row" style={{display:"flex",gap:0,width:"100%",justifyContent:"center",opacity:loaded?1:0,transform:loaded?"translateY(0)":"translateY(12px)",transition:"opacity .9s .72s,transform .9s cubic-bezier(.16,1,.3,1) .72s"}}>
            {[{to:3,suffix:"+",label:"Internships",color:T.primary},{to:9,suffix:"+",label:"Projects",color:T.white},{to:7,suffix:".75",label:"CGPA × 100",color:T.primary}].map((s,i)=>(
              <div key={s.label} className="stat-cell" style={{flex:1,textAlign:"center",padding:"0 24px",borderRight:i<2?`1px solid ${T.border}`:"none"}}>
                <Counter to={s.to} suffix={s.suffix} label={s.label} color={s.color}/>
              </div>
            ))}
          </div>
        </div>
        <div className="scroll-indicator" style={{position:"absolute",bottom:36,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:10,zIndex:2,opacity:loaded?1:0,transition:"opacity 1s 1.1s"}}>
          <div style={{width:26,height:42,borderRadius:13,border:`1.5px solid ${T.border}`,display:"flex",justifyContent:"center",paddingTop:6,background:"rgba(245,245,242,0.4)",backdropFilter:"blur(8px)",boxShadow:`inset 0 1px 0 rgba(255,255,255,0.5)`}}>
            <div style={{width:3,height:8,borderRadius:2,background:T.primary,animation:"floatY 1.8s ease-in-out infinite",boxShadow:`0 0 8px ${T.primary}`}}/>
          </div>
          <span style={{fontFamily:"'Outfit',sans-serif",fontSize:9,color:T.gray,letterSpacing:4,textTransform:"uppercase"}}>scroll</span>
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section id="about" style={{padding:"120px 8%",position:"relative",zIndex:2,overflow:"hidden"}} className="section-pad">
        <div style={{position:"absolute",top:"5%",right:"0%",width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${T.primary}08,transparent 70%)`,filter:"blur(80px)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"10%",left:"-8%",width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle,${T.primary}06,transparent 70%)`,filter:"blur(60px)",pointerEvents:"none"}}/>
        <SecHead tag="About Me" title={<>The Person Behind<br/>The Code</>} sub="A full stack developer who turns complex ideas into clean, scalable software."/>
        <div className="about-grid-inner" style={{display:"grid",gridTemplateColumns:"repeat(12,1fr)",gap:14}}>
          <Reveal d={.04} style={{gridColumn:"span 7"}} className="about-col-7">
            <div style={{background:`linear-gradient(145deg,${T.bg1} 0%,${T.bg2} 100%)`,border:`1px solid ${T.border}`,borderRadius:22,padding:"32px 28px",height:"100%",position:"relative",overflow:"hidden",minHeight:220}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${T.primary}66,transparent)`}}/>
              <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 80% 20%,${T.primary}07,transparent 60%)`,pointerEvents:"none"}}/>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20,flexWrap:"wrap"}}>
                <div style={{width:48,height:48,borderRadius:14,background:`${T.primary}15`,border:`1.5px solid ${T.primary}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,boxShadow:`0 0 20px ${T.primary}22`,animation:"floatY 5s ease-in-out infinite"}}>👩‍💻</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:"clamp(17px,2.5vw,22px)",fontWeight:700,color:T.text,letterSpacing:-.4,lineHeight:1}}>Akalya A.</div>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:T.primary,fontWeight:600,letterSpacing:1.5,textTransform:"uppercase",marginTop:4}}>Full Stack Developer</div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,background:`${T.primary}0c`,border:`1px solid ${T.primary}28`,borderRadius:100,padding:"5px 12px",flexShrink:0}}>
                  <div style={{width:6,height:6,borderRadius:"50%",background:T.primary,animation:"pulse 2s infinite",boxShadow:`0 0 8px ${T.primary}`}}/>
                  <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:T.primary,fontWeight:600,whiteSpace:"nowrap"}}>Open to Work</span>
                </div>
              </div>
              <p className="about-p" style={{fontFamily:"'Outfit',sans-serif",fontSize:14,lineHeight:1.9,color:T.gray,marginBottom:14}}>B.Tech graduate in Information Technology (7.75 CGPA) from KGiSL Institute of Technology. Currently building production systems at <span style={{color:T.primary,fontWeight:600}}>Outdid Unified Private Limited</span> — used by real clients every day.</p>
              <p className="about-p" style={{fontFamily:"'Outfit',sans-serif",fontSize:14,lineHeight:1.9,color:T.gray}}>From enterprise fleet dashboards to EV battery monitors and Flutter mobile apps — I live at the intersection of <span style={{color:T.primary,fontWeight:600}}>performance, clean code, and great UX</span>.</p>
            </div>
          </Reveal>
          <Reveal d={.08} style={{gridColumn:"span 5"}} className="about-col-5">
            <div style={{background:`linear-gradient(145deg,${T.primary}12,${T.primary}06)`,border:`1.5px solid ${T.primary}33`,borderRadius:22,padding:"32px 28px",height:"100%",position:"relative",overflow:"hidden",minHeight:200,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${T.primary},transparent)`}}/>
              <div style={{position:"absolute",bottom:-30,right:-30,width:160,height:160,borderRadius:"50%",background:`${T.primary}08`,border:`1px solid ${T.primary}15`}}/>
              <div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:T.primary,letterSpacing:3,textTransform:"uppercase",fontWeight:700,marginBottom:10}}>Academic Score</div>
                <div className="cgpa-num" style={{fontFamily:"'Clash Display',sans-serif",fontSize:"clamp(54px,8vw,72px)",fontWeight:900,color:T.primary,lineHeight:.9,letterSpacing:-3,textShadow:`0 0 60px ${T.primary}44`}}>7.75</div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:T.gray,letterSpacing:3,textTransform:"uppercase",marginTop:10}}>CGPA</div>
              </div>
              <div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:T.gray,marginBottom:4}}>🏫 KGiSL Institute of Technology</div>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:T.gray}}>📅 June 2021 – May 2025</div>
              </div>
            </div>
          </Reveal>
          <Reveal d={.12} style={{gridColumn:"span 5"}} className="about-col-5">
            <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:22,padding:"26px 24px",height:"100%",position:"relative",overflow:"hidden"}}>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:T.primary,letterSpacing:3,textTransform:"uppercase",fontWeight:700,marginBottom:18}}>Contact Details</div>
              <div className="contact-details-grid" style={{display:"flex",flexDirection:"column",gap:12}}>
                {[["📧","aakalya603@gmail.com"],["📍","Coimbatore, Tamil Nadu"]].map(([ic,v])=>(
                  <div key={v} className="info-card" style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:T.bg,border:`1px solid ${T.border}`,borderRadius:12}}>
                    <span style={{fontSize:18,flexShrink:0}}>{ic}</span>
                    <span style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:T.text,fontWeight:600,wordBreak:"break-all"}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal d={.14} style={{gridColumn:"span 7"}} className="about-col-7">
            <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:22,padding:"26px 28px",height:"100%",position:"relative",overflow:"hidden"}}>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:T.primary,letterSpacing:3,textTransform:"uppercase",fontWeight:700,marginBottom:18}}>Education & Credentials</div>
              <div className="edu-cred-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[["🎓","Degree","B.Tech — Information Technology"],["🏫","Institute","KGiSL Institute of Technology"],["📅","Duration","June 2021 – May 2025"],["⭐","Score","7.75 CGPA"]].map(([ic,label,val])=>(
                  <div key={label} className="info-card" style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:12,padding:"14px 14px",display:"flex",gap:10,alignItems:"flex-start"}}>
                    <div style={{width:34,height:34,borderRadius:10,background:`${T.primary}0e`,border:`1px solid ${T.primary}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{ic}</div>
                    <div style={{minWidth:0}}>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:T.gray,letterSpacing:1.5,textTransform:"uppercase",fontWeight:600,marginBottom:3}}>{label}</div>
                      <div style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:T.text,fontWeight:700,lineHeight:1.35}}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal d={.2} style={{gridColumn:"span 12"}} className="about-col-12">
            <div style={{background:T.bg1,border:`1px solid ${T.border}`,borderRadius:22,padding:"30px 28px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${T.primary}33,transparent)`}}/>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:T.primary,letterSpacing:3,textTransform:"uppercase",fontWeight:700,marginBottom:20}}>What I Do</div>
              <div className="what-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>
                {WHAT_I_DO.map((w)=>(
                  <div key={w.title} className="what-card" style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:14,padding:"20px 18px",position:"relative",overflow:"hidden"}}>
                    <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${T.primary}44,transparent)`}}/>
                    <div className="wi" style={{fontSize:26,marginBottom:10,display:"inline-block",transition:"transform .35s cubic-bezier(.16,1,.3,1)"}}>{w.icon}</div>
                    <h4 style={{fontFamily:"'Clash Display',sans-serif",fontSize:14,fontWeight:700,color:T.text,marginBottom:7,letterSpacing:-.2}}>{w.title}</h4>
                    <p style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:T.gray,lineHeight:1.75}}>{w.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ SKILLS ══ */}
      <section id="skills" style={{padding:"120px 8%",background:T.bg1,position:"relative",zIndex:2}} className="section-pad">
        <SecHead tag="Technical Skills" title="My Tech Stack" sub="Technologies and tools I work with to build reliable, scalable, and user-focused software."/>
        <div className="skills-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:16}}>
          {SKILLS.map((s,i)=>(
            <Reveal key={s.cat} d={i*.07}>
              <TiltCard style={{height:"100%"}}>
                <div className="skill-card" style={{background:`linear-gradient(135deg,${T.bg} 0%,${T.bg2} 100%)`,border:`1px solid ${T.border}`,borderRadius:14,padding:"26px 22px",height:"100%",boxShadow:`inset 0 1px 0 ${T.border}`,position:"relative"}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${s.color}66,transparent)`}}/>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:32,height:32,borderRadius:8,background:`${s.color}12`,border:`1px solid ${s.color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:s.color,flexShrink:0}}>{s.icon}</div>
                      <span style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:T.white,fontWeight:700,letterSpacing:.3}}>{s.cat}</span>
                    </div>
                    <span style={{fontFamily:"'Clash Display',sans-serif",fontSize:14,color:s.color,fontWeight:700,flexShrink:0}}>{s.pct}%</span>
                  </div>
                  <SkillBar pct={s.pct} color={s.color} delay={i*.08}/>
                  <div style={{display:"flex",flexWrap:"wrap",gap:7,marginTop:16}}>
                    {s.items.map(it=>(<span key={it} className="skill-chip" style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:T.gray,background:T.bg2,border:`1px solid ${T.border}`,padding:"4px 11px",borderRadius:6,fontWeight:500}}>{it}</span>))}
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ EXPERIENCE ══ */}
      <section id="experience" style={{padding:"120px 8%",position:"relative",zIndex:2}} className="section-pad">
        <SecHead tag="Work Experience" title="Career Journey" sub="Hands-on experience building production systems across web, mobile, and IoT domains."/>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {EXPERIENCES.map((exp,i)=><ExpCard key={exp.company} exp={exp} idx={i}/>)}
        </div>
      </section>

      {/* ══ PROJECTS ══ */}
      <section id="projects" style={{padding:"120px 8%",background:T.bg1,position:"relative",zIndex:2}} className="section-pad">
        <SecHead tag="Projects" title="Selected Work" sub="A curated set of projects spanning full-stack web, mobile, and data-intensive dashboards."/>
        <div className="proj-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:14}}>
          {PROJECTS.map((p,i)=>(
            <Reveal key={p.name} d={i*.07}>
              <div className="proj-card" data-c="View"
                onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty("--mx",((e.clientX-r.left)/r.width*100)+"%");e.currentTarget.style.setProperty("--my",((e.clientY-r.top)/r.height*100)+"%");}}
                style={{background:p.highlight?`linear-gradient(135deg,${T.bg2},${T.bg})`:T.bg,border:`1px solid ${p.highlight?T.primary+"44":T.border}`,borderRadius:14,padding:"26px 22px",cursor:"none",height:"100%",display:"flex",flexDirection:"column",position:"relative",boxShadow:p.highlight?`0 0 50px ${T.primary}0e,inset 0 1px 0 ${T.primary}15`:"none"}}>
                {p.highlight&&<div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${T.primary},transparent)`,boxShadow:`0 0 20px ${T.primary}88`}}/>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,gap:8}}>
                  <span className="proj-num" style={{fontFamily:"'Clash Display',sans-serif",fontSize:12,color:T.border,fontWeight:700,letterSpacing:2,transition:"color .3s",flexShrink:0}}>{p.num}</span>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
                    <span style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:p.status==="Production"?T.primary:T.gray,background:p.status==="Production"?`${T.primary}14`:T.bg2,border:`1px solid ${p.status==="Production"?T.primary+"30":T.border}`,padding:"3px 10px",borderRadius:100,fontWeight:600,letterSpacing:.8,whiteSpace:"nowrap"}}>{p.status}</span>
                    <span style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:T.gray,background:T.bg2,border:`1px solid ${T.border}`,padding:"3px 10px",borderRadius:100,whiteSpace:"nowrap"}}>{p.type}</span>
                  </div>
                </div>
                <h3 className="proj-title" style={{fontFamily:"'Clash Display',sans-serif",fontSize:"clamp(15px,2vw,19px)",fontWeight:700,color:T.white,marginBottom:10,letterSpacing:-.3,transition:"color .3s"}}>{p.name}</h3>
                <p style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:T.gray,lineHeight:1.8,marginBottom:20,flex:1}}>{p.desc}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {p.tech.map(t=>(<span key={t} className="tech-tag" style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:T.primary,background:`${T.primary}0a`,border:`1px solid ${T.primary}1e`,padding:"3px 9px",borderRadius:6,fontWeight:500}}>{t}</span>))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ ACHIEVEMENTS ══ */}
      <section id="achievements" style={{padding:"120px 8%",position:"relative",zIndex:2}} className="section-pad">
        <SecHead tag="Recognition" title="Achievements & Education" sub="Milestones that shaped my technical foundation and competitive edge."/>
        <div className="ach-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14,marginBottom:20}}>
          {ACHIEVEMENTS.map((a,i)=>(
            <Reveal key={a.title} d={i*.09}>
              <TiltCard style={{height:"100%"}}>
                <div className="ach-card" style={{"--ac":a.color,background:T.bg1,border:`1px solid ${T.border}`,borderRadius:14,padding:"28px 22px",height:"100%",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${a.color}55,transparent)`}}/>
                  <div className="ach-icon" style={{fontSize:32,marginBottom:16,display:"inline-block",animation:`floatY ${3.5+i*.4}s ease-in-out ${i*.3}s infinite`}}>{a.icon}</div>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
                    <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:a.color,fontWeight:700,letterSpacing:1.5}}>{a.org}</span>
                    <span style={{width:3,height:3,borderRadius:"50%",background:T.border,display:"inline-block",flexShrink:0}}/>
                    <span style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:T.gray}}>{a.year}</span>
                  </div>
                  <h3 style={{fontFamily:"'Clash Display',sans-serif",fontSize:"clamp(14px,2vw,17px)",fontWeight:700,color:T.white,marginBottom:10,letterSpacing:-.3}}>{a.title}</h3>
                  <p style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:T.gray,lineHeight:1.78}}>{a.desc}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <Reveal d={.3}>
          <div className="edu-card" style={{background:`linear-gradient(135deg,${T.bg2},${T.bg1})`,border:`1px solid ${T.border}`,borderRadius:16,padding:"28px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:20,position:"relative",overflow:"hidden",animation:"borderPulse 4s ease-in-out infinite"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${T.primary}44,transparent)`}}/>
            <div style={{display:"flex",gap:18,alignItems:"center",flexWrap:"wrap",flex:1,minWidth:0}}>
              <div style={{width:52,height:52,borderRadius:14,background:`${T.primary}12`,border:`1px solid ${T.primary}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,boxShadow:`0 0 24px ${T.primary}22`,animation:"floatY 5s ease-in-out infinite",flexShrink:0}}>🎓</div>
              <div style={{minWidth:0}}>
                <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:T.primary,fontWeight:700,letterSpacing:3,textTransform:"uppercase",marginBottom:6}}>Education</div>
                <h3 style={{fontFamily:"'Clash Display',sans-serif",fontSize:"clamp(15px,2.5vw,22px)",fontWeight:700,color:T.white,marginBottom:5,letterSpacing:-.5}}>Bachelor of Technology — Information Technology</h3>
                <p style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:T.gray}}>KGiSL Institute of Technology, Coimbatore · June 2021 – May 2025</p>
              </div>
            </div>
            <div style={{textAlign:"center",flexShrink:0}}>
              <div style={{fontFamily:"'Clash Display',sans-serif",fontSize:"clamp(44px,6vw,58px)",fontWeight:900,color:T.primary,lineHeight:1,letterSpacing:-3,textShadow:`0 0 40px ${T.primary}77`}}>7.75</div>
              <div style={{fontFamily:"'Outfit',sans-serif",fontSize:10,color:T.gray,letterSpacing:4,textTransform:"uppercase",marginTop:6}}>CGPA</div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ CONTACT ══ */}
      <section id="contact" style={{padding:"120px 8% 140px",background:T.bg1,position:"relative",zIndex:2,overflow:"hidden"}} className="section-pad">
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"min(600px,90vw)",height:"min(600px,90vw)",borderRadius:"50%",background:`radial-gradient(circle,${T.primary}05,transparent 70%)`,pointerEvents:"none"}}/>
        <div style={{maxWidth:760,margin:"0 auto",position:"relative"}}>
          <Reveal>
            <div style={{textAlign:"center",marginBottom:60}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:8,background:`${T.primary}0e`,border:`1px solid ${T.primary}28`,borderRadius:100,padding:"6px 20px",marginBottom:24}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:T.primary,boxShadow:`0 0 8px ${T.primary}`,animation:"pulse 2s infinite"}}/>
                <span style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:T.primary,fontWeight:600,letterSpacing:1.5}}>Open to Work</span>
              </div>
              <h2 style={{fontFamily:"'Clash Display',sans-serif",fontSize:"clamp(36px,7vw,82px)",fontWeight:700,lineHeight:1.0,letterSpacing:-2.5,marginBottom:20}}>
                Let's Build<br/>
                <span className="grad-text">Something Great</span>
              </h2>
              <p style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(14px,1.8vw,16px)",color:T.gray,lineHeight:1.9,maxWidth:520,margin:"0 auto"}}>Looking for full-time roles, internship extensions, and exciting freelance projects. I respond within 24 hours.</p>
            </div>
          </Reveal>
          <Reveal d={.15}>
            <div className="contact-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12,marginBottom:36}}>
              {[["📧","Email","aakalya603@gmail.com","mailto:aakalya603@gmail.com"],["📍","Location","Coimbatore, Tamil Nadu",null]].map(([ic,l,v,href])=>(
                <div key={l} className="contact-card" style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:12,padding:"20px 20px",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${T.primary}33,transparent)`}}/>
                  <div style={{fontFamily:"'Outfit',sans-serif",fontSize:11,color:T.gray,marginBottom:8,letterSpacing:1}}>{ic} {l}</div>
                  {href?<a href={href} data-c={l} style={{fontFamily:"'Outfit',sans-serif",fontSize:14,color:T.primary,fontWeight:700,textDecoration:"none",cursor:"none",wordBreak:"break-all"}}>{v}</a>:<span style={{fontFamily:"'Outfit',sans-serif",fontSize:14,color:T.textDim,fontWeight:700}}>{v}</span>}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal d={.22}>
            <div style={{marginBottom:36}}>
              <ContactForm/>
            </div>
          </Reveal>
          <Reveal d={.32}>
            <div className="contact-socials" style={{display:"flex",justifyContent:"center",gap:10,flexWrap:"wrap"}}>
              {[["GitHub","https://github.com"],["LinkedIn","https://linkedin.com"],["HackerRank","https://hackerrank.com"]].map(([label,href])=>(
                <a key={label} href={href} target="_blank" rel="noopener" className="soc-link" data-c={label}
                  style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:T.gray,border:`1px solid ${T.border}`,padding:"12px 24px",borderRadius:10,textDecoration:"none",cursor:"none",fontWeight:600,letterSpacing:.5,background:T.bg,position:"relative",zIndex:0,textAlign:"center"}}>
                  {label}
                </a>
              ))}
              <a href="mailto:aakalya603@gmail.com" className="cta-a" data-c="Hire"
                style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:"#fff",background:T.primary,border:`1.5px solid ${T.primary}`,padding:"12px 30px",borderRadius:10,textDecoration:"none",cursor:"none",fontWeight:700,letterSpacing:.5,position:"relative",zIndex:0,boxShadow:`0 4px 20px ${T.primary}44`,textAlign:"center"}}>
                Hire Me →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <div className="footer-row" style={{borderTop:`1px solid ${T.border}`,padding:"20px 6%",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,zIndex:2,position:"relative",background:T.bg}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div className="footer-logo" style={{width:26,height:26,borderRadius:"50%",background:`${T.primary}12`,border:`1px solid ${T.primary}44`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 10px ${T.primary}22`,flexShrink:0}}>
            <span style={{fontFamily:"'Clash Display',sans-serif",fontSize:11,color:T.primary,fontWeight:700}}>A</span>
          </div>
          <span style={{fontFamily:"'Outfit',sans-serif",fontSize:13,color:T.gray}}>Akalya A — Full Stack Developer</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:5,height:5,borderRadius:"50%",background:T.primary,boxShadow:`0 0 6px ${T.primary}`,animation:"pulse 2s infinite",flexShrink:0}}/>
          <span style={{fontFamily:"'Outfit',sans-serif",fontSize:12,color:T.gray}}>Built with React · {new Date().getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}