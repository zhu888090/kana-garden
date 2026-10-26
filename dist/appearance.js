/* Appearance preferences are independent from learning records. */
(() => {
  'use strict';
  const KEY='kana-garden-appearance-v1';
  const themes={
    frieren:{name:'芙莉莲',title:'花田里的旅途',work:'葬送的芙莉莲',caption:'FRIEREN · A LITTLE JOURNEY',character:'assets/frieren.webp',background:'assets/frieren-flowers.webp',alt:'芙莉莲官方角色立绘'},
    bocchi:{name:'后藤一里',title:'放课后的约定',work:'孤独摇滚！',caption:'BOCCHI THE ROCK! · AFTER SCHOOL',character:'assets/bocchi.webp',background:'assets/bocchi-band.webp',alt:'后藤一里官方联动角色立绘'}
  };
  const defaults={theme:'frieren',background:true,companion:true,focus:false};
  let prefs={...defaults},line=0;
  try{const p=JSON.parse(localStorage.getItem(KEY));if(p&&themes[p.theme])prefs={theme:p.theme,...Object.fromEntries(['background','companion','focus'].map(k=>[k,typeof p[k]==='boolean'?p[k]:defaults[k]]))};}catch{}
  const messages=[['今日も、少しずつ。','今天也一点一点来。'],['一緒に頑張ろう。','一起加油吧。'],['小さな一歩でいい。','迈出小小的一步就很好。'],['できた！を増やそう。','再收获一个“我会了”吧。']];
  const $=s=>document.querySelector(s);
  const credits=()=>`<h2>动漫画廊与素材来源</h2><p>花田背景与芙莉莲立绘来自<a href="https://frieren-anime.jp/character/chara_group1/1-1/" target="_blank" rel="noopener noreferrer">《葬送的芙莉莲》官方网站</a>及<a href="https://frieren-anime.jp/story/1st/ep02/" target="_blank" rel="noopener noreferrer">第 2 话公开剧照</a>。后藤一里立绘来自<a href="https://syncroom.yamaha.com/topics/2024/02.html" target="_blank" rel="noopener noreferrer">Yamaha × 孤独摇滚！官方联动页</a>；乐队主视觉来源为<a href="https://www.crunchyroll.com/ar/news/latest/2022/9/17/-bocchi-the-rock--" target="_blank" rel="noopener noreferrer">Crunchyroll 公开介绍</a>。</p><p class="art-rights">© 山田鐘人・アベツカサ／小学館／「葬送のフリーレン」製作委員会<br>© はまじあき／芳文社・アニプレックス<br>角色和图片权利归各自权利人所有。本站为非官方学习项目；挂件寄语为原创学习提示。</p>`;
  function hero(){return `<section class="anime-hero hero"><div class="hero-copy"><div class="hero-kicker"><span class="scene-dot"></span><span data-scene-caption></span></div><h1>从「あ」开始，<br>开启你的<em>日语小冒险。</em></h1><p>一行假名，一句台词，一点点靠近喜欢的世界。</p><div class="hero-links"><button class="button" data-action="quick-start">开始今日练习 <span aria-hidden="true">↗</span></button><button class="hero-dialogue" data-action="view" data-view="dialogue">去台词教室 <span aria-hidden="true">→</span></button></div><span class="hero-footnote" lang="ja">好きから、はじめよう。</span></div><div class="hero-visual"><span class="hero-japanese" lang="ja">ことばの旅</span><img data-scene-character src="${themes[prefs.theme].character}" alt="${themes[prefs.theme].alt}" width="230" height="330"><span class="hero-character-name" data-scene-work></span><span class="floating-kana" lang="ja" aria-hidden="true">あ</span><span class="floating-star" aria-hidden="true">✦</span></div><span class="hero-scene-label" data-scene-title></span></section>`;}
  function refresh(){
    const t=themes[prefs.theme];
    document.body.dataset.scene=prefs.theme;
    document.body.classList.toggle('scene-no-background',!prefs.background);
    document.body.classList.toggle('scene-no-companion',!prefs.companion);
    document.body.classList.toggle('scene-focus',prefs.focus);
    document.querySelectorAll('[data-scene-character]').forEach(img=>{if(img.getAttribute('src')!==t.character)img.src=t.character;img.alt=t.alt;});
    document.querySelectorAll('[data-scene-caption]').forEach(el=>el.textContent=t.caption);
    document.querySelectorAll('[data-scene-work]').forEach(el=>el.textContent=t.work);
    document.querySelectorAll('[data-scene-title]').forEach(el=>el.textContent=t.title);
    document.querySelectorAll('[data-scene-name]').forEach(el=>el.textContent=t.name);
    document.querySelectorAll('[data-theme-choice]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.themeChoice===prefs.theme)));
    document.querySelectorAll('[data-appearance="focus"]').forEach(el=>{el.setAttribute('aria-pressed',String(prefs.focus));el.querySelector('span').textContent=prefs.focus?'退出专注':'专注模式';});
    for(const k of ['background','companion'])if($('#appearance-'+k))$('#appearance-'+k).checked=prefs[k];
    $('#companion-ja').textContent=messages[line][0];$('#companion-zh').textContent=messages[line][1];
  }
  function save(){try{localStorage.setItem(KEY,JSON.stringify(prefs));}catch{}refresh();}
  document.addEventListener('click',event=>{
    const choice=event.target.closest('[data-theme-choice]');
    if(choice&&themes[choice.dataset.themeChoice]){prefs.theme=choice.dataset.themeChoice;save();return;}
    const b=event.target.closest('[data-appearance]');if(!b)return;
    const action=b.dataset.appearance;
    if(action==='open')$('#appearance-dialog').showModal();
    else if(action==='close')$('#appearance-dialog').close();
    else if(action==='focus'){prefs.focus=!prefs.focus;save();}
    else if(action==='hide-companion'){prefs.companion=false;save();}
    else if(action==='encourage'){line=(line+1)%messages.length;refresh();}
  });
  document.addEventListener('change',event=>{const k=event.target.id.replace('appearance-','');if(['background','companion'].includes(k)){prefs[k]=event.target.checked;save();}});
  window.KanaAppearance={hero,refresh,credits};
  $('#appearance-credits').innerHTML=credits();
  refresh();
})();
