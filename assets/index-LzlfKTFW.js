(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))l(o);new MutationObserver(o=>{for(const c of o)if(c.type==="childList")for(const i of c.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&l(i)}).observe(document,{childList:!0,subtree:!0});function s(o){const c={};return o.integrity&&(c.integrity=o.integrity),o.referrerPolicy&&(c.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?c.credentials="include":o.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function l(o){if(o.ep)return;o.ep=!0;const c=s(o);fetch(o.href,c)}})();function Le(e){switch(e.screen){case"home":return"#/";case"select":return"#/select";case"play":return`#/play/${e.levelId}`}}function $e(e){const t=e.replace(/^#/,"");if(t==="/select")return{screen:"select"};const s=/^\/play\/([\w-]+)$/.exec(t);return s?{screen:"play",levelId:s[1]}:{screen:"home"}}class xe{handler=()=>this.emit();listeners=[];get current(){return $e(window.location.hash)}onChange(t){this.listeners.push(t)}emit(){const t=this.current;for(const s of this.listeners)s(t)}start(){window.addEventListener("hashchange",this.handler),this.emit()}go(t){const s=Le(t);window.location.hash===s?this.emit():window.location.hash=s}stop(){window.removeEventListener("hashchange",this.handler)}}const Ae=[{name:"はしの えらび",trick:"大きい方の端を取るのが正解とは限らない。取ったあと相手に何が残るかを読む",levels:[{id:"1-1",cards:[3,1,1,2,5,2],best:4},{id:"1-2",cards:[2,5,3,8,7,2],best:3},{id:"1-3",cards:[3,8,5,1,4,2,2],best:1},{id:"1-4",cards:[2,7,9,1,2,8,5],best:2}]},{name:"マイナスの わな",trick:"マイナスのカードを相手に取らせる。端に出てきたら、押しつける順番を読む",levels:[{id:"2-1",cards:[4,7,1,-4,-4,-2,4],best:4},{id:"2-2",cards:[1,9,3,-6,-3,2,8],best:2},{id:"2-3",cards:[-5,2,1,2,1,1,-3,-5],best:6},{id:"2-4",cards:[4,9,-3,3,1,-2,8,4],best:4}]},{name:"ながい よみ",trick:"10 枚前後。3 手先より深く読まないと、唯一の勝ち筋を外す",levels:[{id:"3-1",cards:[1,9,2,-5,-1,2,3,2,7],best:4},{id:"3-2",cards:[1,2,6,9,-2,-5,1,2,8],best:6},{id:"3-3",cards:[-1,-3,-2,8,6,9,8,1,7,2],best:3},{id:"3-4",cards:[-3,2,-1,-5,2,6,1,1,9,1],best:3}]}],ie=Ae.map((e,t)=>({id:`W${t+1}`,name:e.name,trick:e.trick,levels:e.levels})),p=ie.flatMap(e=>e.levels),Te=e=>p.find(t=>t.id===e),Ee=e=>{const t=p.findIndex(s=>s.id===e);return t>=0&&t+1<p.length?p[t+1].id:null},R="torikko:v1",B=new Map,M={get(e){try{return window.localStorage.getItem(e)}catch{return B.get(e)??null}},set(e,t){try{window.localStorage.setItem(e,t)}catch{B.set(e,t)}},del(e){try{window.localStorage.removeItem(e)}catch{B.delete(e)}}};class Se{data={};constructor(){try{const t=M.get(R),s=t?JSON.parse(t):{};s&&typeof s=="object"&&(this.data=s)}catch{this.data={}}}save(){M.set(R,JSON.stringify(this.data))}stars(t){return this.data[t]?.stars??0}best(t){return this.data[t]?.taps??null}isCleared(t){return this.stars(t)>0}isUnlocked(t){const s=p.findIndex(l=>l.id===t);return s<0?!1:s===0||this.isCleared(p[s-1].id)}record(t,s,l){const o=this.data[t];this.data[t]={stars:o&&o.stars>s?o.stars:s,taps:o&&o.taps>l?o.taps:l},this.save()}total(){return p.reduce((t,s)=>t+this.stars(s.id),0)}worldStars(t){return t.reduce((s,l)=>s+this.stars(l),0)}firstUncleared(){return(p.find(t=>!this.isCleared(t.id))??p[p.length-1]).id}unlockAll(){for(const t of p)this.isCleared(t.id)||this.record(t.id,2,1)}clear(){this.data={},M.del(R)}}const de={sfx(){return M.get("torikko:sfx")!=="0"},setSfx(e){M.set("torikko:sfx",e?"1":"0")}},ne=e=>({cards:e,l:0,r:e.length-1,owner:e.map(()=>-1),score:[0,0],turn:0}),g=e=>e.l>e.r;function oe(e,t){if(g(e))return e;const s=t===0?e.l:e.r,l=e.owner.slice();l[s]=e.turn;const o=[e.score[0],e.score[1]];return o[e.turn]+=e.cards[s],{cards:e.cards,l:t===0?e.l+1:e.l,r:t===1?e.r-1:e.r,owner:l,score:o,turn:e.turn===0?1:0}}function ue(e){e.length;const t=new Map,s=(l,o)=>{if(l>o)return 0;const c=l*64+o,i=t.get(c);if(i!==void 0)return i;const n=Math.max(e[l]-s(l+1,o),e[o]-s(l,o-1));return t.set(c,n),n};return s}function ae(e){const t=ue(e.cards),s=e.cards[e.l]-t(e.l+1,e.r);return e.cards[e.r]-t(e.l,e.r-1)>s?1:0}function Ce(e){const t=ue(e.cards);return e.l===e.r?[e.cards[e.l],e.cards[e.l]]:[e.cards[e.l]-t(e.l+1,e.r),e.cards[e.r]-t(e.l,e.r-1)]}const Me=(e,t)=>e>=t?3:e>0?2:0,N=e=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`,qe=()=>N('<path d="M9 14 L4 9 l5 -5" /><path d="M4 9 h11 a5 5 0 0 1 0 10 h-4" />'),Ue=()=>N('<path d="M21 12 a9 9 0 1 1 -3 -6.7" /><path d="M21 3 v6 h-6" />'),Ie=()=>N('<path d="M9 18 h6" /><path d="M10 22 h4" /><path d="M12 2 a7 7 0 0 0 -4 12.7 V18 h8 v-3.3 A7 7 0 0 0 12 2 Z" />'),G=e=>`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.4" fill="var(--accent)" />${e}</svg>`,he=()=>G('<path d="M13.6 7.8 L9.4 12 l4.2 4.2" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" />'),Oe=()=>G('<path d="M9.5 9.3 a2.6 2.6 0 1 1 3.2 2.9 v1.5" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" /><circle cx="12.6" cy="16.6" r="1.25" fill="#fff" />'),pe=()=>G('<path fill="#fff" d="M10.65 7.29 L10.86 5.19 A6.9 6.9 0 0 1 13.14 5.19 L13.35 7.29 A4.9 4.9 0 0 1 14.38 7.71 L16.01 6.38 A6.9 6.9 0 0 1 17.62 7.99 L16.29 9.62 A4.9 4.9 0 0 1 16.71 10.65 L18.81 10.86 A6.9 6.9 0 0 1 18.81 13.14 L16.71 13.35 A4.9 4.9 0 0 1 16.29 14.38 L17.62 16.01 A6.9 6.9 0 0 1 16.01 17.62 L14.38 16.29 A4.9 4.9 0 0 1 13.35 16.71 L13.14 18.81 A6.9 6.9 0 0 1 10.86 18.81 L10.65 16.71 A4.9 4.9 0 0 1 9.62 16.29 L7.99 17.62 A6.9 6.9 0 0 1 6.38 16.01 L7.71 14.38 A4.9 4.9 0 0 1 7.29 13.35 L5.19 13.14 A6.9 6.9 0 0 1 5.19 10.86 L7.29 10.65 A4.9 4.9 0 0 1 7.71 9.62 L6.38 7.99 A6.9 6.9 0 0 1 7.99 6.38 L9.62 7.71 A4.9 4.9 0 0 1 10.65 7.29 Z" /><circle cx="12" cy="12" r="2.1" fill="var(--accent)" />');let m=null,q=null;const fe=typeof location<"u"&&new URLSearchParams(location.search).has("mute");let K=!fe&&de.sfx();const ce=()=>K;function Pe(e){K=e&&!fe,de.setSfx(e)}function He(){if(!K)return null;try{if(!m){m=new AudioContext;const e=m.createDynamicsCompressor();e.threshold.value=-16,e.knee.value=20,e.ratio.value=6,e.attack.value=.003,e.release.value=.15,q=m.createGain(),q.gain.value=.85,q.connect(e).connect(m.destination)}return m.state==="suspended"&&m.resume(),m}catch{return null}}const re={},V=(e,t)=>{const s=performance.now();return s-(re[e]??-1e9)<t?!1:(re[e]=s,!0)};function v(e,t,s,l,o=0,c,i=0){const n=He();if(!n||!q)return;const d=n.currentTime+o,u=n.createOscillator(),h=n.createGain();if(u.type=s,u.frequency.setValueAtTime(e,d),c&&u.frequency.exponentialRampToValueAtTime(Math.max(30,c),d+t),h.gain.setValueAtTime(1e-4,d),h.gain.exponentialRampToValueAtTime(l,d+.008),h.gain.exponentialRampToValueAtTime(1e-4,d+t),i){const b=n.createBiquadFilter();b.type="lowpass",b.frequency.value=i,u.connect(b).connect(h)}else u.connect(h);h.connect(q),u.start(d),u.stop(d+t+.03)}const le=[523.25,587.33,659.25,783.99,880,1046.5,1174.66,1318.5,1567.98,1760],j=e=>{try{navigator.vibrate?.(e)}catch{}},L={take(e,t){if(!V("take"+(t?"c":"p"),40))return;if(e<0){v(t?150:190,.16,"sawtooth",.07,0,(t?150:190)*.7,700),j(10);return}const s=le[Math.min(Math.max(e-1,0),le.length-1)]*(t?.5:1);v(s,.2,t?"sine":"triangle",t?.12:.14,0,0,3400),v(s*2,.1,"sine",.03,.015),t||j(7)},undo(){V("undo",60)&&v(420,.08,"sine",.07,0,300)},nope(){V("nope",120)&&v(170,.09,"triangle",.09,0,130,700)},lose(){[392,330,262].forEach((e,t)=>v(e,.3,"triangle",.09,t*.14,0,1800))},clear(){[523.25,659.25,783.99,1046.5].forEach((e,t)=>{v(e,.34,"triangle",.11,t*.1,0,3400),v(e*2,.2,"sine",.03,t*.1+.02)}),v(1318.5,.6,"sine",.05,.42),j(60)}};function W(e,t){const s=document.createElement("div");s.className="overlay",s.innerHTML=`<div class="sheet">${e}</div>`,document.body.appendChild(s);const l=()=>{s.remove(),document.removeEventListener("keydown",o)},o=c=>{c.key==="Escape"&&l()};document.addEventListener("keydown",o),s.addEventListener("click",c=>{const i=c.target;(i===s||i.closest(".sheet-close"))&&l()}),t?.(s,l)}function Re(){W(`<h2 class="sheet-title">遊びかた</h2>
     <ul class="help-list">
       <li>カードが 1 列に ならぶ。あなたと CPU が かわりばんこに、上か 下の「はしっこ」を 1 まい とる。</li>
       <li>盤の 上半分を タップ = 上を とる。下半分を タップ = 下を とる。</li>
       <li>とった カードの 数字が 点数。ぜんぶ とって、CPU より 多ければ かち。</li>
       <li>マイナスの カードは とると 減る。でも 端に あれば、いつか だれかが とらされる。</li>
       <li>CPU は いつも いちばん いい 手を えらぶ。さいぜんの さを だせたら ★3。</li>
     </ul>
     <button class="sheet-btn sheet-close" type="button">とじる</button>`)}function be(){W(`<h2 class="sheet-title">設定</h2>
     <div class="sheet-row static">
       <span>効果音</span>
       <button class="switch mute-toggle" type="button" role="switch" aria-checked="${ce()}" aria-label="効果音の入切"></button>
     </div>
     <button class="sheet-btn sheet-close" type="button">とじる</button>`,e=>{const t=e.querySelector(".mute-toggle");t.addEventListener("click",()=>{const s=!ce();Pe(s),t.setAttribute("aria-checked",String(s)),s&&L.take(5,!1)})})}function Be(e,t){W(`<h2 class="sheet-title">テストツール</h2>
     <p class="dev-note">本番では使わない、動作確認用のボタンです。</p>
     <button class="sheet-row unlock-all" type="button">全ステージ開放</button>
     <button class="sheet-row danger clear-all" type="button">きろくを ぜんぶ けす</button>
     <p class="dev-status"></p>
     <button class="sheet-link sheet-close" type="button">とじる</button>`,s=>{const l=s.querySelector(".dev-status");s.querySelector(".unlock-all").addEventListener("click",()=>{e.unlockAll(),l.textContent="全ステージを開放しました。",t()}),s.querySelector(".clear-all").addEventListener("click",()=>{window.confirm("きろくを ぜんぶ けしますか？")&&(e.clear(),l.textContent="きろくを消しました。",t())})})}const Ve=520;function je(e,t,s){const l=Te(t);if(!l)return s.go({screen:"home"}),()=>{};const o=l,c=o.cards.length,i=Ee(o.id);let n=ne(o.cards);const d=[];let u=!1,h=0,b=0,$=0,I=0,O=!1,x=!1,F="";for(let a=0;a<c;a++)F+=`<div class="tile" data-i="${a}"><b${o.cards[a]<0?' class="neg"':""}>${o.cards[a]}</b></div>`;e.innerHTML=`
    <div class="app app-game game-screen">
      <header class="header">
        <div class="header-row">
          <div class="header-left"><button class="icon-btn back-btn" type="button" aria-label="もどる">${he()}</button></div>
          <h1 class="title">${o.id}</h1>
          <div class="header-actions">
            <button class="icon-btn help-btn" type="button" aria-label="遊びかた">${Oe()}</button>
            <button class="icon-btn settings-btn" type="button" aria-label="設定">${pe()}</button>
          </div>
        </div>
        <div class="status-bar">
          <span class="stat me"><span class="stat-label">あなた</span><span class="stat-num score0">0</span></span>
          <span class="stat cpu"><span class="stat-label">CPU</span><span class="stat-num score1">0</span></span>
        </div>
      </header>
      <div class="board-wrap">
        <div class="board" style="--n:${c}">
          ${F}
          <div class="toast" hidden></div>
        </div>
      </div>
      <footer class="footer">
        <button class="tool undo-btn" type="button" aria-label="もどす" disabled>${qe()}</button>
        <button class="tool retry-btn" type="button" aria-label="やりなおし">${Ue()}</button>
        <button class="tool hint-btn" type="button" aria-label="ヒント">${Ie()}</button>
      </footer>
      <div class="overlay game-message" hidden>
        <div class="sheet message-card">
          <p class="message-title"></p>
          <div class="stars"></div>
          <p class="message-moves"></p>
          <div class="message-buttons">
            <button class="sheet-btn next-btn" type="button">つぎへ</button>
            <button class="sheet-btn quiet again-btn" type="button">もういちど</button>
            <button class="sheet-btn quiet select-btn" type="button">ステージせんたく</button>
          </div>
        </div>
      </div>
    </div>`;const f=a=>e.querySelector(a),A=f(".board"),P=f(".toast"),ve=f(".score0"),me=f(".score1"),ge=f(".undo-btn"),T=f(".game-message"),w=Array.from(A.querySelectorAll(".tile"));i||f(".next-btn").setAttribute("hidden","");const U=a=>a>0?`+${a}`:String(a);function y(){for(let a=0;a<c;a++){const r=w[a],k=n.owner[a];r.dataset.owner=String(k);const S=a>=n.l&&a<=n.r,te=S&&a===n.l,se=S&&a===n.r;r.classList.toggle("open",S),r.classList.toggle("end",(te||se)&&!g(n)&&n.turn===0&&!u),r.dataset.end=te?"top":se?"bottom":""}ve.textContent=String(n.score[0]),me.textContent=String(n.score[1]),e.classList.toggle("turn-cpu",n.turn===1&&!g(n)),ge.disabled=d.length===0||u}y();const we=a=>{P.textContent=a,P.hidden=!1,window.clearTimeout($),$=window.setTimeout(()=>P.hidden=!0,1800)};function J(a){const r=w[a];r.classList.remove("taken"),r.offsetWidth,r.classList.add("taken")}function Y(){x=!0;const a=n.score[0]-n.score[1],r=Me(a,o.best);b=window.setTimeout(()=>{O||(f(".message-title").textContent=r>0?"かち!":"まけ…",f(".stars").innerHTML=r>0?[0,1,2].map(k=>`<span class="star${k<r?" on":""}" style="--i:${k}">★</span>`).join(""):"",f(".message-moves").textContent=r===3?`${n.score[0]} 対 ${n.score[1]}（${U(a)}）— さいぜん!`:r===2?`${n.score[0]} 対 ${n.score[1]}（${U(a)}）。さいぜんは ${U(o.best)}`:`${n.score[0]} 対 ${n.score[1]}。はしの えらびかたを かえてみよう`,f(".next-btn").toggleAttribute("hidden",r===0||!i),r>0?(s.store.record(o.id,r,a),L.clear()):L.lose(),T.hidden=!1)},520)}function ye(){u=!0,y(),h=window.setTimeout(()=>{if(O)return;const a=ae(n),r=a===0?n.l:n.r;n=oe(n,a),J(r),L.take(o.cards[r],!0),u=!1,y(),g(n)&&Y()},Ve)}function H(a){if(u||x||!T.hidden||n.turn!==0||g(n))return;E(),d.push(n);const r=a===0?n.l:n.r;n=oe(n,a),J(r),L.take(o.cards[r],!1),y(),g(n)?Y():ye()}function Z(){window.clearTimeout(h),window.clearTimeout(b),n=ne(o.cards),d.length=0,u=!1,x=!1,T.hidden=!0,E(),w.forEach(a=>a.classList.remove("taken")),y()}function _(){!d.length||u||!T.hidden||(n=d.pop(),x=!1,L.undo(),E(),w.forEach(a=>a.classList.remove("taken")),y())}function E(){w.forEach(a=>a.classList.remove("hint")),window.clearTimeout(I)}const ke=()=>{if(u||x||!T.hidden||n.turn!==0||g(n))return;E();const a=ae(n),[r,k]=Ce(n),S=a===0?n.l:n.r;w[S].classList.add("hint"),we(n.l===n.r?"さいごの 1 まい":`${a===0?"上":"下"}を とると、さいごの さが ${U(Math.max(r,k))}`),I=window.setTimeout(E,3e3)},Q=a=>{if(!A.contains(a.target))return;a.preventDefault();const r=A.getBoundingClientRect();H(a.clientY<r.top+r.height/2?0:1)};A.addEventListener("pointerdown",Q);const X=a=>{const r=a.target;r.closest(".back-btn")?s.go({screen:"select"}):r.closest(".help-btn")?Re():r.closest(".settings-btn")?be():r.closest(".undo-btn")?_():r.closest(".retry-btn")?Z():r.closest(".hint-btn")?ke():r.closest(".next-btn")&&i?s.go({screen:"play",levelId:i}):r.closest(".again-btn")?Z():r.closest(".select-btn")&&s.go({screen:"select"})};e.addEventListener("click",X);const ee=a=>{(a.key==="z"||a.key==="Backspace")&&_(),a.key==="ArrowUp"&&H(0),a.key==="ArrowDown"&&H(1)};return window.addEventListener("keydown",ee),()=>{O=!0,window.clearTimeout(h),window.clearTimeout(b),window.clearTimeout($),window.clearTimeout(I),A.removeEventListener("pointerdown",Q),e.removeEventListener("click",X),window.removeEventListener("keydown",ee)}}const De=()=>`
<div class="home-hero" aria-hidden="true">
  <span class="hh t me"><b>9</b></span>
  <span class="hh t"><b>3</b></span>
  <span class="hh t"><b>-4</b></span>
  <span class="hh t"><b>7</b></span>
  <span class="hh t cpu"><b>5</b></span>
</div>`;function Ne(e,t){const{store:s}=t,l=()=>{const c=s.total();e.innerHTML=`
      <div class="app app-home home-screen">
        <div class="home-top">
          <button class="icon-btn settings-btn" type="button" aria-label="設定">${pe()}</button>
        </div>
        <div class="home">
          <div class="home-art">${De()}</div>
          <h1 class="home-title">とりっこ</h1>
          <p class="home-sub">はしっこを とって、CPU に かとう</p>
          <div class="home-buttons">
            <button class="home-btn primary resume-btn" type="button">${c>0?"つづきから":"はじめる"}</button>
            <button class="home-btn select-btn" type="button">ステージを えらぶ</button>
          </div>
          <p class="home-progress">★ ${c} / ${p.length*3}</p>
        </div>
        <button class="dev-pill" type="button">テスト用</button>
      </div>`};l();const o=c=>{const i=c.target;i.closest(".resume-btn")?t.go({screen:"play",levelId:s.firstUncleared()}):i.closest(".select-btn")?t.go({screen:"select"}):i.closest(".settings-btn")?be():i.closest(".dev-pill")&&Be(s,l)};return e.addEventListener("click",o),()=>e.removeEventListener("click",o)}function Ge(e,t){const{store:s}=t,l=ie.map(c=>{const i=c.levels.some(d=>s.isUnlocked(d.id)),n=c.levels.map(d=>{const u=s.isUnlocked(d.id),h=s.stars(d.id),b=d.id.split("-")[1];return`<button class="level-card${u?"":" locked"}${h===3?" perfect":""}" type="button" data-level="${d.id}"${u?"":' aria-disabled="true"'}>
            <span class="level-num">${b}</span>
            <span class="level-stars">${u?[0,1,2].map($=>`<span class="star${$<h?" on":""}">★</span>`).join(""):'<span class="lock">🔒</span>'}</span>
          </button>`}).join("");return`<section class="world">
      <h2 class="world-head"><span class="world-name">${c.id} ${c.name}</span>${i?`<span class="world-stars">★ ${s.worldStars(c.levels.map(d=>d.id))} / ${c.levels.length*3}</span>`:""}</h2>
      <div class="level-grid">${n}</div>
    </section>`}).join("");e.innerHTML=`
    <div class="app select-screen">
      <header class="header">
        <div class="header-row">
          <div class="header-left"><button class="icon-btn back-btn" type="button" aria-label="もどる">${he()}</button></div>
          <h1 class="title">ステージ</h1>
          <div class="header-actions"></div>
        </div>
        <div class="status-bar"><span class="stat"><span class="stat-label">★</span><span class="stat-num">${s.total()}</span><span class="stat-label">/ ${p.length*3}</span></span></div>
      </header>
      <div class="worlds">${l}</div>
    </div>`;const o=c=>{const i=c.target;i.closest(".back-btn")&&t.go({screen:"home"});const n=i.closest(".level-card");n&&!n.classList.contains("locked")&&t.go({screen:"play",levelId:n.dataset.level})};return e.addEventListener("click",o),()=>e.removeEventListener("click",o)}const D=document.querySelector("#app"),Ke=new Se,z=new xe;let C=null;const We=e=>z.go(e);z.onChange(e=>{C?.(),C=null,window.scrollTo(0,0);const t={store:Ke,go:We};e.screen==="home"?C=Ne(D,t):e.screen==="select"?C=Ge(D,t):C=je(D,e.levelId,t)});z.start();
