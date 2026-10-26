/* Translate presentation only: identifiers, answers, kana and saved progress stay intact. */
(function(root){
 'use strict';
 const M=root.KanaLocales.messages,valid=code=>root.KanaLocales.languages.includes(code),KEY='kana-garden-language-v1';
 let locale='zh';
 const pick=(en,ko,code)=>code==='ko'?ko:en;
 const patterns=[
  [/^答对了！(.+)$/,(m,c)=>pick(`Correct! ${m[1]}`,`정답! ${m[1]}`,c)],
  [/^再记一次：(.+)。已加入复习。$/,(m,c)=>pick(`Remember: ${m[1]}. Added to review.`,`다시 기억해요: ${m[1]}. 복습에 추가했어요.`,c)],
  [/^再记一遍：(.+)。已加入台词「待复习」。$/,(m,c)=>pick(`Remember: ${translate(m[1],c)} Added to dialogue review.`,`다시 기억해요: ${translate(m[1],c)} 대사 복습에 추가했어요.`,c)],
  [/^当前范围 (\d+) 句，每轮最多 10 题。答错的台词会收进「待复习」。$/,(m,c)=>pick(`${m[1]} lines selected. Up to 10 questions per round. Mistakes are saved for review.`,`${m[1]}개 대사를 선택했어요. 한 라운드는 최대 10문제이며 오답은 복습 목록에 저장돼요.`,c)],
  [/^(\d+) \/ (\d+) 题答对 · 台词小测单独统计$/,(m,c)=>pick(`${m[1]} / ${m[2]} correct · Dialogue scores are tracked separately`,`${m[1]} / ${m[2]} 정답 · 대사 점수는 따로 집계해요`,c)],
  [/^(.+) · 连续记对 (\d+) 次$/,(m,c)=>pick(`${translate(m[1],c)} · ${m[2]} correct in a row`,`${translate(m[1],c)} · ${m[2]}회 연속 정답`,c)],
  [/^(.+) 在这里读 (.+?)。(.+)$/,(m,c)=>pick(`${m[1]} is read ${m[2]} here. ${translate(m[3],c)}`,`여기서 ${m[1]}는 ${m[2]}로 읽어요. ${translate(m[3],c)}`,c)],
  [/^(.+?) → (.+?)。(.+)$/,(m,c)=>`${m[1]} → ${m[2]}. ${translate(m[3],c)}`],
  [/^播放 (.+) 的日语读音$/,(m,c)=>pick(`Play Japanese pronunciation of ${m[1]}`,`${m[1]}의 일본어 발음 재생`,c)],
  [/^播放 (.+)$/,(m,c)=>pick(`Play ${m[1]}`,`${m[1]} 재생`,c)],
  [/^(\d+) 个待巩固$/,(m,c)=>pick(`${m[1]} to review`,`${m[1]}개 복습 필요`,c)],
  [/^(\d+) 次$/,(m,c)=>pick(`${m[1]} ${m[1]==='1'?'practice':'practices'}`,`${m[1]}회`,c)],
  [/^(\d+) 个$/,(m,c)=>pick(`${m[1]} items`,`${m[1]}개`,c)],
  [/^([a-z]+) 行$/,(m,c)=>pick(`${m[1]} row`,`${m[1]}행`,c)],
  [/^(.+) · (.+) (\d+) 音$/,(m,c)=>pick(`${translate(m[1],c)} · ${translate(m[2],c)} · ${m[3]} sounds`,`${translate(m[1],c)} · ${translate(m[2],c)} · ${m[3]}음`,c)],
  [/^(\d{4}-\d{2}-\d{2}): (\d+) 次$/,(m,c)=>pick(`${m[1]}: ${m[2]} practices`,`${m[1]}: ${m[2]}회`,c)]
 ];
 const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 // Longest phrases first; single-character word meanings are exact matches only.
 const fragments=new RegExp(Object.keys(M).filter(k=>k.length>1).sort((a,b)=>b.length-a.length).map(escape).join('|'),'g');
 function translate(value,code=locale){
  const source=String(value);if(!valid(code)||code==='zh')return source;
  const body=source.trim();if(!body)return source;
  const lead=source.slice(0,source.indexOf(body)),tail=source.slice(source.indexOf(body)+body.length);
  let result=M[body]?.[code];
  if(result===undefined){for(const [re,format] of patterns){const m=body.match(re);if(m){result=format(m,code);break;}}}
  if(result===undefined)result=body.replace(fragments,key=>M[key][code]);
  return lead+result+tail;
 }
 const originals=new WeakMap(),attrs=new WeakMap();let observer=null;
 function apply(){
  if(typeof document==='undefined')return;
  observer?.disconnect();
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let node;
  while((node=walker.nextNode())){
   if(node.parentElement?.closest('script,style,textarea,[lang="ja"],[translate="no"],#ui-language'))continue;
   const before=node.nodeValue,old=originals.get(node),source=old&&before===old.rendered?old.source:before;
   let rendered=translate(source);
   if(locale==='en'&&source.trim()==='次'&&node.parentElement?.previousSibling?.textContent?.trim()==='1')rendered=rendered.replace('practices','practice');
   originals.set(node,{source,rendered});if(before!==rendered)node.nodeValue=rendered;
  }
  document.body.querySelectorAll('[aria-label],[title],[placeholder],[alt]').forEach(el=>{
   if(el.closest('[lang="ja"],[translate="no"]'))return;
   const record=attrs.get(el)||{};
   for(const name of ['aria-label','title','placeholder','alt'])if(el.hasAttribute(name)){
    const before=el.getAttribute(name),old=record[name],source=old&&before===old.rendered?old.source:before,rendered=translate(source);
    record[name]={source,rendered};if(before!==rendered)el.setAttribute(name,rendered);
   }
   attrs.set(el,record);
  });
  document.documentElement.lang={zh:'zh-CN',en:'en',ko:'ko'}[locale];
  document.title=translate('假名花园 · 每天一点日语');
  const description=document.querySelector('meta[name="description"]');
  if(description)description.content={zh:'从喜欢的动漫开始学日语：五十音、记忆卡、测验与动漫台词教室。支持中文、英语、韩语。',en:'Learn Japanese through your love of anime. Kana charts, flashcards, quizzes, anime themes and a dialogue club. Chinese, English and Korean interfaces.',ko:'좋아하는 애니에서 시작하는 일본어 학습. 오십음도, 암기 카드, 퀴즈, 애니 테마와 대사 교실. 중국어·영어·한국어 지원.'}[locale];
  const selector=document.querySelector('#ui-language');if(selector)selector.value=locale;
  observer?.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title','placeholder','alt']});
 }
 function setLocale(code){if(!valid(code))return false;locale=code;try{localStorage.setItem(KEY,code);const url=new URL(location.href);if(url.searchParams.has('lang')){url.searchParams.set('lang',code);history.replaceState(null,'',url);}}catch{}apply();return true;}
 const api={translate,setLocale,apply,get locale(){return locale;}};root.KanaI18n=api;
 if(typeof module!=='undefined')module.exports=api;
 if(typeof document==='undefined')return;
 try{const query=new URLSearchParams(location.search).get('lang'),saved=localStorage.getItem(KEY);locale=valid(query)?query:valid(saved)?saved:'zh';if(valid(query))localStorage.setItem(KEY,query);}catch{}
 document.addEventListener('change',event=>{if(event.target.id==='ui-language')setLocale(event.target.value);});
 observer=new MutationObserver(apply);apply();
})(typeof globalThis!=='undefined'?globalThis:this);
