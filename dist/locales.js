/* Source-language keys keep learning data independent from display language. */
(function(root){
 'use strict';
 const messages=Object.create(null);
 const rows=String.raw`
假名花园|Kana Garden|가나 가든
假名花园 · 每天一点日语|Kana Garden · A little Japanese, every day|가나 가든 · 매일 조금씩 일본어
跳至学习内容|Skip to learning|학습 내용으로 건너뛰기
假名花园首页|Kana Garden home|가나 가든 홈
我的日语小天地|YOUR LITTLE JAPANESE WORLD|나만의 일본어 공간
主要导航|Main navigation|주요 메뉴
五十音图|Kana chart|오십음도
记忆卡片|Flashcards|암기 카드
假名测验|Kana quiz|가나 퀴즈
听音练习|Listening|듣기 연습
台词教室|Dialogue club|대사 교실
动漫台词教室|Anime dialogue club|애니 대사 교실
温故知新|Review|복습
学习进度|Progress|학습 기록
关于与学习提示|About & study tips|소개 및 학습 팁
今日的小目标|TODAY'S LITTLE GOAL|오늘의 작은 목표
每天 20 次练习，让记忆慢慢开花。|20 practices a day. Let your memory bloom.|하루 20번 연습하며 기억을 키워 보세요.
今日目标完成，给坚持的自己一朵小花。|Daily goal complete. Celebrate your little win!|오늘 목표 달성! 꾸준히 해낸 나를 칭찬해요.
一音一会，日积月累。|One sound, one small step.|한 소리씩, 한 걸음씩.
我的学习|My learning|나의 학습
天坚持|day streak|일 연속 학습
查看学习进度|View learning progress|학습 기록 보기
学|あ|あ
动漫学习挂件|Anime study companion|애니 학습 친구
收起角色挂件|Hide character artwork & companion|캐릭터와 학습 친구 숨기기
换一句原创学习寄语|Show another original study message|새 학습 응원 메시지 보기
学习搭子 ·|STUDY BUDDY ·|학습 친구 ·
今天也一点一点来。|A little at a time, today too.|오늘도 조금씩 해 봐요.
一起加油吧。|Let's do our best together.|함께 힘내요.
迈出小小的一步就很好。|A small step is enough.|작은 한 걸음이면 충분해요.
再收获一个“我会了”吧。|Add one more “I can do it!”|“이제 알겠다!”를 하나 더 늘려 봐요.
轻点，收获一句鼓励 ↗|Tap for a little encouragement ↗|눌러서 응원 한마디 받기 ↗
动漫主题与外观|Anime themes & appearance|애니 테마 및 꾸미기
芙莉莲 · 花田|Frieren · Flowers|프리렌 · 꽃밭
孤独摇滚 · 放课后|Bocchi · After school|봇치 · 방과 후
专注模式|Focus mode|집중 모드
退出专注|Exit focus|집중 모드 종료
装扮|Customize|꾸미기
装扮花园|Customize your garden|가든 꾸미기
装扮你的花园|Make this garden yours|나만의 가든 꾸미기
给今天的日语时间，换一份喜欢的心情。|Set the mood for today's Japanese adventure.|오늘의 일본어 시간에 좋아하는 분위기를 더해 보세요.
关闭装扮面板|Close appearance settings|꾸미기 닫기
选择动漫主题|Choose an anime theme|애니 테마 선택
花田里的旅途|A journey through flowers|꽃밭을 지나는 여행
放课后的约定|An after-school promise|방과 후의 약속
葬送的芙莉莲 · 青绿 × 奶油白|Frieren · Sage & cream|장송의 프리렌 · 세이지 & 크림
孤独摇滚！ · 樱粉 × 浅紫|Bocchi the Rock! · Pink & lilac|봇치 더 록! · 핑크 & 라일락
葬送的芙莉莲|Frieren: Beyond Journey's End|장송의 프리렌
孤独摇滚！|Bocchi the Rock!|봇치 더 록!
芙莉莲|Frieren|프리렌
后藤一里|Hitori Gotoh|고토 히토리
动漫背景|Anime backgrounds|애니 배경
角色立绘与挂件|Character artwork & companion|캐릭터 일러스트 및 학습 친구
图片来源与作品信息|Artwork sources & credits|이미지 출처 및 작품 정보
就用这个，开始学习|Looks good. Let's learn!|이 테마로 학습 시작
芙莉莲站在花田中的动画剧照|Frieren in a flower field, anime still|꽃밭에 서 있는 프리렌의 애니메이션 장면
孤独摇滚结束乐队官方主视觉|Bocchi the Rock! official band visual|봇치 더 록! 결속 밴드 공식 비주얼
芙莉莲官方角色立绘|Official Frieren character artwork|프리렌 공식 캐릭터 일러스트
后藤一里官方联动角色立绘|Official Hitori Gotoh collaboration artwork|고토 히토리 공식 컬래버레이션 일러스트
从「あ」开始，|Start with「あ」,|「あ」부터 시작해,
开启你的|begin your|나만의
日语小冒险。|Japanese adventure.|일본어 모험을 떠나요.
一行假名，一句台词，一点点靠近喜欢的世界。|One row of kana. One familiar phrase. A little closer to the world you love.|가나 한 줄, 익숙한 대사 한마디. 좋아하는 세계에 한 걸음 더 가까이.
开始今日练习|Start today's practice|오늘의 연습 시작
去台词教室|Visit the dialogue club|대사 교실로 가기
每天一点点，离日语更近一点。|A little every day, a little closer to Japanese.|매일 조금씩, 일본어에 더 가까이.
已掌握假名|Kana mastered|익힌 가나
今日练习|Today's practice|오늘의 연습
假名正确率|Kana accuracy|가나 정답률
待开始|Ready to begin|시작 전
错题与标记|Mistakes & bookmarks|오답 및 표시
点选一个假名，认识它的读音与模样。|Choose a kana to explore its sound and shape.|가나를 눌러 모양과 발음을 살펴보세요.
开始练习|Start practice|연습 시작
假名表|Kana chart|가나 표
假名类型|Script|문자 종류
平假名|Hiragana|히라가나
片假名|Katakana|가타카나
平假名 + 片假名|Hiragana + Katakana|히라가나 + 가타카나
发音分组|Sound group|발음 분류
清音|Basic sounds|청음
浊音 / 半浊音|Voiced / semi-voiced|탁음 / 반탁음
拗音|Combined sounds|요음
显示罗马音|Show romaji|로마자 표시
无对应假名|No kana in this position|해당하는 가나 없음
小绿点表示已掌握|A green dot means mastered|초록 점은 익힌 가나를 뜻해요
认识这个假名|MEET THIS KANA|이 가나 알아보기
加入复习|Add to review|복습에 추가
已加入复习|Added to review|복습에 추가됨
上一个假名|Previous kana|이전 가나
下一个假名|Next kana|다음 가나
花园小贴士|A little study tip|가든 학습 팁
小写拗音，合读一拍|Small combined kana: one beat together|작은 요음은 앞 글자와 합쳐 한 박자로 읽어요
听读音，再试着回忆|Listen, then try to recall|발음을 듣고 떠올려 보세요
拗音由 i 段假名加小写的「ゃ・ゅ・ょ」组成，两个字符合起来读作一拍。|Combined sounds join an i-row kana with small ゃ, ゅ or ょ. Read the pair as one beat.|요음은 い단 가나에 작은 ゃ・ゅ・ょ를 붙인 것으로, 두 글자를 한 박자로 읽어요.
「゛」是浊点，「゜」是半浊点。ぢ与じ、づ与ず在现代标准日语中通常同音。|゛ marks voiced sounds and ゜ marks semi-voiced sounds. In modern standard Japanese, ぢ/じ and づ/ず usually sound alike.|゛는 탁점, ゜는 반탁점이에요. 현대 표준 일본어에서 ぢ/じ, づ/ず는 보통 발음이 같아요.
片假名常用于外来语、人名和拟声词。先留意「シ / ツ」「ソ / ン」的细小差别。|Katakana is common in loanwords, names and sound effects. Look closely at シ/ツ and ソ/ン.|가타카나는 외래어, 이름, 의성어 등에 자주 쓰여요. シ/ツ와 ソ/ン의 작은 차이를 살펴보세요.
先从「あ・い・う・え・お」开始，每天认识一行。熟悉读音后，试着关闭罗马音来回忆。|Start with あ・い・う・え・お, one row a day. Once familiar, hide romaji and recall the sounds.|あ・い・う・え・お부터 하루에 한 줄씩 배워 보세요. 익숙해지면 로마자를 숨기고 떠올려 보세요.
连续记对 3 次即可标记为掌握。发音使用设备的日语语音；可在「关于与学习提示」查看读音规则。|Recall a kana correctly 3 times in a row to master it. Audio uses your device's Japanese voice. See About & study tips for pronunciation notes.|연속 3번 맞히면 익힌 가나로 표시돼요. 음성은 기기의 일본어 음성을 사용해요. 발음 규칙은 소개 및 학습 팁에서 확인하세요.
安排这次小练习|Make it your practice|이번 연습 설정
练习范围|Practice range|연습 범위
按行练习|Choose a row|행별 연습
全部所选行|All selected rows|선택한 모든 행
元音|Vowels|모음
拨音 n|Nasal n|발음 ん
答题方式|Quiz mode|문제 유형
看假名 → 选罗马音|Kana → choose romaji|가나 → 로마자 고르기
看罗马音 → 选假名|Romaji → choose kana|로마자 → 가나 고르기
看假名 → 输入罗马音|Kana → type romaji|가나 → 로마자 입력
卡片数量|Number of cards|카드 수
题目数量|Number of questions|문제 수
全部所选假名|All selected kana|선택한 모든 가나
开始记忆|Start flashcards|카드 학습 시작
开始听音|Start listening|듣기 시작
开始测验|Start quiz|퀴즈 시작
每次随机出题，同一轮内不重复。题量以所选假名数量为上限。|Questions are shuffled without repeats in a round. The selected kana limit the number of questions.|매 라운드는 무작위로 출제되며 중복되지 않아요. 문제 수는 선택한 가나 수를 넘지 않아요.
记住一音，收获一点。|One sound remembered. One step forward.|한 소리를 기억하며 한 걸음 앞으로.
先在心里读出来，再翻开卡片看看。记忆需要一点点耐心。|Say it in your mind, then flip the card. Give your memory a little time.|먼저 마음속으로 읽고 카드를 뒤집어 보세요. 기억에는 조금의 여유가 필요해요.
今天，记住了多少？|How much do you remember today?|오늘은 얼마나 기억하나요?
把刚认识的假名变成小小的成就。答错的假名会自动加入复习。|Turn new kana into small wins. Mistakes are automatically added to review.|새로 배운 가나를 작은 성취로 바꿔 보세요. 틀린 가나는 자동으로 복습에 추가돼요.
用耳朵，认识日语。|Meet Japanese through sound.|귀로 일본어를 만나 보세요.
点击播放，听一听这个音，再选出对应的假名。|Press play, listen to the sound, then choose its kana.|재생을 눌러 발음을 듣고 해당하는 가나를 고르세요.
已检测到日语语音，准备好就开始吧。|Japanese voice available. Start when you're ready.|일본어 음성을 찾았어요. 준비되면 시작하세요.
听音练习需要设备提供日语语音。正在检测；若未找到，请安装系统日语语音包后刷新。|Checking for a Japanese voice. If none is found, install a Japanese system voice and refresh.|기기의 일본어 음성을 확인하고 있어요. 찾지 못하면 일본어 음성 팩을 설치한 뒤 새로고침하세요.
未检测到日语语音。请安装系统日语语音包后刷新；其他练习仍可使用。|No Japanese voice found. Install a Japanese system voice and refresh. Other exercises still work.|일본어 음성을 찾지 못했어요. 일본어 음성 팩을 설치하고 새로고침하세요. 다른 연습은 계속 사용할 수 있어요.
每个声音，都有自己的模样。|Every sound has a shape.|모든 소리에는 모양이 있어요.
轻轻翻开，让记忆发芽。|Flip a card. Let a memory grow.|카드를 뒤집으며 기억을 키워요.
给自己一个小小的挑战。|A little challenge for yourself.|나에게 작은 도전을 선물해요.
平假名与片假名共享读音，从听见到认出。|Hiragana and katakana share sounds. Learn to hear and recognize them.|히라가나와 가타카나는 발음을 공유해요. 듣고 알아보는 연습을 해요.
从一行开始也很好。你可以自由选择练习范围。|One row is a great start. Choose the range that suits you.|한 줄부터 시작해도 좋아요. 원하는 연습 범위를 골라 보세요.
翻面后再评价记忆状态；连续记对 3 次标记为掌握。|Flip, then rate your recall. Three correct recalls in a row mark a kana as mastered.|카드를 뒤집은 뒤 기억 상태를 평가하세요. 연속 3번 맞히면 익힌 가나가 돼요.
每轮结束可查看结果，并单独重练错题。|See your results after each round and retry only your mistakes.|라운드가 끝나면 결과를 보고 틀린 문제만 다시 연습할 수 있어요.
结束本轮 ×|End round ×|이번 라운드 종료 ×
先试着回忆读音，再翻开卡片。|Recall the sound first, then flip the card.|먼저 발음을 떠올린 뒤 카드를 뒤집으세요.
隐藏读音|Hide reading|읽기 숨기기
翻开查看读音|Flip to see the reading|뒤집어서 읽기 확인
点击卡片可再次隐藏读音|Tap again to hide the reading|다시 누르면 읽기를 숨겨요
点击翻面 · 或按空格键|Tap to flip · or press Space|눌러서 뒤집기 · 또는 Space
还没记住|Not yet|아직 어려워요
记住了|Remembered|기억했어요
听一听|Listen|들어 보기
诚实地评价记忆状态，慢慢来就好。|Rate your recall honestly. Take your time.|기억 상태를 솔직하게 평가해 보세요. 천천히 해도 좋아요.
播放本题日语读音|Play this question's Japanese audio|이 문제의 일본어 발음 재생
点击播放，选择你听到的假名|Play the audio and choose the kana you hear|재생을 누르고 들리는 가나를 고르세요
请输入这个假名的罗马音|Type this kana's romaji|이 가나의 로마자를 입력하세요
选择与这个读音对应的假名|Choose the kana for this sound|이 발음에 맞는 가나를 고르세요
选择正确的罗马音|Choose the correct romaji|알맞은 로마자를 고르세요
输入罗马音|Type romaji|로마자 입력
确认|Check|확인
选择答案，或使用键盘快捷键。|Choose an answer, or use the keyboard shortcuts.|답을 고르거나 키보드 단축키를 사용하세요.
查看结果|See results|결과 보기
下一个|Next|다음
读音|Pronunciation|발음
空格翻面 · 1 还没记住 · 2 记住了|Space: flip · 1: not yet · 2: remembered|Space: 뒤집기 · 1: 아직 어려워요 · 2: 기억했어요
Enter 确认答案 · 再按 Enter 进入下一题|Enter: check · Enter again: next question|Enter: 답 확인 · 다시 Enter: 다음 문제
1–4 选择答案 · Enter 进入下一题|1–4: choose an answer · Enter: next question|1–4: 답 선택 · Enter: 다음 문제
这一轮，小有收获。|A little progress, well done.|이번에도 조금 성장했어요.
本轮记忆自评|Your recall this round|이번 라운드 기억 평가
本轮测验正确率|This round's quiz accuracy|이번 라운드 정답률
继续照顾那些还没记牢的小种子。|Give the tricky ones a little more care.|아직 낯선 가나를 조금 더 돌봐 주세요.
每一个小小的坚持，都算数。|Every small effort counts.|작은 노력도 모두 쌓이고 있어요.
答对题数|Correct answers|맞힌 문제 수
本轮用时|Time this round|이번 라운드 시간
待巩固|To review|복습 필요
再练本轮错题|Retry mistakes|틀린 문제 다시 풀기
再来一轮|Another round|한 라운드 더
返回设置|Back to setup|설정으로 돌아가기
这几个假名，值得再看一眼|These kana deserve another look|이 가나들을 한 번 더 살펴보세요
再见一面，记得更牢。|Meet again. Remember better.|다시 만나면 더 잘 기억해요.
答错的假名和手动标记的假名会留在这里。连续记对 3 次后，自动移出待巩固列表。|Mistakes and bookmarked kana stay here. Three correct recalls in a row remove them from this list.|틀렸거나 직접 표시한 가나가 모여 있어요. 연속 3번 맞히면 복습 목록에서 자동으로 빠져요.
到期复习|Due for review|복습할 때가 된 카드
开始复习|Start review|복습 시작
这里还没有待巩固的假名。|No kana to review here yet.|아직 복습할 가나가 없어요.
暂时没有到期的卡片。|No cards are due right now.|지금 복습할 카드는 없어요.
完成一轮小测验，或者在五十音图中标记想复习的假名。|Try a quiz, or bookmark kana in the chart.|퀴즈를 풀거나 오십음도에서 복습할 가나를 표시해 보세요.
记忆确认后，卡片将在 1、3、7、14、30 天后提醒复习。|After recall, cards become due again after 1, 3, 7, 14 or 30 days.|기억 상태에 따라 1, 3, 7, 14, 30일 뒤에 복습할 수 있어요.
去做一次测验|Take a quiz|퀴즈 풀러 가기
看，你已经走了这么远。|Look how far you've come.|어느새 이만큼 왔네요.
每一次练习，都是记忆生长的痕迹。学习记录保存在当前浏览器，可导出备份。|Every practice helps memory grow. Your progress stays in this browser and can be exported.|연습할 때마다 기억이 자라요. 기록은 이 브라우저에 저장되며 백업할 수 있어요.
假名掌握情况|Kana mastery|가나 학습 현황
卡片自评「记住了」与测验答对均累计记忆次数；连续记对 3 次标记掌握，记错后重新累计。|Remembered cards and correct quiz answers count toward mastery. Reach 3 in a row; a mistake resets the streak.|카드의 ‘기억했어요’와 퀴즈 정답이 모두 기억 횟수에 포함돼요. 연속 3번 맞히면 익힌 가나가 되며, 틀리면 다시 세어요.
最近 7 天|Last 7 days|최근 7일
包括记忆卡、假名测验与台词小测，每次评价记录 1 次。|Includes flashcards, kana quizzes and dialogue quizzes. Each response counts once.|암기 카드, 가나 퀴즈, 대사 퀴즈를 포함하며 응답마다 1회로 기록돼요.
连续学习天数|Study streak|연속 학습일
累计测验题数|Total kana quiz answers|누적 가나 퀴즈 응답 수
假名正确率只统计假名测验与听音题，不包含卡片自评；台词小测在「台词教室」中单独统计。今日目标：20 次练习。|Kana accuracy includes kana and listening quizzes, not card ratings. Dialogue accuracy is separate in the Dialogue club. Daily goal: 20 practices.|가나 정답률은 가나 및 듣기 퀴즈만 집계하며 카드 평가는 제외해요. 대사 정답률은 대사 교실에서 따로 확인하세요. 하루 목표는 20회예요.
照顾好你的学习记录|Keep your progress safe|학습 기록을 소중히 보관하세요
记录不会自动跨设备同步。清除浏览器数据会移除记录；可以导出 JSON，再在另一台设备导入。|Progress does not sync automatically. Clearing browser data removes it. Export a JSON backup to import on another device.|기록은 기기 간에 자동 동기화되지 않아요. 브라우저 데이터를 지우면 기록도 사라져요. JSON으로 내보내 다른 기기에서 가져올 수 있어요.
导出备份|Export backup|백업 내보내기
导入备份|Import backup|백업 가져오기
清空记录|Clear progress|기록 초기화
离线使用：在线打开一次后，支持的浏览器会缓存页面。语音是否离线可用取决于设备的日语语音包。|Offline: supported browsers cache the site after an online visit. Offline audio depends on your device's Japanese voice.|오프라인: 지원되는 브라우저는 온라인 접속 후 페이지를 저장해요. 오프라인 음성 지원은 기기의 일본어 음성 팩에 따라 달라요.
清空所有学习记录？|Clear all learning progress?|모든 학습 기록을 초기화할까요?
当前浏览器的练习次数、记忆状态和错题都会清空。建议先导出一份备份。|This clears practice counts, recall history and mistakes in this browser. Export a backup first.|이 브라우저의 연습 횟수, 기억 상태, 오답이 모두 지워져요. 먼저 백업을 내보내는 것을 권장해요.
保留记录|Keep progress|기록 유지
确认清空|Clear all progress|기록 초기화 확인
停一拍|Pause a beat|한 박자 쉬기
促音っ不单独读作 tsu；在后面的辅音前短暂停顿。|Small っ is not pronounced tsu by itself. Pause briefly before the following consonant.|작은 っ는 tsu로 따로 읽지 않아요. 뒤에 오는 자음 앞에서 잠깐 멈추세요.
再听整句，感受它在词语中的声音。|Listen to the full line and hear this sound in context.|전체 문장을 다시 듣고 단어 안에서 나는 소리를 느껴 보세요.
ANIME DIALOGUE CLUB · 台词教室|ANIME DIALOGUE CLUB|애니 대사 교실
听懂一句，走进一个小故事。|One familiar line. A new little story.|익숙한 대사 한마디로 작은 이야기 속으로.
用常见日语表达，练习假名、读音和说话的场合。|Learn kana, pronunciation and context through everyday Japanese expressions.|자주 쓰는 일본어 표현으로 가나, 발음, 사용 상황을 배워요.
台词场景|Dialogue scenes|대사 장면
校园初遇|School days|학교에서의 첫 만남
日常小剧场|Everyday moments|일상 속 한 장면
伙伴集结|Together as a team|친구들과 함께
热血时刻|Courage & resolve|뜨거운 열정
全部台词|All lines|모든 대사
显示|Show|표시
台词学习状态|Dialogue learning status|대사 학습 상태
全部|All|전체
已熟悉|Familiar|익숙한 대사
待复习|To review|복습할 대사
今日的台词本|Today's phrasebook|오늘의 대사 노트
句常用表达|everyday expressions|가지 일상 표현
句已标熟悉|marked familiar|개 익숙한 대사
句待复习|to review|개 복습할 대사
台词小测正确率|Dialogue accuracy|대사 퀴즈 정답률
听整句|Listen to the line|전체 문장 듣기
已标熟悉|Marked familiar|익숙한 대사로 표시됨
这句我记住了|I know this line|이 대사를 기억했어요
显示读音|Show reading|읽기 표시
拆开看，每一拍都认识。|Break it down, one beat at a time.|한 박자씩 나누어 살펴봐요.
点假名，听读音 / 看提示|Tap kana for sound & tips|가나를 눌러 발음과 팁 보기
台词假名拆解|Kana breakdown of this line|대사 가나 나누어 보기
本句小知识|KANA SPOTLIGHT|가나 포인트
什么时候说|WHEN TO SAY IT|언제 쓰나요?
把语气也一起学会|Learn the tone, too|말투도 함께 익혀요
长音|Long vowels|장음
特殊读音|Special readings|특별한 읽기
拨音|Nasal ん|발음 ん
字形与读音|Shapes & sounds|글자 모양과 발음
浊音|Voiced sounds|탁음
促音|Small っ|촉음
拗音与促音|Combined sounds & small っ|요음과 촉음
促音与拗音|Small っ & combined sounds|촉음과 요음
助词读音|Particle readings|조사의 발음
拗音与长音|Combined sounds & long vowels|요음과 장음
拨音与促音|Nasal ん & small っ|발음 ん과 촉음
浊音与促音|Voiced sounds & small っ|탁음과 촉음
轮到你接台词了。|Your turn to say the next line.|이번에는 내가 대사를 이어 볼 차례.
台词小测方式|Dialogue quiz mode|대사 퀴즈 유형
看台词选意思|Read a line → choose its meaning|대사 읽고 뜻 고르기
补全缺失假名|Fill in the missing kana|빠진 가나 채우기
听台词选意思|Listen → choose the meaning|대사 듣고 뜻 고르기
来一轮小测|Try a dialogue quiz|대사 퀴즈 시작
这些台词暂时没有错题。|No mistakes in these lines yet.|이 대사에는 아직 오답이 없어요.
还没有符合筛选条件的台词。|No lines match this filter yet.|조건에 맞는 대사가 아직 없어요.
先挑一句听一听，或者把筛选切回「全部」。|Listen to a line, or switch the filter back to All.|대사를 들어 보거나 필터를 ‘전체’로 바꿔 보세요.
查看全部台词|See all lines|모든 대사 보기
台词采用通用日语表达与原创情境，不对应特定作品片段。朗读使用设备日语合成语音；台词小测单独统计，记录包含在学习备份中。|These everyday expressions use original anime-style scenarios, not excerpts from specific shows. Audio uses your device's Japanese voice. Dialogue scores are separate and included in progress backups.|일상 표현과 창작 애니풍 상황으로 구성되어 특정 작품의 장면을 인용하지 않아요. 기기의 일본어 합성 음성을 사용해요. 대사 점수는 별도로 집계되며 학습 백업에 포함돼요.
台词小测|Dialogue quiz|대사 퀴즈
返回台词本 ×|Back to phrasebook ×|대사 노트로 돌아가기 ×
播放本题台词|Play this question's line|이 문제의 대사 재생
听一听，选择这句台词的意思。|Listen, then choose what this line means.|듣고 이 대사의 뜻을 고르세요.
补上缺失的假名|Fill in the missing kana|빠진 가나를 채우세요
选择这句台词的意思。|Choose what this line means.|이 대사의 뜻을 고르세요.
仔细想一想，或按 1–4 选择。|Take your time, or press 1–4 to choose.|천천히 생각해 보거나 1–4를 눌러 고르세요.
下一句|Next line|다음 대사
再听一遍|Listen again|다시 듣기
这段小故事，你听懂了多少？|How much of this little story did you understand?|이 작은 이야기를 얼마나 이해했나요?
重练本轮错题|Retry this round's mistakes|이번 라운드 오답 다시 풀기
回到台词本|Back to phrasebook|대사 노트로 돌아가기
这几句，值得再听一次|These lines deserve another listen|이 대사들을 한 번 더 들어 보세요
全对啦。试试换个场景，或者补全假名。|Perfect! Try another scene or a missing-kana quiz.|모두 맞혔어요! 다른 장면이나 가나 채우기에 도전해 보세요.
答对了，这句台词接住啦！|Correct! You've got this line.|정답! 이 대사를 이해했네요.
从五十音，走向更大的世界。|From kana to a bigger world.|오십음도에서 더 넓은 세계로.
一个简洁、安静的日语假名练习空间。|A calm little space to learn Japanese kana.|차분하게 일본어 가나를 배우는 작은 공간.
怎么开始？|Where to begin|어떻게 시작하나요?
先在五十音图中认识一行假名，再用记忆卡回忆，最后完成 10 题小测验。可以按行筛选练习范围，也可以混合平假名与片假名。答错的假名会自动进入「温故知新」。|Learn one row in the chart, recall it with flashcards, then try a 10-question quiz. Choose rows or mix both scripts. Mistakes automatically go to Review.|오십음도에서 한 줄을 배운 뒤 암기 카드로 떠올리고 10문제 퀴즈를 풀어 보세요. 행을 고르거나 두 문자를 섞을 수 있어요. 틀린 가나는 복습으로 이동해요.
发音与罗马音|Pronunciation & romaji|발음과 로마자
本程序包含每种文字的 46 个清音（含拨音 ん）、25 个浊音与半浊音，以及 33 个常用拗音。五十音图是传统名称，并不是 50 个不同的基础假名。较少见的「ぢゃ／ぢゅ／ぢょ」、外来语扩展组合和历史假名未收录。|Each script includes 46 basic kana (including ん), 25 voiced/semi-voiced kana and 33 common combinations. “Fifty sounds” is a traditional name, not a count of 50 basic kana. Rare ぢゃ/ぢゅ/ぢょ, extended loanword combinations and historical kana are omitted.|각 문자에는 청음 46개(ん 포함), 탁음·반탁음 25개, 자주 쓰는 요음 33개가 있어요. ‘오십음’은 전통적인 이름으로 기본 가나가 정확히 50개라는 뜻은 아니에요. 드문 ぢゃ/ぢゅ/ぢょ, 외래어 확장 조합과 옛 가나는 제외돼요.
默认显示常见的赫本式写法；输入题也接受 shi / si、chi / ti、tsu / tu、fu / hu、ji / zi 等常见替代写法。ぢ另接受 di，づ另接受 du。相同读音的假名不会同时作为反向题或听音题的干扰选项。|The chart uses common Hepburn romaji. Typing also accepts variants such as shi/si, chi/ti, tsu/tu, fu/hu and ji/zi; ぢ also accepts di, and づ accepts du. Kana with the same sound are not competing choices in reverse or listening quizzes.|표에는 일반적인 헵번식 로마자를 사용해요. 입력 문제는 shi/si, chi/ti, tsu/tu, fu/hu, ji/zi 등의 표기도 허용해요. ぢ는 di, づ는 du도 가능해요. 같은 발음의 가나는 역방향·듣기 문제의 선택지로 함께 나오지 않아요.
假名|Kana|가나
学习提示|Study tip|학습 팁
作为助词时常读作 wa、e、o；字母识读题使用 ha、he、wo（を也接受 o）。|As particles, these are usually read wa, e and o. Kana quizzes use ha, he and wo (o is also accepted for を).|조사일 때는 보통 wa, e, o로 읽어요. 가나 문제에서는 ha, he, wo를 사용하며 を는 o도 허용해요.
在现代标准日语中通常同音，本表显示 ji、zu。|Usually pronounced alike in modern standard Japanese; shown here as ji and zu.|현대 표준 일본어에서 보통 발음이 같으며, 여기서는 ji와 zu로 표시해요.
小写的ゃゅょ与前一个假名合读一拍，注意与大写やゆよ区分。|Small ゃゅょ join the preceding kana into one beat. Distinguish them from full-size やゆよ.|작은 ゃゅょ는 앞 가나와 합쳐 한 박자로 읽어요. 큰 やゆよ와 구별하세요.
小写っ表示促音，ー表示片假名词中的长音；本程序不把它们当作独立音节测试。|Small っ marks a brief consonant pause, and ー marks long vowels in katakana words. They are not tested as standalone sounds.|작은 っ는 촉음, ー는 가타카나 단어의 장음을 나타내요. 독립된 음으로 출제되지는 않아요.
关于声音|About audio|음성 안내
发音调用浏览器的 Speech Synthesis（日语语音），不包含录制的真人音频。设备必须有可用的日语语音。语音包缺失时，听音练习会提示安装，其他练习仍可使用。单字语音可能与自然语流中的音变或声调有所不同。|Audio uses the browser's Japanese Speech Synthesis voice, not recorded human audio. A Japanese voice must be available on your device. If missing, listening practice explains what to install; other exercises still work. Isolated sounds may differ from natural speech.|브라우저의 일본어 Speech Synthesis를 사용하며 실제 사람의 녹음은 포함하지 않아요. 기기에 일본어 음성이 필요해요. 음성이 없으면 듣기 연습에서 설치를 안내하며 다른 연습은 계속 사용할 수 있어요. 단독 발음은 자연스러운 말의 음운 변화나 억양과 다를 수 있어요.
GitHub 检索与参考|GitHub references|GitHub 참고 프로젝트
制作前检索了下列公开项目，并参考「自选范围 → 随机测试 → 复习薄弱假名」的学习流程。本程序独立编写，未复制这些项目的源码或素材。|These public projects inspired the flow of selecting a range, taking a random quiz and reviewing tricky kana. This app was independently written without copying their code or assets.|아래 공개 프로젝트의 ‘범위 선택 → 무작위 퀴즈 → 약한 가나 복습’ 흐름을 참고했어요. 코드와 자료를 복사하지 않고 독립적으로 제작했어요.
项目|Project|프로젝트
相关功能|Features|관련 기능
平假名、片假名输入测验；仓库提供在线版本链接。|Hiragana and katakana typing quizzes with a live-site link in the repository.|히라가나·가타카나 입력 퀴즈. 저장소에서 온라인 버전 링크를 제공해요.
假名图表、自选测验与学习进度。|Kana charts, custom quizzes and progress tracking.|가나 표, 맞춤 퀴즈, 학습 기록.
Python 命令行速读测试与历史记录。|Python command-line speed-reading practice and history.|Python 명령줄 속독 연습과 기록.
已确认存在相关开源仓库；GitHub Releases 页面未能完整读取，因此不把源码仓库等同于已核验的安装包发布。|The repositories were verified. Release pages were not fully available, so this does not verify downloadable installers.|저장소의 존재를 확인했어요. Releases 페이지는 완전히 확인하지 못했으므로 설치 파일 배포를 검증했다는 뜻은 아니에요.
动漫画廊与素材来源|Anime artwork & sources|애니 이미지 및 출처
花田背景与芙莉莲立绘来自|The flower-field background and Frieren artwork come from|꽃밭 배경과 프리렌 일러스트 출처:
《葬送的芙莉莲》官方网站|the official Frieren website|장송의 프리렌 공식 사이트
及|and|및
第 2 话公开剧照|episode 2's public stills|제2화 공개 스틸
。后藤一里立绘来自|. Hitori Gotoh's artwork comes from|. 고토 히토리 일러스트 출처:
Yamaha × 孤独摇滚！官方联动页|the official Yamaha × Bocchi the Rock! collaboration page|Yamaha × 봇치 더 록! 공식 컬래버레이션 페이지
；乐队主视觉来源为|; the band visual is from|. 밴드 비주얼 출처:
Crunchyroll 公开介绍|Crunchyroll's public feature|Crunchyroll 공개 소개
角色和图片权利归各自权利人所有。本站为非官方学习项目；挂件寄语为原创学习提示。|Characters and artwork belong to their respective rights holders. This is an unofficial learning project; companion messages are original study prompts.|캐릭터와 이미지의 권리는 각 권리자에게 있어요. 비공식 학습 프로젝트이며 학습 친구의 메시지는 창작 학습 응원 문구예요.
你的学习记录|Your learning data|나의 학습 데이터
练习数据使用浏览器 localStorage 保存，不发送给学习数据服务器。导入备份会替换当前记录。访问托管页面时仍适用托管平台自身的访问机制。关闭页面后不会主动发送复习通知。|Progress is stored in browser localStorage, not sent to a learning-data server. Importing a backup replaces current progress. The hosting platform's access mechanisms still apply. The app does not send reminders after it is closed.|기록은 브라우저 localStorage에 저장되며 학습 데이터 서버로 전송되지 않아요. 백업을 가져오면 현재 기록이 바뀌어요. 호스팅 플랫폼 자체의 접속 처리 방식은 적용돼요. 페이지를 닫은 뒤 복습 알림을 보내지는 않아요.
回到五十音图|Back to kana chart|오십음도로 돌아가기
管理学习记录|Manage progress|학습 기록 관리
当前浏览器无法正常读取或保存学习记录。练习仍可继续，请在「学习进度」中导出备份。|This browser cannot read or save progress. You can keep practicing; export a backup in Progress.|이 브라우저에서 기록을 읽거나 저장할 수 없어요. 연습은 계속할 수 있으니 학습 기록에서 백업을 내보내세요.
浏览器无法保存记录，请到学习进度中导出备份。|Unable to save. Export a backup in Progress.|기록을 저장할 수 없어요. 학습 기록에서 백업을 내보내세요.
当前设备未检测到日语语音。请安装日语语音包后刷新；识字和测验仍可使用。|No Japanese voice found. Install a Japanese voice and refresh; reading and quizzes still work.|일본어 음성을 찾지 못했어요. 일본어 음성 팩을 설치하고 새로고침하세요. 글자 학습과 퀴즈는 계속 사용할 수 있어요.
语音播放失败，请检查设备的日语语音设置。|Audio failed. Check your device's Japanese voice settings.|음성 재생에 실패했어요. 기기의 일본어 음성 설정을 확인하세요.
当前设备没有可用的日语语音，请安装日语语音包后重试。|No Japanese voice is available. Install one and try again.|사용 가능한 일본어 음성이 없어요. 일본어 음성 팩을 설치한 뒤 다시 시도하세요.
请至少选择一组假名。|Choose at least one sound group.|가나 분류를 하나 이상 선택하세요.
已加入复习，可在「温故知新」中练习。|Added to Review. Practice it there whenever you're ready.|복습에 추가했어요. 복습 메뉴에서 연습할 수 있어요.
已取消手动复习标记。|Review bookmark removed.|복습 표시를 해제했어요.
学习记录已导出。|Progress exported.|학습 기록을 내보냈어요.
学习记录已清空，重新出发。|Progress cleared. A fresh start.|기록을 초기화했어요. 새롭게 시작해요.
备份文件过大，请选择本程序导出的 JSON 文件。|This backup is too large. Choose a JSON file exported by this app.|백업 파일이 너무 커요. 이 앱에서 내보낸 JSON 파일을 선택하세요.
导入备份会替换当前浏览器的学习记录，是否继续？|Importing replaces this browser's progress. Continue?|백업을 가져오면 이 브라우저의 학습 기록이 바뀌어요. 계속할까요?
备份已导入，可以继续学习了。|Backup imported. Ready to keep learning.|백업을 가져왔어요. 학습을 계속하세요.
无法读取这个备份，请选择假名花园导出的有效 JSON 文件。|Unable to read this backup. Choose a valid Kana Garden JSON export.|백업을 읽을 수 없어요. 가나 가든에서 내보낸 올바른 JSON 파일을 선택하세요.
听台词练习需要设备提供日语语音，请安装日语语音包后重试。|Dialogue listening needs a Japanese voice. Install one on your device and try again.|대사 듣기에는 일본어 음성이 필요해요. 기기에 일본어 음성 팩을 설치한 뒤 다시 시도하세요.
语言|Language|언어
界面语言|Interface language|화면 언어
行|row|행
音|sounds|음
次|practices|회
秒|s|초
个待巩固|to review|개 복습 필요
个|items|개
记忆|flashcards|암기
听音|listening|듣기
测验|quiz|퀴즈
全部所选行|All selected rows|선택한 모든 행
`;
 for(const row of rows.trim().split('\n')){const [zh,en,ko]=row.split('|');if(!zh||!en||!ko)throw Error('Invalid locale row: '+row);messages[zh]={en,ko};}
 const words=String.raw`雨|rain|비
狗|dog|개
海|sea|바다
车站|station|역
声音|sound|소리
伞|umbrella|우산
树|tree|나무
云|cloud|구름
今天早晨|this morning|오늘 아침
鱼|fish|물고기
盐|salt|소금
寿司|sushi|초밥
世界|world|세계
天空|sky|하늘
章鱼|octopus|문어
地图|map|지도
月亮|moon|달
手|hand|손
鸟|bird|새
夏天|summer|여름
肉|meat|고기
布|cloth|천
猫|cat|고양이
海苔|nori seaweed|김
花|flower|꽃
人|person|사람
冬天|winter|겨울
房间|room|방
星星|star|별
窗户|window|창문
耳朵|ear|귀
昆虫|insect|곤충
眼睛|eye|눈
森林|forest|숲
山|mountain|산
雪|snow|눈
夜晚|night|밤
轻松|ease; comfort|편안함
松鼠|squirrel|다람쥐
不在家|away from home|부재중
历史|history|역사
六|six|여섯
我|I; me|나
读书|read a book|책을 읽다
书|book|책
冰淇淋|ice cream|아이스크림
墨水|ink|잉크
羊毛|wool|양모
空调|air conditioner|에어컨
橙子|orange|오렌지
相机|camera|카메라
猕猴桃|kiwi|키위
班级|class|반
蛋糕|cake|케이크
咖啡|coffee|커피
衬衫|shirt|셔츠
旅行团|tour|투어
沙发|sofa|소파
面包|bread|빵`;
 for(const row of words.split('\n')){const [zh,en,ko]=row.split('|');messages[zh]={en,ko};}
 // These source nodes sit directly beside links, without Chinese word spaces.
 for(const key of ['花田背景与芙莉莲立绘来自','。后藤一里立绘来自','；乐队主视觉来源为'])for(const lang of ['en','ko'])messages[key][lang]+=' ';
 messages['及']={en:' and ',ko:' 및 '};
 messages['。']={en:'.',ko:'.'};
 const lessons=String.raw`
ohayou|Good morning!|You greet your classmate as they enter the classroom in the morning.|A casual greeting for people you know. Use おはようございます with teachers or in polite settings.|The final よう usually forms a long yo sound. Avoid giving う a separate, strong sound.|좋은 아침!|아침 교실에서 막 들어온 짝에게 인사해요.|친한 사이의 가벼운 인사예요. 선생님 등에게는 おはようございます라고 해요.|끝의 よう는 보통 긴 yo 소리로 이어져요. う를 따로 강하게 읽지 마세요.
konnichiwa|Hello.|In the afternoon hallway, you meet someone you recently got to know.|A common daytime greeting.|The final は is read wa here; as an isolated kana, it is usually ha.|안녕하세요.|오후 복도에서 얼마 전에 알게 된 다른 반 친구를 만나요.|낮에 만났을 때 자주 쓰는 인사예요.|이 표현의 마지막 は는 wa로 읽어요. 가나를 따로 배울 때는 보통 ha예요.
arigatou|Thank you!|Your classmate hands you the eraser you forgot to bring.|For familiar people. ありがとうございます is more polite.|とう usually forms a long to sound; が has a voicing mark.|고마워!|짝이 깜빡하고 안 가져온 지우개를 건네요.|친한 사람에게 써요. 더 공손하게는 ありがとうございます라고 해요.|とう는 보통 긴 to 소리로 이어져요. が에는 탁점이 있어요.
gomenne|Sorry about that.|After accidentally bumping into a classmate, you stop to apologize.|A gentle, friendly apology for familiar people.|ん takes one beat. The final ね softens the tone.|미안해.|실수로 친구와 부딪혀 멈춰 서서 사과해요.|친한 사이에 부드럽게 사과할 때 써요.|ん은 한 박자예요. 끝의 ね는 말투를 부드럽게 해요.
mataashita|See you tomorrow!|Club activities end, and everyone waves goodbye at the school gate.|A casual goodbye when you will meet again tomorrow.|明日 is read あした here. し is commonly written shi in romaji.|내일 봐!|동아리 활동이 끝나고 교문에서 손을 흔들어요.|내일 다시 만날 때 가볍게 하는 작별 인사예요.|여기서 明日는 あした로 읽어요. し의 일반적인 로마자는 shi예요.
yoroshikune|Nice to meet you. Let's get along.|You introduce yourself to your new friends at the Japanese club.|Used when meeting someone or starting to work together. ね sounds friendly.|し is shi, and く is ku. Connect the kana and listen to the whole phrase.|앞으로 잘 부탁해.|일본어 동아리에 처음 들어가 새 친구들에게 자기소개를 해요.|처음 만나거나 함께 일하기 시작할 때 써요. ね는 친근한 느낌을 줘요.|し는 shi, く는 ku예요. 가나를 이어 읽고 전체 표현을 들어 보세요.
tadaima|I'm home!|You open the door and smell dinner cooking.|Said when returning home; often paired with おかえり.|だ is た with a voicing mark. Distinguish da from unvoiced ta.|다녀왔어!|집 문을 여니 맛있는 음식 냄새가 나요.|집에 돌아왔을 때 하는 말이에요. 보통 おかえり와 짝을 이뤄요.|だ는 た에 탁점을 붙인 글자예요. 청음 ta와 구별하세요.
okaeri|Welcome home!|Hearing the front door, you greet a family member who has just returned.|A response to ただいま. おかえりなさい is more polite.|え is e, and り is ri. Keep each beat clear.|어서 와!|현관 소리를 듣고 막 돌아온 가족에게 인사해요.|ただいま에 답하는 말이에요. 더 공손하게는 おかえりなさい라고 해요.|え는 e, り는 ri예요. 각 박자를 또렷하게 읽어 보세요.
itadakimasu|Let's eat.|Everyone opens their lunch boxes and gets ready to eat together.|A set expression said before a meal.|だ is da. At the end of the phrase, the vowel in す is often devoiced in natural speech.|잘 먹겠습니다.|도시락을 열고 함께 점심을 먹을 준비를 해요.|식사를 시작하기 전에 하는 관용 표현이에요.|だ는 da예요. 자연스러운 말에서 문장 끝 す의 모음은 자주 무성화돼요.
gochisousama|Thank you for the meal.|After dinner, you thank the person who prepared the food.|A common expression after finishing a meal.|そう usually forms a long so sound; ち is chi.|잘 먹었습니다.|저녁을 먹고 음식을 준비한 사람에게 감사해요.|식사를 마친 뒤 자주 쓰는 표현이에요.|そう는 보통 긴 so 소리로 이어져요. ち는 chi예요.
oyasumi|Good night.|It is late, and you say good night before ending your chat.|A casual good night. おやすみなさい is more polite.|や is ya, and み is mi. Recall them separately, then join them.|잘 자.|밤이 깊어 대화를 마치며 친구에게 잘 자라고 해요.|친한 사이의 밤 인사예요. 공손한 표현은 おやすみなさい예요.|や는 ya, み는 mi예요. 따로 떠올린 뒤 이어 읽어 보세요.
chottomatte|Wait a moment!|The train is about to leave, and you catch up with a friend who is heading off.|A casual request. Your tone can make it urgent or gentle.|ちょ is one beat. Both っ indicate a brief pause before the following consonant.|잠깐 기다려!|전철이 곧 출발해 먼저 가려는 친구를 따라잡아요.|가벼운 부탁이에요. 말투에 따라 다급하거나 부드러운 느낌이 돼요.|ちょ는 한 박자예요. 두 개의 っ는 모두 다음 자음 앞에서 잠깐 멈추는 소리예요.
makasete|Leave it to me!|The school-festival poster is unfinished, and you volunteer to help.|A casual way to take on a task and reassure someone.|せ is se. Distinguish the similar shapes of せ and さ.|나에게 맡겨!|문화제 포스터가 아직 완성되지 않아 손을 들고 맡겠다고 해요.|일을 자청하며 상대를 안심시키는 편한 표현이에요.|せ는 se예요. 모양이 비슷한 せ와 さ를 구별하세요.
isshoniikou|Let's go together!|After school, a friend invites you to walk to the clubroom together.|An invitation to do something together with familiar people.|Pause a beat for っ; しょ is one combined beat. The final こう has a long vowel.|같이 가자!|방과 후 친구가 동아리실에 함께 가자고 해요.|친한 사람에게 함께 행동하자고 권할 때 써요.|っ에서 한 박자 쉬고 しょ를 한 박자로 읽어요. 끝의 こう는 장음이에요.
ikuzo|Let's go!|The adventure party gathers at the entrance, and the leader waves everyone forward.|An assertive, casual call to familiar teammates. 行きましょう is more polite.|ぞ is zo: そ with a voicing mark. It adds a forceful tone at the end.|가자!|모험 일행이 입구에 모이고 리더가 손짓해요.|친한 동료에게 힘차게 외치는 편한 표현이에요. 더 공손하게는 行きましょう라고 해요.|ぞ는 そ에 탁점을 붙인 zo예요. 문장 끝에서 강한 말투를 더해요.
yatta|We did it!|The club performance you prepared for so long finally goes well.|An excited exclamation after success or good news.|っ is not pronounced tsu by itself. Pause before た, like yat-ta.|해냈다!|오랫동안 준비한 동아리 공연이 드디어 잘 끝났어요.|성공하거나 좋은 소식을 들었을 때 기쁘게 외쳐요.|っ를 tsu로 따로 읽지 않아요. yat-ta처럼 た 앞에서 한 박자 쉬세요.
kiwotsukete|Be careful!|The steps are slippery after the rain, so you warn the friend ahead of you.|Warn someone to stay safe, or show care when saying goodbye.|を is a particle here and is read o; つ is tsu.|조심해!|비가 온 뒤 계단이 미끄러워 앞서 가는 친구에게 알려 줘요.|안전을 주의시키거나 헤어질 때 걱정하는 마음을 전해요.|여기서 を는 조사여서 o로 읽어요. つ는 tsu예요.
tasukete|Help me!|While setting up a booth, you cannot lift a prop and ask a nearby friend for help.|A direct request for help, also used in emergencies.|す is su, and け is ke. Recall them together as すけ.|도와줘!|부스를 꾸미다가 소품을 들지 못해 근처 친구에게 도움을 청해요.|직접 도움을 구하는 표현이며 긴급한 상황에서도 써요.|す는 su, け는 ke예요. すけ로 이어서 기억해 보세요.
daijoubu|It's okay. I'm fine!|After a mistake in practice, you smile and wave to reassure a worried teammate.|Means okay or all right. With rising intonation, 大丈夫？ asks if someone is okay.|じょ is one beat; the following う lengthens jo. だ and ぶ are voiced sounds.|괜찮아, 난 괜찮아!|연습 중 실수한 뒤 걱정하는 친구에게 웃으며 손을 흔들어요.|괜찮다는 뜻이에요. 大丈夫？처럼 끝을 올리면 상대가 괜찮은지 물을 수 있어요.|じょ는 한 박자이고 뒤의 う가 jo를 길게 해요. だ와 ぶ는 탁음이에요.
ganbatte|You can do it!|Your friend is about to go on stage, and you cheer from the audience.|Encouragement for someone trying hard or facing a challenge.|ん and っ each take one beat. The っ creates a brief pause before て.|힘내!|친구가 무대에 오를 차례라 관객석에서 응원해요.|노력하고 있거나 도전을 앞둔 사람을 격려할 때 써요.|ん과 っ는 각각 한 박자예요. っ는 て 앞에서 짧게 멈추는 소리를 만들어요.
akiramenai|I won't give up!|After several failed attempts, the hero returns to the starting line.|Expresses your determination not to give up, usually in casual speech.|ら is ra, and な is na. Do not confuse their shapes.|포기하지 않을 거야!|몇 번 실패한 뒤 주인공이 다시 출발점에 서요.|포기하지 않겠다는 결심을 나타내는 보통 편한 말투예요.|ら는 ra, な는 na예요. 두 글자의 모양을 헷갈리지 않도록 해요.
shinjiteru|I believe in you.|A teammate is about to face a challenge, and you give a sincere nod.|The object is understood from context. てる is the conversational form of ている.|し is shi; adding a voicing mark makes じ, ji. Listen to the difference.|널 믿어.|도전을 앞둔 친구에게 진지하게 고개를 끄덕여요.|대상이 상황상 분명해서 생략되어 있어요. てる는 ている의 구어체예요.|し는 shi, 탁점을 붙인 じ는 ji예요. 두 발음의 차이를 들어 보세요.
yakusokudayo|It's a promise.|On the way home, you promise to join the next school festival together.|Emphasizes a shared promise in a friendly tone.|だ is da. The final よ presents or emphasizes what you are saying.|약속이야.|하굣길에 다음 문화제에도 함께 참가하자고 약속해요.|서로의 약속을 친근한 말투로 강조해요.|だ는 da예요. 끝의 よ는 자신의 말을 상대에게 전하거나 강조해요.
zettainimakenai|I absolutely won't lose!|Before the final match, the hero clenches a fist and builds up courage.|A strong statement of resolve, suited to an energetic story scene.|ぜ is voiced. Pause for っ before た, like zet-tai.|절대로 지지 않을 거야!|결승전 직전 주인공이 주먹을 쥐고 스스로를 격려해요.|뜨거운 이야기 장면에서 강한 결심을 드러내는 표현이에요.|ぜ는 탁음이에요. zet-tai처럼 っ에서 멈춘 뒤 た를 읽어요.
`;
 for(const row of lessons.trim().split('\n')){const values=row.split('|'),line=root.KanaDialogueData.lines.find(l=>l.id===values[0]);if(values.length!==9||!line)throw Error('Invalid lesson locale: '+values[0]);for(let i=0;i<4;i++)messages[line[['meaning','scene','usage','note'][i]]]={en:values[i+1],ko:values[i+5]};}
 root.KanaLocales={messages,languages:['zh','en','ko']};
 if(typeof module!=='undefined')module.exports=root.KanaLocales;
})(typeof globalThis!=='undefined'?globalThis:this);
