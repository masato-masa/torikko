(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))c(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&c(l)}).observe(document,{childList:!0,subtree:!0});function s(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function c(n){if(n.ep)return;n.ep=!0;const r=s(n);fetch(n.href,r)}})();function Te(e){switch(e.screen){case"home":return"#/";case"select":return"#/select";case"play":return`#/play/${e.levelId}`}}function Ae(e){const t=e.replace(/^#/,"");if(t==="/select")return{screen:"select"};const s=/^\/play\/([\w-]+)$/.exec(t);return s?{screen:"play",levelId:s[1]}:{screen:"home"}}class Se{handler=()=>this.emit();listeners=[];get current(){return Ae(window.location.hash)}onChange(t){this.listeners.push(t)}emit(){const t=this.current;for(const s of this.listeners)s(t)}start(){window.addEventListener("hashchange",this.handler),this.emit()}go(t){const s=Te(t);window.location.hash===s?this.emit():window.location.hash=s}stop(){window.removeEventListener("hashchange",this.handler)}}const xe=[{name:"はしの えらび",trick:"大きい方の端を取るのが正解とは限らない。取ったあと相手に何が残るかを読む",levels:[{id:"1-1",cards:[3,1,1,2,5,2],best:4},{id:"1-2",cards:[2,5,3,8,7,2],best:3},{id:"1-3",cards:[3,8,5,1,4,2,2],best:1},{id:"1-4",cards:[2,7,9,1,2,8,5],best:2}]},{name:"マイナスの わな",trick:"マイナスのカードを相手に取らせる。端に出てきたら、押しつける順番を読む",levels:[{id:"2-1",cards:[4,7,1,-4,-4,-2,4],best:4},{id:"2-2",cards:[1,9,3,-6,-3,2,8],best:2},{id:"2-3",cards:[-5,2,1,2,1,1,-3,-5],best:6},{id:"2-4",cards:[4,9,-3,3,1,-2,8,4],best:4}]},{name:"ながい よみ",trick:"10 枚前後。3 手先より深く読まないと、唯一の勝ち筋を外す",levels:[{id:"3-1",cards:[1,9,2,-5,-1,2,3,2,7],best:4},{id:"3-2",cards:[1,2,6,9,-2,-5,1,2,8],best:6},{id:"3-3",cards:[-1,-3,-2,8,6,9,8,1,7,2],best:3},{id:"3-4",cards:[-3,2,-1,-5,2,6,1,1,9,1],best:3}]},{name:"ならぶ おなじ かず",trick:"同じ数が並ぶ。どちらの端を取っても同じに見えるが、残りの形が変わる。偶数枚と奇数枚で、最初の端の選びかたが変わる",levels:[{id:"4-1",cards:[-3,-4,-4,2,7,4,5,-2],best:5},{id:"4-2",cards:[3,9,3,3,-5,4,8,-5,3],best:1},{id:"4-3",cards:[-4,6,-3,2,2,-5,4,-2,6,7],best:3},{id:"4-4",cards:[4,1,6,-3,1,3,3,4,-4,-1,1],best:1}]},{name:"おなじ はし",trick:"両端のカードが同じ数。どちらを取っても今は同点なので、取ったあとに残る列を比べて選ぶ",levels:[{id:"5-1",cards:[5,9,4,2,-3,-4,5],best:4},{id:"5-2",cards:[-5,5,5,9,5,4,6,-5],best:2},{id:"5-3",cards:[2,9,-5,3,1,-4,6,-5,2],best:1},{id:"5-4",cards:[4,5,1,5,2,-2,3,1,7,4],best:4}]}],de=xe.map((e,t)=>({id:`W${t+1}`,name:e.name,trick:e.trick,levels:e.levels})),p=de.flatMap(e=>e.levels),Ee=e=>p.find(t=>t.id===e),Ce=e=>{const t=p.findIndex(s=>s.id===e);return t>=0&&t+1<p.length?p[t+1].id:null},V="torikko:v1",j=new Map,w={get(e){try{return window.localStorage.getItem(e)}catch{return j.get(e)??null}},set(e,t){try{window.localStorage.setItem(e,t)}catch{j.set(e,t)}},del(e){try{window.localStorage.removeItem(e)}catch{j.delete(e)}}};class Me{data={};constructor(){try{const t=w.get(V),s=t?JSON.parse(t):{};s&&typeof s=="object"&&(this.data=s)}catch{this.data={}}}save(){w.set(V,JSON.stringify(this.data))}stars(t){return this.data[t]?.stars??0}best(t){return this.data[t]?.taps??null}isCleared(t){return this.stars(t)>0}isUnlocked(t){const s=p.findIndex(c=>c.id===t);return s<0?!1:s===0||this.isCleared(p[s-1].id)}record(t,s,c){const n=this.data[t];this.data[t]={stars:n&&n.stars>s?n.stars:s,taps:n&&n.taps>c?n.taps:c},this.save()}total(){return p.reduce((t,s)=>t+this.stars(s.id),0)}worldStars(t){return t.reduce((s,c)=>s+this.stars(c),0)}firstUncleared(){return(p.find(t=>!this.isCleared(t.id))??p[p.length-1]).id}unlockAll(){for(const t of p)this.isCleared(t.id)||this.record(t.id,2,1)}clear(){this.data={},w.del(V)}}const y={sfx(){return w.get("torikko:sfx")!=="0"},setSfx(e){w.set("torikko:sfx",e?"1":"0")},easy(){return w.get("torikko:easy")==="1"},setEasy(e){w.set("torikko:easy",e?"1":"0")},seenTip(){return w.get("torikko:tip")==="1"},setSeenTip(){w.set("torikko:tip","1")}},ae=e=>({cards:e,l:0,r:e.length-1,owner:e.map(()=>-1),score:[0,0],turn:0}),$=e=>e.l>e.r;function ce(e,t){if($(e))return e;const s=t===0?e.l:e.r,c=e.owner.slice();c[s]=e.turn;const n=[e.score[0],e.score[1]];return n[e.turn]+=e.cards[s],{cards:e.cards,l:t===0?e.l+1:e.l,r:t===1?e.r-1:e.r,owner:c,score:n,turn:e.turn===0?1:0}}function ue(e){e.length;const t=new Map,s=(c,n)=>{if(c>n)return 0;const r=c*64+n,l=t.get(r);if(l!==void 0)return l;const o=Math.max(e[c]-s(c+1,n),e[n]-s(c,n-1));return t.set(r,o),o};return s}function he(e){const t=ue(e.cards),s=e.cards[e.l]-t(e.l+1,e.r);return e.cards[e.r]-t(e.l,e.r-1)>s?1:0}function pe(e){const t=ue(e.cards);return e.l===e.r?[e.cards[e.l],e.cards[e.l]]:[e.cards[e.l]-t(e.l+1,e.r),e.cards[e.r]-t(e.l,e.r-1)]}const qe=(e,t)=>e>=t?3:e>0?2:0,Ie=.6,Ue=6;function Pe(e){let t=2166136261;for(let s=0;s<e.length;s++)t^=e.charCodeAt(s),t=Math.imul(t,16777619);return t^=t>>>15,t=Math.imul(t,739982445),t^=t>>>12,(t>>>0)%1e5/1e5}function Oe(e,t,s){const c=he(e);if(!t||e.l===e.r)return c;const[n,r]=pe(e);return Math.abs(n-r)>Ue?c:Pe(s)<Ie?1-c:c}const G=e=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${e}</svg>`,He=()=>G('<path d="M9 14 L4 9 l5 -5" /><path d="M4 9 h11 a5 5 0 0 1 0 10 h-4" />'),Re=()=>G('<path d="M21 12 a9 9 0 1 1 -3 -6.7" /><path d="M21 3 v6 h-6" />'),Be=()=>G('<path d="M9 18 h6" /><path d="M10 22 h4" /><path d="M12 2 a7 7 0 0 0 -4 12.7 V18 h8 v-3.3 A7 7 0 0 0 12 2 Z" />'),W=e=>`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.4" fill="var(--accent)" />${e}</svg>`,fe=()=>W('<path d="M13.6 7.8 L9.4 12 l4.2 4.2" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" />'),Ve=()=>W('<path d="M9.5 9.3 a2.6 2.6 0 1 1 3.2 2.9 v1.5" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" /><circle cx="12.6" cy="16.6" r="1.25" fill="#fff" />'),be=()=>W('<path fill="#fff" d="M10.65 7.29 L10.86 5.19 A6.9 6.9 0 0 1 13.14 5.19 L13.35 7.29 A4.9 4.9 0 0 1 14.38 7.71 L16.01 6.38 A6.9 6.9 0 0 1 17.62 7.99 L16.29 9.62 A4.9 4.9 0 0 1 16.71 10.65 L18.81 10.86 A6.9 6.9 0 0 1 18.81 13.14 L16.71 13.35 A4.9 4.9 0 0 1 16.29 14.38 L17.62 16.01 A6.9 6.9 0 0 1 16.01 17.62 L14.38 16.29 A4.9 4.9 0 0 1 13.35 16.71 L13.14 18.81 A6.9 6.9 0 0 1 10.86 18.81 L10.65 16.71 A4.9 4.9 0 0 1 9.62 16.29 L7.99 17.62 A6.9 6.9 0 0 1 6.38 16.01 L7.71 14.38 A4.9 4.9 0 0 1 7.29 13.35 L5.19 13.14 A6.9 6.9 0 0 1 5.19 10.86 L7.29 10.65 A4.9 4.9 0 0 1 7.71 9.62 L6.38 7.99 A6.9 6.9 0 0 1 7.99 6.38 L9.62 7.71 A4.9 4.9 0 0 1 10.65 7.29 Z" /><circle cx="12" cy="12" r="2.1" fill="var(--accent)" />');let k=null,P=null;const me=typeof location<"u"&&new URLSearchParams(location.search).has("mute");let Y=!me&&y.sfx();const re=()=>Y;function je(e){Y=e&&!me,y.setSfx(e)}function De(){if(!Y)return null;try{if(!k){k=new AudioContext;const e=k.createDynamicsCompressor();e.threshold.value=-16,e.knee.value=20,e.ratio.value=6,e.attack.value=.003,e.release.value=.15,P=k.createGain(),P.gain.value=.85,P.connect(e).connect(k.destination)}return k.state==="suspended"&&k.resume(),k}catch{return null}}const ie={},D=(e,t)=>{const s=performance.now();return s-(ie[e]??-1e9)<t?!1:(ie[e]=s,!0)};function g(e,t,s,c,n=0,r,l=0){const o=De();if(!o||!P)return;const d=o.currentTime+n,u=o.createOscillator(),h=o.createGain();if(u.type=s,u.frequency.setValueAtTime(e,d),r&&u.frequency.exponentialRampToValueAtTime(Math.max(30,r),d+t),h.gain.setValueAtTime(1e-4,d),h.gain.exponentialRampToValueAtTime(c,d+.008),h.gain.exponentialRampToValueAtTime(1e-4,d+t),l){const m=o.createBiquadFilter();m.type="lowpass",m.frequency.value=l,u.connect(m).connect(h)}else u.connect(h);h.connect(P),u.start(d),u.stop(d+t+.03)}const le=[523.25,587.33,659.25,783.99,880,1046.5,1174.66,1318.5,1567.98,1760],N=e=>{try{navigator.vibrate?.(e)}catch{}},x={take(e,t){if(!D("take"+(t?"c":"p"),40))return;if(e<0){g(t?150:190,.16,"sawtooth",.07,0,(t?150:190)*.7,700),N(10);return}const s=le[Math.min(Math.max(e-1,0),le.length-1)]*(t?.5:1);g(s,.2,t?"sine":"triangle",t?.12:.14,0,0,3400),g(s*2,.1,"sine",.03,.015),t||N(7)},undo(){D("undo",60)&&g(420,.08,"sine",.07,0,300)},nope(){D("nope",120)&&g(170,.09,"triangle",.09,0,130,700)},lose(){[392,330,262].forEach((e,t)=>g(e,.3,"triangle",.09,t*.14,0,1800))},clear(){[523.25,659.25,783.99,1046.5].forEach((e,t)=>{g(e,.34,"triangle",.11,t*.1,0,3400),g(e*2,.2,"sine",.03,t*.1+.02)}),g(1318.5,.6,"sine",.05,.42),N(60)}};function _(e,t){const s=document.createElement("div");s.className="overlay",s.innerHTML=`<div class="sheet">${e}</div>`,document.body.appendChild(s);const c=()=>{s.remove(),document.removeEventListener("keydown",n)},n=r=>{r.key==="Escape"&&c()};document.addEventListener("keydown",n),s.addEventListener("click",r=>{const l=r.target;(l===s||l.closest(".sheet-close"))&&c()}),t?.(s,c)}function Ne(){_(`<h2 class="sheet-title">遊びかた</h2>
     <ul class="help-list">
       <li>カードが 1 列に ならぶ。あなたと CPU が かわりばんこに、上か 下の「はしっこ」を 1 まい とる。</li>
       <li>盤の 上半分を タップ = 上を とる。下半分を タップ = 下を とる。</li>
       <li>とった カードの 数字が 点数。ぜんぶ とって、CPU より 多ければ かち。</li>
       <li>マイナスの カードは とると 減る。でも 端に あれば、いつか だれかが とらされる。</li>
       <li>CPU は いつも いちばん いい 手を えらぶ。さいぜんの さを だせたら ★3。</li>
     </ul>
     <button class="sheet-btn sheet-close" type="button">とじる</button>`)}function ve(){_(`<h2 class="sheet-title">設定</h2>
     <div class="sheet-row static">
       <span>効果音</span>
       <button class="switch mute-toggle" type="button" role="switch" aria-checked="${re()}" aria-label="効果音の入切"></button>
     </div>
     <div class="sheet-row static">
       <span>やさしいモード<small class="row-note">CPU が たまに まちがえる（★は 2 まで）</small></span>
       <button class="switch easy-toggle" type="button" role="switch" aria-checked="${y.easy()}" aria-label="やさしいモードの入切"></button>
     </div>
     <button class="sheet-btn sheet-close" type="button">とじる</button>`,e=>{const t=e.querySelector(".mute-toggle");t.addEventListener("click",()=>{const c=!re();je(c),t.setAttribute("aria-checked",String(c)),c&&x.take(5,!1)});const s=e.querySelector(".easy-toggle");s.addEventListener("click",()=>{const c=!y.easy();y.setEasy(c),s.setAttribute("aria-checked",String(c))})})}function Ke(e,t){_(`<h2 class="sheet-title">テストツール</h2>
     <p class="dev-note">本番では使わない、動作確認用のボタンです。</p>
     <button class="sheet-row unlock-all" type="button">全ステージ開放</button>
     <button class="sheet-row danger clear-all" type="button">きろくを ぜんぶ けす</button>
     <p class="dev-status"></p>
     <button class="sheet-link sheet-close" type="button">とじる</button>`,s=>{const c=s.querySelector(".dev-status");s.querySelector(".unlock-all").addEventListener("click",()=>{e.unlockAll(),c.textContent="全ステージを開放しました。",t()}),s.querySelector(".clear-all").addEventListener("click",()=>{window.confirm("きろくを ぜんぶ けしますか？")&&(e.clear(),c.textContent="きろくを消しました。",t())})})}const Ge=520;function We(e,t,s){const c=Ee(t);if(!c)return s.go({screen:"home"}),()=>{};const n=c,r=n.cards.length,l=Ce(n.id);let o=ae(n.cards);const d=[];let u=!1,h=0,m=0,T=0,O=0,H=!1,E=!1;const R=y.easy();let F="";for(let a=0;a<r;a++)F+=`<div class="tile" data-i="${a}"><b${n.cards[a]<0?' class="neg"':""}>${n.cards[a]}</b></div>`;e.innerHTML=`
    <div class="app app-game game-screen">
      <header class="header">
        <div class="header-row">
          <div class="header-left"><button class="icon-btn back-btn" type="button" aria-label="もどる">${fe()}</button></div>
          <h1 class="title">${n.id}</h1>
          <div class="header-actions">
            <button class="icon-btn help-btn" type="button" aria-label="遊びかた">${Ve()}</button>
            <button class="icon-btn settings-btn" type="button" aria-label="設定">${be()}</button>
          </div>
        </div>
        <div class="status-bar">
          <span class="stat me"><span class="stat-label">あなた</span><span class="stat-num score0">0</span></span>
          <span class="stat cpu"><span class="stat-label">CPU</span><span class="stat-num score1">0</span></span>
        </div>
      </header>
      <div class="board-wrap">
        <div class="board" style="--n:${r}">
          ${F}
          <div class="toast" hidden></div>
        </div>
      </div>
      <footer class="footer">
        <button class="tool undo-btn" type="button" aria-label="もどす" disabled>${He()}</button>
        <button class="tool retry-btn" type="button" aria-label="やりなおし">${Re()}</button>
        <button class="tool hint-btn" type="button" aria-label="ヒント">${Be()}</button>
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
    </div>`;const b=a=>e.querySelector(a),C=b(".board"),L=b(".toast"),ge=b(".score0"),we=b(".score1"),ye=b(".undo-btn"),M=b(".game-message"),A=Array.from(C.querySelectorAll(".tile"));l||b(".next-btn").setAttribute("hidden",""),y.seenTip()||(L.textContent="上の半分を タップ = 上を とる。下の半分 = 下を とる",L.hidden=!1,T=window.setTimeout(()=>L.hidden=!0,5e3));const J=a=>a>0?`+${a}`:String(a);function S(){for(let a=0;a<r;a++){const i=A[a],f=o.owner[a];i.dataset.owner=String(f);const v=a>=o.l&&a<=o.r,I=v&&a===o.l,oe=v&&a===o.r;i.classList.toggle("open",v),i.classList.toggle("end",(I||oe)&&!$(o)&&o.turn===0&&!u),i.dataset.end=I?"top":oe?"bottom":""}ge.textContent=String(o.score[0]),we.textContent=String(o.score[1]),e.classList.toggle("turn-cpu",o.turn===1&&!$(o)),ye.disabled=d.length===0||u}S();const ke=a=>{L.textContent=a,L.hidden=!1,window.clearTimeout(T),T=window.setTimeout(()=>L.hidden=!0,1800)};function Z(a){const i=A[a];i.classList.remove("taken"),i.offsetWidth,i.classList.add("taken")}function Q(){E=!0;const a=o.score[0]-o.score[1],i=qe(a,n.best),f=R&&i===3?2:i;m=window.setTimeout(()=>{if(H)return;b(".message-title").textContent=f>0?"かち!":"まけ…",b(".stars").innerHTML=f>0?[0,1,2].map(I=>`<span class="star${I<f?" on":""}" style="--i:${I}">★</span>`).join(""):"";const v=`${o.score[0]} 対 ${o.score[1]}（${J(a)}）`;b(".message-moves").textContent=f===3?`${v} — さいぜん!`:f===2?R?`${v}。やさしいモードは ★2 まで`:`${v} ・ あと ${n.best-a} 点で ★3`:`${o.score[0]} 対 ${o.score[1]}。はしの えらびかたを かえてみよう`,b(".next-btn").toggleAttribute("hidden",f===0||!l),f>0?(s.store.record(n.id,f,a),x.clear()):x.lose(),M.hidden=!1},520)}function Le(){u=!0,S(),h=window.setTimeout(()=>{if(H)return;const a=Oe(o,R,`${n.id}:${o.l}:${o.r}`),i=a===0?o.l:o.r;o=ce(o,a),Z(i),x.take(n.cards[i],!0),u=!1,S(),$(o)&&Q()},Ge)}function B(a){if(u||E||!M.hidden||o.turn!==0||$(o))return;q(),y.seenTip()||(y.setSeenTip(),L.hidden=!0),d.push(o);const i=a===0?o.l:o.r;o=ce(o,a),Z(i),x.take(n.cards[i],!1),S(),$(o)?Q():Le()}function X(){window.clearTimeout(h),window.clearTimeout(m),o=ae(n.cards),d.length=0,u=!1,E=!1,M.hidden=!0,q(),A.forEach(a=>a.classList.remove("taken")),S()}function ee(){!d.length||u||!M.hidden||(o=d.pop(),E=!1,x.undo(),q(),A.forEach(a=>a.classList.remove("taken")),S())}function q(){A.forEach(a=>a.classList.remove("hint")),window.clearTimeout(O)}const $e=()=>{if(u||E||!M.hidden||o.turn!==0||$(o))return;q();const a=he(o),[i,f]=pe(o),v=a===0?o.l:o.r;A[v].classList.add("hint"),ke(o.l===o.r?"さいごの 1 まい":`${a===0?"上":"下"}を とると、さいごの さが ${J(Math.max(i,f))}`),O=window.setTimeout(q,3e3)},te=a=>{if(!C.contains(a.target))return;a.preventDefault();const i=C.getBoundingClientRect();B(a.clientY<i.top+i.height/2?0:1)};C.addEventListener("pointerdown",te);const se=a=>{const i=a.target;i.closest(".back-btn")?s.go({screen:"select"}):i.closest(".help-btn")?Ne():i.closest(".settings-btn")?ve():i.closest(".undo-btn")?ee():i.closest(".retry-btn")?X():i.closest(".hint-btn")?$e():i.closest(".next-btn")&&l?s.go({screen:"play",levelId:l}):i.closest(".again-btn")?X():i.closest(".select-btn")&&s.go({screen:"select"})};e.addEventListener("click",se);const ne=a=>{(a.key==="z"||a.key==="Backspace")&&ee(),a.key==="ArrowUp"&&B(0),a.key==="ArrowDown"&&B(1)};return window.addEventListener("keydown",ne),()=>{H=!0,window.clearTimeout(h),window.clearTimeout(m),window.clearTimeout(T),window.clearTimeout(O),C.removeEventListener("pointerdown",te),e.removeEventListener("click",se),window.removeEventListener("keydown",ne)}}const Ye=()=>`
<div class="home-hero" aria-hidden="true">
  <span class="hh t me"><b>9</b></span>
  <span class="hh t"><b>3</b></span>
  <span class="hh t"><b>-4</b></span>
  <span class="hh t"><b>7</b></span>
  <span class="hh t cpu"><b>5</b></span>
</div>`;function _e(e,t){const{store:s}=t,c=()=>{const r=s.total();e.innerHTML=`
      <div class="app app-home home-screen">
        <div class="home-top">
          <button class="icon-btn settings-btn" type="button" aria-label="設定">${be()}</button>
        </div>
        <div class="home">
          <div class="home-art">${Ye()}</div>
          <h1 class="home-title">とりっこ</h1>
          <p class="home-sub">はしっこを とって、CPU に かとう</p>
          <div class="home-buttons">
            <button class="home-btn primary resume-btn" type="button">${r>0?"つづきから":"はじめる"}</button>
            <button class="home-btn select-btn" type="button">ステージを えらぶ</button>
          </div>
          <p class="home-progress">★ ${r} / ${p.length*3}</p>
        </div>
        <button class="dev-pill" type="button">テスト用</button>
      </div>`};c();const n=r=>{const l=r.target;l.closest(".resume-btn")?t.go({screen:"play",levelId:s.firstUncleared()}):l.closest(".select-btn")?t.go({screen:"select"}):l.closest(".settings-btn")?ve():l.closest(".dev-pill")&&Ke(s,c)};return e.addEventListener("click",n),()=>e.removeEventListener("click",n)}function ze(e,t){const{store:s}=t,c=de.map(r=>{const l=r.levels.some(d=>s.isUnlocked(d.id)),o=r.levels.map(d=>{const u=s.isUnlocked(d.id),h=s.stars(d.id),m=d.id.split("-")[1];return`<button class="level-card${u?"":" locked"}${h===3?" perfect":""}" type="button" data-level="${d.id}"${u?"":' aria-disabled="true"'}>
            <span class="level-num">${m}</span>
            <span class="level-stars">${u?[0,1,2].map(T=>`<span class="star${T<h?" on":""}">★</span>`).join(""):'<span class="lock">🔒</span>'}</span>
          </button>`}).join("");return`<section class="world">
      <h2 class="world-head"><span class="world-name">${r.id} ${r.name}</span>${l?`<span class="world-stars">★ ${s.worldStars(r.levels.map(d=>d.id))} / ${r.levels.length*3}</span>`:""}</h2>
      <div class="level-grid">${o}</div>
    </section>`}).join("");e.innerHTML=`
    <div class="app select-screen">
      <header class="header">
        <div class="header-row">
          <div class="header-left"><button class="icon-btn back-btn" type="button" aria-label="もどる">${fe()}</button></div>
          <h1 class="title">ステージ</h1>
          <div class="header-actions"></div>
        </div>
        <div class="status-bar"><span class="stat"><span class="stat-label">★</span><span class="stat-num">${s.total()}</span><span class="stat-label">/ ${p.length*3}</span></span></div>
      </header>
      <div class="worlds">${c}</div>
    </div>`;const n=r=>{const l=r.target;l.closest(".back-btn")&&t.go({screen:"home"});const o=l.closest(".level-card");o&&!o.classList.contains("locked")&&t.go({screen:"play",levelId:o.dataset.level})};return e.addEventListener("click",n),()=>e.removeEventListener("click",n)}const K=document.querySelector("#app"),Fe=new Me,z=new Se;let U=null;const Je=e=>z.go(e);z.onChange(e=>{U?.(),U=null,window.scrollTo(0,0);const t={store:Fe,go:Je};e.screen==="home"?U=_e(K,t):e.screen==="select"?U=ze(K,t):U=We(K,e.levelId,t)});z.start();
