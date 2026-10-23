(function(root){
  'use strict';
  const normalize=s=>s.trim().toLowerCase().replace(/[’‘]/g,"'");
  const key=(entry,script)=>`${script}:${entry.id}`;
  function fresh(){return {version:1,cards:{},daily:{},answers:0,correct:0};}
  function valid(state){return state&&state.version===1&&state.cards&&typeof state.cards==='object'&&!Array.isArray(state.cards)&&state.daily&&typeof state.daily==='object'&&!Array.isArray(state.daily)&&Number.isSafeInteger(state.answers)&&state.answers>=0&&Number.isSafeInteger(state.correct)&&state.correct>=0&&state.correct<=state.answers&&Object.values(state.daily).every(v=>Number.isSafeInteger(v)&&v>=0)&&Object.values(state.cards).every(c=>c&&Number.isSafeInteger(c.streak)&&c.streak>=0&&Number.isSafeInteger(c.wrong)&&c.wrong>=0&&typeof c.review==='boolean'&&typeof c.due==='number'&&Number.isFinite(c.due)&&c.due>=0);}
  function dateKey(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
  function record(state,cardKey,success,quiz=true,now=new Date()){
    const c=state.cards[cardKey]||{streak:0,wrong:0,review:false,due:0};
    c.streak=success?Math.min(c.streak+1,20):0;
    if(!success){c.wrong++;c.review=true;}
    if(success&&c.streak>=3)c.review=false;
    c.due=success?now.getTime()+[0,1,3,7,14,30][Math.min(c.streak,5)]*86400000:now.getTime();
    state.cards[cardKey]=c;
    const day=dateKey(now);state.daily[day]=(state.daily[day]||0)+1;
    if(quiz){state.answers++;if(success)state.correct++;}
    return c;
  }
  function shuffle(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  function choices(current,pool,mode,script){
    const label=e=>mode==='reverse'||mode==='listen'?e[script]:e.romaji;
    const target=label(current);const eligible=mode==='reverse'||mode==='listen'?pool.filter(e=>!e.accepted.some(a=>current.accepted.includes(a))):pool;
    const alternatives=[...new Set(eligible.map(label))].filter(x=>x!==target);
    return shuffle([target,...shuffle(alternatives).slice(0,3)]);
  }
  function streakDays(daily,now=new Date()){
    const d=new Date(now.getFullYear(),now.getMonth(),now.getDate());let n=0;
    if(!daily[dateKey(d)])d.setDate(d.getDate()-1);
    while(daily[dateKey(d)]){n++;d.setDate(d.getDate()-1);}return n;
  }
  const api={normalize,key,fresh,valid,dateKey,record,shuffle,choices,streakDays};
  root.KanaLearning=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
