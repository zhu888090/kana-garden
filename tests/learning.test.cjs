const test=require('node:test');
const assert=require('node:assert/strict');
const D=require('../dist/kana-data.js');
const L=require('../dist/learning.js');
test('complete modern kana data and unique identities',()=>{
  assert.equal(D.entries.length,104);
  assert.deepEqual(['basic','voiced','yoon'].map(g=>D.entries.filter(e=>e.group===g).length),[46,25,33]);
  assert.equal(new Set(D.entries.map(e=>e.id)).size,104);
  assert.equal(new Set(D.entries.map(e=>e.hira)).size,104);
  assert.equal(new Set(D.entries.map(e=>e.kata)).size,104);
  for(const e of D.entries){assert.ok(e.accepted.includes(e.romaji));assert.equal(D.toKata(e.hira),e.kata);assert.ok(!e.hira.includes(' '));}
  assert.equal(D.entries.find(e=>e.hira==='を').kata,'ヲ');
  assert.equal(D.entries.find(e=>e.hira==='きゃ').kata,'キャ');
});
test('common romanization variants and normalization',()=>{
  for(const [h,variants] of [['し',['shi','si']],['ち',['chi','ti']],['つ',['tsu','tu']],['ふ',['fu','hu']],['ぢ',['ji','zi','di']],['づ',['zu','du']],['を',['wo','o']],['ん',['n','nn',"n'"]]]){
    const e=D.entries.find(e=>e.hira===h);for(const v of variants)assert.ok(e.accepted.includes(v));
  }
  assert.equal(L.normalize(' SHI '),'shi');assert.equal(L.normalize('N’'),"n'");
});
test('no ambiguous same-sound distractors in reverse and audio quizzes',()=>{
  for(const mode of ['recognition','reverse','listen'])for(const script of ['hira','kata'])for(const e of D.entries){
    const options=L.choices(e,D.entries,mode,script),expected=mode==='recognition'?e.romaji:e[script];
    assert.equal(options.length,4);assert.equal(new Set(options).size,4);assert.ok(options.includes(expected));
    if(mode!=='recognition')for(const o of options.filter(o=>o!==expected)){
      const other=D.entries.find(d=>d[script]===o);assert.ok(!other.accepted.some(a=>e.accepted.includes(a)),`${e.hira} versus ${other.hira}`);
    }
  }
  const pool=D.entries.filter(e=>e.row==='a'&&e.group==='basic');
  for(const option of L.choices(pool[0],pool,'recognition','hira'))assert.ok(pool.some(e=>e.romaji===option));
});
test('mistake recovery, scheduling, per-script progress and honest statistics',()=>{
  const state=L.fresh(),e=D.entries[0],key=L.key(e,'hira'),now=new Date(2026,9,23,12);
  L.record(state,key,false,true,now);assert.equal(state.answers,1);assert.equal(state.correct,0);assert.equal(state.cards[key].review,true);assert.equal(state.cards[key].due,now.getTime());
  for(let i=0;i<3;i++)L.record(state,key,true,false,now);
  assert.equal(state.cards[key].streak,3);assert.equal(state.cards[key].review,false);
  assert.equal(state.cards[key].due,now.getTime()+7*86400000);
  assert.equal(state.answers,1);assert.equal(state.correct,0);assert.equal(state.daily[L.dateKey(now)],4);
  assert.equal(state.cards[L.key(e,'kata')],undefined);
  L.record(state,key,false,true,now);assert.equal(state.cards[key].streak,0);assert.equal(state.cards[key].wrong,2);
  assert.ok(L.valid(state));
});
test('daily streak allows yesterday and handles gaps',()=>{
  const now=new Date(2026,9,23,12);
  assert.equal(L.streakDays({'2026-10-22':1,'2026-10-21':2},now),2);
  assert.equal(L.streakDays({'2026-10-23':1,'2026-10-21':2},now),1);
  assert.equal(L.streakDays({'2026-10-20':2},now),0);
});
test('backup validation rejects corrupt progress',()=>{
  assert.ok(L.valid(L.fresh()));assert.ok(!L.valid({version:1,cards:{},daily:{},answers:-1,correct:2}));
  const s=L.fresh();s.cards['hira:x']={streak:-3,wrong:0,review:false,due:0};assert.ok(!L.valid(s));
});
test('review pools smaller than four still offer four choices',()=>{
  const all=D.entries.flatMap(e=>['hira','kata'].map(s=>({...e,script:s})));
  for(const n of [1,2,3])for(const script of ['hira','kata'])for(const mode of ['recognition','reverse','listen']){
    const current=all.find(e=>e.script===script);
    const pool=[current,...all.filter(e=>e.script===script&&e.id!==current.id).slice(0,n-1)];
    const options=L.choices(current,pool,mode,script,D.entries);
    assert.equal(options.length,4,`${mode} pool=${n}`);
    assert.equal(new Set(options).size,4);
    const expected=mode==='recognition'?current.romaji:current[script];
    assert.ok(options.includes(expected));
    for(const o of options.filter(o=>o!==expected)){
      const other=all.find(d=>d.script===script&&d[mode==='recognition'?'romaji':script]===o);
      assert.ok(!other||!other.accepted.some(a=>current.accepted.includes(a)),`${current.hira} vs ${o}`);
    }
  }
});
test('extra distractors preserve complete row pools and exclude same-sound kana',()=>{
  for(const mode of ['recognition','reverse','listen'])for(const script of ['hira','kata']){
    const pool=D.entries.filter(e=>e.row==='a'&&e.group==='basic');
    for(let i=0;i<20;i++)for(const option of L.choices(pool[0],pool,mode,script,D.entries))assert.ok(pool.some(e=>e[mode==='recognition'?'romaji':script]===option));
    if(mode==='recognition')continue;
    for(const current of D.entries)for(const option of L.choices(current,[current],mode,script,D.entries).filter(o=>o!==current[script])){
      const other=D.entries.find(e=>e[script]===option);
      assert.ok(!other.accepted.some(a=>current.accepted.includes(a)),`${current.hira} vs ${option}`);
    }
  }
});

function appHarness(raw,{failCorruptBackup=false}={}){
 const vm=require('node:vm'),fs=require('node:fs');
 const store=new Map(raw===undefined?[]:[['kana-garden-progress-v1',raw]]),nodes=new Map(),handlers={};let app,confirms=0;
 const document={activeElement:null,querySelectorAll:()=>[],addEventListener:(name,fn)=>{handlers[name]=fn;}};
 document.querySelector=selector=>{
  if(selector==='dialog[open]')return null;
  if(!nodes.has(selector))nodes.set(selector,{innerHTML:'',textContent:'',style:{},dataset:{},classList:{add(){},remove(){}},querySelectorAll:()=>[],focus(){document.activeElement=this;}});
  return nodes.get(selector);
 };
 document.activeElement=document.querySelector('body');
 const context={KanaData:D,KanaLearning:L,KanaDialogueData:require('../dist/dialogue-data.js'),
  KanaDialogue:{create:config=>{app=config;return {render:()=>'',change:()=>false,handle:()=>false,leave(){},keydown(){}};}},
  KanaAppearance:{refresh(){},credits:()=>''},KanaI18n:{translate:s=>s},document,
  localStorage:{getItem:key=>store.get(key)??null,setItem:(key,value)=>{if(failCorruptBackup&&key.endsWith('-corrupt'))throw Error('quota');store.set(key,value);}},
  window:{addEventListener(){},scrollTo(){},confirm:()=>{confirms++;return true;}},location:{hash:'#progress',protocol:'file:'},navigator:{},setTimeout:()=>1,clearTimeout(){}};
 vm.runInNewContext(fs.readFileSync(require.resolve('../dist/app.js'),'utf8'),context,{filename:'dist/app.js'});
 return {store,nodes,get state(){return app.getState();},get confirms(){return confirms;},
  import:async data=>handlers.change({target:{id:'import-file',files:[{size:100,text:async()=>JSON.stringify(data)}]}})};
}
test('backup import rejects unknown dialogue IDs before changing current progress',async()=>{
 const current=L.fresh();L.record(current,L.key(D.entries[0],'hira'),true);
 const raw=JSON.stringify(current);
 for(const target of ['learned','records','both']){
  const h=appHarness(raw),data=L.fresh();
  if(target!=='records')data.dialogue.learned=['nope'];
  if(target!=='learned')data.dialogue.records.nope={attempts:1,correct:1,review:true};
  await h.import(data);
  assert.match(h.nodes.get('#toast').textContent,/无法读取这个备份/);
  assert.equal(h.store.get('kana-garden-progress-v1'),raw);
  assert.equal(JSON.stringify(h.state),raw);
  assert.equal(h.confirms,0);
 }
});
test('backup import still accepts known dialogue IDs and old kana-only backups',async()=>{
 for(const old of [false,true]){
  const h=appHarness(),data=L.fresh();
  if(old)delete data.dialogue;
  else {data.dialogue.learned=['ohayou'];data.dialogue.records.ohayou={attempts:1,correct:1,review:false};}
  await h.import(data);
  assert.equal(h.confirms,1);
  assert.equal(h.store.get('kana-garden-progress-v1'),JSON.stringify(data));
  assert.match(h.nodes.get('#toast').textContent,/备份已导入/);
 }
});
test('corrupt saved progress keeps the original raw content and shows a warning',()=>{
 for(const raw of ['{oops','null',JSON.stringify({version:9})]){
  const h=appHarness(raw);
  assert.equal(h.store.get('kana-garden-progress-v1-corrupt'),raw);
  assert.equal(h.store.get('kana-garden-progress-v1'),raw);
  assert.equal(JSON.stringify(h.state),JSON.stringify(L.fresh()));
  assert.match(h.nodes.get('#main').innerHTML,/storage-warning/);
 }
 const h=appHarness('{oops',{failCorruptBackup:true});
 assert.equal(h.store.get('kana-garden-progress-v1'),'{oops');
 assert.match(h.nodes.get('#main').innerHTML,/storage-warning/);
});
