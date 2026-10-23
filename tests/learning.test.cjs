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
