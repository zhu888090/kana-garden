const fs=require('node:fs');
const path=require('node:path');
const root=__dirname;
let html=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
const icon='data:image/svg+xml;base64,'+fs.readFileSync(path.join(root,'dist/icon.svg')).toString('base64');
html=html.replace('href="icon.svg"',`href="${icon}"`).replace('<link rel="manifest" href="manifest.webmanifest">','');
html=html.replace(/<link rel="stylesheet" href="([^"]+)">/g,(_,file)=>'<style>'+fs.readFileSync(path.join(root,'dist',file),'utf8')+'</style>');
for(const file of ['kana-data.js','dialogue-data.js','learning.js','dialogue.js','appearance.js','app.js']){
 const source=fs.readFileSync(path.join(root,'dist',file),'utf8').replace(/<\/script/gi,'<\\/script');
 html=html.replace(`<script src="${file}" defer></script>`,()=>'<script defer>'+source+'</script>');
}
// Inline classic scripts execute immediately, so move them behind the document body.
const scripts=[];
html=html.replace(/<script defer>[\s\S]*?<\/script>/g,match=>{scripts.push(match.replace('<script defer>','<script>'));return '';});
html=html.replace('</body>',()=>scripts.join('\n')+'\n</body>');
// Keep the downloadable edition self-contained, including theme artwork.
for(const file of fs.readdirSync(path.join(root,'dist/assets'))){
 const asset='assets/'+file;
 const uri='data:image/webp;base64,'+fs.readFileSync(path.join(root,'dist',asset)).toString('base64');
 html=html.split(asset).join(uri);
}
fs.writeFileSync(path.join(root,'假名花园.html'),html,'utf8');
console.log('Portable HTML created.');
