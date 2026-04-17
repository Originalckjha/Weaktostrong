"use strict";(()=>{var l=class{constructor(){this.root=document.documentElement;this.theme={primary:"#7c3aed",accent:"#f59e0b",dark:"#0f0a1e",light:"#f3e8ff",heroGradient:"linear-gradient(135deg, #0f0a1e 0%, #3b0764 55%, #7c3aed 100%)",footerGradient:"linear-gradient(160deg, #0f0a1e 0%, #1e0a3c 40%, #3b0764 100%)"};this.applyTheme()}applyTheme(){let t=this.theme,e={"--color-primary":t.primary,"--color-accent":t.accent,"--color-dark":t.dark,"--color-light":t.light,"--gradient-hero":t.heroGradient,"--gradient-footer":t.footerGradient,"--color-primary-hover":"#6d28d9","--color-accent-hover":"#d97706","--shadow-glow":`0 0 20px ${t.primary}66`};for(let[i,s]of Object.entries(e))this.root.style.setProperty(i,s)}};var c=class{constructor(t,e){this.charIndex=0;this.wordIndex=0;this.deleting=!1;let i=document.querySelector(t);if(!i)throw new Error(`TypingEffect: element not found \u2014 "${t}"`);this.el=i,this.words=e,this.el.classList.add("typing-el"),this.tick()}tick(){let t=this.words[this.wordIndex];this.deleting?this.charIndex--:this.charIndex++,this.el.textContent=t.substring(0,this.charIndex);let e=this.deleting?55:115;!this.deleting&&this.charIndex===t.length?(e=1800,this.deleting=!0):this.deleting&&this.charIndex===0&&(this.deleting=!1,this.wordIndex=(this.wordIndex+1)%this.words.length,e=400),setTimeout(()=>this.tick(),e)}},w=class{constructor(t,e){this.x=Math.random()*t,this.y=Math.random()*e,this.vx=(Math.random()-.5)*.35,this.vy=(Math.random()-.5)*.35,this.radius=Math.random()*1.8+.4,this.alpha=Math.random()*.55+.15}update(t,e){this.x=(this.x+this.vx+t)%t,this.y=(this.y+this.vy+e)%e}draw(t){t.beginPath(),t.arc(this.x,this.y,this.radius,0,Math.PI*2),t.fillStyle=`rgba(200, 160, 255, ${this.alpha})`,t.fill()}},d=class{constructor(t){this.particles=[];this.canvas=document.createElement("canvas"),this.canvas.setAttribute("aria-hidden","true"),Object.assign(this.canvas.style,{position:"absolute",inset:"0",width:"100%",height:"100%",pointerEvents:"none",zIndex:"0"}),t.style.position="relative",t.prepend(this.canvas),Array.from(t.children).forEach(e=>{e!==this.canvas&&(e.style.position="relative",e.style.zIndex="1")}),this.ctx=this.canvas.getContext("2d"),this.resize(),window.addEventListener("resize",()=>this.resize(),{passive:!0}),requestAnimationFrame(()=>this.animate())}resize(){this.canvas.width=this.canvas.offsetWidth,this.canvas.height=this.canvas.offsetHeight;let t=Math.max(30,Math.floor(this.canvas.width*this.canvas.height/1e4));this.particles=Array.from({length:t},()=>new w(this.canvas.width,this.canvas.height))}animate(){let{width:t,height:e}=this.canvas;this.ctx.clearRect(0,0,t,e);for(let i=0;i<this.particles.length;i++){for(let s=i+1;s<this.particles.length;s++){let r=this.particles[i].x-this.particles[s].x,o=this.particles[i].y-this.particles[s].y,a=Math.hypot(r,o);a<90&&(this.ctx.beginPath(),this.ctx.moveTo(this.particles[i].x,this.particles[i].y),this.ctx.lineTo(this.particles[s].x,this.particles[s].y),this.ctx.strokeStyle=`rgba(200, 160, 255, ${.18*(1-a/90)})`,this.ctx.lineWidth=.6,this.ctx.stroke())}this.particles[i].update(t,e),this.particles[i].draw(this.ctx)}requestAnimationFrame(()=>this.animate())}};var h=class{constructor(t,e=60){let i=document.querySelector(t);if(!i)throw new Error(`StickyNav: element not found \u2014 "${t}"`);this.nav=i,this.threshold=e,window.addEventListener("scroll",()=>this.onScroll(),{passive:!0}),this.onScroll()}onScroll(){let t=window.scrollY>this.threshold;this.nav.classList.toggle("nav-scrolled",t)}};var p=class{constructor(t){this.observer=new IntersectionObserver(e=>{e.forEach(i=>{i.isIntersecting&&(i.target.classList.add("revealed"),this.observer.unobserve(i.target))})},{threshold:.12}),document.querySelectorAll(t).forEach(e=>{e.classList.add("reveal-hidden"),this.observer.observe(e)})}},m=class{constructor(){this.btn=document.createElement("button"),this.btn.id="back-to-top",this.btn.setAttribute("aria-label","Back to top"),this.btn.innerHTML="&#8679;",document.body.appendChild(this.btn),this.btn.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"})),window.addEventListener("scroll",()=>this.btn.classList.toggle("visible",window.scrollY>400),{passive:!0})}},v=class{constructor(){this.bar=document.createElement("div"),this.bar.id="scroll-progress",document.body.prepend(this.bar),window.addEventListener("scroll",()=>this.update(),{passive:!0})}update(){let t=window.scrollY,e=document.documentElement.scrollHeight-window.innerHeight,i=e>0?t/e*100:0;this.bar.style.width=`${i}%`}},u=class{constructor(t){let e=new IntersectionObserver(i=>{i.forEach(s=>{if(s.isIntersecting){let r=t.find(o=>o.element===s.target);r&&(this.animateCounter(r),e.unobserve(s.target))}})},{threshold:.5});t.forEach(i=>e.observe(i.element))}animateCounter(t){let i=performance.now(),s=r=>{let o=r-i,a=Math.min(o/t.duration,1),S=1-Math.pow(1-a,3),I=Math.round(0+(t.target-0)*S);t.element.textContent=I.toLocaleString()+t.suffix,a<1&&requestAnimationFrame(s)};requestAnimationFrame(s)}};var f=class{constructor(t){this.timerId=null;let e=document.querySelector(t);if(!e)throw new Error(`LiveClock: element not found \u2014 "${t}"`);this.el=e,this.tick(),this.timerId=setInterval(()=>this.tick(),1e3)}tick(){let t=new Date;this.el.textContent=t.toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:!0})}destroy(){this.timerId!==null&&clearInterval(this.timerId)}},g=class{inject(t){let e=document.createElement("div");e.className="footer-wave-wrapper",e.setAttribute("aria-hidden","true"),e.innerHTML=`
      <svg xmlns="http://www.w3.org/2000/svg"
           viewBox="0 0 1440 80"
           preserveAspectRatio="none"
           class="footer-wave-svg">
        <path
          d="M0,32 C240,72 480,4 720,36 C960,68 1200,8 1440,40 L1440,0 L0,0 Z"
          fill="var(--color-light, #f3e8ff)" />
      </svg>`,t.parentElement?.insertBefore(e,t)}},T=["#ea4335","#25d366","#e1306c","#6e5494","#1877f2"],E=class{constructor(t){document.querySelectorAll(t).forEach((i,s)=>{let r=T[s%T.length];i.style.transition="transform 0.22s ease, filter 0.22s ease",i.style.display="inline-block",i.addEventListener("mouseenter",()=>{i.style.filter=`drop-shadow(0 0 10px ${r})`,i.style.transform="scale(1.25) translateY(-5px)"}),i.addEventListener("mouseleave",()=>{i.style.filter="",i.style.transform=""})})}},b=class{constructor(t){this.angle=160;this.hue=270;this.frameId=0;let e=document.querySelector(t);if(!e)throw new Error(`FooterGradientPulse: element not found \u2014 "${t}"`);this.footer=e,this.frame()}frame(){this.hue=(this.hue+.08)%360,this.angle=(this.angle+.04)%360;let t=Math.round(this.hue),e=Math.round((this.hue+30)%360),i=Math.round((this.hue+55)%360);this.footer.style.background=[`linear-gradient(${Math.round(this.angle)}deg,`,`  hsl(${t}, 72%, 8%) 0%,`,`  hsl(${e}, 68%, 14%) 45%,`,`  hsl(${i}, 60%, 20%) 100%)`].join(""),this.frameId=requestAnimationFrame(()=>this.frame())}destroy(){cancelAnimationFrame(this.frameId)}};function x(n){let t=document.querySelector(n);t&&(t.innerHTML=`&copy; ${new Date().getFullYear()} WEAKTOSTRONG`)}var k={Fingerprint:"\u261D",Face:"\u{1F464}",Card:"\u{1F4B3}",Password:"\u{1F511}"},H={connecting:"Connecting\u2026",connected:"Connected",disconnected:"Disconnected",error:"Connection Error"},M=[{id:"EMP001",name:"Rahul Sharma",dept:"Engineering"},{id:"EMP002",name:"Priya Gupta",dept:"Design"},{id:"EMP003",name:"Vikram Singh",dept:"Marketing"},{id:"EMP004",name:"Anjali Mehta",dept:"HR"},{id:"EMP005",name:"Suresh Patel",dept:"Finance"},{id:"EMP006",name:"Deepa Nair",dept:"Engineering"},{id:"EMP007",name:"Arjun Kumar",dept:"Sales"},{id:"EMP008",name:"Sneha Reddy",dept:"Design"},{id:"EMP009",name:"Manish Joshi",dept:"Operations"},{id:"EMP010",name:"Kavya Iyer",dept:"Marketing"}],L=["Fingerprint","Fingerprint","Fingerprint","Fingerprint","Face","Card","Password"],$=8,C=2500,A=8e3,y=class{constructor(t,e){this.status="connecting";this.checkIns=0;this.checkOuts=0;this.activeSet=new Set;this.secondsSinceLastEvent=0;this.syncTimerId=null;this.eventTimerId=null;let i=document.getElementById(t);if(!i)throw new Error(`BiometricRealtimeFeed: element #${t} not found`);this.root=i,this.buildDOM(e),this.resolveRefs(),this.boot()}buildDOM(t){this.root.innerHTML=`
      <div class="bio-widget">

        <!-- Header -->
        <div class="bio-header">
          <div class="bio-header-left">
            <span class="bio-status-dot" data-ref="statusDot"></span>
            <span class="bio-title">Biometric Live Feed</span>
            <span class="bio-status-badge" data-ref="statusText">Connecting\u2026</span>
          </div>
          <div class="bio-header-right">
            <span class="bio-device-model">${t.model}</span>
            <span class="bio-device-ip">
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                <circle cx="5" cy="5" r="4" fill="none" stroke="currentColor" stroke-width="1.2"/>
                <path d="M5 1 Q6.5 3 6.5 5 Q6.5 7 5 9 Q3.5 7 3.5 5 Q3.5 3 5 1Z"
                      fill="none" stroke="currentColor" stroke-width="1"/>
                <line x1="1.2" y1="5" x2="8.8" y2="5" stroke="currentColor" stroke-width="1"/>
              </svg>
              ${t.ip}
            </span>
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="bio-stats-bar">
          <div class="bio-stat-item">
            <span class="bio-stat-num" data-ref="checkInCount">\u2014</span>
            <span class="bio-stat-lbl">Check-ins</span>
          </div>
          <div class="bio-stat-divider"></div>
          <div class="bio-stat-item">
            <span class="bio-stat-num" data-ref="checkOutCount">\u2014</span>
            <span class="bio-stat-lbl">Check-outs</span>
          </div>
          <div class="bio-stat-divider"></div>
          <div class="bio-stat-item">
            <span class="bio-stat-num" data-ref="activeCount">\u2014</span>
            <span class="bio-stat-lbl">On premises</span>
          </div>
          <div class="bio-stat-divider"></div>
          <div class="bio-stat-item">
            <span class="bio-stat-num" data-ref="lastEvent">\u2014</span>
            <span class="bio-stat-lbl">Last event</span>
          </div>
        </div>

        <!-- Column Headers -->
        <div class="bio-col-headers">
          <span>Time</span>
          <span>Employee</span>
          <span>ID</span>
          <span>Dept</span>
          <span>Method</span>
          <span>Status</span>
        </div>

        <!-- Live Event List -->
        <div class="bio-feed" role="log" aria-live="polite" aria-label="Biometric events">
          <div class="bio-event-list" data-ref="eventList">
            <!-- Placeholder shown before connection -->
            <div class="bio-placeholder">
              <div class="bio-spinner"></div>
              <p>Establishing connection to device\u2026</p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bio-widget-footer">
          <span class="bio-fw-info">S/N ${t.serial} &nbsp;\xB7&nbsp; FW ${t.firmware}</span>
          <span class="bio-realtime-pill">
            <span class="bio-pulse"></span>REALTIME
          </span>
        </div>

      </div>`}resolveRefs(){let t=e=>{let i=this.root.querySelector(`[data-ref="${e}"]`);if(!i)throw new Error(`BiometricRealtimeFeed: ref "${e}" missing`);return i};this.statusDotEl=t("statusDot"),this.statusTextEl=t("statusText"),this.eventListEl=t("eventList"),this.checkInCountEl=t("checkInCount"),this.checkOutCountEl=t("checkOutCount"),this.activeCountEl=t("activeCount"),this.lastEventEl=t("lastEvent")}boot(){this.setStatus("connecting"),setTimeout(()=>{this.checkIns=12+Math.floor(Math.random()*8),this.checkOuts=4+Math.floor(Math.random()*4),M.slice(0,this.checkIns-this.checkOuts).forEach(t=>this.activeSet.add(t.id)),this.flushStats(),this.eventListEl.innerHTML="",this.setStatus("connected"),this.startSyncClock(),this.scheduleNextEvent()},1600)}setStatus(t){this.status=t,this.statusDotEl.className=`bio-status-dot bio-status-${t}`,this.statusTextEl.textContent=H[t]}flushStats(){this.checkInCountEl.textContent=String(this.checkIns),this.checkOutCountEl.textContent=String(this.checkOuts),this.activeCountEl.textContent=String(this.activeSet.size)}scheduleNextEvent(){let t=C+Math.random()*(A-C);this.eventTimerId=setTimeout(()=>{this.status==="connected"&&this.emitEvent(),this.scheduleNextEvent()},t)}emitEvent(){let t=M[Math.floor(Math.random()*M.length)],i=this.activeSet.has(t.id)?Math.random()>.25?"OUT":"IN":Math.random()>.15?"IN":"OUT",s={uid:Math.random().toString(36).slice(2,9),employeeId:t.id,name:t.name,dept:t.dept,timestamp:new Date,direction:i,method:L[Math.floor(Math.random()*L.length)],verified:Math.random()>.04};s.verified&&(i==="IN"?this.activeSet.add(t.id):this.activeSet.delete(t.id)),s.verified&&(i==="IN"?this.checkIns++:this.checkOuts++),this.secondsSinceLastEvent=0,this.lastEventEl.textContent="just now",this.flushStats(),this.renderRow(s)}renderRow(t){let e=document.createElement("div");e.className=`bio-row bio-row-enter ${t.verified?"":"bio-row-denied"}`;let i=t.timestamp.getHours().toString().padStart(2,"0"),s=t.timestamp.getMinutes().toString().padStart(2,"0"),r=t.timestamp.getSeconds().toString().padStart(2,"0");for(e.innerHTML=`
      <span class="bio-cell bio-cell-time">${i}:${s}:${r}</span>
      <span class="bio-cell bio-cell-name">${t.name}</span>
      <span class="bio-cell bio-cell-id">${t.employeeId}</span>
      <span class="bio-cell bio-cell-dept">${t.dept}</span>
      <span class="bio-cell bio-cell-method" title="${t.method}">${k[t.method]} <small>${t.method}</small></span>
      <span class="bio-cell bio-cell-status">
        <span class="bio-dir-badge bio-dir-${t.direction.toLowerCase()}">${t.direction}</span>
        <span class="bio-verify-icon">${t.verified?"\u2713":"\u2717"}</span>
      </span>`,this.eventListEl.prepend(e);this.eventListEl.children.length>$;)this.eventListEl.removeChild(this.eventListEl.lastChild);requestAnimationFrame(()=>setTimeout(()=>e.classList.remove("bio-row-enter"),500))}startSyncClock(){this.syncTimerId=setInterval(()=>{this.secondsSinceLastEvent++;let t=this.secondsSinceLastEvent;t<2?this.lastEventEl.textContent="just now":t<60?this.lastEventEl.textContent=`${t}s ago`:this.lastEventEl.textContent=`${Math.floor(t/60)}m ago`},1e3)}destroy(){this.syncTimerId!==null&&clearInterval(this.syncTimerId),this.eventTimerId!==null&&clearTimeout(this.eventTimerId)}};document.addEventListener("DOMContentLoaded",()=>{new l,new v,new h("nav.navbar");let n=document.querySelector(".s1");n&&new d(n),document.querySelector("#hero-title")&&new c("#hero-title",["Weaktostrong","Web Design","Content Writing","Advertising","Your Growth"]),new p(".reveal"),new m;let e=document.querySelectorAll("[data-counter]"),i=Array.from(e).map(r=>({element:r,target:parseInt(r.dataset.counter??"0",10),duration:1800,suffix:r.dataset.suffix??""}));i.length>0&&new u(i);let s=document.querySelector("footer");s&&(new g().inject(s),new b("footer")),new f("#footer-clock"),new E(".social-icons a"),x("#copyright"),document.getElementById("biometric-feed")&&new y("biometric-feed",{model:"ZKTeco N9",ip:"192.168.1.201",serial:"BKF2309140042",firmware:"Ver 6.60 Apr 12 2023"})});})();
