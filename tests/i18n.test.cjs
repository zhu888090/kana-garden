const test=require('node:test');
const assert=require('node:assert/strict');
const K=require('../dist/kana-data.js');
const D=require('../dist/dialogue-data.js');
const C=require('../dist/locales.js');
const I=require('../dist/i18n.js');

test('English and Korean cover every dialogue lesson and kana example meaning',()=>{
 for(const lang of ['en','ko']){
  for(const line of D.lines)for(const field of ['meaning','scene','usage','topic','note']){
   assert.ok(C.messages[line[field]]?.[lang],`${lang}: ${line.id}.${field}`);
   assert.notEqual(I.translate(line[field],lang),line[field]);
  }
  for(const example of [...Object.values(K.examples),...Object.values(K.kataExamples)])assert.ok(C.messages[example[2]]?.[lang],example[2]);
  for(const label of [...Object.values(K.scripts),...Object.values(K.groups),...Object.values(D.groups).map(g=>g.name)])assert.ok(C.messages[label]?.[lang],label);
 }
});
test('dynamic feedback and counts are localized without changing kana or romaji',()=>{
 assert.equal(I.translate('答对了！し → shi','en'),'Correct! し → shi');
 assert.equal(I.translate('再记一次：し → shi / si。已加入复习。','ko'),'다시 기억해요: し → shi / si. 복습에 추가했어요.');
 assert.match(I.translate('再记一遍：早上好！。已加入台词「待复习」。','en'),/Good morning!.*review/);
 assert.equal(I.translate('k 行','en'),'k row');
 assert.equal(I.translate('20 次','ko'),'20회');
 assert.match(I.translate('当前范围 24 句，每轮最多 10 题。答错的台词会收进「待复习」。','en'),/^24 lines selected/);
 assert.equal(I.translate('播放 おはよう！','ko'),'おはよう！ 재생');
});
test('Japanese study content and unsupported languages remain unchanged',()=>{
 for(const lang of ['en','ko','zh','fr'])for(const s of ['あ・ア','おはよう！','shi / si','ちょっとまって'])assert.equal(I.translate(s,lang),s);
 assert.equal(I.translate('学习进度','fr'),'学习进度');
 assert.equal(I.setLocale('fr'),false);
});
test('switching language never modifies lesson identifiers, answers or kana data',()=>{
 const before=JSON.stringify({K,D});
 I.setLocale('en');assert.equal(I.translate('早上好！'),'Good morning!');
 I.setLocale('ko');assert.equal(I.translate('早上好！'),'좋은 아침!');
 I.setLocale('zh');assert.equal(I.translate('早上好！'),'早上好！');
 assert.equal(JSON.stringify({K,D}),before);
});

test('Korean counters remove only their leading unit space',()=>{
 assert.equal(I.translate(' 天坚持','ko'),'일 연속 학습');
 assert.equal(I.translate(' 天坚持','en'),' day streak');
 assert.equal(I.translate(' 句常用表达','ko'),'가지 일상 표현');
 assert.equal(I.translate(' 句已标熟悉','ko'),'개 익숙한 대사');
 assert.equal(I.translate(' 句待复习','ko'),'개 복습할 대사');
 assert.equal(I.translate(' 秒','ko'),'초');
 assert.equal(I.translate(' · ','ko'),' · ');
 assert.equal(I.translate(' 天坚持 ','ko'),'일 연속 학습 ');
});
test('incorrect English feedback keeps dialogue punctuation and Korean wording',()=>{
 assert.equal(I.translate('再记一次：あ → a / i。已加入复习。','en'),'Not quite: あ → a / i. Added to review.');
 assert.equal(I.translate('再记一遍：早上好！。已加入台词「待复习」。','en'),'Not quite: Good morning! Added to dialogue review.');
 assert.equal(I.translate('再记一遍：早上好！。已加入台词「待复习」。','ko'),'다시 기억해요: 좋은 아침! 대사 복습에 추가했어요.');
});
test('English range and calendar counters use singular only for one',()=>{
 for(const [n,word] of [[0,'lines'],[1,'line'],[2,'lines']])assert.ok(I.translate('当前范围 '+n+' 句，每轮最多 10 题。答错的台词会收进「待复习」。','en').startsWith(n+' '+word+' selected.'));
 assert.equal(I.translate('2026-10-29: 1 次','en'),'2026-10-29: 1 practice');
 assert.equal(I.translate('2026-10-29: 2 次','en'),'2026-10-29: 2 practices');
 assert.equal(I.translate('2026-10-29: 0 次','en'),'2026-10-29: 0 practices');
});
