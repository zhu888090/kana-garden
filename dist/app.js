/* 假名花园 · No dependencies, no account, progress stays in this browser. */
(() => {
  'use strict';
  const D=KanaData,L=KanaLearning,STORE='kana-garden-progress-v1';
  const $=s=>document.querySelector(s);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let state=L.fresh(),storageOK=true,session=null,toastTimer;
  try{const raw=localStorage.getItem(STORE);if(raw){const parsed=JSON.parse(raw);if(L.valid(parsed))state=parsed;else storageOK=false;}}catch{storageOK=false;}
  const ui={script:'hira',group:'basic',selected:'basic-a-0',showRomaji:true,reviewFilter:'wrong',settings:{script:'hira',groups:['basic'],row:'all',count:'20',mode:'recognition'}};
  const iconPaths={
    grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    cards:'<rect x="7" y="5" width="13" height="16" rx="2"/><path d="M4 17V4a2 2 0 0 1 2-2h10M11 11h5m-5 4h3"/>',
    pen:'<path d="m14 4 6 6M4 20l4-1 12-12a2.8 2.8 0 0 0-4-4L4 15v5Z"/>',
    sound:'<path d="M11 4 5 9H2v6h3l6 5V4Zm4 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
    review:'<path d="M3 10a9 9 0 1 1 2 8M3 4v6h6m3-3v6l4 2"/>',
    leaf:'<path d="M20 3c-1 9-3 17-12 15C-1 13 5 3 20 3Zm-1 1L4 21m5-7v-4m4 0h4"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    chart:'<path d="M4 3v17h17M8 15v-4m5 4V6m5 9v-7"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
    check:'<path d="m5 12 4 4L20 5"/>',
    arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
    spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"/>',
    flag:'<path d="M5 21V4c5-4 9 4 14 0v10c-5 4-9-4-14 0"/>',
    upload:'<path d="M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6"/>',
    download:'<path d="M12 3v13m-5-5 5 5 5-5M4 16v5h16v-5"/>'
  };
  const I=name=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name]||iconPaths.leaf}</svg>`;
  document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=I(el.dataset.icon));
  const navItems=[['chart','grid','五十音图'],['cards','cards','记忆卡片'],['quiz','pen','假名测验'],['listen','sound','听音练习'],['dialogue','spark','台词教室'],['review','review','温故知新']];
  const names={chart:'五十音图',cards:'记忆卡片',quiz:'假名测验',listen:'听音练习',dialogue:'动漫台词教室',review:'温故知新',progress:'学习进度',about:'关于与学习提示'};
  const dialogue=KanaDialogue.create({getState:()=>state,save,render,speak,hasJapaneseVoice,toast,esc,I});
  const entry=id=>D.entries.find(e=>e.id===id);
  const allCards=()=>D.entries.flatMap(e=>['hira','kata'].map(script=>({...e,script})));
  const cardState=(e,script)=>state.cards[L.key(e,script)];
  const wrongCards=()=>allCards().filter(e=>cardState(e,e.script)?.review);
  const dueCards=()=>allCards().filter(e=>{const c=cardState(e,e.script);return c&&c.due<=Date.now();});
  const mastered=(script,group)=>D.entries.filter(e=>(!group||e.group===group)&&cardState(e,script)?.streak>=3).length;
  function save(){try{localStorage.setItem(STORE,JSON.stringify(state));storageOK=true;}catch{storageOK=false;toast('浏览器无法保存记录，请到学习进度中导出备份。');}updateShell();}
  function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3600);}
  function view(){const hash=location.hash.slice(1);return names[hash]?hash:'chart';}
  function updateShell(){
    const current=view();
    $('#nav').innerHTML=navItems.map(([id,icon,title])=>`<button class="nav-button ${current===id?'active':''}" ${current===id?'aria-current="page"':''} data-action="view" data-view="${id}">${I(icon)}<span>${title}</span>${id==='review'&&wrongCards().length?`<span class="nav-count">${wrongCards().length}</span>`:''}</button>`).join('');
    $('#crumb').textContent=names[current];
    const today=state.daily[L.dateKey()]||0;
    $('#goal-fraction').textContent=`${today} / 20`;$('#goal-bar').style.width=`${Math.min(today/20*100,100)}%`;
    $('#goal-message').textContent=today>=20?'今日目标完成，给坚持的自己一朵小花。':'每天 20 次练习，让记忆慢慢开花。';
    $('#streak-days').textContent=L.streakDays(state.daily);
  }
  function intro(label,title,text){return `<div class="view-intro"><div class="eyebrow">${label}</div><h1>${title}</h1><p>${text}</p></div>`;}
  function warning(){return storageOK?'':'<div class="storage-warning">当前浏览器无法正常读取或保存学习记录。练习仍可继续，请在「学习进度」中导出备份。</div>';}
  function summary(){const today=state.daily[L.dateKey()]||0;return `<div class="summary-strip"><div class="summary"><span class="summary-icon">${I('leaf')}</span><div><small>已掌握假名</small><strong>${mastered('hira')+mastered('kata')}<span>/ 208</span></strong></div></div><div class="summary"><span class="summary-icon">${I('sun')}</span><div><small>今日练习</small><strong>${today}<span>次</span></strong></div></div><div class="summary"><span class="summary-icon">${I('check')}</span><div><small>假名正确率</small><strong>${state.answers?Math.round(state.correct/state.answers*100):'—'}<span>${state.answers?'%':'待开始'}</span></strong></div></div><div class="summary"><span class="summary-icon">${I('review')}</span><div><small>错题与标记</small><strong>${wrongCards().length}<span>个待巩固</span></strong></div></div></div>`;}
  function chart(){
    const list=D.entries.filter(e=>e.group===ui.group);let selected=entry(ui.selected);if(!selected||selected.group!==ui.group){selected=list[0];ui.selected=selected.id;}
    const rows=[...new Set(list.map(e=>e.row))];const columns=ui.group==='yoon'?['ya','yu','yo']:['a','i','u','e','o'];
    return `<section class="hero"><div><div class="eyebrow">A LITTLE JAPANESE, EVERY DAY</div><h1>从「あ」开始，<br>让日语的种子<em>慢慢发芽。</em></h1><p>听一听，认一认，练一练。<br>在这里，遇见你的第一个日语小进步。</p></div><div class="hero-art" aria-hidden="true"><div class="art-circle"></div><div class="art-orbit"></div><div class="art-card hira">あ</div><div class="art-card kata">ア</div><div class="art-leaf">${I('leaf')}</div><div class="art-dot"></div><div class="art-caption">小さな一歩。</div></div></section>
    ${summary()}<div class="section-heading"><div><h2>五十音图 <span style="font-size:12px;color:#a4af98;font-weight:400;margin-left:9px">かな一覧</span></h2><p>点选一个假名，认识它的读音与模样。</p></div><button class="button" data-action="quick-start">开始练习 ${I('arrow')}</button></div>
    <div class="study-layout"><section class="chart-panel" aria-label="假名表"><div class="chart-toolbar"><div class="script-tabs" role="tablist" aria-label="假名类型">${['hira','kata'].map(s=>`<button class="script-tab ${ui.script===s?'active':''}" role="tab" aria-selected="${ui.script===s}" data-action="script" data-script="${s}"><span>${s==='hira'?'あ':'ア'}</span>${D.scripts[s]}</button>`).join('')}</div><div class="chart-controls"><div class="pills" aria-label="发音分组">${Object.entries(D.groups).map(([g,n])=>`<button class="pill ${ui.group===g?'active':''}" aria-pressed="${ui.group===g}" data-action="group" data-group="${g}">${n}</button>`).join('')}</div><label class="switch-label"><input type="checkbox" id="show-romaji" ${ui.showRomaji?'checked':''}>显示罗马音</label></div></div><div class="chart-wrap ${ui.showRomaji?'':'romaji-hidden'}"><table class="kana-table"><thead><tr><th aria-label="行"></th>${columns.map(c=>`<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr><th scope="row">${r==='a'?'∅':r==='nn'?'n':r}</th>${columns.map((_,c)=>{const e=list.find(e=>e.row===r&&e.col===c);return e?`<td><button class="kana-cell ${e.id===selected.id?'selected':''} ${cardState(e,ui.script)?.streak>=3?'mastered':''}" aria-pressed="${e.id===selected.id}" aria-label="${e[ui.script]}${ui.showRomaji?'，'+e.romaji:''}" data-action="select-kana" data-id="${e.id}"><span class="kana-char" lang="ja">${e[ui.script]}</span><span class="kana-romaji" ${ui.showRomaji?'':'aria-hidden="true"'}>${e.romaji}</span></button></td>`:'<td class="empty-cell" aria-label="无对应假名">·</td>';}).join('')}</tr>`).join('')}</tbody></table></div><div class="chart-legend"><span><span class="legend-dot"></span>小绿点表示已掌握</span><span>${D.scripts[ui.script]} · ${D.groups[ui.group]} ${list.length} 音</span></div></section><aside class="study-aside"><div id="kana-detail">${detail(selected)}</div><div class="tip-card"><h3>${I('spark')} 花园小贴士</h3><p>${ui.group==='yoon'?'拗音由 i 段假名加小写的「ゃ・ゅ・ょ」组成，两个字符合起来读作一拍。':ui.group==='voiced'?'「゛」是浊点，「゜」是半浊点。ぢ与じ、づ与ず在现代标准日语中通常同音。':ui.script==='kata'?'片假名常用于外来语、人名和拟声词。先留意「シ / ツ」「ソ / ン」的细小差别。':'先从「あ・い・う・え・お」开始，每天认识一行。熟悉读音后，试着关闭罗马音来回忆。'}</p></div></aside></div><div class="study-note">${I('info')} <span>连续记对 3 次即可标记为掌握。发音使用设备的日语语音；可在「关于与学习提示」查看读音规则。</span></div>`;
  }
  function detail(e){
    const example=ui.script==='kata'?D.kataExamples[e.romaji]:D.examples[e.romaji];
    const marked=cardState(e,ui.script)?.review;
    const paired=ui.script==='hira'?e.kata:e.hira;
    return `<div class="detail-card"><div class="detail-top"><span>认识这个假名</span><button class="sound-button" data-action="speak-detail" aria-label="播放 ${e[ui.script]} 的日语读音">${I('sound')}</button></div><div class="detail-kana" lang="ja">${e[ui.script]}</div><div class="detail-reading">${e.romaji}</div><div class="detail-sub">${ui.script==='hira'?'片假名':'平假名'} <span lang="ja">${paired}</span></div><div class="detail-divider"></div><div class="word-example">${example?`<strong lang="ja">${example[0]}</strong><small>${example[1]}</small><div class="meaning">${example[2]}</div>`:`<strong lang="ja">${e.hira} · ${e.kata}</strong><small>${e.accepted.join(' / ')}</small><div class="meaning">${e.group==='yoon'?'小写拗音，合读一拍':'听读音，再试着回忆'}</div>`}</div><button class="button secondary small" data-action="mark-review">${I(marked?'check':'flag')}${marked?'已加入复习':'加入复习'}</button><div class="detail-nav"><button data-action="prev-kana" aria-label="上一个假名">←</button><span>${D.groups[ui.group]} · ${D.scripts[ui.script]}</span><button data-action="next-kana" aria-label="下一个假名">→</button></div></div>`;
  }
  function hasJapaneseVoice(){return 'speechSynthesis' in window&&speechSynthesis.getVoices().some(v=>/^ja([_-]|$)/i.test(v.lang));}
  function speak(text){
    if(!hasJapaneseVoice()){toast('当前设备未检测到日语语音。请安装日语语音包后刷新；识字和测验仍可使用。');return false;}
    speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text==='を'||text==='ヲ'?'お':text);
    utterance.lang='ja-JP';utterance.voice=speechSynthesis.getVoices().find(v=>/^ja([_-]|$)/i.test(v.lang));utterance.rate=.75;
    utterance.onerror=()=>toast('语音播放失败，请检查设备的日语语音设置。');speechSynthesis.speak(utterance);return true;
  }
  function settingsPanel(kind){
    const s=ui.settings;const rows=[...new Set(D.entries.filter(e=>s.groups.includes(e.group)).map(e=>e.row))];
    return `<section class="panel"><h2>安排这次小练习</h2><div class="field"><label for="setting-script">假名类型</label><select id="setting-script"><option value="hira" ${s.script==='hira'?'selected':''}>平假名 · ひらがな</option><option value="kata" ${s.script==='kata'?'selected':''}>片假名 · カタカナ</option><option value="mixed" ${s.script==='mixed'?'selected':''}>平假名 + 片假名</option></select></div><div class="field"><fieldset><legend>练习范围</legend><div class="checkboxes">${Object.entries(D.groups).map(([g,n])=>`<label><input type="checkbox" name="setting-group" value="${g}" ${s.groups.includes(g)?'checked':''}>${n}</label>`).join('')}</div></fieldset></div><div class="field"><label for="setting-row">按行练习</label><select id="setting-row"><option value="all">全部所选行</option>${rows.map(r=>`<option value="${r}" ${s.row===r?'selected':''}>${r==='a'?'元音':r==='nn'?'拨音 n':r+' 行'}</option>`).join('')}</select></div>${kind==='quiz'?`<div class="field"><label for="setting-mode">答题方式</label><select id="setting-mode"><option value="recognition" ${s.mode==='recognition'?'selected':''}>看假名 → 选罗马音</option><option value="reverse" ${s.mode==='reverse'?'selected':''}>看罗马音 → 选假名</option><option value="typing" ${s.mode==='typing'?'selected':''}>看假名 → 输入罗马音</option></select></div>`:''}<div class="field"><label for="setting-count">${kind==='cards'?'卡片':'题目'}数量</label><select id="setting-count">${[['10','10'],['20','20'],['46','46'],['all','全部所选假名']].map(([v,n])=>`<option value="${v}" ${s.count===v?'selected':''}>${n}${v==='all'?'':' 个'}</option>`).join('')}</select></div><button class="button full" data-action="start-session" data-kind="${kind}">${I(kind==='cards'?'cards':kind==='listen'?'sound':'pen')}开始${kind==='cards'?'记忆':kind==='listen'?'听音':'测验'} ${I('arrow')}</button><p class="muted">每次随机出题，同一轮内不重复。题量以所选假名数量为上限。</p></section>`;
  }
  function setup(kind){const content={cards:['FLASHCARDS','记住一音，收获一点。','先在心里读出来，再翻开卡片看看。记忆需要一点点耐心。'],quiz:['A LITTLE CHALLENGE','今天，记住了多少？','把刚认识的假名变成小小的成就。答错的假名会自动加入复习。'],listen:['LISTEN & LEARN','用耳朵，认识日语。','点击播放，听一听这个音，再选出对应的假名。']}[kind];
    return intro(...content)+(kind==='listen'?`<div class="session-warning" id="voice-status">${hasJapaneseVoice()?'已检测到日语语音，准备好就开始吧。':'听音练习需要设备提供日语语音。正在检测；若未找到，请安装系统日语语音包后刷新。'}</div>`:'')+`<div class="workspace-grid">${settingsPanel(kind)}<div class="setup-art"><div><div class="big" lang="ja">${kind==='listen'?'きく':kind==='cards'?'あ ア':'かな'}</div><div class="eyebrow">${kind==='listen'?'LISTEN. RECOGNIZE. REPEAT.':'SMALL STEPS, LASTING MEMORIES.'}</div><h2>${kind==='listen'?'每个声音，都有自己的模样。':kind==='cards'?'轻轻翻开，让记忆发芽。':'给自己一个小小的挑战。'}</h2><p>${kind==='listen'?'平假名与片假名共享读音，从听见到认出。':'从一行开始也很好。你可以自由选择练习范围。'}</p><p class="muted">${kind==='cards'?'翻面后再评价记忆状态；连续记对 3 次标记为掌握。':'每轮结束可查看结果，并单独重练错题。'}</p></div></div></div>`;
  }
  function selectedPool(){const s=ui.settings;return allCards().filter(e=>s.groups.includes(e.group)&&(s.script==='mixed'||e.script===s.script)&&(s.row==='all'||e.row===s.row));}
  function startSession(kind,customPool,countOverride){
    if(kind==='listen'&&!hasJapaneseVoice()){toast('当前设备没有可用的日语语音，请安装日语语音包后重试。');return;}
    const pool=customPool||selectedPool();if(!pool.length){toast('请至少选择一组假名。');return;}
    const count=customPool?Math.min(pool.length,countOverride||pool.length):ui.settings.count==='all'?pool.length:Math.min(Number(ui.settings.count),pool.length);
    const mode=kind==='cards'?'cards':kind==='listen'?'listen':ui.settings.mode;
    session={kind,mode,pool,queue:L.shuffle(pool).slice(0,count),index:0,results:[],answered:false,flipped:false,done:false,start:Date.now(),origin:view()};prepareQuestion();render();
  }
  function prepareQuestion(){
    if(!session)return;session.answered=false;session.flipped=false;session.feedback='';
    const c=session.queue[session.index];session.options=L.choices(c,session.pool,session.mode,c.script);
  }
  function sessionView(){
    if(session.done)return resultView();const s=session,c=s.queue[s.index],isCard=s.kind==='cards';
    return `<div class="session-wrap"><div class="session-top"><span>${D.scripts[c.script]} · ${D.groups[c.group]}</span><span>${s.index+1} / ${s.queue.length}</span><button class="button ghost small" data-action="exit-session">结束本轮 ×</button></div><div class="session-progress"><span style="width:${s.index/s.queue.length*100}%"></span></div><section class="panel question-panel"><div class="question-tag">${isCard?'TAKE A MOMENT TO REMEMBER':s.mode==='listen'?'LISTEN CAREFULLY':s.mode==='reverse'?'FIND THE KANA':'READ THE KANA'}</div>${isCard?`<p class="question-instruction">先试着回忆读音，再翻开卡片。</p><button class="flip-card" data-action="flip" aria-label="${s.flipped?'隐藏读音':'翻开查看读音'}"><div class="question-kana" lang="ja">${c[c.script]}</div><div class="flip-answer">${s.flipped?c.romaji:'· · ·'}</div><div class="flip-helper">${s.flipped?'点击卡片可再次隐藏读音':'点击翻面 · 或按空格键'}</div></button>${s.flipped?`<div class="rating-actions"><button class="button secondary" data-action="rate" data-success="false">1 · 还没记住</button><button class="button" data-action="rate" data-success="true">2 · 记住了 ${I('check')}</button></div><button class="button ghost small" data-action="speak-current">${I('sound')}听一听</button>`:'<p class="muted">诚实地评价记忆状态，慢慢来就好。</p>'}`:
    `${s.mode==='listen'?`<button class="play-large" data-action="speak-current" aria-label="播放本题日语读音">${I('sound')}</button><p class="question-instruction">点击播放，选择你听到的假名</p>`:`<div class="question-kana ${s.mode==='reverse'?'roman':''}" ${s.mode==='reverse'?'':'lang="ja"'}>${s.mode==='reverse'?c.romaji:c[c.script]}</div><p class="question-instruction">${s.mode==='typing'?'请输入这个假名的罗马音':s.mode==='reverse'?'选择与这个读音对应的假名':'选择正确的罗马音'}</p>`}
    ${s.mode==='typing'?`<form id="typing-form" class="typing-form"><input id="typing-answer" aria-label="输入罗马音" autocomplete="off" autocapitalize="none" spellcheck="false" inputmode="text" maxlength="12" ${s.answered?'disabled':''} value="${esc(s.typed||'')}" placeholder="输入罗马音"><button type="submit" class="button" ${s.answered?'disabled':''}>确认</button></form>`:`<div class="answer-options">${s.options.map((o,i)=>{const expected=s.mode==='reverse'||s.mode==='listen'?c[c.script]:c.romaji;return `<button class="answer-option ${s.mode==='reverse'||s.mode==='listen'?'kana-option':''} ${s.answered?(o===expected?'correct':o===s.chosen?'wrong':''):''}" data-action="answer" data-value="${esc(o)}" ${s.answered?'disabled':''}>${o}<small>${i+1}</small></button>`;}).join('')}</div>`}
    <div class="feedback ${s.answered?s.results.at(-1).success?'good':'bad':''}" role="status" aria-live="polite">${s.answered?s.feedback:'选择答案，或使用键盘快捷键。'}</div>${s.answered?`<div class="next-row"><button class="button" data-action="next-question">${s.index===s.queue.length-1?'查看结果':'下一个'} ${I('arrow')}</button><button class="button ghost" data-action="speak-current">${I('sound')}读音</button></div>`:''}`}</section><p class="muted" style="text-align:center;margin-top:17px">${isCard?'空格翻面 · 1 还没记住 · 2 记住了':s.mode==='typing'?'Enter 确认答案 · 再按 Enter 进入下一题':'1–4 选择答案 · Enter 进入下一题'}</p></div>`;
  }
  function answer(value){
    if(!session||session.done||session.answered||session.kind==='cards')return;
    const s=session,c=s.queue[s.index];if(!value.trim())return;
    const success=s.mode==='typing'?c.accepted.includes(L.normalize(value)):value===(s.mode==='reverse'||s.mode==='listen'?c[c.script]:c.romaji);
    s.chosen=value;s.typed=s.mode==='typing'?value:'';s.answered=true;s.results.push({card:c,success});
    const accepted=c.accepted.join(' / ');
    s.feedback=success?`答对了！${c[c.script]} → ${c.romaji}`:`再记一次：${c[c.script]} → ${accepted}。已加入复习。`;
    L.record(state,L.key(c,c.script),success,true);save();render();
    setTimeout(()=>document.querySelector('[data-action="next-question"]')?.focus({preventScroll:true}),0);
  }
  function rate(success){if(!session||session.done||session.kind!=='cards'||!session.flipped)return;const c=session.queue[session.index];session.results.push({card:c,success});L.record(state,L.key(c,c.script),success,false);save();nextQuestion();}
  function nextQuestion(){if(!session||session.done)return;if(session.kind!=='cards'&&!session.answered)return;session.index++;session.typed='';if(session.index>=session.queue.length)session.done=true;else prepareQuestion();render();}
  function resultView(){
    const s=session,correct=s.results.filter(r=>r.success).length,missed=s.results.filter(r=>!r.success),elapsed=Math.max(1,Math.round((Date.now()-s.start)/1000));
    return `<div class="session-wrap"><section class="panel question-panel"><div class="eyebrow">A LITTLE PROGRESS, WELL DONE</div><h1 style="font-size:23px;font-weight:500">这一轮，小有收获。</h1><div class="result-figure">${Math.round(correct/s.queue.length*100)}<small>%</small></div><p class="muted">${s.kind==='cards'?'本轮记忆自评':'本轮测验正确率'} · ${missed.length?'继续照顾那些还没记牢的小种子。':'每一个小小的坚持，都算数。'}</p><div class="result-grid"><div><strong>${correct} / ${s.queue.length}</strong><span>${s.kind==='cards'?'记住了':'答对题数'}</span></div><div><strong>${elapsed}<small style="font-size:12px"> 秒</small></strong><span>本轮用时</span></div><div><strong>${missed.length}</strong><span>待巩固</span></div></div><div class="button-row" style="justify-content:center">${missed.length?'<button class="button" data-action="retry-missed">再练本轮错题</button>':''}<button class="button ${missed.length?'secondary':''}" data-action="restart">再来一轮</button><button class="button secondary" data-action="exit-session">返回设置</button></div>${missed.length?`<div class="result-list"><div class="muted">这几个假名，值得再看一眼</div>${missed.map(r=>`<div class="result-item"><span class="kana-char" lang="ja">${r.card[r.card.script]}</span><span>${r.card.romaji}</span><small>${D.scripts[r.card.script]}</small><button class="sound-button" data-action="speak" data-text="${r.card[r.card.script]}" aria-label="播放 ${r.card[r.card.script]}">${I('sound')}</button></div>`).join('')}</div>`:''}</section></div>`;
  }
  function review(){
    const wrong=wrongCards(),due=dueCards(),list=ui.reviewFilter==='wrong'?wrong:due;
    return intro('GROW THROUGH REVIEW','再见一面，记得更牢。','答错的假名和手动标记的假名会留在这里。连续记对 3 次后，自动移出待巩固列表。')+`<div class="section-heading"><div class="pills"><button class="pill ${ui.reviewFilter==='wrong'?'active':''}" data-action="review-filter" data-filter="wrong">错题与标记 · ${wrong.length}</button><button class="pill ${ui.reviewFilter==='due'?'active':''}" data-action="review-filter" data-filter="due">到期复习 · ${due.length}</button></div>${list.length?'<button class="button" data-action="start-review">开始复习 '+I('arrow')+'</button>':''}</div>${list.length?`<div class="review-list">${list.map(e=>`<div class="panel review-card"><span class="kana-char" lang="ja">${e[e.script]}</span><div><strong>${e.romaji}</strong><small>${D.scripts[e.script]} · 连续记对 ${cardState(e,e.script).streak} 次</small></div><button class="sound-button" data-action="speak" data-text="${e[e.script]}" aria-label="播放 ${e[e.script]}">${I('sound')}</button></div>`).join('')}</div>`:`<section class="panel empty-state"><div class="big" lang="ja">芽</div><h2>${ui.reviewFilter==='wrong'?'这里还没有待巩固的假名。':'暂时没有到期的卡片。'}</h2><p>${ui.reviewFilter==='wrong'?'完成一轮小测验，或者在五十音图中标记想复习的假名。':'记忆确认后，卡片将在 1、3、7、14、30 天后提醒复习。'}</p><button class="button" data-action="view" data-view="quiz">去做一次测验 ${I('arrow')}</button></section>`}`;
  }
  function progress(){
    const days=Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);return {key:L.dateKey(d),label:`${d.getMonth()+1}/${d.getDate()}`};});
    return intro('YOUR LITTLE ACHIEVEMENTS','看，你已经走了这么远。','每一次练习，都是记忆生长的痕迹。学习记录保存在当前浏览器，可导出备份。')+summary()+`<div class="progress-pair"><section class="panel"><h2>假名掌握情况</h2>${['hira','kata'].map(s=>`<div class="mastery-line"><span>${D.scripts[s]}</span><span>${mastered(s)} / 104</span></div><div class="progress-track"><span style="width:${mastered(s)/104*100}%"></span></div>${Object.keys(D.groups).map(g=>`<div class="mastery-line muted"><span>${D.groups[g]}</span><span>${mastered(s,g)} / ${D.entries.filter(e=>e.group===g).length}</span></div>`).join('')}`).join('')}<p class="muted" style="margin-top:20px">卡片自评「记住了」与测验答对均累计记忆次数；连续记对 3 次标记掌握，记错后重新累计。</p></section><section class="panel"><h2>最近 7 天</h2><p class="muted">包括记忆卡、假名测验与台词小测，每次评价记录 1 次。</p><div class="heatmap">${days.map(d=>`<div class="day-square ${state.daily[d.key]?'done':''}" title="${d.key}: ${state.daily[d.key]||0} 次"><span>${d.label}</span><strong>${state.daily[d.key]||0}</strong></div>`).join('')}</div><div class="result-grid"><div><strong>${L.streakDays(state.daily)}</strong><span>连续学习天数</span></div><div><strong>${state.answers}</strong><span>累计测验题数</span></div></div><p class="muted">假名正确率只统计假名测验与听音题，不包含卡片自评；台词小测在「台词教室」中单独统计。今日目标：20 次练习。</p></section></div><section class="panel data-actions"><h2>照顾好你的学习记录</h2><p class="muted">记录不会自动跨设备同步。清除浏览器数据会移除记录；可以导出 JSON，再在另一台设备导入。</p><div class="button-row"><button class="button secondary" data-action="export">${I('download')}导出备份</button><button class="button secondary" data-action="import">${I('upload')}导入备份</button><button class="button ghost" data-action="reset">清空记录</button></div><p class="muted">离线使用：在线打开一次后，支持的浏览器会缓存页面。语音是否离线可用取决于设备的日语语音包。</p></section>`;
  }
  function about(){return intro('ABOUT THE GARDEN','从五十音，走向更大的世界。','一个简洁、安静的日语假名练习空间。')+`<article class="panel article"><h2>怎么开始？</h2><p>先在五十音图中认识一行假名，再用记忆卡回忆，最后完成 10 题小测验。可以按行筛选练习范围，也可以混合平假名与片假名。答错的假名会自动进入「温故知新」。</p><h2>发音与罗马音</h2><p>本程序包含每种文字的 46 个清音（含拨音 ん）、25 个浊音与半浊音，以及 33 个常用拗音。五十音图是传统名称，并不是 50 个不同的基础假名。较少见的「ぢゃ／ぢゅ／ぢょ」、外来语扩展组合和历史假名未收录。</p><p>默认显示常见的赫本式写法；输入题也接受 shi / si、chi / ti、tsu / tu、fu / hu、ji / zi 等常见替代写法。ぢ另接受 di，づ另接受 du。相同读音的假名不会同时作为反向题或听音题的干扰选项。</p><table><thead><tr><th>假名</th><th>学习提示</th></tr></thead><tbody><tr><td lang="ja">は・へ・を</td><td>作为助词时常读作 wa、e、o；字母识读题使用 ha、he、wo（を也接受 o）。</td></tr><tr><td lang="ja">じ / ぢ、ず / づ</td><td>在现代标准日语中通常同音，本表显示 ji、zu。</td></tr><tr><td lang="ja">きゃ・しゅ・ちょ</td><td>小写的ゃゅょ与前一个假名合读一拍，注意与大写やゆよ区分。</td></tr><tr><td lang="ja">っ / ッ、ー</td><td>小写っ表示促音，ー表示片假名词中的长音；本程序不把它们当作独立音节测试。</td></tr></tbody></table><h2>关于声音</h2><p>发音调用浏览器的 Speech Synthesis（日语语音），不包含录制的真人音频。设备必须有可用的日语语音。语音包缺失时，听音练习会提示安装，其他练习仍可使用。单字语音可能与自然语流中的音变或声调有所不同。</p><h2>GitHub 检索与参考</h2><p>制作前检索了下列公开项目，并参考「自选范围 → 随机测试 → 复习薄弱假名」的学习流程。本程序独立编写，未复制这些项目的源码或素材。</p><table><thead><tr><th>项目</th><th>相关功能</th></tr></thead><tbody><tr><td><a href="https://github.com/furudean/type-kana" target="_blank" rel="noopener noreferrer">Type Kana ↗</a></td><td>平假名、片假名输入测验；仓库提供在线版本链接。</td></tr><tr><td><a href="https://github.com/davidbelesp/kana-practice" target="_blank" rel="noopener noreferrer">Kana Practice ↗</a></td><td>假名图表、自选测验与学习进度。</td></tr><tr><td><a href="https://github.com/skywind3000/KanaQuiz" target="_blank" rel="noopener noreferrer">KanaQuiz ↗</a></td><td>Python 命令行速读测试与历史记录。</td></tr></tbody></table><p>已确认存在相关开源仓库；GitHub Releases 页面未能完整读取，因此不把源码仓库等同于已核验的安装包发布。</p><h2>你的学习记录</h2><p>练习数据使用浏览器 localStorage 保存，不发送给学习数据服务器。导入备份会替换当前记录。访问托管页面时仍适用托管平台自身的访问机制。关闭页面后不会主动发送复习通知。</p><div class="button-row"><button class="button" data-action="view" data-view="chart">回到五十音图 ${I('arrow')}</button><button class="button secondary" data-action="view" data-view="progress">管理学习记录</button></div></article>`;}
  function render(){updateShell();const current=view();$('#main').innerHTML=warning()+(session&&session.origin===current?sessionView():current==='chart'?chart():current==='dialogue'?dialogue.render():['cards','quiz','listen'].includes(current)?setup(current):current==='review'?review():current==='progress'?progress():about());if(session&&!session.done&&!session.answered&&session.mode==='typing')setTimeout(()=>$('#typing-answer')?.focus({preventScroll:true}),0);}
  function navigate(target){if(!names[target])return;session=null;dialogue.leave();if('speechSynthesis' in window)speechSynthesis.cancel();if(location.hash===`#${target}`)render();else location.hash=target;window.scrollTo({top:0,behavior:'instant'});}
  function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`kana-garden-${L.dateKey()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('学习记录已导出。');}
  document.addEventListener('click',event=>{
    const b=event.target.closest('[data-action]');if(!b||b.disabled)return;const a=b.dataset.action;
    if(dialogue.handle(a,b))return;
    if(a==='view')navigate(b.dataset.view);
    else if(a==='script'){ui.script=b.dataset.script;render();}
    else if(a==='group'){ui.group=b.dataset.group;render();}
    else if(a==='select-kana'){ui.selected=b.dataset.id;render();}
    else if(a==='next-kana'||a==='prev-kana'){const list=D.entries.filter(e=>e.group===ui.group),i=list.findIndex(e=>e.id===ui.selected);ui.selected=list[(i+(a==='next-kana'?1:-1)+list.length)%list.length].id;render();}
    else if(a==='speak-detail')speak(entry(ui.selected)[ui.script]);
    else if(a==='speak')speak(b.dataset.text);
    else if(a==='speak-current'&&session&&!session.done)speak(session.queue[session.index][session.queue[session.index].script]);
    else if(a==='mark-review'){const k=L.key(entry(ui.selected),ui.script),c=state.cards[k]||{streak:0,wrong:0,review:false,due:0};c.review=!c.review;state.cards[k]=c;save();render();toast(c.review?'已加入复习，可在「温故知新」中练习。':'已取消手动复习标记。');}
    else if(a==='quick-start'){ui.settings.script=ui.script;ui.settings.groups=[ui.group];ui.settings.row='all';navigate('quiz');}
    else if(a==='start-session')startSession(b.dataset.kind);
    else if(a==='answer')answer(b.dataset.value);
    else if(a==='next-question')nextQuestion();
    else if(a==='flip'&&session&&!session.done){session.flipped=!session.flipped;render();}
    else if(a==='rate')rate(b.dataset.success==='true');
    else if(a==='exit-session'){session=null;if('speechSynthesis' in window)speechSynthesis.cancel();render();}
    else if(a==='review-filter'){ui.reviewFilter=b.dataset.filter;render();}
    else if(a==='start-review')startSession('quiz',ui.reviewFilter==='wrong'?wrongCards():dueCards());
    else if(a==='retry-missed'){const kind=session.kind,pool=session.results.filter(r=>!r.success).map(r=>r.card);startSession(kind,pool);}
    else if(a==='restart'){const kind=session.kind,pool=session.pool,count=session.queue.length;startSession(kind,pool,count);}
    else if(a==='export')exportData();
    else if(a==='import'){$('#import-file').value='';$('#import-file').click();}
    else if(a==='reset')$('#confirm-dialog').showModal();
    else if(a==='cancel-reset')$('#confirm-dialog').close();
    else if(a==='confirm-reset'){state=L.fresh();save();$('#confirm-dialog').close();render();toast('学习记录已清空，重新出发。');}
  });
  document.addEventListener('change',async event=>{
    const el=event.target;
    if(dialogue.change(el))return;
    if(el.id==='show-romaji'){ui.showRomaji=el.checked;render();}
    else if(el.name==='setting-group'){ui.settings.groups=[...document.querySelectorAll('input[name="setting-group"]:checked')].map(i=>i.value);ui.settings.row='all';render();}
    else if(el.id.startsWith('setting-')){const name=el.id.slice(8);if(Object.hasOwn(ui.settings,name))ui.settings[name]=el.value;}
    else if(el.id==='import-file'&&el.files[0]){
      const file=el.files[0];if(file.size>2*1024*1024){toast('备份文件过大，请选择本程序导出的 JSON 文件。');return;}
      try{const data=JSON.parse(await file.text());const keys=new Set(allCards().map(e=>L.key(e,e.script)));if(!L.valid(data)||Object.keys(data.cards).some(k=>!keys.has(k))||Object.keys(data.daily).some(k=>!/^\d{4}-\d{2}-\d{2}$/.test(k)))throw new Error('invalid');
        if(!window.confirm('导入备份会替换当前浏览器的学习记录，是否继续？'))return;
        state=data;save();render();toast('备份已导入，可以继续学习了。');
      }catch{toast('无法读取这个备份，请选择假名花园导出的有效 JSON 文件。');}
    }
  });
  document.addEventListener('submit',event=>{if(event.target.id==='typing-form'){event.preventDefault();answer($('#typing-answer').value);}});
  document.addEventListener('keydown',event=>{
    if(view()==='dialogue'){dialogue.keydown(event);return;}
    if(!session||session.done||event.ctrlKey||event.altKey||event.metaKey||$('#confirm-dialog').open)return;
    if(/^(INPUT|SELECT|TEXTAREA)$/.test(event.target.tagName))return;
    if(event.key==='Enter'&&session.answered){event.preventDefault();nextQuestion();}
    else if(session.kind==='cards'&&event.code==='Space'){event.preventDefault();session.flipped=!session.flipped;render();}
    else if(session.kind==='cards'&&session.flipped&&['1','2'].includes(event.key)){event.preventDefault();rate(event.key==='2');}
    else if(session.kind!=='cards'&&session.mode!=='typing'&&!session.answered&&/^[1-4]$/.test(event.key)){event.preventDefault();const option=session.options[Number(event.key)-1];if(option)answer(option);}
  });
  window.addEventListener('hashchange',()=>{session=null;dialogue.leave();render();});
  if('speechSynthesis' in window)speechSynthesis.addEventListener('voiceschanged',()=>{const status=$('#voice-status');if(status)status.textContent=hasJapaneseVoice()?'已检测到日语语音，准备好就开始吧。':'未检测到日语语音。请安装系统日语语音包后刷新；其他练习仍可使用。';});
  if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol))navigator.serviceWorker.register('./sw.js').catch(()=>{});
  render();
})();
