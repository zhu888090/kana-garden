(function (root) {
  'use strict';
  const base = [
    ['a','あいうえお',['a','i','u','e','o']],
    ['k','かきくけこ',['ka','ki','ku','ke','ko']],
    ['s','さしすせそ',['sa','shi','su','se','so']],
    ['t','たちつてと',['ta','chi','tsu','te','to']],
    ['n','なにぬねの',['na','ni','nu','ne','no']],
    ['h','はひふへほ',['ha','hi','fu','he','ho']],
    ['m','まみむめも',['ma','mi','mu','me','mo']],
    ['y','や ゆ よ',['ya',null,'yu',null,'yo']],
    ['r','らりるれろ',['ra','ri','ru','re','ro']],
    ['w','わ   を',['wa',null,null,null,'wo']],
    ['nn','ん    ',['n',null,null,null,null]]
  ];
  const voiced = [
    ['g','がぎぐげご',['ga','gi','gu','ge','go']],
    ['z','ざじずぜぞ',['za','ji','zu','ze','zo']],
    ['d','だぢづでど',['da','ji','zu','de','do']],
    ['b','ばびぶべぼ',['ba','bi','bu','be','bo']],
    ['p','ぱぴぷぺぽ',['pa','pi','pu','pe','po']]
  ];
  const compounds = [
    ['ky','き',['kya','kyu','kyo']],['sh','し',['sha','shu','sho']],
    ['ch','ち',['cha','chu','cho']],['ny','に',['nya','nyu','nyo']],
    ['hy','ひ',['hya','hyu','hyo']],['my','み',['mya','myu','myo']],
    ['ry','り',['rya','ryu','ryo']],['gy','ぎ',['gya','gyu','gyo']],
    ['j','じ',['ja','ju','jo']],
    ['by','び',['bya','byu','byo']],['py','ぴ',['pya','pyu','pyo']]
  ];
  const aliases = {shi:['si'],chi:['ti'],tsu:['tu'],fu:['hu'],ji:['zi'],sha:['sya'],shu:['syu'],sho:['syo'],cha:['tya','cya'],chu:['tyu','cyu'],cho:['tyo','cyo'],ja:['jya','zya'],ju:['jyu','zyu'],jo:['jyo','zyo'],wo:['o'],n:["n'",'nn']};
  const examples = {
    a:['あめ','ame','雨'],i:['いぬ','inu','狗'],u:['うみ','umi','海'],e:['えき','eki','车站'],o:['おと','oto','声音'],
    ka:['かさ','kasa','伞'],ki:['き','ki','树'],ku:['くも','kumo','云'],ke:['けさ','kesa','今天早晨'],ko:['こえ','koe','声音'],
    sa:['さかな','sakana','鱼'],shi:['しお','shio','盐'],su:['すし','sushi','寿司'],se:['せかい','sekai','世界'],so:['そら','sora','天空'],
    ta:['たこ','tako','章鱼'],chi:['ちず','chizu','地图'],tsu:['つき','tsuki','月亮'],te:['て','te','手'],to:['とり','tori','鸟'],
    na:['なつ','natsu','夏天'],ni:['にく','niku','肉'],nu:['ぬの','nuno','布'],ne:['ねこ','neko','猫'],no:['のり','nori','海苔'],
    ha:['はな','hana','花'],hi:['ひと','hito','人'],fu:['ふゆ','fuyu','冬天'],he:['へや','heya','房间'],ho:['ほし','hoshi','星星'],
    ma:['まど','mado','窗户'],mi:['みみ','mimi','耳朵'],mu:['むし','mushi','昆虫'],me:['め','me','眼睛'],mo:['もり','mori','森林'],
    ya:['やま','yama','山'],yu:['ゆき','yuki','雪'],yo:['よる','yoru','夜晚'],ra:['らく','raku','轻松'],ri:['りす','risu','松鼠'],ru:['るす','rusu','不在家'],re:['れきし','rekishi','历史'],ro:['ろく','roku','六'],wa:['わたし','watashi','我'],wo:['ほんをよむ','hon o yomu','读书'],n:['ほん','hon','书']
  };
  const kataExamples = {a:['アイス','aisu','冰淇淋'],i:['インク','inku','墨水'],u:['ウール','uuru','羊毛'],e:['エアコン','eakon','空调'],o:['オレンジ','orenji','橙子'],ka:['カメラ','kamera','相机'],ki:['キウイ','kiui','猕猴桃'],ku:['クラス','kurasu','班级'],ke:['ケーキ','keeki','蛋糕'],ko:['コーヒー','koohii','咖啡'],shi:['シャツ','shatsu','衬衫'],tsu:['ツアー','tsuaa','旅行团'],so:['ソファ','sofa','沙发'],n:['パン','pan','面包']};
  const toKata = str => [...str].map(c=>{ const n=c.charCodeAt(0);return n>=0x3041&&n<=0x3096?String.fromCharCode(n+0x60):c;}).join('');
  const entries=[];
  function add(group,row,hira,romaji,col) {
    if(!romaji)return;
    const accepted=[romaji,...(aliases[romaji]||[])];
    if(hira==='ぢ')accepted.push('di');
    if(hira==='づ')accepted.push('du');
    if(hira.startsWith('ぢ')&&group==='yoon')accepted.push({ja:'dya',ju:'dyu',jo:'dyo'}[romaji]);
    entries.push({id:`${group}-${row}-${col}`,group,row,hira,kata:toKata(hira),romaji,accepted,col});
  }
  for(const [row,chars,readings] of base) readings.forEach((r,c)=>add('basic',row,chars[c],r,c));
  for(const [row,chars,readings] of voiced) readings.forEach((r,c)=>add('voiced',row,chars[c],r,c));
  for(const [row,char,readings] of compounds) readings.forEach((r,c)=>add('yoon',row,char+['ゃ','ゅ','ょ'][c],r,c));
  const data={entries,toKata,examples,kataExamples,groups:{basic:'清音',voiced:'浊音 / 半浊音',yoon:'拗音'},scripts:{hira:'平假名',kata:'片假名'}};
  root.KanaData=data;
  if(typeof module!=='undefined')module.exports=data;
})(typeof globalThis!=='undefined'?globalThis:this);
