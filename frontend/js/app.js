// =====================================================
// Blood War to the End — Frontend Application v3.0
// Multi-player rooms · Time elimination · MetaMask
// i18n · Account Panel · Random Username
// =====================================================

// ===== CONFIG =====
const CONFIG = {
  API_URL: '/api',
  BSC_CHAIN_ID: '0x38',
  BSC_RPC: 'https://bsc-dataseed1.binance.org:443',
  WS_URL: `ws://${window.location.host}/ws`,
};

// ===== i18n TRANSLATIONS =====
const TRANSLATIONS = {
  en: {
    'nav.arena': 'Arena', 'nav.rooms': 'Rooms', 'nav.create': 'Create',
    'nav.rankings': 'Rankings', 'nav.dawn': 'Dawn',
    'btn.connect': 'Connect Wallet',
    'hero.badge': '⚡ LIVE ON BINANCE SMART CHAIN',
    'hero.sub': 'Decentralized PK battles. Pick your side, bet your conviction. Winners take all — powered by smart contracts.',
    'hero.enterArena': '⚔ Enter Arena', 'hero.createRoom': '+ Create Room',
    'stat.liveBattles': 'Live Battles', 'stat.warriors': 'Warriors', 'stat.totalVolume': 'Total Volume',
    'section.featuredBattle': '⚔ Featured Battle',
    'team.a': 'TEAM A', 'team.b': 'TEAM B',
    'team.supporters12': '12 supporters', 'team.supporters18': '18 supporters',
    'howItWorks.title': 'How It Works',
    'howItWorks.sub': 'Three steps to enter the arena. All on-chain. All transparent.',
    'step1.title': 'Choose Your Battle', 'step1.desc': 'Browse active PK rooms or create your own. 1v1 duels or multiplayer chaos.',
    'step2.title': 'Pick A Side & Bet', 'step2.desc': 'Support Team A or B with U tokens. Your contribution degree determines your share.',
    'step3.title': 'Winners Take All', 'step3.desc': 'Smart contracts auto-settle. Winning team splits the prize pool. Only 5% fee on losers.',
    'step4.title': 'Claim & Rise', 'step4.desc': 'Claim rewards instantly. Climb the leaderboard. Earn the Dawn Medal.',
    'rooms.title': '⚔ Battle Arena', 'rooms.sub': 'Active PK rooms awaiting warriors',
    'create.title': '+ Create Battle Room', 'create.sub': 'Deploy a new match. Earn creator rewards.',
    'label.roomName': 'Room Name', 'label.gameMode': 'Game Mode', 'label.duration': 'Duration (Min)',
    'label.betLimit': 'Bet Limit (U)', 'label.tokenAddr': 'Token Address',
    'btn.deploy': '⚡ Deploy Battle Room',
    'mode.1v1': '1v1 PK', 'mode.4teams': '4 Teams', 'mode.8teams': '8 Teams',
    'btn.back': '← Back', 'stage.remaining': 'REMAINING',
    'label.betAmount': 'Bet Amount (U)', 'placeholder.betAmount': 'Enter amount',
    'btn.selectTeam': 'Select a team first', 'btn.claimReward': '🏆 Claim Your Reward',
    'loading.battle': 'Loading battle...',
    'rankings.title': '🏆 Rankings',
    'tab.daily': 'Daily', 'tab.weekly': 'Weekly', 'tab.monthly': 'Monthly', 'tab.alltime': 'All-Time',
    'cat.profit': '💰 Profit', 'cat.rooms': '🏟 Rooms', 'cat.volume': '📊 Volume',
    'lb.rank': 'Rank', 'lb.player': 'Player', 'lb.wins': 'Wins', 'lb.losses': 'Losses',
    'lb.totalBets': 'Total Bets', 'lb.winRate': 'Win Rate', 'lb.profit': 'Net Profit',
    'lb.gameName': 'Room Name', 'lb.participants': 'Participants', 'lb.winners': 'Winners',
    'lb.prizePool': 'Prize Pool', 'lb.games': 'Games', 'lb.maxBet': 'Max Single Bet', 'lb.totalVolume': 'Total Volume',
    'dawn.title': '🌅 The Dawn Protocol',
    'dawn.sub': 'Early bird check-in staking. Wake up, check in, earn rewards.',
    'dawn.cardTitle': 'Daily Check-In Pool', 'dawn.window': 'Window: 05:00 — 08:00 UTC',
    'dawn.onTime': 'On-Time', 'dawn.late': 'Late', 'dawn.pool': 'Pool',
    'btn.checkin': '☀ Check In (1 U)',
    'label.inviteLink': 'Your Invite Link', 'label.enterInvite': 'Enter Invite Code',
    'btn.copy': 'Copy', 'btn.apply': 'Apply',
    'placeholder.inviteCode': 'Code from friend',
    'stat.wins': 'Wins', 'stat.losses': 'Losses', 'stat.wagered': 'Total Wagered',
    'stat.netProfit': 'Net Profit', 'stat.winRate': 'Win Rate',
    'stat.followers': 'Followers', 'stat.noted': 'Times Noted',
    'profile.anonymous': 'Anonymous Warrior', 'profile.notConnected': 'Not connected',
    'avatar.pick': 'Choose Your Avatar',
    'label.privateNote': 'Private Note (only you can see)',
    'placeholder.note': 'Add a private note about this user...',
    'btn.follow': 'Follow', 'btn.unfollow': 'Unfollow', 'btn.saveNote': 'Save Note',
    'toast.followed': 'Now following!', 'toast.unfollowed': 'Unfollowed',
    'toast.noteSaved': 'Note saved!', 'toast.linkCopied': 'Invite link copied!',
    'dawn.rule1Title': 'Daily Check-In', 'dawn.rule2Title': 'Invite & Earn', 'dawn.rule3Title': 'Pool Distribution',
    'dawn.rule1Desc': 'Check in between 05:00–08:00 UTC to earn on-time rewards from the pool. Late check-ins (08:00–24:00) contribute 1 U to the pool but earn reduced rewards.',
    'dawn.rule2Desc': 'Share your invite link. Each successful referral boosts your computing power by +5% (up to +100%), increasing your share of daily pool rewards.',
    'dawn.rule3Desc': 'The late-fee pool is split among on-time check-ins weighted by computing power. Higher computing power = larger share. Unclaimed rewards roll to next day.',
    'create.feeDesc2': 'Room creator receives 1% from the platform\'s 5% fee',
    'btn.settings': '⚙ Settings',
    'settings.title': '⚙ Settings', 'label.username': 'Username',
    'label.language': 'Language', 'label.currency': 'Currency', 'btn.save': 'Save',
    'placeholder.username': 'Unique name', 'placeholder.roomName': 'e.g. The Final Showdown',
    'acct.viewProfile': 'Profile', 'acct.disconnect': 'Disconnect', 'acct.namePlaceholder': 'New username',
    'btn.confirm': '✓ Save', 'btn.cancel': '✕',
    'footer.text': 'Decentralized PK Competition Platform • FomoPlayground',
    'footer.whitepaper': 'White Paper', 'footer.contracts': 'Contracts', 'footer.audit': 'Audit',
    'toast.walletConnected': 'Wallet connected!', 'toast.walletRejected': 'Connection rejected',
    'toast.walletFailed': 'Connection failed', 'toast.connectFirst': 'Connect wallet first',
    'toast.settingsSaved': 'Settings saved!', 'toast.usernameTaken': 'Username taken',
    'toast.usernameSaved': 'Username updated!', 'toast.inviteCopied': 'Invite code copied!',
    'toast.inviteApplied': 'Invite applied! Welcome aboard.', 'toast.invalidCode': 'Invalid code',
    'toast.selectTeam': 'Select a team first', 'toast.enterAmount': 'Enter a valid bet amount',
    'toast.disconnected': 'Wallet disconnected',
    'fee.title': '💰 Est. Creation Cost', 'fee.gasDeploy': 'Contract Deploy Gas',
    'fee.platformFee': 'Platform Fee', 'fee.creatorReward': 'Creator Reward',
    'fee.upfrontCost': 'Upfront Cost', 'fee.note': 'Gas price varies by network congestion. Demo mode costs nothing.',
    'fee.roomPreview': 'Room Preview', 'fee.teams': 'Teams',
    'fee.duration': 'Duration', 'fee.maxBet': 'Max Bet', 'fee.maxPool': 'Max Prize Pool',
    'mode.multi': 'Multiplayer', 'label.teamCount': 'Teams (3–8)',
    'label.firstTeamName': 'First Team Name',
    'placeholder.firstTeamName': 'e.g. Red Dragons',
    'label.betLimitStep': 'Bet Cap Step (%)',
    'hint.betLimitStep': 'Range: 20% – 100%',
    'tooltip.betLimit': 'Per-team bet cap. When a team hits the cap, betting on it pauses until other teams catch up.',
    'tooltip.betLimitStep': 'When ALL teams reach the cap, it increases by this percentage.',
    'create.feeInfo': '💰 Platform Fees',
    'create.feeDesc1': 'Platform collects 5% of total pool after match settles',
    'create.feeDesc2': '1% of total pool rewards the room creator',
    'room.waitingMsg': 'Waiting for the first player to join and start the timer...',
    'toast.battleEnded': 'Battle has ended — no more bets',
    'toast.teamCapped': 'This team reached the bet cap. Wait for other teams to catch up.',
    'toast.teamNameSaved': 'Team name updated!',
    'toast.teamNameLocked': 'Team name already set by another player',
    'toast.roomStarted': 'Battle started! Timer is running.',
  },
  'zh-CN': {
    'nav.arena': '竞技场', 'nav.rooms': '房间', 'nav.create': '创建',
    'nav.rankings': '排行榜', 'nav.dawn': '黎明',
    'btn.connect': '连接钱包',
    'hero.badge': '⚡ 实时运行于币安智能链',
    'hero.sub': '去中心化PK对决。选择你的阵营，押注你的信念。赢家通吃 — 智能合约驱动。',
    'hero.enterArena': '⚔ 进入竞技场', 'hero.createRoom': '+ 创建房间',
    'stat.liveBattles': '实时对战', 'stat.warriors': '战士', 'stat.totalVolume': '总交易量',
    'section.featuredBattle': '⚔ 特色对决',
    'team.a': 'A 队', 'team.b': 'B 队',
    'team.supporters12': '12 名支持者', 'team.supporters18': '18 名支持者',
    'howItWorks.title': '如何使用',
    'howItWorks.sub': '简单三步进入竞技场。全链上操作，完全透明。',
    'step1.title': '选择战场', 'step1.desc': '浏览活跃的PK房间或创建你自己的。1v1对决或多人混战。',
    'step2.title': '选边站 & 下注', 'step2.desc': '用U代币支持A队或B队。你的投注比例决定你的奖励份额。',
    'step3.title': '赢家通吃', 'step3.desc': '智能合约自动结算。获胜队伍瓜分奖池。失败方仅扣除5%手续费。',
    'step4.title': '领取 & 晋升', 'step4.desc': '即时领取奖励。攀登排行榜。赢取黎明勋章。',
    'rooms.title': '⚔ 战斗竞技场', 'rooms.sub': '等待战士入场的活跃PK房间',
    'create.title': '+ 创建战斗房间', 'create.sub': '部署新的对决。赚取创建者奖励。',
    'label.roomName': '房间名称', 'label.gameMode': '游戏模式', 'label.duration': '持续时间（分钟）',
    'label.betLimit': '下注上限 (U)', 'label.tokenAddr': '代币地址',
    'btn.deploy': '⚡ 部署战斗房间',
    'mode.1v1': '1v1 PK', 'mode.4teams': '4 队', 'mode.8teams': '8 队',
    'btn.back': '← 返回', 'stage.remaining': '剩余时间',
    'label.betAmount': '下注金额 (U)', 'placeholder.betAmount': '输入金额',
    'btn.selectTeam': '请先选择队伍', 'btn.claimReward': '🏆 领取奖励',
    'loading.battle': '加载战场中...',
    'rankings.title': '🏆 排行榜',
    'tab.daily': '日榜', 'tab.weekly': '周榜', 'tab.monthly': '月榜', 'tab.alltime': '总榜',
    'cat.profit': '💰 盈利', 'cat.rooms': '🏟 房间', 'cat.volume': '📊 交易量',
    'lb.rank': '排名', 'lb.player': '玩家', 'lb.wins': '胜场', 'lb.losses': '败场',
    'lb.totalBets': '总投注', 'lb.winRate': '胜率', 'lb.profit': '净盈利',
    'lb.gameName': '房间名称', 'lb.participants': '参与人数', 'lb.winners': '获胜人数',
    'lb.prizePool': '奖池', 'lb.games': '游戏场数', 'lb.maxBet': '最大单注', 'lb.totalVolume': '总交易量',
    'dawn.title': '🌅 黎明协议',
    'dawn.sub': '早起签到质押。醒来签到，赚取奖励。',
    'dawn.cardTitle': '每日签到池', 'dawn.window': '时间窗口：UTC 05:00 — 08:00',
    'dawn.onTime': '准时', 'dawn.late': '迟到', 'dawn.pool': '奖池',
    'btn.checkin': '☀ 签到 (1 U)',
    'label.inviteLink': '你的邀请链接', 'label.enterInvite': '输入邀请码',
    'btn.copy': '复制', 'btn.apply': '应用',
    'placeholder.inviteCode': '朋友的邀请码',
    'stat.wins': '胜场', 'stat.losses': '败场', 'stat.wagered': '总投注',
    'stat.netProfit': '净盈利', 'stat.winRate': '胜率',
    'stat.followers': '粉丝', 'stat.noted': '被备注次数',
    'profile.anonymous': '匿名战士', 'profile.notConnected': '未连接',
    'avatar.pick': '选择头像',
    'label.privateNote': '私人备注（只有你能看到）',
    'placeholder.note': '对这个用户添加私人备注...',
    'btn.follow': '关注', 'btn.unfollow': '取消关注', 'btn.saveNote': '保存备注',
    'toast.followed': '已关注！', 'toast.unfollowed': '已取消关注',
    'toast.noteSaved': '备注已保存！', 'toast.linkCopied': '邀请链接已复制！',
    'dawn.rule1Title': '每日签到', 'dawn.rule2Title': '邀请赚收益', 'dawn.rule3Title': '奖池分配',
    'dawn.rule1Desc': '每天 UTC 05:00–08:00 签到可获得准时奖励。迟到签到（08:00–24:00）向奖池贡献 1 U 但获得较少奖励。',
    'dawn.rule2Desc': '分享你的邀请链接。每成功邀请一人，你的算力提升 +5%（最高 +100%），增加每日奖池份额。',
    'dawn.rule3Desc': '迟到费用奖池按算力加权分配给准时签到者。算力越高，分配越多。未领取奖励滚入次日。',
    'create.feeDesc2': '房主从平台5%手续费中获得1%',
    'btn.settings': '⚙ 设置',
    'settings.title': '⚙ 设置', 'label.username': '用户名',
    'label.language': '语言', 'label.currency': '货币', 'btn.save': '保存',
    'placeholder.username': '唯一用户名', 'placeholder.roomName': '例如：最终决战',
    'acct.viewProfile': '查看资料', 'acct.disconnect': '断开连接', 'acct.namePlaceholder': '新用户名',
    'btn.confirm': '✓ 保存', 'btn.cancel': '✕',
    'footer.text': '去中心化PK竞技平台 • FomoPlayground',
    'footer.whitepaper': '白皮书', 'footer.contracts': '合约', 'footer.audit': '审计',
    'toast.walletConnected': '钱包已连接！', 'toast.walletRejected': '连接被拒绝',
    'toast.walletFailed': '连接失败', 'toast.connectFirst': '请先连接钱包',
    'toast.settingsSaved': '设置已保存！', 'toast.usernameTaken': '用户名已被占用',
    'toast.usernameSaved': '用户名已更新！', 'toast.inviteCopied': '邀请码已复制！',
    'toast.inviteApplied': '邀请码已应用！欢迎加入。', 'toast.invalidCode': '无效邀请码',
    'toast.selectTeam': '请先选择队伍', 'toast.enterAmount': '请输入有效下注金额',
    'toast.disconnected': '钱包已断开连接',
    'fee.title': '💰 预计创建费用', 'fee.gasDeploy': '合约部署Gas',
    'fee.platformFee': '平台手续费', 'fee.creatorReward': '创建者奖励',
    'fee.upfrontCost': '预付成本', 'fee.note': 'Gas费用随网络拥堵变化。演示模式免费。',
    'fee.roomPreview': '房间预览', 'fee.teams': '队伍数',
    'fee.duration': '持续时间', 'fee.maxBet': '最高下注', 'fee.maxPool': '最大奖池',
    'mode.multi': '多人对战', 'label.teamCount': '队伍数 (3–8)',
    'label.firstTeamName': '第一队伍名称',
    'placeholder.firstTeamName': '例如：红龙队',
    'label.betLimitStep': '下注上限增加幅度 (%)',
    'hint.betLimitStep': '范围：20% – 100%',
    'tooltip.betLimit': '每队下注上限。某队达到上限后暂停下注，等其他队伍跟上后继续。',
    'tooltip.betLimitStep': '当所有队伍都达到当前上限时，上限按此比例增加。',
    'create.feeInfo': '💰 平台手续费',
    'create.feeDesc1': '比赛结算后平台收取总奖池的5%',
    'create.feeDesc2': '总奖池的1%奖励给房主',
    'room.waitingMsg': '等待第一位玩家加入后开始计时...',
    'toast.battleEnded': '比赛已结束，不能再下注',
    'toast.teamCapped': '该队伍已达下注上限，等待其他队伍跟上',
    'toast.teamNameSaved': '队伍名称已更新！',
    'toast.teamNameLocked': '队伍名称已被其他玩家设置',
    'toast.roomStarted': '比赛开始！计时器已启动。',
  },
  'zh-TW': {
    'nav.arena': '競技場', 'nav.rooms': '房間', 'nav.create': '創建',
    'nav.rankings': '排行榜', 'nav.dawn': '黎明',
    'btn.connect': '連接錢包',
    'hero.badge': '⚡ 實時運行於幣安智能鏈',
    'hero.sub': '去中心化PK對決。選擇你的陣營，押注你的信念。贏家通吃 — 智能合約驅動。',
    'hero.enterArena': '⚔ 進入競技場', 'hero.createRoom': '+ 創建房間',
    'stat.liveBattles': '實時對戰', 'stat.warriors': '戰士', 'stat.totalVolume': '總交易量',
    'section.featuredBattle': '⚔ 特色對決',
    'team.a': 'A 隊', 'team.b': 'B 隊',
    'team.supporters12': '12 名支持者', 'team.supporters18': '18 名支持者',
    'howItWorks.title': '如何使用',
    'howItWorks.sub': '簡單三步進入競技場。全鏈上操作，完全透明。',
    'step1.title': '選擇戰場', 'step1.desc': '瀏覽活躍的PK房間或創建你自己的。1v1對決或多人混戰。',
    'step2.title': '選邊站 & 下注', 'step2.desc': '用U代幣支持A隊或B隊。你的投注比例決定你的獎勵份額。',
    'step3.title': '贏家通吃', 'step3.desc': '智能合約自動結算。獲勝隊伍瓜分獎池。失敗方僅扣除5%手續費。',
    'step4.title': '領取 & 晉升', 'step4.desc': '即時領取獎勵。攀登排行榜。贏取黎明勳章。',
    'rooms.title': '⚔ 戰鬥競技場', 'rooms.sub': '等待戰士入場的活躍PK房間',
    'create.title': '+ 創建戰鬥房間', 'create.sub': '部署新的對決。賺取創建者獎勵。',
    'label.roomName': '房間名稱', 'label.gameMode': '遊戲模式', 'label.duration': '持續時間（分鐘）',
    'label.betLimit': '下注上限 (U)', 'label.tokenAddr': '代幣地址',
    'btn.deploy': '⚡ 部署戰鬥房間',
    'mode.1v1': '1v1 PK', 'mode.4teams': '4 隊', 'mode.8teams': '8 隊',
    'btn.back': '← 返回', 'stage.remaining': '剩餘時間',
    'label.betAmount': '下注金額 (U)', 'placeholder.betAmount': '輸入金額',
    'btn.selectTeam': '請先選擇隊伍', 'btn.claimReward': '🏆 領取獎勵',
    'loading.battle': '載入戰場中...',
    'rankings.title': '🏆 排行榜',
    'tab.daily': '日榜', 'tab.weekly': '週榜', 'tab.monthly': '月榜', 'tab.alltime': '總榜',
    'cat.profit': '💰 盈利', 'cat.rooms': '🏟 房間', 'cat.volume': '📊 交易量',
    'lb.rank': '排名', 'lb.player': '玩家', 'lb.wins': '勝場', 'lb.losses': '敗場',
    'lb.totalBets': '總投注', 'lb.winRate': '勝率', 'lb.profit': '淨盈利',
    'lb.gameName': '房間名稱', 'lb.participants': '參與人數', 'lb.winners': '獲勝人數',
    'lb.prizePool': '獎池', 'lb.games': '遊戲場數', 'lb.maxBet': '最大單注', 'lb.totalVolume': '總交易量',
    'dawn.title': '🌅 黎明協議',
    'dawn.sub': '早起簽到質押。醒來簽到，賺取獎勵。',
    'dawn.cardTitle': '每日簽到池', 'dawn.window': '時間視窗：UTC 05:00 — 08:00',
    'dawn.onTime': '準時', 'dawn.late': '遲到', 'dawn.pool': '獎池',
    'btn.checkin': '☀ 簽到 (1 U)',
    'label.inviteLink': '你的邀請連結', 'label.enterInvite': '輸入邀請碼',
    'btn.copy': '複製', 'btn.apply': '應用',
    'placeholder.inviteCode': '朋友的邀請碼',
    'stat.wins': '勝場', 'stat.losses': '敗場', 'stat.wagered': '總投注',
    'stat.netProfit': '淨盈利', 'stat.winRate': '勝率',
    'stat.followers': '粉絲', 'stat.noted': '被備注次數',
    'profile.anonymous': '匿名戰士', 'profile.notConnected': '未連接',
    'avatar.pick': '選擇頭像',
    'label.privateNote': '私人備注（只有你能看到）',
    'placeholder.note': '對這個用戶添加私人備注...',
    'btn.follow': '關注', 'btn.unfollow': '取消關注', 'btn.saveNote': '儲存備注',
    'toast.followed': '已關注！', 'toast.unfollowed': '已取消關注',
    'toast.noteSaved': '備注已儲存！', 'toast.linkCopied': '邀請連結已複製！',
    'dawn.rule1Title': '每日簽到', 'dawn.rule2Title': '邀請賺收益', 'dawn.rule3Title': '獎池分配',
    'dawn.rule1Desc': '每天 UTC 05:00–08:00 簽到可獲得準時獎勵。遲到簽到（08:00–24:00）向獎池貢獻 1 U 但獲得較少獎勵。',
    'dawn.rule2Desc': '分享你的邀請連結。每成功邀請一人，你的算力提升 +5%（最高 +100%），增加每日獎池份額。',
    'dawn.rule3Desc': '遲到費用獎池按算力加權分配給準時簽到者。算力越高，分配越多。未領取獎勵滾入次日。',
    'create.feeDesc2': '房主從平台5%手續費中獲得1%',
    'btn.settings': '⚙ 設定',
    'settings.title': '⚙ 設定', 'label.username': '用戶名',
    'label.language': '語言', 'label.currency': '貨幣', 'btn.save': '儲存',
    'placeholder.username': '唯一用戶名', 'placeholder.roomName': '例如：最終決戰',
    'acct.viewProfile': '查看資料', 'acct.disconnect': '斷開連接', 'acct.namePlaceholder': '新用戶名',
    'btn.confirm': '✓ 儲存', 'btn.cancel': '✕',
    'footer.text': '去中心化PK競技平台 • FomoPlayground',
    'footer.whitepaper': '白皮書', 'footer.contracts': '合約', 'footer.audit': '審計',
    'toast.walletConnected': '錢包已連接！', 'toast.walletRejected': '連接被拒絕',
    'toast.walletFailed': '連接失敗', 'toast.connectFirst': '請先連接錢包',
    'toast.settingsSaved': '設定已儲存！', 'toast.usernameTaken': '用戶名已被佔用',
    'toast.usernameSaved': '用戶名已更新！', 'toast.inviteCopied': '邀請碼已複製！',
    'toast.inviteApplied': '邀請碼已應用！歡迎加入。', 'toast.invalidCode': '無效邀請碼',
    'toast.selectTeam': '請先選擇隊伍', 'toast.enterAmount': '請輸入有效下注金額',
    'toast.disconnected': '錢包已斷開連接',
    'fee.title': '💰 預計創建費用', 'fee.gasDeploy': '合約部署Gas',
    'fee.platformFee': '平台手續費', 'fee.creatorReward': '創建者獎勵',
    'fee.upfrontCost': '預付成本', 'fee.note': 'Gas費用隨網路壅塞變化。演示模式免費。',
    'fee.roomPreview': '房間預覽', 'fee.teams': '隊伍數',
    'fee.duration': '持續時間', 'fee.maxBet': '最高下注', 'fee.maxPool': '最大獎池',
    'mode.multi': '多人對戰', 'label.teamCount': '隊伍數 (3–8)',
    'label.firstTeamName': '第一隊伍名稱',
    'placeholder.firstTeamName': '例如：紅龍隊',
    'label.betLimitStep': '下注上限增加幅度 (%)',
    'hint.betLimitStep': '範圍：20% – 100%',
    'tooltip.betLimit': '每隊下注上限。某隊達到上限後暫停下注，等其他隊伍跟上後繼續。',
    'tooltip.betLimitStep': '當所有隊伍都達到當前上限時，上限按此比例增加。',
    'create.feeInfo': '💰 平台手續費',
    'create.feeDesc1': '比賽結算後平台收取總獎池的5%',
    'create.feeDesc2': '總獎池的1%獎勵給房主',
    'room.waitingMsg': '等待第一位玩家加入後開始計時...',
    'toast.battleEnded': '比賽已結束，不能再下注',
    'toast.teamCapped': '該隊伍已達下注上限，等待其他隊伍跟上',
    'toast.teamNameSaved': '隊伍名稱已更新！',
    'toast.teamNameLocked': '隊伍名稱已被其他玩家設置',
    'toast.roomStarted': '比賽開始！計時器已啟動。',
  },
};

function t(key) {
  return (TRANSLATIONS[state.lang] || TRANSLATIONS.en)[key] || TRANSLATIONS.en[key] || key;
}

// Language labels for the switcher button
const LANG_LABELS = { 'en': 'English', 'zh-CN': '简体中文', 'zh-TW': '繁體中文' };

function toggleLangMenu() {
  const btn = document.getElementById('langCurrentBtn');
  const menu = document.getElementById('langMenu');
  const isOpen = menu.classList.contains('open');
  if (isOpen) {
    closeLangMenu();
  } else {
    btn.classList.add('open');
    menu.classList.add('open');
  }
}

function closeLangMenu() {
  const btn = document.getElementById('langCurrentBtn');
  const menu = document.getElementById('langMenu');
  if (btn) btn.classList.remove('open');
  if (menu) menu.classList.remove('open');
}

function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  state.lang = lang;
  localStorage.setItem('bw_lang', lang);
  closeLangMenu();

  // Update switcher button label
  const label = document.getElementById('langCurrentLabel');
  if (label) label.textContent = LANG_LABELS[lang] || lang;

  // Update checkmarks and active state in menu
  document.querySelectorAll('.lang-option').forEach(btn => {
    const isActive = btn.dataset.lang === lang;
    btn.classList.toggle('active', isActive);
    const check = btn.querySelector('.lang-opt-check');
    if (check) check.textContent = isActive ? '✓' : '';
  });

  // Update settings select
  const sl = document.getElementById('settingsLang');
  if (sl) sl.value = lang;

  // Apply all data-i18n text nodes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const text = t(key);
    if (text) el.textContent = text;
  });

  // Apply placeholder translations
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const text = t(key);
    if (text) el.placeholder = text;
  });

  // Apply title/tooltip translations
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.dataset.i18nTitle;
    const text = t(key);
    if (text) el.title = text;
  });

  // Sync html lang attribute
  document.documentElement.lang = lang === 'en' ? 'en' : lang === 'zh-CN' ? 'zh-Hans' : 'zh-Hant';

  // Re-render leaderboard headers if visible
  if (state.currentPage === 'leaderboard') updateLbHeaders();

  // Re-sync connect button
  if (!state.wallet) {
    const btn = document.getElementById('connectBtn');
    if (btn) btn.textContent = t('btn.connect');
  }
}

// Close lang menu on outside click
document.addEventListener('click', e => {
  const switcher = document.getElementById('langSwitcher');
  if (switcher && !switcher.contains(e.target)) closeLangMenu();
});

// ===== CONTRACT ABIs (minimal) =====
const PKROOM_ABI = [
  'function placeBet(uint8 _team, uint256 _amount) external',
  'function claimReward() external',
  'function startMatch() external',
  'function teamTotalBets(uint8) view returns (uint256)',
  'function userBets(uint8, address) view returns (uint256)',
  'function userTeam(address) view returns (uint8)',
  'function hasJoined(address) view returns (bool)',
  'function hasClaimed(address) view returns (bool)',
  'function status() view returns (uint8)',
  'function maxTeams() view returns (uint8)',
  'function currentBetLimit() view returns (uint256)',
  'function winningTeam() view returns (uint8)',
  'function winnerDeclared() view returns (bool)',
  'function totalPrizePool() view returns (uint256)',
  'function endTime() view returns (uint256)',
  'function freeStageWindow() view returns (uint256)',
  'function getTimeRemaining() view returns (uint256)',
  'function isInFreeStage() view returns (bool)',
  'function betToken() view returns (address)',
  'function roomName() view returns (string)',
];

const PKFACTORY_ABI = [
  'function createRoom(string _roomName, uint8 _maxTeams, uint256 _duration, uint256 _initialBetLimit, address _betToken) external returns (address)',
  'function rooms(uint256) view returns (address roomAddress, address creator, uint256 createdAt, string roomName, uint8 maxTeams)',
  'function roomCount() view returns (uint256)',
  'event RoomCreated(uint256 indexed roomId, address indexed roomAddress, address indexed creator, string roomName, uint8 maxTeams, uint256 duration, uint256 initialBetLimit)',
];

const ERC20_ABI = [
  'function approve(address spender, uint256 amount) external returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

// ===== TEAM COLOR PALETTE =====
const TEAM_COLORS = [
  { name: 'TEAM A', hex: '#ff2d55', glow: 'rgba(255,45,85,.4)' },
  { name: 'TEAM B', hex: '#00d4ff', glow: 'rgba(0,212,255,.4)' },
  { name: 'TEAM C', hex: '#00ff88', glow: 'rgba(0,255,136,.4)' },
  { name: 'TEAM D', hex: '#8b5cf6', glow: 'rgba(139,92,246,.4)' },
  { name: 'TEAM E', hex: '#ff9900', glow: 'rgba(255,153,0,.4)' },
  { name: 'TEAM F', hex: '#ff69b4', glow: 'rgba(255,105,180,.4)' },
  { name: 'TEAM G', hex: '#00ffcc', glow: 'rgba(0,255,204,.4)' },
  { name: 'TEAM H', hex: '#ffe033', glow: 'rgba(255,224,51,.3)' },
];

// ===== DEMO ROOMS =====
const DEMO_ROOMS = [
  { id: 0, name: 'The Final Showdown', status: 'active', maxTeams: 2, contract_address: null, betToken: null, teams: [{ index: 0, total: 520 }, { index: 1, total: 680 }], endTimestamp: Date.now() + 12 * 60 * 1000 + 34 * 1000, duration: 30 * 60 * 1000, betLimit: 100, freeStageWindow: 300 },
  { id: 1, name: 'Midnight Massacre', status: 'active', maxTeams: 2, contract_address: null, betToken: null, teams: [{ index: 0, total: 1200 }, { index: 1, total: 890 }], endTimestamp: Date.now() + 5 * 60 * 1000 + 21 * 1000, duration: 30 * 60 * 1000, betLimit: 200, freeStageWindow: 300 },
  { id: 2, name: 'Dragon Tournament · 4 Teams', status: 'active', maxTeams: 4, contract_address: null, betToken: null, teams: [{ index: 0, total: 1200 }, { index: 1, total: 890 }, { index: 2, total: 450 }, { index: 3, total: 320 }], endTimestamp: Date.now() + 18 * 60 * 1000, duration: 45 * 60 * 1000, betLimit: 150, freeStageWindow: 300 },
  { id: 3, name: 'Whale Wars · 8 Teams', status: 'active', maxTeams: 8, contract_address: null, betToken: null, teams: [{ index: 0, total: 3500 }, { index: 1, total: 4200 }, { index: 2, total: 2100 }, { index: 3, total: 1800 }, { index: 4, total: 1500 }, { index: 5, total: 900 }, { index: 6, total: 650 }, { index: 7, total: 400 }], endTimestamp: Date.now() + 2 * 60 * 1000 + 15 * 1000, duration: 60 * 60 * 1000, betLimit: 500, freeStageWindow: 300 },
  { id: 4, name: 'Rookie Rumble', status: 'active', maxTeams: 2, contract_address: null, betToken: null, teams: [{ index: 0, total: 80 }, { index: 1, total: 120 }], endTimestamp: Date.now() + 18 * 60 * 1000 + 45 * 1000, duration: 30 * 60 * 1000, betLimit: 50, freeStageWindow: 300 },
  { id: 5, name: 'Diamond Hands Only', status: 'settled', maxTeams: 2, contract_address: null, betToken: null, teams: [{ index: 0, total: 2100 }, { index: 1, total: 1800 }], endTimestamp: Date.now() - 10 * 60 * 1000, duration: 30 * 60 * 1000, betLimit: 200, freeStageWindow: 300, winnerDeclared: true, winningTeam: 0, totalPrizePool: 2100 + 1800 * 0.95 },
];

// ===== STATE =====
let state = {
  wallet: null,
  user: null,
  lang: localStorage.getItem('bw_lang') || 'en',
  currentPage: 'home',
  selectedTeam: null,
  currentRoom: null,
  contractConfig: null,
  betRoomTimer: null,
  userBetsInRoom: {},
  ws: null,
};

// ===== UTILITY =====
function formatU(amount) {
  const n = parseFloat(amount) || 0;
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M U`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K U`;
  return `${n.toFixed(n % 1 === 0 ? 0 : 2)} U`;
}

function formatTime(seconds) {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(sec)}`;
  return `${pad(m)}:${pad(sec)}`;
}

function pad(n) { return String(n).padStart(2, '0'); }

// Random warrior username
function generateRandomUsername() {
  const adj = ['Blood','Iron','Shadow','Dark','Steel','Fire','Storm','Thunder','Silver','Golden','Crimson','Phantom','Frost','Void','Chaos','Blaze'];
  const noun = ['Warrior','Fighter','Slayer','Hunter','Knight','Blade','Wolf','Dragon','Tiger','Hawk','Viper','Ghost','Titan','Reaper','Phoenix','Legend'];
  const num = Math.floor(1000 + Math.random() * 9000);
  return adj[Math.floor(Math.random() * adj.length)] + noun[Math.floor(Math.random() * noun.length)] + num;
}

// ===== NAVIGATION =====
document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', e => { e.preventDefault(); navigateTo(el.dataset.page); });
});

function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) {
    pageEl.classList.add('active');
    state.currentPage = page;
    document.querySelectorAll(`.nav-link[data-page="${page}"]`).forEach(n => n.classList.add('active'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (page === 'rooms') loadRooms();
    if (page === 'leaderboard') loadLeaderboard();
    if (page === 'dawn') loadDawnData();
    if (page === 'profile') loadProfile();
    if (page !== 'bet') stopBetRoomTimer();
  }
  closeAccountDropdown();
}

// =====================================================
// ACCOUNT DROPDOWN
// =====================================================
function toggleAccountDropdown() {
  const dd = document.getElementById('accountDropdown');
  if (!dd) return;
  const isOpen = dd.classList.contains('open');
  if (isOpen) { closeAccountDropdown(); } else { openAccountDropdown(); }
}

function openAccountDropdown() {
  const dd = document.getElementById('accountDropdown');
  if (dd) dd.classList.add('open');
  // Load fresh stats for dropdown
  loadDropdownStats();
}

function closeAccountDropdown() {
  const dd = document.getElementById('accountDropdown');
  if (dd) dd.classList.remove('open');
  cancelEditUsername();
}

// Close dropdown on outside click
document.addEventListener('click', e => {
  const wrap = document.getElementById('accountWrap');
  if (wrap && !wrap.contains(e.target)) closeAccountDropdown();
});

async function loadDropdownStats() {
  if (!state.wallet) return;
  try {
    const res = await fetch(`${CONFIG.API_URL}/users/${state.wallet}/stats`);
    const data = await res.json();
    if (data.success) {
      const wins = data.data.wins || 0;
      const total = data.data.total_matches || 0;
      const profit = parseFloat(data.data.total_profit || 0);
      const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
      const dropWins = document.getElementById('dropWins');
      const dropWinRate = document.getElementById('dropWinRate');
      const dropProfit = document.getElementById('dropProfit');
      if (dropWins) dropWins.textContent = wins;
      if (dropWinRate) dropWinRate.textContent = `${winRate}%`;
      if (dropProfit) {
        dropProfit.textContent = `${profit >= 0 ? '+' : ''}${profit.toFixed(1)} U`;
        dropProfit.style.color = profit >= 0 ? 'var(--green-win)' : 'var(--red-hot)';
      }
    }
  } catch (e) {}
}

// Username edit
function startEditUsername() {
  const wrap = document.getElementById('acctEditWrap');
  const input = document.getElementById('newUsernameInput');
  if (wrap) wrap.style.display = 'block';
  if (input) {
    input.placeholder = t('acct.namePlaceholder');
    input.value = state.user?.username || '';
    input.focus();
    input.select();
  }
}

function cancelEditUsername() {
  const wrap = document.getElementById('acctEditWrap');
  if (wrap) wrap.style.display = 'none';
}

async function saveUsername() {
  if (!state.wallet) { toast(t('toast.connectFirst'), 'error'); return; }
  const input = document.getElementById('newUsernameInput');
  const username = (input?.value || '').trim();
  if (!username || username.length < 3) { toast('Username must be at least 3 characters', 'error'); return; }
  if (username.length > 20) { toast('Username max 20 characters', 'error'); return; }

  try {
    const res = await fetch(`${CONFIG.API_URL}/users/${state.wallet}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    if (data.success) {
      state.user = data.data;
      updateAccountUI();
      cancelEditUsername();
      toast(t('toast.usernameSaved'), 'success');
    } else {
      toast(data.error === 'Username taken' ? t('toast.usernameTaken') : data.error, 'error');
    }
  } catch (e) {
    toast('Failed to update username', 'error');
  }
}

function updateAccountUI() {
  const username = state.user?.username || state.wallet?.slice(0, 8) || '???';
  const walletShort = state.wallet ? `${state.wallet.slice(0, 8)}...${state.wallet.slice(-4)}` : '';
  const avatarChar = username.slice(0, 2).toUpperCase();

  // Dropdown
  const dropUsername = document.getElementById('dropUsername');
  const dropWallet = document.getElementById('dropWallet');
  const dropAvatar = document.getElementById('dropAvatar');
  if (dropUsername) dropUsername.textContent = username;
  if (dropWallet) dropWallet.textContent = walletShort;
  if (dropAvatar) dropAvatar.textContent = avatarChar;

  // Account button label
  const label = document.getElementById('accountBtnLabel');
  if (label) label.textContent = walletShort;

  // Profile page
  const profileAvatar = document.getElementById('profileAvatar');
  const profileName = document.getElementById('profileName');
  const profileWallet = document.getElementById('profileWallet');
  if (profileAvatar) profileAvatar.textContent = avatarChar;
  if (profileName) profileName.textContent = username;
  if (profileWallet) profileWallet.textContent = state.wallet || '';
}

// =====================================================
// WALLET — MetaMask
// =====================================================
async function connectWallet() {
  if (!window.ethereum) {
    toast('Please install MetaMask to continue', 'error');
    window.open('https://metamask.io/download/', '_blank');
    return;
  }
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    state.wallet = accounts[0].toLowerCase();
    await switchToBSC();
    await loadUserData();
    loadContractConfig();
    updateWalletUI();
    toast(t('toast.walletConnected'), 'success');
  } catch (err) {
    if (err.code === 4001) toast(t('toast.walletRejected'), 'error');
    else { console.error(err); toast(t('toast.walletFailed'), 'error'); }
  }
}

async function switchToBSC() {
  try {
    await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: CONFIG.BSC_CHAIN_ID }] });
  } catch (e) {
    if (e.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{ chainId: CONFIG.BSC_CHAIN_ID, chainName: 'BNB Smart Chain', nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 }, rpcUrls: [CONFIG.BSC_RPC], blockExplorerUrls: ['https://bscscan.com/'] }],
      });
    }
  }
}

function disconnectWallet() {
  state.wallet = null;
  state.user = null;
  updateWalletUI();
  closeAccountDropdown();
  toast(t('toast.disconnected'), 'success');
  if (state.currentPage === 'profile') navigateTo('home');
}

function updateWalletUI() {
  const connectBtn = document.getElementById('connectBtn');
  const accountWrap = document.getElementById('accountWrap');

  if (state.wallet) {
    if (connectBtn) connectBtn.style.display = 'none';
    if (accountWrap) accountWrap.style.display = 'flex';
    updateAccountUI();
  } else {
    if (connectBtn) { connectBtn.style.display = 'block'; connectBtn.textContent = t('btn.connect'); }
    if (accountWrap) accountWrap.style.display = 'none';
  }
}

if (window.ethereum) {
  window.ethereum.on('accountsChanged', accounts => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      state.wallet = accounts[0].toLowerCase();
      loadUserData().then(() => { updateWalletUI(); loadContractConfig(); });
    }
  });
  window.ethereum.on('chainChanged', () => window.location.reload());
}

async function loadContractConfig() {
  try {
    const res = await fetch(`${CONFIG.API_URL}/config`);
    const data = await res.json();
    state.contractConfig = data;
  } catch (e) {}
}

async function loadUserData() {
  if (!state.wallet) return;
  try {
    const res = await fetch(`${CONFIG.API_URL}/users/${state.wallet}`);
    const data = await res.json();
    if (data.success) {
      state.user = data.data;
      // Auto-assign random username if none set
      if (!state.user.username) {
        await assignRandomUsername();
      }
      const linkEl = document.getElementById('inviteLinkDisplay');
      if (linkEl && state.user.invite_code) {
        linkEl.value = `${window.location.origin}/?ref=${state.user.invite_code}`;
      }
      updateAccountUI();
      // Apply pending referral from invite link
      const pendingRef = sessionStorage.getItem('pendingRefCode');
      if (pendingRef && !state.user.invited_by) {
        sessionStorage.removeItem('pendingRefCode');
        const refRes = await fetch(`${CONFIG.API_URL}/users/${state.wallet}/invite`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inviteCode: pendingRef }),
        });
        const refData = await refRes.json();
        if (refData.success) toast(t('toast.inviteApplied'), 'success');
      }
    }
  } catch (e) {}
}

async function assignRandomUsername() {
  let attempts = 0;
  while (attempts < 5) {
    const username = generateRandomUsername();
    try {
      const res = await fetch(`${CONFIG.API_URL}/users/${state.wallet}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (data.success) {
        state.user = data.data;
        return;
      }
      // 409 = taken, try again
    } catch (e) { break; }
    attempts++;
  }
}

// =====================================================
// CONTRACT HELPERS (ethers.js v5)
// =====================================================
function getProvider() {
  if (!window.ethereum || typeof ethers === 'undefined') return null;
  return new ethers.providers.Web3Provider(window.ethereum);
}

function getSigner() { const p = getProvider(); return p ? p.getSigner() : null; }

function getRoomContract(addr, withSigner = false) {
  const ps = withSigner ? getSigner() : getProvider();
  if (!ps || !addr) return null;
  return new ethers.Contract(addr, PKROOM_ABI, ps);
}

function getFactoryContract(withSigner = false) {
  const addr = state.contractConfig?.factoryAddress;
  if (!addr || addr === '0x0000000000000000000000000000000000000000') return null;
  const ps = withSigner ? getSigner() : getProvider();
  if (!ps) return null;
  return new ethers.Contract(addr, PKFACTORY_ABI, ps);
}

function getTokenContract(addr, withSigner = false) {
  const ps = withSigner ? getSigner() : getProvider();
  if (!ps || !addr) return null;
  return new ethers.Contract(addr, ERC20_ABI, ps);
}

// =====================================================
// ROOMS LIST
// =====================================================
async function loadRooms() {
  const grid = document.getElementById('roomsGrid');
  grid.innerHTML = `<div style="text-align:center;color:var(--text-dim);padding:3rem;grid-column:1/-1">${t('loading.battle')}</div>`;
  try {
    const res = await fetch(`${CONFIG.API_URL}/rooms?limit=20`);
    const data = await res.json();
    grid.innerHTML = (data.success && data.data.length > 0) ? data.data.map(renderRoomCard).join('') : renderDemoRooms();
  } catch (e) { grid.innerHTML = renderDemoRooms(); }
}

function renderDemoRooms() {
  return DEMO_ROOMS.map((r, i) => {
    const statusClass = r.status === 'active' ? 'live' : r.status;
    const statusLabel = r.status === 'active' ? '● LIVE' : r.status === 'waiting' ? '◉ WAITING' : '✓ SETTLED';
    const totalBets = r.teams.reduce((s, t) => s + (t.total || 0), 0);
    const teamA = r.teams[0] || {};
    const pct = totalBets > 0 ? Math.max(5, (teamA.total / totalBets) * 100) : 50;
    const remaining = Math.max(0, r.endTimestamp - Date.now());
    const timeStr = remaining > 0 ? formatTime(remaining / 1000) : '00:00';
    const inFreeStage = r.status === 'active' && remaining < r.freeStageWindow * 1000 && remaining > 0;
    const teamMinis = r.teams.slice(0, 4).map((tm, idx) =>
      `<div class="team-mini" style="color:${TEAM_COLORS[idx]?.hex}">${TEAM_COLORS[idx]?.name}: ${formatU(tm.total)}</div>`
    ).join('') + (r.teams.length > 4 ? `<div class="team-mini" style="color:var(--text-dim)">+${r.teams.length - 4} more</div>` : '');
    return `<div class="room-card" onclick="openBetRoom(${i})">
      <div class="room-header"><span class="room-name">${r.name}</span><span class="room-status ${statusClass}">${statusLabel}</span></div>
      <div class="room-teams-mini">${teamMinis}</div>
      <div class="room-progress"><div class="room-progress-inner" style="width:${pct}%"></div></div>
      <div class="room-meta"><span>⚔ ${r.maxTeams} teams</span><span>⏱ ${timeStr}</span><span>🏆 ${formatU(totalBets)}</span>${inFreeStage ? '<span class="free-stage-tag">🔥 FREE STAGE</span>' : ''}</div>
    </div>`;
  }).join('');
}

function renderRoomCard(room) {
  const sc = room.status === 'active' ? 'live' : room.status;
  const sl = room.status === 'active' ? '● LIVE' : room.status === 'waiting' ? '◉ WAITING' : '✓ SETTLED';
  const roomId = room.room_id_onchain != null ? room.room_id_onchain : room.id;
  return `<div class="room-card" onclick="openBetRoom(${roomId}, true)">
    <div class="room-header"><span class="room-name">${room.room_name}</span><span class="room-status ${sc}">${sl}</span></div>
    <div class="room-meta"><span>👥 ${room.total_participants || 0}</span><span>🏆 ${formatU(room.total_prize_pool || 0)}</span></div>
  </div>`;
}

// =====================================================
// BET ROOM
// =====================================================
async function openBetRoom(roomId, fetchFromAPI = false) {
  state.selectedTeam = null;
  state.userBetsInRoom = {};
  stopBetRoomTimer();
  navigateTo('bet');

  const titleEl = document.getElementById('betRoomTitle');
  const teamsGrid = document.getElementById('teamsGrid');
  if (titleEl) titleEl.textContent = 'Loading...';
  if (teamsGrid) teamsGrid.innerHTML = `<div style="text-align:center;color:var(--text-dim);padding:3rem;grid-column:1/-1">${t('loading.battle')}</div>`;

  let roomData;
  if (!fetchFromAPI && typeof roomId === 'number' && DEMO_ROOMS[roomId]) {
    roomData = JSON.parse(JSON.stringify(DEMO_ROOMS[roomId]));
  } else {
    try {
      const res = await fetch(`${CONFIG.API_URL}/rooms/${roomId}`);
      const data = await res.json();
      if (data.success) roomData = normalizeApiRoom(data.data);
    } catch (e) {}
    roomData = roomData || JSON.parse(JSON.stringify(DEMO_ROOMS[0]));
  }

  state.currentRoom = roomData;
  if (roomData.contract_address && typeof ethers !== 'undefined') await refreshRoomFromChain(roomData);
  renderBetRoomUI(roomData);
  startBetRoomTimer(roomData);
  if (state.ws && state.ws.readyState === WebSocket.OPEN) {
    state.ws.send(JSON.stringify({ type: 'subscribe_room', roomId: roomData.id }));
  }
}

function normalizeApiRoom(apiRoom) {
  const teams = [];
  if (apiRoom.teams && Array.isArray(apiRoom.teams)) {
    apiRoom.teams.forEach(t => teams.push({
      index: t.team_index,
      total: parseFloat(t.total_bets || 0),
      name: t.team_name || null,
      nameSetBy: t.name_set_by || null,
    }));
  } else {
    const n = apiRoom.max_teams || 2;
    for (let i = 0; i < n; i++) teams.push({ index: i, total: 0, name: null, nameSetBy: null });
  }
  return {
    id: apiRoom.room_id_onchain != null ? apiRoom.room_id_onchain : apiRoom.id,
    dbId: apiRoom.id,
    name: apiRoom.room_name, status: apiRoom.status,
    maxTeams: apiRoom.max_teams || 2, contract_address: apiRoom.contract_address || null,
    betToken: apiRoom.bet_token || null, teams,
    // null end_time means room is still waiting (timer not started)
    endTimestamp: apiRoom.end_time ? new Date(apiRoom.end_time).getTime() : null,
    duration: (apiRoom.duration_seconds || 1800) * 1000,
    betLimit: parseFloat(apiRoom.current_bet_limit || apiRoom.initial_bet_limit || 100),
    initialBetLimit: parseFloat(apiRoom.initial_bet_limit || 100),
    betLimitStepPct: parseInt(apiRoom.bet_limit_step_pct || 50),
    creatorWallet: apiRoom.creator_wallet || null,
    freeStageWindow: 300, winnerDeclared: !!apiRoom.winner, winningTeam: apiRoom.winner,
    totalPrizePool: parseFloat(apiRoom.total_prize_pool || 0),
  };
}

async function refreshRoomFromChain(room) {
  try {
    const contract = getRoomContract(room.contract_address);
    if (!contract) return;
    const [maxTeamsRaw, betLimitRaw, endTimeRaw, freeWindowRaw, winnerDeclared, winTeamRaw, prizePoolRaw, statusRaw] =
      await Promise.all([contract.maxTeams(), contract.currentBetLimit(), contract.endTime(), contract.freeStageWindow(), contract.winnerDeclared(), contract.winningTeam(), contract.totalPrizePool(), contract.status()]);
    const nTeams = parseInt(maxTeamsRaw);
    const teamTotals = await Promise.all(Array.from({ length: nTeams }, (_, i) => contract.teamTotalBets(i)));
    room.maxTeams = nTeams;
    room.teams = teamTotals.map((t, i) => ({ index: i, total: parseFloat(ethers.utils.formatUnits(t, 18)) }));
    room.betLimit = parseFloat(ethers.utils.formatUnits(betLimitRaw, 18));
    room.endTimestamp = parseInt(endTimeRaw) * 1000;
    room.freeStageWindow = parseInt(freeWindowRaw);
    room.winnerDeclared = winnerDeclared;
    room.winningTeam = parseInt(winTeamRaw);
    room.totalPrizePool = parseFloat(ethers.utils.formatUnits(prizePoolRaw, 18));
    const statusMap = ['waiting', 'active', 'settled', 'cancelled'];
    room.status = statusMap[parseInt(statusRaw)] || room.status;
    if (state.wallet) {
      const hasJoined = await contract.hasJoined(state.wallet);
      if (hasJoined) {
        const userTeamIdx = parseInt(await contract.userTeam(state.wallet));
        const userBetRaw = await contract.userBets(userTeamIdx, state.wallet);
        state.userBetsInRoom[userTeamIdx] = parseFloat(ethers.utils.formatUnits(userBetRaw, 18));
      }
    }
  } catch (e) { console.warn('[Chain] refreshRoomFromChain failed:', e.message); }
}

function renderBetRoomUI(room) {
  const titleEl = document.getElementById('betRoomTitle');
  const statusEl = document.getElementById('betRoomStatus');
  if (titleEl) titleEl.textContent = room.name || `Battle Room #${room.id}`;

  const now = Date.now();
  const timeExpired = room.endTimestamp && now >= room.endTimestamp;
  const isWaiting = room.status === 'waiting';
  const isSettled = room.status === 'settled';
  const isEnded = timeExpired && !isSettled; // time up but not yet settled on-chain

  if (statusEl) {
    if (isSettled) { statusEl.textContent = '✓ SETTLED'; statusEl.className = 'room-status settled'; }
    else if (isEnded) { statusEl.textContent = '⏰ ENDED'; statusEl.className = 'room-status ended'; }
    else if (isWaiting) { statusEl.textContent = '◉ WAITING'; statusEl.className = 'room-status waiting'; }
    else { statusEl.textContent = '● LIVE'; statusEl.className = 'room-status live'; }
  }

  renderTeamsGrid(room);
  updateLeaderStrip(room);

  const betControls = document.getElementById('betControls');
  const placeBetBtn = document.getElementById('placeBetBtn');
  const claimBtn = document.getElementById('claimRewardBtn');

  if (isSettled) {
    if (betControls) betControls.style.display = 'none';
    if (placeBetBtn) placeBetBtn.style.display = 'none';
    if (claimBtn) {
      const userWon = room.winnerDeclared && (state.userBetsInRoom[room.winningTeam] || 0) > 0;
      claimBtn.style.display = userWon ? 'block' : 'none';
      claimBtn.disabled = false;
      claimBtn.textContent = t('btn.claimReward');
    }
    const stagePill = document.getElementById('stagePill');
    const countdown = document.getElementById('stageCountdown');
    if (stagePill) { stagePill.textContent = '✓ SETTLED'; stagePill.className = 'stage-pill ended'; }
    if (countdown) countdown.textContent = '00:00';
  } else if (isEnded) {
    if (betControls) { betControls.style.display = 'block'; betControls.style.opacity = '0.5'; }
    if (placeBetBtn) { placeBetBtn.style.display = 'block'; placeBetBtn.disabled = true; placeBetBtn.textContent = 'Battle Ended — Awaiting Settlement'; placeBetBtn.style.background = ''; }
    if (claimBtn) claimBtn.style.display = 'none';
    const stagePill = document.getElementById('stagePill');
    const countdown = document.getElementById('stageCountdown');
    const limitPill = document.getElementById('stageLimitPill');
    if (stagePill) { stagePill.textContent = '⏰ BATTLE ENDED'; stagePill.className = 'stage-pill ended'; }
    if (countdown) countdown.textContent = '00:00';
    if (limitPill) limitPill.textContent = '—';
  } else if (isWaiting) {
    if (betControls) betControls.style.display = 'block';
    if (placeBetBtn) {
      placeBetBtn.style.display = 'block';
      placeBetBtn.disabled = true;
      placeBetBtn.textContent = t('btn.selectTeam');
      placeBetBtn.style.background = '';
    }
    if (claimBtn) claimBtn.style.display = 'none';
    const stagePill = document.getElementById('stagePill');
    const countdown = document.getElementById('stageCountdown');
    const limitPill = document.getElementById('stageLimitPill');
    if (stagePill) { stagePill.textContent = '◉ WAITING'; stagePill.className = 'stage-pill waiting'; }
    if (countdown) countdown.textContent = '--:--';
    if (limitPill) limitPill.textContent = `MAX: ${room.betLimit || 100} U`;
    // Show waiting message
    const stageBar = document.getElementById('stageBar');
    if (stageBar && !document.getElementById('waitingMsg')) {
      const msg = document.createElement('div');
      msg.id = 'waitingMsg';
      msg.className = 'waiting-msg';
      msg.setAttribute('data-i18n', 'room.waitingMsg');
      msg.textContent = t('room.waitingMsg');
      stageBar.insertAdjacentElement('afterend', msg);
    }
  } else {
    // active
    document.getElementById('waitingMsg')?.remove();
    if (betControls) { betControls.style.display = 'block'; betControls.style.opacity = ''; }
    if (placeBetBtn) {
      placeBetBtn.style.display = 'block';
      placeBetBtn.disabled = true;
      placeBetBtn.textContent = t('btn.selectTeam');
      placeBetBtn.style.background = '';
    }
    if (claimBtn) claimBtn.style.display = 'none';
  }
}

function renderTeamsGrid(room) {
  const grid = document.getElementById('teamsGrid');
  if (!grid) return;
  const totalBets = room.teams.reduce((s, t) => s + (t.total || 0), 0);
  const maxBet = Math.max(...room.teams.map(t => t.total || 0));
  const leadingIdx = (maxBet > 0 && room.status !== 'settled') ? room.teams.findIndex(t => t.total === maxBet) : -1;
  const n = room.teams.length;
  // Odd count → single row (all N columns); Even count → 2 per row
  if (n % 2 === 0) {
    grid.className = 'teams-grid';
    grid.style.gridTemplateColumns = '1fr 1fr';
  } else {
    grid.className = 'teams-grid';
    grid.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
  }
  const betLimit = room.betLimit || 100;
  grid.innerHTML = room.teams.map((team, i) => {
    const tc = TEAM_COLORS[i] || TEAM_COLORS[0];
    const total = team.total || 0;
    const pct = totalBets > 0 ? (total / totalBets * 100).toFixed(1) : '0.0';
    const isLeading = i === leadingIdx;
    const isWinner = room.winnerDeclared && room.winningTeam === i;
    const isCapped = total >= betLimit && room.status === 'active';
    const userBet = state.userBetsInRoom[i] || 0;
    const isSelected = state.selectedTeam === i;
    const capPct = Math.min(100, (total / betLimit) * 100).toFixed(0);

    let badge = '';
    if (isWinner) badge = '<span class="team-badge winner">👑 WINNER</span>';
    else if (isCapped) badge = '<span class="team-badge capped">🔒 CAPPED</span>';
    else if (isLeading) badge = '<span class="team-badge leading">⚡ LEADING</span>';

    // Team name: use custom name or fall back to color palette default
    const teamDisplayName = team.name || tc.name;

    // Show edit button for API rooms when user can rename
    const canRename = room.dbId && state.wallet && (
      (team.nameSetBy === null || team.nameSetBy === undefined) ||
      (team.nameSetBy === state.wallet)
    );
    const editBtn = canRename && room.status !== 'settled'
      ? `<button class="team-name-edit-btn" onclick="event.stopPropagation();editTeamName(${i})" title="Rename team">✏</button>`
      : '';

    const clickable = (room.status === 'active' && !isCapped) ? `onclick="selectTeam(${i})"` : '';
    const cappedStyle = isCapped ? 'opacity:0.6;cursor:not-allowed;' : '';

    return `<div class="team-card ${isLeading ? 'leading' : ''} ${isWinner ? 'winner' : ''} ${isSelected ? 'selected' : ''} ${isCapped ? 'capped' : ''}" style="--tc:${tc.hex};--tg:${tc.glow};${cappedStyle}" ${clickable}>
      ${badge}
      <div class="team-card-name" style="color:${tc.hex}">
        <span id="team-name-${i}">${teamDisplayName}</span>${editBtn}
      </div>
      <div id="team-name-edit-${i}" class="team-name-edit-wrap" style="display:none">
        <input class="form-input team-name-input" id="team-name-input-${i}" maxlength="50" value="${teamDisplayName}">
        <div class="team-name-edit-btns">
          <button onclick="event.stopPropagation();saveTeamName(${i})">✓</button>
          <button onclick="event.stopPropagation();cancelTeamNameEdit(${i})">✕</button>
        </div>
      </div>
      <div class="team-card-total">${formatU(total)}</div>
      <div class="team-card-pct">${pct}% of pool</div>
      <div class="team-pool-bar">
        <div class="team-pool-fill" style="width:${Math.max(2, parseFloat(pct))}%;background:${tc.hex}"></div>
      </div>
      ${betLimit > 0 ? `<div class="team-cap-bar" title="Bet cap: ${formatU(betLimit)}">
        <div class="team-cap-fill ${isCapped ? 'capped' : ''}" style="width:${capPct}%;background:${isCapped ? '#ff2d55' : tc.hex}88"></div>
        <span class="team-cap-label">${isCapped ? '🔒 ' : ''}Cap: ${formatU(total)} / ${formatU(betLimit)}</span>
      </div>` : ''}
      ${userBet > 0 ? `<div class="team-your-bet" style="color:${tc.hex}">Your bet: ${formatU(userBet)}</div>` : ''}
    </div>`;
  }).join('');
}

function updateLeaderStrip(room) {
  const strip = document.getElementById('leaderStrip');
  if (!strip) return;
  const maxBet = Math.max(...room.teams.map(t => t.total || 0));
  if (maxBet === 0) { strip.style.display = 'none'; return; }
  const leadIdx = room.teams.findIndex(t => t.total === maxBet);
  const tc = TEAM_COLORS[leadIdx] || TEAM_COLORS[0];
  strip.style.display = 'flex';
  strip.style.borderColor = tc.hex + '55';
  const prefix = document.getElementById('leaderPrefix');
  const name = document.getElementById('leaderName');
  const amount = document.getElementById('leaderAmount');
  if (prefix) prefix.textContent = room.status === 'settled' && room.winnerDeclared ? '🏆 WINNER:' : '⚔ LEADING:';
  if (name) { name.textContent = tc.name; name.style.color = tc.hex; }
  if (amount) amount.textContent = formatU(maxBet);
}

function selectTeam(teamIdx) {
  const room = state.currentRoom;
  if (!room || room.status !== 'active') return;
  // Block if time expired
  if (room.endTimestamp && Date.now() >= room.endTimestamp) {
    toast(t('toast.battleEnded'), 'error');
    return;
  }
  // Block if team is capped
  const teamTotal = room.teams[teamIdx]?.total || 0;
  if (room.betLimit > 0 && teamTotal >= room.betLimit) {
    toast(t('toast.teamCapped'), 'error');
    return;
  }
  const alreadyBetTeam = Object.keys(state.userBetsInRoom).find(k => state.userBetsInRoom[k] > 0);
  if (alreadyBetTeam !== undefined && parseInt(alreadyBetTeam) !== teamIdx) {
    toast(`You already bet on ${TEAM_COLORS[alreadyBetTeam]?.name} — you cannot switch teams!`, 'error');
    return;
  }
  state.selectedTeam = teamIdx;
  renderTeamsGrid(room);
  const tc = TEAM_COLORS[teamIdx] || TEAM_COLORS[0];
  const btn = document.getElementById('placeBetBtn');
  if (btn) { btn.disabled = false; btn.textContent = `⚔ Bet on ${tc.name}`; btn.style.background = `linear-gradient(135deg, ${tc.hex}cc, ${tc.hex}88)`; }
}

function setBetAmount(amt) {
  const el = document.getElementById('betAmountInput');
  if (el) el.value = amt;
}

async function placeBet() {
  if (state.selectedTeam === null) { toast(t('toast.selectTeam'), 'error'); return; }
  if (!state.wallet) { toast(t('toast.connectFirst'), 'error'); return; }
  const amountStr = document.getElementById('betAmountInput')?.value;
  const amount = parseFloat(amountStr);
  if (!amount || amount <= 0) { toast(t('toast.enterAmount'), 'error'); return; }
  const room = state.currentRoom;
  const now = Date.now();

  // Block if time has expired
  if (room.endTimestamp && now >= room.endTimestamp) {
    toast(t('toast.battleEnded'), 'error');
    return;
  }

  // Check per-team bet cap
  const teamTotal = (room.teams[state.selectedTeam]?.total || 0);
  const betLimit = room.betLimit || 0;
  if (betLimit > 0 && teamTotal >= betLimit) {
    toast(t('toast.teamCapped'), 'error');
    return;
  }

  // If room is waiting and non-creator joins, start the timer
  if (room.status === 'waiting' && room.dbId && room.creatorWallet !== state.wallet) {
    await startRoomIfWaiting(room);
    if (room.status === 'waiting') return; // still waiting, something failed
  }

  const remaining = room.endTimestamp ? room.endTimestamp - now : Infinity;
  const inFreeStage = room.endTimestamp && remaining < (room.freeStageWindow || 300) * 1000;
  if (!inFreeStage && betLimit > 0 && amount > betLimit) {
    const timeToFree = remaining / 1000 - (room.freeStageWindow || 300);
    toast(`Max bet is ${betLimit} U. Free stage in ${formatTime(Math.max(0, timeToFree))}`, 'error');
    return;
  }
  if (room.contract_address && typeof ethers !== 'undefined') {
    const btn = document.getElementById('placeBetBtn');
    try {
      if (btn) { btn.disabled = true; btn.textContent = 'Processing...'; }
      const tokenAddr = room.betToken || state.contractConfig?.betTokenAddress;
      if (!tokenAddr) throw new Error('Token address not configured');
      const amountWei = ethers.utils.parseUnits(amount.toString(), 18);
      await approveAndBet(room.contract_address, tokenAddr, state.selectedTeam, amountWei);
      const tc = TEAM_COLORS[state.selectedTeam];
      toast(`🎉 ${amount} U bet on ${tc?.name}!`, 'success');
      state.userBetsInRoom[state.selectedTeam] = (state.userBetsInRoom[state.selectedTeam] || 0) + amount;
      await refreshRoomFromChain(room);
      renderBetRoomUI(room);
    } catch (err) {
      console.error(err);
      toast(err.reason || err.message || 'Transaction failed', 'error');
      if (btn) { btn.disabled = false; const tc = TEAM_COLORS[state.selectedTeam]; btn.textContent = `⚔ Bet on ${tc?.name}`; }
    }
    return;
  }
  toast('Approving token spend... (demo)', 'success');
  setTimeout(() => {
    const tc = TEAM_COLORS[state.selectedTeam];
    toast(`🎉 Demo: ${amount} U bet on ${tc?.name || 'Team'}!`, 'success');
    state.userBetsInRoom[state.selectedTeam] = (state.userBetsInRoom[state.selectedTeam] || 0) + amount;
    if (room.teams[state.selectedTeam]) room.teams[state.selectedTeam].total += amount;
    // Auto-raise bet cap when ALL teams have reached it
    const limit = room.betLimit || 0;
    if (limit > 0) {
      const allCapped = room.teams.every(tm => (tm.total || 0) >= limit);
      if (allCapped) {
        const stepPct = (room.betLimitStepPct || 50) / 100;
        room.betLimit = parseFloat((limit * (1 + stepPct)).toFixed(4));
        toast(`📈 Bet cap raised to ${formatU(room.betLimit)}!`, 'success');
      }
    }
    renderBetRoomUI(room);
    updateLeaderStrip(room);
  }, 1500);
}

// Start room timer when first non-creator joins
async function startRoomIfWaiting(room) {
  if (!room.dbId || room.status !== 'waiting') return;
  try {
    const res = await fetch(`${CONFIG.API_URL}/rooms/${room.dbId}/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ joiner_wallet: state.wallet }),
    });
    const data = await res.json();
    if (data.success && data.started) {
      room.status = data.data.status;
      room.endTimestamp = data.data.end_time ? new Date(data.data.end_time).getTime() : null;
      document.getElementById('waitingMsg')?.remove();
      renderBetRoomUI(room);
      startBetRoomTimer(room);
      toast(t('toast.roomStarted'), 'success');
    }
  } catch (e) { console.warn('startRoomIfWaiting failed:', e); }
}

// Team name editing
function editTeamName(teamIdx) {
  const nameEl = document.getElementById(`team-name-${teamIdx}`);
  const editWrap = document.getElementById(`team-name-edit-${teamIdx}`);
  if (nameEl) nameEl.parentElement.style.display = 'none';
  if (editWrap) { editWrap.style.display = 'flex'; document.getElementById(`team-name-input-${teamIdx}`)?.focus(); }
}

function cancelTeamNameEdit(teamIdx) {
  const nameEl = document.getElementById(`team-name-${teamIdx}`);
  const editWrap = document.getElementById(`team-name-edit-${teamIdx}`);
  if (nameEl) nameEl.parentElement.style.display = '';
  if (editWrap) editWrap.style.display = 'none';
}

async function saveTeamName(teamIdx) {
  const input = document.getElementById(`team-name-input-${teamIdx}`);
  const newName = (input?.value || '').trim();
  if (!newName) { cancelTeamNameEdit(teamIdx); return; }
  const room = state.currentRoom;
  if (!room?.dbId || !state.wallet) { cancelTeamNameEdit(teamIdx); return; }
  try {
    const res = await fetch(`${CONFIG.API_URL}/rooms/${room.dbId}/teams/${teamIdx}/name`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team_name: newName, wallet: state.wallet }),
    });
    const data = await res.json();
    if (data.success) {
      if (room.teams[teamIdx]) {
        room.teams[teamIdx].name = newName;
        room.teams[teamIdx].nameSetBy = state.wallet;
      }
      cancelTeamNameEdit(teamIdx);
      const nameEl = document.getElementById(`team-name-${teamIdx}`);
      if (nameEl) nameEl.textContent = newName;
      toast(t('toast.teamNameSaved'), 'success');
    } else {
      toast(data.error === 'Team name already set by another player' ? t('toast.teamNameLocked') : (data.error || 'Failed'), 'error');
      cancelTeamNameEdit(teamIdx);
    }
  } catch (e) {
    toast('Failed to update team name', 'error');
    cancelTeamNameEdit(teamIdx);
  }
}

async function approveAndBet(roomAddr, tokenAddr, teamIdx, amountWei) {
  const signer = getSigner();
  if (!signer) throw new Error('No signer — connect your wallet first');
  const userAddr = await signer.getAddress();
  const tokenContract = getTokenContract(tokenAddr, true);
  const allowance = await tokenContract.allowance(userAddr, roomAddr);
  if (allowance.lt(amountWei)) {
    toast('Step 1/2: Approve token spend in MetaMask...', 'success');
    const approveTx = await tokenContract.approve(roomAddr, ethers.constants.MaxUint256);
    toast('Waiting for approval confirmation...', 'success');
    await approveTx.wait();
    toast('Approved! Now confirming bet...', 'success');
  }
  toast('Step 2/2: Confirm bet in MetaMask...', 'success');
  const roomContract = getRoomContract(roomAddr, true);
  const betTx = await roomContract.placeBet(teamIdx, amountWei);
  return await betTx.wait();
}

async function claimReward() {
  if (!state.wallet) { toast(t('toast.connectFirst'), 'error'); return; }
  const room = state.currentRoom;
  const claimBtn = document.getElementById('claimRewardBtn');
  if (room.contract_address && typeof ethers !== 'undefined') {
    try {
      if (claimBtn) claimBtn.disabled = true;
      toast('Confirm claim in MetaMask...', 'success');
      const contract = getRoomContract(room.contract_address, true);
      const tx = await contract.claimReward();
      await tx.wait();
      toast('🏆 Reward claimed successfully!', 'success');
      if (claimBtn) claimBtn.style.display = 'none';
    } catch (err) {
      console.error(err);
      toast(err.reason || err.message || 'Claim failed', 'error');
      if (claimBtn) claimBtn.disabled = false;
    }
    return;
  }
  toast('🏆 Demo: Reward claimed!', 'success');
  if (claimBtn) claimBtn.style.display = 'none';
}

// =====================================================
// TIMER
// =====================================================
function startBetRoomTimer(room) {
  stopBetRoomTimer();
  if (!room.endTimestamp || room.status === 'waiting') return;
  const totalDuration = room.duration || 30 * 60 * 1000;
  const freeWindowMs = (room.freeStageWindow || 300) * 1000;
  function tick() {
    const now = Date.now();
    const remaining = Math.max(0, room.endTimestamp - now);
    const countdownEl = document.getElementById('stageCountdown');
    if (countdownEl) countdownEl.textContent = formatTime(remaining / 1000);
    const fillEl = document.getElementById('timeFill');
    if (fillEl) {
      const pct = Math.max(0, (remaining / totalDuration) * 100);
      fillEl.style.width = `${pct}%`;
      if (remaining < freeWindowMs) fillEl.style.background = 'linear-gradient(90deg, #ff9900, #ff2d55)';
      else if (remaining < totalDuration * 0.2) fillEl.style.background = 'linear-gradient(90deg, #ff9900, #8b5cf6)';
      else fillEl.style.background = 'linear-gradient(90deg, #00d4ff, #8b5cf6)';
    }
    const stagePill = document.getElementById('stagePill');
    const stageLimitEl = document.getElementById('stageLimitPill');
    if (remaining === 0) {
      if (stagePill) { stagePill.textContent = '⏰ BATTLE ENDED'; stagePill.className = 'stage-pill ended'; }
      if (stageLimitEl) stageLimitEl.textContent = '—';
      const placeBetBtn = document.getElementById('placeBetBtn');
      const betControls = document.getElementById('betControls');
      const statusEl = document.getElementById('betRoomStatus');
      if (placeBetBtn) { placeBetBtn.disabled = true; placeBetBtn.textContent = 'Battle Ended — Awaiting Settlement'; placeBetBtn.style.background = ''; }
      if (betControls) betControls.style.opacity = '0.5';
      if (statusEl) { statusEl.textContent = '⏰ ENDED'; statusEl.className = 'room-status ended'; }
      if (fillEl) fillEl.style.width = '0%';
      stopBetRoomTimer();
      return;
    }
    if (remaining < freeWindowMs) {
      if (stagePill) { stagePill.textContent = '🔥 FREE STAGE'; stagePill.className = 'stage-pill free'; }
      if (stageLimitEl) stageLimitEl.textContent = '♾ NO LIMIT';
      const betInput = document.getElementById('betAmountInput');
      if (betInput) betInput.placeholder = 'Any amount — no limits!';
    } else {
      if (stagePill) { stagePill.textContent = 'RESTRICTED'; stagePill.className = 'stage-pill'; }
      if (stageLimitEl) stageLimitEl.textContent = `MAX: ${room.betLimit || 100} U`;
    }
    state.betRoomTimer = setTimeout(tick, 1000);
  }
  tick();
}

function stopBetRoomTimer() {
  if (state.betRoomTimer) { clearTimeout(state.betRoomTimer); state.betRoomTimer = null; }
}

// =====================================================
// CREATE ROOM
// =====================================================
function onModeChange(val) {
  const multiWrap = document.getElementById('multiTeamWrap');
  if (multiWrap) multiWrap.style.display = val === 'multi' ? 'block' : 'none';
  updateFeeEstimate();
}

function getEffectiveTeamCount() {
  const modeEl = document.getElementById('createMaxTeams');
  if (!modeEl) return 2;
  if (modeEl.value === 'multi') {
    return Math.min(8, Math.max(3, parseInt(document.getElementById('createTeamCount')?.value || '3')));
  }
  return parseInt(modeEl.value) || 2;
}

function updateFeeEstimate() {
  const teams = getEffectiveTeamCount();
  const durationMin = parseInt(document.getElementById('createDuration')?.value || '30');
  const betLimit = parseFloat(document.getElementById('createBetLimit')?.value || '100');
  const stepPct = Math.min(100, Math.max(20, parseInt(document.getElementById('createBetLimitStep')?.value || '50')));
  const maxPool = teams * betLimit;

  const el = id => document.getElementById(id);
  if (el('prevTeams')) el('prevTeams').textContent = teams;
  if (el('prevDuration')) el('prevDuration').textContent = `${durationMin} min`;
  if (el('prevBetLimit')) el('prevBetLimit').textContent = `${betLimit} U`;
  if (el('prevMaxPool')) el('prevMaxPool').textContent = `${maxPool} U`;
  if (el('prevBetStep')) el('prevBetStep').textContent = `${stepPct}%`;
}

async function createRoom() {
  if (!state.wallet) { toast(t('toast.connectFirst'), 'error'); return; }
  const name = (document.getElementById('createRoomName')?.value || '').trim();
  const firstTeamName = (document.getElementById('createFirstTeamName')?.value || '').trim();
  const maxTeams = getEffectiveTeamCount();
  const durationMin = parseInt(document.getElementById('createDuration')?.value || '30');
  const betLimit = parseFloat(document.getElementById('createBetLimit')?.value || '100');
  const betLimitStep = Math.min(100, Math.max(20, parseInt(document.getElementById('createBetLimitStep')?.value || '50')));
  const tokenAddr = (document.getElementById('createTokenAddr')?.value || '').trim();
  if (!name) { toast('Enter a room name', 'error'); return; }
  if (durationMin < 5) { toast('Minimum duration is 5 minutes', 'error'); return; }
  if (betLimit <= 0) { toast('Bet limit must be > 0', 'error'); return; }

  const deployBtn = document.querySelector('#page-create .btn-primary');
  const factory = getFactoryContract(true);

  if (!factory) {
    // Demo mode — create via REST API
    try {
      if (deployBtn) { deployBtn.disabled = true; deployBtn.textContent = 'Creating...'; }
      toast('Creating battle room...', 'success');
      const res = await fetch(`${CONFIG.API_URL}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_name: name,
          first_team_name: firstTeamName || undefined,
          max_teams: maxTeams,
          duration_seconds: durationMin * 60,
          initial_bet_limit: betLimit,
          bet_limit_step_pct: betLimitStep,
          creator_wallet: state.wallet,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast(`🎉 "${name}" created! (Demo mode)`, 'success');
        navigateTo('rooms');
      } else {
        toast(data.error || 'Failed to create room', 'error');
      }
    } catch (err) {
      toast('Failed to create room', 'error');
    } finally {
      if (deployBtn) { deployBtn.disabled = false; deployBtn.textContent = t('btn.deploy'); }
    }
    return;
  }

  // On-chain mode
  if (!ethers.utils.isAddress(tokenAddr)) { toast('Enter a valid ERC-20 token address', 'error'); return; }
  try {
    if (deployBtn) { deployBtn.disabled = true; deployBtn.textContent = 'Deploying...'; }
    const durationSec = durationMin * 60;
    const betLimitWei = ethers.utils.parseUnits(betLimit.toString(), 18);
    toast('Confirm deployment in MetaMask...', 'success');
    const tx = await factory.createRoom(name, maxTeams, durationSec, betLimitWei, tokenAddr);
    toast('Waiting for BSC confirmation...', 'success');
    const receipt = await tx.wait();
    const ev = receipt.events?.find(e => e.event === 'RoomCreated');
    toast(`🎉 Battle Room #${ev?.args?.roomId?.toString() || '?'} deployed on BSC!`, 'success');
    navigateTo('rooms');
  } catch (err) {
    console.error(err);
    toast(err.reason || err.message || 'Deployment failed', 'error');
  } finally {
    if (deployBtn) { deployBtn.disabled = false; deployBtn.textContent = t('btn.deploy'); }
  }
}

// =====================================================
// LEADERBOARD
// =====================================================
let lbPeriod = 'daily', lbCategory = 'profit';

document.querySelectorAll('#lbPeriodTabs .lb-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('#lbPeriodTabs .lb-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active'); lbPeriod = tab.dataset.period; loadLeaderboard();
  });
});
document.querySelectorAll('#lbCatTabs .lb-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('#lbCatTabs .lb-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active'); lbCategory = tab.dataset.cat; loadLeaderboard();
  });
});

// Leaderboard table header configs per category
const LB_HEADERS = {
  profit:  ['lb.rank','lb.player','lb.wins','lb.losses','lb.winRate','lb.totalBets','lb.profit'],
  rooms:   ['lb.rank','lb.gameName','lb.participants','lb.winners','lb.prizePool'],
  volume:  ['lb.rank','lb.player','lb.games','lb.maxBet','lb.totalVolume'],
};

function updateLbHeaders() {
  const thead = document.querySelector('#page-leaderboard table thead tr');
  if (!thead) return;
  const keys = LB_HEADERS[lbCategory] || LB_HEADERS.profit;
  thead.innerHTML = keys.map(k => `<th>${t(k)}</th>`).join('');
}

async function loadLeaderboard() {
  updateLbHeaders();
  const tbody = document.getElementById('lbBody');
  tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text-dim);padding:2rem">${t('loading.battle')}</td></tr>`;
  try {
    const res = await fetch(`${CONFIG.API_URL}/leaderboard/${lbPeriod}/${lbCategory}`);
    const data = await res.json();
    tbody.innerHTML = (data.success && data.data.length > 0)
      ? data.data.map(renderLbRow).join('')
      : generateDemoLeaderboard();
  } catch (e) { tbody.innerHTML = generateDemoLeaderboard(); }
}

function generateDemoLeaderboard() {
  const medals = ['🥇', '🥈', '🥉'];
  const scale = lbPeriod === 'daily' ? 0.05 : lbPeriod === 'weekly' ? 0.3 : lbPeriod === 'monthly' ? 0.6 : 1;

  if (lbCategory === 'rooms') {
    const rooms = [
      ['Dragon Final · 8 Teams', 342, 43, 284591],
      ['Whale Wars Championship', 218, 28, 182400],
      ['Midnight Massacre',       156, 20, 134200],
      ['Blood Moon Tournament',   134, 17,  98500],
      ['Iron Fist League',        112, 14,  76300],
      ['Rookie Rumble Cup',        89, 11,  54100],
      ['Shadow Arena Open',        67,  9,  38900],
      ['Dawn Protocol Finals',     45,  6,  22400],
    ];
    return rooms.map(([name, users, wins, pool], i) => {
      const u = Math.round(users * scale) || 1;
      const w = Math.round(wins * scale) || 1;
      const p = Math.round(pool * scale);
      return `<tr>
        <td>${i < 3 ? medals[i] : i + 1}</td>
        <td style="color:var(--text-primary)">${name}</td>
        <td>${u}</td><td>${w}</td>
        <td style="color:var(--gold-reward)">${formatU(p)}</td>
      </tr>`;
    }).join('');
  }

  if (lbCategory === 'volume') {
    const players = [
      ['0x1a2b...3c4d', 89, 4200, 284591],
      ['0x5e6f...7g8h', 72, 3800, 218340],
      ['0x9i0j...1k2l', 65, 2900, 176200],
      ['0x3m4n...5o6p', 54, 2400, 134800],
      ['0x7q8r...9s0t', 48, 1900,  98500],
      ['0xab12...cd34', 39, 1500,  72300],
      ['0xef56...gh78', 31, 1200,  54100],
      ['0xij90...kl12', 24,  800,  32900],
    ];
    return players.map(([addr, games, maxBet, vol], i) => {
      const g = Math.max(1, Math.round(games * scale));
      const v = Math.round(vol * scale);
      return `<tr>
        <td>${i < 3 ? medals[i] : i + 1}</td>
        <td style="font-family:var(--font-mono)">${addr}</td>
        <td>${g}</td>
        <td style="color:var(--blue-electric)">${formatU(maxBet)}</td>
        <td style="color:var(--gold-reward)">${formatU(v)}</td>
      </tr>`;
    }).join('');
  }

  // profit (default)
  const players = [
    ['0x1a2b...3c4d', 42, 12, '77.8', 15200,  8450],
    ['0x5e6f...7g8h', 38, 15, '71.7', 12800,  6220],
    ['0x9i0j...1k2l', 35, 18, '66.0', 10500,  4800],
    ['0x3m4n...5o6p', 29, 14, '67.4',  8900,  3100],
    ['0x7q8r...9s0t', 25, 20, '55.6',  7200,  1850],
    ['0xab12...cd34', 22, 22, '50.0',  6100,   420],
    ['0xef56...gh78', 18, 25, '41.9',  5800,  -890],
    ['0xij90...kl12', 15, 30, '33.3',  4500, -2100],
  ];
  return players.map(([addr, w, l, wr, bets, pl], i) => {
    const scaledW  = Math.max(0, Math.round(w * scale));
    const scaledL  = Math.max(0, Math.round(l * scale));
    const scaledPl = Math.round(pl * scale);
    const scaledB  = Math.round(bets * scale);
    const pc = scaledPl >= 0 ? 'profit-positive' : 'profit-negative';
    const plStr = (scaledPl >= 0 ? '+' : '') + formatU(scaledPl);
    return `<tr>
      <td>${i < 3 ? medals[i] : i + 1}</td>
      <td style="font-family:var(--font-mono)">${addr}</td>
      <td>${scaledW}</td><td>${scaledL}</td>
      <td>${wr}%</td>
      <td>${formatU(scaledB)}</td>
      <td class="${pc}">${plStr}</td>
    </tr>`;
  }).join('');
}

function renderLbRow(row) {
  const medals = ['🥇', '🥈', '🥉'];
  const rankCell = row.rank <= 3 ? medals[row.rank - 1] : row.rank;

  if (lbCategory === 'rooms') {
    return `<tr>
      <td>${rankCell}</td>
      <td style="color:var(--text-primary)">${row.game_name || '—'}</td>
      <td>${row.total_participants || 0}</td>
      <td>${row.winner_count || 0}</td>
      <td style="color:var(--gold-reward)">${formatU(row.total_prize_pool || 0)}</td>
    </tr>`;
  }

  if (lbCategory === 'volume') {
    const display = row.username || (row.player ? `${row.player.slice(0,6)}...${row.player.slice(-4)}` : '—');
    const playerCell = row.player ? `<span class="wallet-link" onclick="showUserProfile('${row.player}')">${display}</span>` : display;
    return `<tr>
      <td>${rankCell}</td>
      <td style="font-family:var(--font-mono)">${playerCell}</td>
      <td>${row.game_count || 0}</td>
      <td style="color:var(--blue-electric)">${formatU(row.max_single_bet || 0)}</td>
      <td style="color:var(--gold-reward)">${formatU(row.total_volume || 0)}</td>
    </tr>`;
  }

  // profit
  const display = row.username || (row.player ? `${row.player.slice(0,6)}...${row.player.slice(-4)}` : '—');
  const playerCell = row.player ? `<span class="wallet-link" onclick="showUserProfile('${row.player}')">${display}</span>` : display;
  const pl = parseFloat(row.profit_loss || 0);
  const pc = pl >= 0 ? 'profit-positive' : 'profit-negative';
  return `<tr>
    <td>${rankCell}</td>
    <td style="font-family:var(--font-mono)">${playerCell}</td>
    <td>${row.wins || 0}</td>
    <td>${row.losses || 0}</td>
    <td>${row.win_rate || 0}%</td>
    <td>${formatU(row.total_bets || 0)}</td>
    <td class="${pc}">${pl >= 0 ? '+' : ''}${formatU(pl)}</td>
  </tr>`;
}

// =====================================================
// DAWN PROTOCOL
// =====================================================
async function loadDawnData() {
  try {
    const res = await fetch(`${CONFIG.API_URL}/dawn/today`);
    const data = await res.json();
    if (data.success) {
      document.getElementById('dawnOnTime').textContent = data.data.on_time_count || 0;
      document.getElementById('dawnLate').textContent = data.data.late_count || 0;
      document.getElementById('dawnPool').textContent = `${parseFloat(data.data.late_pool || 0).toFixed(1)} U`;
    }
  } catch (e) {}
  // Update invite link display
  const linkEl = document.getElementById('inviteLinkDisplay');
  if (linkEl && state.user?.invite_code) {
    linkEl.value = `${window.location.origin}/?ref=${state.user.invite_code}`;
  }
}

async function dawnCheckIn() {
  if (!state.wallet) { toast(t('toast.connectFirst'), 'error'); return; }
  toast('Processing check-in on-chain...', 'success');
  setTimeout(() => toast('☀ Checked in! Early bird reward pending.', 'success'), 1500);
}

function updateDawnTimer() {
  const now = new Date();
  const utcH = now.getUTCHours(), utcM = now.getUTCMinutes(), utcS = now.getUTCSeconds();
  const nowSec = utcH * 3600 + utcM * 60 + utcS;
  let remaining;
  if (utcH >= 5 && utcH < 8) { remaining = 8 * 3600 - nowSec; }
  else { let next = 5 * 3600; if (nowSec >= 8 * 3600) next += 86400; remaining = next - nowSec; }
  const el = document.getElementById('dawnTimer');
  if (el) el.textContent = formatTime(remaining);
}
setInterval(updateDawnTimer, 1000);

// =====================================================
// PROFILE + SETTINGS
// =====================================================
async function loadProfile() {
  if (!state.wallet) {
    document.getElementById('profileWallet').textContent = t('profile.notConnected');
    document.getElementById('profileName').textContent = t('profile.anonymous');
    return;
  }
  updateAccountUI();
  // Render avatar
  const avatarEl = document.getElementById('profileAvatar');
  if (avatarEl && state.user?.avatar) avatarEl.textContent = state.user.avatar;
  try {
    const [statsRes, socialRes] = await Promise.all([
      fetch(`${CONFIG.API_URL}/users/${state.wallet}/stats`),
      fetch(`${CONFIG.API_URL}/users/${state.wallet}/social`),
    ]);
    const stats = await statsRes.json();
    const social = await socialRes.json();
    if (stats.success) {
      document.getElementById('profWins').textContent = stats.data.wins || 0;
      document.getElementById('profLosses').textContent = (stats.data.total_matches || 0) - (stats.data.wins || 0);
      document.getElementById('profBets').textContent = `${parseFloat(stats.data.total_wagered || 0).toFixed(0)} U`;
      document.getElementById('profProfit').textContent = `${parseFloat(stats.data.total_profit || 0).toFixed(1)} U`;
    }
    if (social.success) {
      document.getElementById('profFollowers').textContent = social.data.follower_count || 0;
      document.getElementById('profNoted').textContent = social.data.noted_count || 0;
    }
  } catch (e) {}
}

// =====================================================
// AVATAR PICKER
// =====================================================
const AVATARS = ['⚔️','🔥','💀','🎯','🏆','👑','🦊','🐉','🌊','⚡','🎭','🦁','🌙','💎','🚀','🐺','🦅','🌀','🏴','🎪'];

function showAvatarPicker() {
  if (!state.wallet) { toast(t('toast.connectFirst'), 'error'); return; }
  const grid = document.getElementById('avatarGrid');
  grid.innerHTML = AVATARS.map(e =>
    `<div class="avatar-option${state.user?.avatar === e ? ' selected' : ''}" onclick="setAvatar('${e}')">${e}</div>`
  ).join('');
  document.getElementById('avatarPickerModal').classList.add('open');
}
function closeAvatarPicker() { document.getElementById('avatarPickerModal').classList.remove('open'); }

async function setAvatar(emoji) {
  if (!state.wallet) return;
  try {
    const res = await fetch(`${CONFIG.API_URL}/users/${state.wallet}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ avatar: emoji }),
    });
    const data = await res.json();
    if (data.success) {
      state.user = data.data;
      document.getElementById('profileAvatar').textContent = emoji;
      updateAccountUI();
      closeAvatarPicker();
      toast('Avatar updated!', 'success');
    }
  } catch (e) { toast('Failed to update avatar', 'error'); }
}

// =====================================================
// USER PROFILE MODAL (view other users)
// =====================================================
let _viewingWallet = null;

async function showUserProfile(wallet) {
  if (!wallet) return;
  _viewingWallet = wallet.toLowerCase();
  document.getElementById('userProfileModal').classList.add('open');
  document.getElementById('upWallet').textContent = `${_viewingWallet.slice(0,6)}...${_viewingWallet.slice(-4)}`;
  document.getElementById('upName').textContent = '...';
  document.getElementById('upFollowers').textContent = '...';
  document.getElementById('upFollowBtn').style.display = state.wallet && state.wallet !== _viewingWallet ? '' : 'none';
  try {
    const [userRes, socialRes] = await Promise.all([
      fetch(`${CONFIG.API_URL}/users/${_viewingWallet}`),
      fetch(`${CONFIG.API_URL}/users/${_viewingWallet}/social?viewer=${state.wallet || ''}`),
    ]);
    const userData = await userRes.json();
    const socialData = await socialRes.json();
    if (userData.success) {
      const u = userData.data;
      document.getElementById('upName').textContent = u.username || `${_viewingWallet.slice(0,6)}...`;
      const av = document.getElementById('upAvatar');
      av.textContent = u.avatar || u.username?.slice(0,2)?.toUpperCase() || '?';
    }
    if (socialData.success) {
      document.getElementById('upFollowers').textContent = socialData.data.follower_count || 0;
      const btn = document.getElementById('upFollowBtn');
      btn.textContent = socialData.data.is_following ? t('btn.unfollow') : t('btn.follow');
      btn.classList.toggle('following', socialData.data.is_following);
    }
    // Load private note if viewer
    if (state.wallet && state.wallet !== _viewingWallet) {
      const noteRes = await fetch(`${CONFIG.API_URL}/users/${state.wallet}/note/${_viewingWallet}`);
      const noteData = await noteRes.json();
      if (noteData.success) document.getElementById('upNoteInput').value = noteData.note || '';
    }
  } catch (e) {}
}

function closeUserProfile() {
  document.getElementById('userProfileModal').classList.remove('open');
  _viewingWallet = null;
}

async function toggleFollow() {
  if (!state.wallet || !_viewingWallet) { toast(t('toast.connectFirst'), 'error'); return; }
  try {
    const res = await fetch(`${CONFIG.API_URL}/users/${state.wallet}/follow/${_viewingWallet}`, { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      const btn = document.getElementById('upFollowBtn');
      btn.textContent = data.following ? t('btn.unfollow') : t('btn.follow');
      btn.classList.toggle('following', data.following);
      toast(data.following ? t('toast.followed') : t('toast.unfollowed'), 'success');
    }
  } catch (e) { toast('Failed', 'error'); }
}

async function saveUserNote() {
  if (!state.wallet || !_viewingWallet) { toast(t('toast.connectFirst'), 'error'); return; }
  const note = document.getElementById('upNoteInput').value;
  try {
    const res = await fetch(`${CONFIG.API_URL}/users/${state.wallet}/note/${_viewingWallet}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    });
    const data = await res.json();
    if (data.success) toast(t('toast.noteSaved'), 'success');
  } catch (e) { toast('Failed to save note', 'error'); }
}

function showSettingsModal() {
  if (state.user?.username) document.getElementById('settingsUsername').value = state.user.username;
  document.getElementById('settingsLang').value = state.lang;
  document.getElementById('settingsModal').classList.add('open');
}

function closeSettingsModal() { document.getElementById('settingsModal').classList.remove('open'); }

async function saveSettings() {
  if (!state.wallet) { toast(t('toast.connectFirst'), 'error'); return; }
  const username = document.getElementById('settingsUsername').value.trim();
  const language = document.getElementById('settingsLang').value;
  const currency_unit = document.getElementById('settingsCurrency').value;

  if (language) setLanguage(language);

  if (username) {
    try {
      const res = await fetch(`${CONFIG.API_URL}/users/${state.wallet}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, language, currency_unit }),
      });
      const data = await res.json();
      if (data.success) {
        state.user = data.data;
        updateAccountUI();
        toast(t('toast.settingsSaved'), 'success');
        closeSettingsModal();
        loadProfile();
      } else {
        toast(data.error === 'Username taken' ? t('toast.usernameTaken') : (data.error || 'Failed'), 'error');
      }
    } catch (e) { toast('Failed to save settings', 'error'); }
  } else {
    toast(t('toast.settingsSaved'), 'success');
    closeSettingsModal();
  }
}

function copyInviteLink() {
  const link = document.getElementById('inviteLinkDisplay')?.value || '';
  if (!link) { toast(t('toast.connectFirst'), 'error'); return; }
  navigator.clipboard.writeText(link);
  toast(t('toast.linkCopied'), 'success');
}

async function applyInviteCode() {
  if (!state.wallet) { toast(t('toast.connectFirst'), 'error'); return; }
  const code = document.getElementById('inviteCodeInput')?.value;
  if (!code) { toast('Enter an invite code', 'error'); return; }
  try {
    const res = await fetch(`${CONFIG.API_URL}/users/${state.wallet}/invite`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inviteCode: code }),
    });
    const data = await res.json();
    toast(data.success ? t('toast.inviteApplied') : (data.error || t('toast.invalidCode')), data.success ? 'success' : 'error');
  } catch (e) { toast('Failed to apply invite code', 'error'); }
}

// =====================================================
// WEBSOCKET
// =====================================================
function initWebSocket() {
  try {
    state.ws = new WebSocket(CONFIG.WS_URL);
    state.ws.onopen = () => {
      if (state.currentRoom?.id !== undefined && state.currentPage === 'bet') {
        state.ws.send(JSON.stringify({ type: 'subscribe_room', roomId: state.currentRoom.id }));
      }
    };
    state.ws.onmessage = e => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'bet_placed' && state.currentRoom && state.currentPage === 'bet') {
          const teamIdx = msg.team;
          if (state.currentRoom.teams[teamIdx] !== undefined) {
            state.currentRoom.teams[teamIdx].total += parseFloat(msg.amount || 0);
            renderTeamsGrid(state.currentRoom);
            updateLeaderStrip(state.currentRoom);
            const tc = TEAM_COLORS[teamIdx];
            toast(`New bet on ${tc?.name || 'Team'}: ${formatU(msg.amount)}`, 'success');
          }
        }
        if (msg.type === 'match_settled') {
          toast(`Match #${msg.roomId} settled! Winner: ${TEAM_COLORS[msg.winningTeam]?.name || 'Team'}`, 'success');
          if (state.currentRoom?.id === msg.roomId && state.currentPage === 'bet') {
            state.currentRoom.status = 'settled';
            state.currentRoom.winnerDeclared = true;
            state.currentRoom.winningTeam = msg.winningTeam;
            renderBetRoomUI(state.currentRoom);
            stopBetRoomTimer();
          }
        }
      } catch (x) {}
    };
    state.ws.onclose = () => setTimeout(initWebSocket, 3000);
    state.ws.onerror = () => {};
  } catch (e) {}
}

// =====================================================
// TOAST
// =====================================================
function toast(message, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  document.getElementById('toasts').appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

// =====================================================
// ANIMATED COUNTERS
// =====================================================
function animateValue(id, end) {
  const el = document.getElementById(id);
  if (!el) return;
  let current = 0;
  const step = Math.max(1, Math.ceil(end / 60));
  const timer = setInterval(() => {
    current = Math.min(current + step, end);
    el.textContent = current.toLocaleString();
    if (current >= end) clearInterval(timer);
  }, 30);
}

// =====================================================
// INIT
// =====================================================
// =====================================================
// MOBILE NAVIGATION
// =====================================================
function toggleMobileMenu() {
  document.getElementById('mobileNavDrawer').classList.toggle('open');
  document.getElementById('mobileNavOverlay').classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('mobileNavDrawer').classList.remove('open');
  document.getElementById('mobileNavOverlay').classList.remove('open');
}

// Wire mobile nav links same as desktop
document.querySelectorAll('.mobile-nav-link[data-page]').forEach(link => {
  link.addEventListener('click', () => navigateTo(link.dataset.page));
});

window.addEventListener('DOMContentLoaded', () => {
  // Apply saved language (also initialises switcher label + checkmarks)
  setLanguage(state.lang);

  animateValue('stat-rooms', 147);
  animateValue('stat-users', 3842);
  document.getElementById('stat-volume').textContent = '284,591 U';
  updateDawnTimer();
  updateFeeEstimate();
  initWebSocket();

  // Auto-reconnect MetaMask if previously authorized
  if (window.ethereum?.selectedAddress) {
    state.wallet = window.ethereum.selectedAddress.toLowerCase();
    updateWalletUI();
    loadUserData();
    loadContractConfig();
  }

  // Handle ?ref= invite link
  const refCode = new URLSearchParams(window.location.search).get('ref');
  if (refCode) {
    sessionStorage.setItem('pendingRefCode', refCode);
    // Clear ref from URL without reload
    const url = new URL(window.location);
    url.searchParams.delete('ref');
    window.history.replaceState({}, '', url);
  }
});
