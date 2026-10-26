const test=require('node:test');
const assert=require('node:assert/strict');
const K=require('../dist/kana-data.js');
const D=require('../dist/dialogue-data.js');
const L=require('../dist/learning.js');
require('../dist/dialogue.js');
globalThis.window={};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function harness(oldState=L.fresh()){
 let state=oldState,saves=0;const messages=[];
 const app=globalThis.KanaDialogue.create({getState:()=>state,save:()=>saves++,render:()=>{},speak:()=>false,hasJapaneseVoice:()=>false,toast:s=>messages.push(s),esc:escape,I:()=>''});
 return {app,messages,get state(){return state;},get saves(){return saves;},replace:s=>{state=s;}};
}
test('24 complete dialogue lessons across four original scene groups',()=>{
 assert.equal(D.lines.length,24);assert.equal(new Set(D.lines.map(l=>l.id)).size,24);assert.equal(new Set(D.lines.map(l=>l.text)).size,24);
 for(const group of Object.keys(D.groups))assert.equal(D.lines.filter(l=>l.group===group).length,6);
 for(const line of D.lines){
  assert.ok(line.scene&&line.usage&&line.note&&line.meaning&&/^[a-z ]+$/.test(line.romaji));
  const tokens=D.tokenize(line.kana);assert.equal(tokens.join(''),line.kana);assert.ok(tokens.includes(line.focus),line.id);
  for(const token of tokens)assert.ok(token==='っ'||K.entries.some(e=>e.hira===token),`${line.id}: ${token}`);
 }
});
test('mora splitting handles yoon, gemination, and particle readings',()=>{
 assert.deepEqual(D.tokenize('ちょっとまって'),['ちょ','っ','と','ま','っ','て']);
 assert.deepEqual(D.tokenize('だいじょうぶ'),['だ','い','じょ','う','ぶ']);
 assert.equal(D.spokenToken(D.lines.find(l=>l.id==='konnichiwa'),4),'わ');
 assert.equal(D.spokenToken(D.lines.find(l=>l.id==='kiwotsukete'),1),'お');
});
test('dialogue progress survives backup and old kana backups still load',()=>{
 const h=harness({version:1,cards:{},daily:{},answers:0,correct:0});
 h.app.render();assert.deepEqual(h.state.dialogue,{learned:[],records:{}});
 h.app.handle('dialogue-mark',{dataset:{id:'ohayou'}});assert.equal(h.app.stats().learned,1);
 const restored=JSON.parse(JSON.stringify(h.state));assert.ok(L.valid(restored));
 h.replace(restored);assert.equal(h.app.stats().learned,1);
 h.app.handle('dialogue-mark',{dataset:{id:'ohayou'}});assert.equal(h.app.stats().learned,0);
 h.replace(L.fresh());assert.equal(h.app.stats().learned,0);
 const broken=L.fresh();broken.dialogue.records.ohayou={attempts:1,correct:2,review:false};assert.ok(!L.valid(broken));
 const duplicate=L.fresh();duplicate.dialogue.learned=['ohayou','ohayou'];assert.ok(!L.valid(duplicate));
});
test('quiz prevents duplicate grading and keeps kana accuracy independent',()=>{
 const h=harness();h.app.handle('dialogue-start',{dataset:{}});
 const html=h.app.render(),text=html.match(/class="dialogue-quiz-text" lang="ja">([^<]+)/)[1];const line=D.lines.find(l=>l.text===text);
 h.app.handle('dialogue-answer',{dataset:{value:line.meaning}});
 assert.equal(h.app.stats().correct,1);assert.equal(h.app.stats().attempts,1);assert.equal(h.state.answers,0);assert.equal(h.state.correct,0);
 assert.equal(h.state.daily[L.dateKey()],1);assert.equal(h.saves,1);
 h.app.handle('dialogue-answer',{dataset:{value:line.meaning}});assert.equal(h.app.stats().attempts,1);
 assert.ok(L.valid(JSON.parse(JSON.stringify(h.state))));
});
test('wrong dialogue enters review and can be practiced in isolation',()=>{
 const h=harness();h.app.handle('dialogue-start',{dataset:{}});
 const html=h.app.render(),text=html.match(/class="dialogue-quiz-text" lang="ja">([^<]+)/)[1],line=D.lines.find(l=>l.text===text);
 const options=[...html.matchAll(/data-action="dialogue-answer" data-value="([^"]+)"/g)].map(m=>m[1]);
 h.app.handle('dialogue-answer',{dataset:{value:options.find(o=>o!==line.meaning)}});
 assert.equal(h.app.stats().review,1);assert.equal(h.state.dialogue.records[line.id].review,true);
 h.app.handle('dialogue-exit',{});h.app.change({id:'dialogue-filter',value:'review'});
 const filtered=h.app.render();assert.equal((filtered.match(/data-action="dialogue-select"/g)||[]).length,1);
 h.app.handle('dialogue-start',{});assert.ok(h.app.render().includes('1 / 1'));
 h.app.handle('dialogue-answer',{dataset:{value:line.meaning}});assert.equal(h.app.stats().review,0);
 h.app.handle('dialogue-next',{});assert.ok(h.app.render().includes('100<small>%'));
});
test('cloze quizzes teach the focused kana and audio practice checks voice support',()=>{
 const h=harness();h.app.change({id:'dialogue-mode',value:'blank'});h.app.handle('dialogue-start',{});
 const html=h.app.render(),scene=html.match(/class="dialogue-quiz-scene">([^<]+)/)[1],line=D.lines.find(l=>l.scene===scene);
 assert.ok(html.includes('blank-token'));h.app.handle('dialogue-answer',{dataset:{value:line.focus}});assert.equal(h.app.stats().correct,1);
 h.app.handle('dialogue-exit',{});h.app.change({id:'dialogue-mode',value:'listening'});h.app.handle('dialogue-start',{});
 assert.equal(h.messages.length,1);assert.ok(h.app.render().includes('dialogue-quote'));
});
