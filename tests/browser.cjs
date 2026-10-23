const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const fs=require('node:fs');
const {chromium}=require(process.env.KANA_PLAYWRIGHT_MODULE||'playwright');
const D=require('../dist/kana-data.js');
(async()=>{
 const browser=await chromium.launch({...(process.env.KANA_BROWSER_PATH?{executablePath:process.env.KANA_BROWSER_PATH}:{}),headless:true});
 const artifacts=path.resolve(__dirname,'../artifacts');fs.mkdirSync(artifacts,{recursive:true});
 const context=await browser.newContext({viewport:{width:1440,height:1100},acceptDownloads:true});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(pathToFileURL(path.resolve(__dirname,'../dist/index.html')).href);
 await page.locator('.kana-cell').first().waitFor();
 assert.equal(await page.locator('.kana-cell').count(),46);
 await page.locator('[data-action="script"][data-script="kata"]').click();
 assert.equal(await page.locator('.kana-cell').first().innerText(),'ア\na');
 await page.locator('[data-action="group"][data-group="voiced"]').click();assert.equal(await page.locator('.kana-cell').count(),25);
 await page.locator('[data-action="group"][data-group="yoon"]').click();assert.equal(await page.locator('.kana-cell').count(),33);
 await page.locator('[data-action="script"][data-script="hira"]').click();await page.locator('[data-action="group"][data-group="basic"]').click();
 await page.locator('#show-romaji').uncheck();assert.equal(await page.locator('.kana-cell').first().getAttribute('aria-label'),'あ');await page.locator('#show-romaji').check();
 await page.screenshot({path:path.join(artifacts,'preview-desktop.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'mobile overflow');
 await page.screenshot({path:path.join(artifacts,'preview-mobile.png'),fullPage:true});
 await page.setViewportSize({width:1440,height:1100});
 await page.locator('#nav [data-view="quiz"]').click();await page.locator('#setting-row').selectOption('a');
 await page.locator('#setting-count').selectOption('10');await page.locator('[data-action="start-session"]').click();
 for(let i=0;i<5;i++){
   const kana=(await page.locator('.question-kana').innerText()).trim(),e=D.entries.find(e=>e.hira===kana);
   const buttons=page.locator('.answer-option');
   if(i===0){for(let j=0;j<await buttons.count();j++){const b=buttons.nth(j);if((await b.innerText()).split('\n')[0]!==e.romaji){await b.click();break;}}}
   else await page.locator(`.answer-option[data-value="${e.romaji}"]`).click();
   assert.equal(await page.locator('.answer-option:enabled').count(),0);
   await page.locator('[data-action="next-question"]').click();
 }
 assert.equal((await page.locator('.result-figure').innerText()).trim(),'80%');
 let state=await page.evaluate(()=>JSON.parse(localStorage.getItem('kana-garden-progress-v1')));assert.equal(state.answers,5);assert.equal(state.correct,4);assert.equal(Object.values(state.cards).filter(c=>c.review).length,1);
 await page.locator('[data-action="exit-session"]').click();
 await page.locator('#setting-row').selectOption('s');await page.locator('#setting-mode').selectOption('typing');await page.locator('[data-action="start-session"]').click();
 for(let i=0;i<5;i++){
   const kana=(await page.locator('.question-kana').innerText()).trim(),e=D.entries.find(e=>e.hira===kana);
   await page.locator('#typing-answer').fill(' '+(e.hira==='し'?'SI':e.romaji.toUpperCase())+' ');await page.locator('#typing-form').locator('button').click();
   assert.ok((await page.locator('.feedback').innerText()).startsWith('答对了'));
   await page.locator('[data-action="next-question"]').click();
 }
 assert.equal((await page.locator('.result-figure').innerText()).trim(),'100%');
 await page.locator('#nav [data-view="cards"]').click();await page.locator('#setting-row').selectOption('a');await page.locator('[data-action="start-session"]').click();
 for(let i=0;i<5;i++){await page.locator('[data-action="flip"]').click();await page.locator('[data-action="rate"][data-success="true"]').click();}
 state=await page.evaluate(()=>JSON.parse(localStorage.getItem('kana-garden-progress-v1')));assert.equal(state.answers,10);assert.equal(state.correct,9);assert.equal(Object.values(state.daily).reduce((a,b)=>a+b,0),15);
 await page.reload();assert.equal((await page.evaluate(()=>JSON.parse(localStorage.getItem('kana-garden-progress-v1')))).answers,10);
 await page.locator('#nav [data-view="review"]').click();assert.equal(await page.locator('.review-card').count(),1);
 await page.locator('[data-action="start-review"]').click();assert.ok(await page.locator('.question-panel').isVisible());
 await page.locator('[data-action="exit-session"]').click();
 await page.locator('.side-link[data-view="progress"]').click();
 const dl=page.waitForEvent('download');await page.locator('[data-action="export"]').click();assert.ok((await dl).suggestedFilename().endsWith('.json'));
 await page.locator('#nav [data-view="listen"]').click();await page.locator('#voice-status').waitFor();assert.ok(await page.locator('#voice-status').isVisible());
 if(!await page.evaluate(()=>speechSynthesis.getVoices().some(v=>/^ja([_-]|$)/i.test(v.lang)))){await page.locator('[data-action="start-session"]').click();assert.equal(await page.locator('.question-panel').count(),0);}
 await page.locator('.side-link[data-view="about"]').click();await page.locator('article').waitFor();assert.equal(await page.locator('article a[target="_blank"]').count(),3);
 assert.deepEqual(errors,[]);
 await context.close();await browser.close();console.log('Browser checks passed: charts, mobile layout, quiz, typing aliases, flashcards, progress, persistence, review, export, audio fallback and sources.');
})().catch(e=>{console.error(e);process.exit(1);});
