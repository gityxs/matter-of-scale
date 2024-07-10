/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com
 @idle games : http://www.gityx.com
 @QQ Group : 627141737

*/

//1.汉化杂项
var cnItems = {
    _OTHER_: [],

    //未分类：
    'Save': '保存',
    'Export': '导出',
    'Import': '导入',
    'Settings': '设置',
    'Achievements': '成就',
    'Statistics': '统计',
    'Changelog': '更新日志',
    'Hotkeys': '快捷键',
    'ALL': '全部',
    'Default': '默认',
    'AUTO': '自动',
    'default': '默认',
    "points": "点数",
    "Reset for +": "重置得到 + ",
    "Currently": "当前",
    "Effect": "效果",
    "Cost": "成本",
    "Goal:": "目标:",
    "Reward": "奖励",
    "Start": "开始",
    "Exit Early": "提前退出",
    "Finish": "完成",
    "Milestone Gotten!": "获得里程碑！",
    "Milestones": "里程碑",
    "Completed": "已完成",
    "Default Save": "默认存档",
    "Delete": "删除",
    "No": "否",
    "Saves": "存档",
    "Options": "选项",
    "Yes": "是",
    "Are you sure?": "你确定吗？",
    "Edit Name": "编辑名称",
    "Info": "信息",
    "Currently:": "当前:",
    "Appearance": "外观",
    "How the game looks.": "游戏看起来如何。",
    "Theme": "主题",
    "Show milestones": "显示里程碑",
    "Show TPS meter at the bottom-left corner of the page.": "在页面左下角显示 TPS。",
    "Show TPS": "显示 TPS",
    "None": "无",
    "Align modifier units": "对齐概览单位",
    "Align numbers to the beginning of the unit in modifier view.": "在概览视图中将数字与单元的开头对齐。",
    "Select which milestones to display based on criterias.": "根据标准选择要显示的里程碑。",
    "All": "全部",
    "Classic": "经典",
    "Configurable": "可配置",
    "Duplicate": "复制",
    "Mute": "静音",
    "Unmute": "播放",
    "/ sec": "/ 秒",
    "Research": "研究",
    "\tHere is your save.  Copy the full text.": "\这就是你的存档。复制全文。",
    "Active Time": "活动时间",
    "Archer": "弓箭手",
    "Assign": "分配",
    "Bloodhound": "猎犬",
    "Building": "建筑",
    "Count": "数量",
    "Donate BTC": "捐赠BTC",
    "Donate CC": "捐赠CC",
    "Donate Patreon": "捐赠Patreon",
    "Feats": "功绩",
    "Follow on Reddit": "关注Reddit",
    "Follow on Twitter": "关注Twitter",
    "hamlet": "村庄",
    "Income": "收入",
    "Managers": "管理者",
    "New Slot": "新槽位",
    "Offline Time": "离线时间",
    "Pathfinder": "探路者",
    "Retrain": "再训练",
    "River": "河流",
    "Saved!": "保存成功!",
    "Scout": "侦察兵",
    "Share on Facebook": "在Facebook上分享",
    "Share on Pinterest": "在Pinterest上分享",
    "Share on Reddit": "在Reddit上分享",
    "Spearman": "枪兵",
    "Stats": "统计",
    "Support": "支持",
    "Time since Founding": "建国以来时间",
    "Total": "总计",
    "Total Income": "总收入",
    "Tracker": "追踪者",
    "Trapper": "诱捕者",
    "undefined": "未定义的",
    "Upgrades": "升级",
    "Votes Clicked": "已点击票数",
    "Wellspring": "水井",
    "Woodsman": "樵夫",
    "Export game to string": "将游戏存档导出为字符串",
    "Import game from string": "从字符串中导入游戏存档",
    "Increases duration of Prestige events by 25%": "声望事件的持续时间增加25%",
    "Increases duration of Upgrade events by 25%": "升级事件的持续时间增加25%",
    "Increases duration of Vote events by 25%": "增加投票事件的持续时间25%",
    "Manual Save Now": "手动保存",
    "Mute/Unmute Audio": "静音/音频静音状态",
    "Patchnotes": "补丁说明",
    "Pause": "暂停",
    "Reset": "重置",
    "Start over but keep stats": "重新开始，但要保留统计数据",
    "Suspend game processing": "暂停游戏处理",
    "Toggle Mute": "切换静音",
    "View patchnotes": "查看补丁说明",
    "Auto-completes Hamlets after 120 (from never) seconds": "120秒后(从无开始)自动完成 村庄",
    "Auto-completes Villages after 120 (from never) seconds": "120秒后(从无开始)自动完成 乡村",
    "Autobuy": "自动购买",
    "Complete": "完成",
    "Unassigned": "未分配",
    "Autocomplete": "自动完成",
    "Botley": "波特利",
    "[ close all ]": "[ 全部关闭 ]",
    "Breeder": "饲养员",
    "Carver": "雕刻家",
    "Farmhand": "农场工人",
    "Fence-Maker": "栅栏制造者",
    "Roaster": "烤炉",
    "Sheepdog": "牧羊犬",
    "Shearer": "剪毛机",
    "Shepherd": "牧羊人",
    "Smoker": "薰制工",
    "village": "乡村",
    "Wolf-hunter": "猎狼人",
    "Local": "本地",
    "Bridge Builder": "桥梁建造者",
    "Scale": "规模",
    "Baker": "面包师",
    "Digger": "挖掘机",
    "Heater": "加热器",
    "Mason": "泥瓦匠",
    "Mixer": "搅拌机",
    "River Guide": "河道导流器",
    "Sculptor": "雕塑家",
    "Shaper": "塑造者",
    "Trailblazer": "开拓者",
    "town": "城镇",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "Doubles Trailblazer income": "开拓者 收入翻倍",
    "Doubles Heater income": "加热器 收入翻倍",
    "Doubles Mixer income": "搅拌机 收入翻倍",
    "Doubles Shaper income": "塑造者 收入翻倍",
    "Doubles Sheepdog income": "牧羊犬 收入翻倍",
    "Doubles Baker income": "面包师 收入翻倍",
    "Doubles Breeder income": "饲养员 收入翻倍",
    "Doubles Roaster income": "烤炉 收入翻倍",
    "Doubles Smoker income": "薰制工 收入翻倍",
    "Doubles Pathfinder income": "探路者 收入翻倍",
    "Doubles River income": "河流 收入翻倍",
    "Doubles Scout income": "侦察兵 收入翻倍",
    "Doubles Trapper income": "捕兽者 收入翻倍",
    "Doubles Wellspring income": "水井 收入翻倍",
    "Doubles Woodsman income": "樵夫 收入翻倍",
    "Doubles Archer income": "弓箭手 收入翻倍",
    "Doubles Bloodhound income": "猎犬 收入翻倍",
    "Doubles Spearman income": "枪兵 收入翻倍",
    "Doubles Tracker income": "追踪者 收入翻倍",
    "Doubles Fence-Maker income": "栅栏制造者 收入翻倍",
    "Doubles Wolf-hunter income": "猎狼人 收入翻倍",
    "Doubles Shepherd income": "牧羊人 收入翻倍",
    "Doubles Shearer income": "剪毛机 收入翻倍",
    "Doubles Carver income": "雕刻家 收入翻倍",
    "Doubles Farmhand income": "农场工人 收入翻倍",
    "Doubles Digger income": "挖掘机 收入翻倍",
    "Doubles River Guide income": "河道导流器 收入翻倍",
    "Doubles Bridge Builder income": "桥梁建造者 收入翻倍",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "Ballinger Bottom": "Ballinger Bottom",
    "Addingrove": "Addingrove",
    "Chivery": "Chivery",
    "Chalkshire": "Chalkshire",
    "Hastings": "Hastings",
    "Burcott": "Burcott",
    "Broughton Crossing": "Broughton Crossing",
    "Butlers Cross": "Butlers Cross",
    "Duporth": "Duporth",
    "Coldmoorholme": "Coldmoorholme",
    "Ackhampstead": "Ackhampstead",
    "Kim Jones": "Kim Jones",
    "Bradville": "Bradville",
    "Donna Boyd": "Donna Boyd",
    "Durgan": "Durgan",
    "Kim Haverford": "Kim Haverford",
    "Ackhampstead'": "Ackhampstead'",
    "Crafton": "Crafton",
    // 图标代码，不能汉化
    "Jacorb's Games": "Jacorb's Games",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "Scientific": "科学计数法",
    "Standard": "标准",
    "Blind": "盲文",
    "Letters": "字母",
    "Mixed Engineering": "混合工程",
    "Mixed Scientific": "混合科学",
    "Chemistry": "化学",
    "Engineering": "工程符号",
    "By Jacorb90": "By Jacorb90",
    "content_copy": "content_copy",
    "library_books": "library_books",
    "discord": "discord",
    "drag_handle": "drag_handle",
    "edit": "edit",
    "forum": "forum",
    "content_paste": "content_paste",
    "delete": "delete",
    "info": "info",
    "settings": "settings",

    //树游戏
    'Loading...': '加载中...',
    'ALWAYS': '一直',
    'HARD RESET': '硬重置',
    'Export to clipboard': '导出到剪切板',
    'INCOMPLETE': '不完整',
    'HIDDEN': '隐藏',
    'AUTOMATION': '自动',
    'NEVER': '从不',
    'ON': '打开',
    'OFF': '关闭',
    'SHOWN': '显示',
    'Play Again': '再次游戏',
    'Keep Going': '继续',
    'The Modding Tree Discord': '模型树Discord',
    'You have': '你有',
    'It took you {{formatTime(player.timePlayed)}} to beat the game.': '花费了 {{formatTime(player.timePlayed)}} 时间去通关游戏.',
    'Congratulations! You have reached the end and beaten this game, but for now...': '恭喜你！ 您已经结束并通关了本游戏，但就目前而言...',
    'Main Prestige Tree server': '主声望树服务器',
    'Reach {{formatWhole(ENDGAME)}} to beat the game!': '达到 {{formatWhole(ENDGAME)}} 去通关游戏!',
    "Loading... (If this takes too long it means there was a serious error!": "正在加载...（如果这花费的时间太长，则表示存在严重错误！",
    'Loading... (If this takes too long it means there was a serious error!)←': '正在加载...（如果时间太长，则表示存在严重错误！）←',
    'Main\n\t\t\t\tPrestige Tree server': '主\n\t\t\t\t声望树服务器',
    'The Modding Tree\n\t\t\t\t\t\t\tDiscord': '模型树\n\t\t\t\t\t\t\tDiscord',
    'Please check the Discord to see if there are new content updates!': '请检查 Discord 以查看是否有新的内容更新！',
    'aqua': '水色',
    'AUTOMATION, INCOMPLETE': '自动化，不完整',
    'LAST, AUTO, INCOMPLETE': '最后，自动，不完整',
    'NONE': '无',
    'P: Reset for': 'P: 重置获得',
    'Git游戏': 'Git游戏',
    'QQ群号': 'QQ群号',
    'x': 'x',
    'QQ群号:': 'QQ群号:',
    '* 启用后台游戏': '* 启用后台游戏',
    '更多同类游戏:': '更多同类游戏:',
    'i': 'i',
    'I': 'I',
    'II': 'I',
    'III': 'III',
    'IV': 'IV',
    'V': 'V',
    'VI': 'VI',
    'VII': 'VII',
    'VIII': 'VIII',
    'X': 'X',
    'XI': 'XI',
    'XII': 'XII',
    'XIII': 'XIII',
    'XIV': 'XIV',
    'XV': 'XV',
    'XVI': 'XVI',
    'A': 'A',
    'B': 'B',
    'C': 'C',
    'D': 'D',
    'E': 'E',
    'F': 'F',
    'G': 'G',
    'H': 'H',
    'I': 'I',
    'J': 'J',
    'K': 'K',
    'L': 'L',
    'M': 'M',
    'N': 'N',
    'O': 'O',
    'P': 'P',
    'Q': 'Q',
    'R': 'R',
    'S': 'S',
    'T': 'T',
    'U': 'U',
    'V': 'V',
    'W': 'W',
    'X': 'X',
    'Y': 'Y',
    'Z': 'Z',
    '<': '<',
    '<<': '<<',
    '>': '>',
    '>>': '>>',
    '': '',
    '': '',
    '': '',

}


//需处理的前缀，此处可以截取语句开头部分的内容进行汉化
//例如：Coin: 13、Coin: 14、Coin: 15... 这种有相同开头的语句
//可以在这里汉化开头："Coin: ":"金币: "
var cnPrefix = {
    "\n": "\n",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": " ",
    " ": " ",
    //树游戏
    "\t\t\t": "\t\t\t",
    "\n\n\t\t": "\n\n\t\t",
    "\n\t\t": "\n\t\t",
    "\t": "\t",
    "Show Milestones: ": "显示里程碑：",
    "Autosave: ": "自动保存: ",
    "Offline Prod: ": "离线生产: ",
    "Completed Challenges: ": "完成的挑战: ",
    "High-Quality Tree: ": "高质量树贴图: ",
    "Offline Time: ": "离线时间: ",
    "Theme: ": "主题: ",
    "Anti-Epilepsy Mode: ": "抗癫痫模式：",
    "In-line Exponent: ": "直列指数：",
    "Single-Tab Mode: ": "单标签模式：",
    "Time Played: ": "已玩时长：",
    "Shift-Click to Toggle Tooltips: ": "Shift-单击以切换工具提示：",
    "Notation: ": "符号: ",
    "Toggle Music: ": "切换声音: ",
    "Hamlet (Next in ": "村庄 (下一个在 ",
    "Village (Next in ": "乡村 (下一个在 ",
    "Town (Next in ": "城镇 (下一个在 ",
    "Grants base income of ": "给予基础收入 ",
    "Increases upgrade point generation by ": "使升级点生成增加 ",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需处理的后缀，此处可以截取语句结尾部分的内容进行汉化
//例如：13 Coin、14 Coin、15 Coin... 这种有相同结尾的语句
//可以在这里汉化结尾：" Coin":" 金币"
var cnPostfix = {
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "  ",
    " ": " ",
    "\n": "\n",
    "\n\t\t\t": "\n\t\t\t",
    "\t\t\n\t\t": "\t\t\n\t\t",
    "\t\t\t\t": "\t\t\t\t",
    "\n\t\t": "\n\t\t",
    "\t": "\t",
    "/sec)": "/秒)",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^(\d+)$/,
    /^\s*$/, //纯空格
    /^([\d\.]+):([\d\.]+)$/,
    /^([\d\.]+):([\d\.]+):([\d\.]+)$/,
    /^([\d\.]+):([\d\.]+):([\d\.]+):([\d\.]+)$/,
    /^([\d\.]+):([\d\.]+):([\d\.]+):([\d\.]+):([\d\.]+)$/,
    /^([\d\.]+)h ([\d\.]+)m ([\d\.]+)s$/,
    /^([\d\.]+)y ([\d\.]+)d ([\d\.]+)h$/,
    /^([\d\.]+)\-([\d\.]+)\-([\d\.]+)$/,
    /^([\d\.]+)e(\d+)$/,
    /^([\d\.]+)$/,
    /^\$([\d\.]+)$/,
    /^\(([\d\.]+)\)$/,
    /^([\d\.]+)\%$/,
    /^([\d\.]+)\/([\d\.]+)$/,
    /^([\d\.]+)\/([\d\.,]+)$/,
    /^([\d\.,]+)\/([\d\.,]+)$/,
    /^\(([\d\.]+)\/([\d\.]+)\)$/,
    /^成本(.+)$/,
    /^\(([\d\.]+)\%\)$/,
    /^([\d\.]+):([\d\.]+):([\d\.]+)$/,
    /^([\d\.]+)K$/,
    /^([\d\.]+)M$/,
    /^([\d\.]+)B$/,
    /^([\d\.]+) K$/,
    /^([\d\.]+) M$/,
    /^([\d\.]+) B$/,
    /^([\d\.]+) T$/,
    /^([\d\.]+) Qi$/,
    /^([\d\.]+) Qa$/,
    /^([\d\.]+)s$/,
    /^([\d\.]+)x$/,
    /^x([\d\.]+)$/,
    /^([\d\.,]+)$/,
    /^\$([\d\.,]+)$/,
    /^\+([\d\.,]+)$/,
    /^\-([\d\.,]+)$/,
    /^([\d\.,]+)x$/,
    /^x([\d\.,]+)$/,
    /^([\d\.,]+) \/ ([\d\.,]+)$/,
    /^([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.]+)e([\d\.,]+) \/ ([\d\.]+)e([\d\.,]+)$/,
    /^\$([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.,]+)\/([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.]+)e([\d\.,]+)\/([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.]+)e\+([\d\.,]+)$/,
    /^e([\d\.]+)e([\d\.,]+)$/,
    /^x([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.]+)e([\d\.,]+)x$/,
    /^[\u4E00-\u9FA5]+$/
];
var cnExcludePostfix = [
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//字母加数字：([\d\.]+[A-Za-z])
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
//换行加空格：\n(.+)
var cnRegReplace = new Map([
    [/^([\d\.]+) hours ([\d\.]+) minutes ([\d\.]+) seconds$/, '$1 小时 $2 分钟 $3 秒'],
    [/^You are gaining (.+) elves per second$/, '你每秒获得 $1 精灵'],
    [/^You have (.+) points$/, '你有 $1 点数'],
    [/^Next at (.+) points$/, '下一个在 $1 点数'],
    [/^Build (.+) Pathfinders$/, '建造 $1 探路者'],
    [/^Build (.+) Rivers$/, '建造 $1 河流'],
    [/^Build (.+) Roasters$/, '建造 $1 烤炉'],
    [/^Build (.+) Mixers$/, '建造 $1 搅拌机'],
    [/^Build (.+) Sculptors$/, '建造 $1 雕塑家'],
    [/^Build (.+) Trailblazers$/, '建造 $1 开拓者'],
    [/^Build (.+) Shapers$/, '建造 $1 塑造者'],
    [/^Build (.+) Masons$/, '建造 $1 泥瓦匠'],
    [/^Build (.+) Smokers$/, '建造 $1 薰制工'],
    [/^Build (.+) Shearers$/, '建造 $1 剪毛机'],
    [/^Build (.+) Carvers$/, '建造 $1 雕刻家'],
    [/^Build (.+) Breeders$/, '建造 $1 饲养员'],
    [/^Build (.+) Scouts$/, '建造 $1 侦察兵'],
    [/^Build (.+) Trappers$/, '建造 $1 陷阱'],
    [/^Build (.+) Wolf\-hunter$/, '建造 $1 猎狼人'],
    [/^Build (.+) Wellsprings$/, '建造 $1 水井'],
    [/^Click (.+) Research events for Villages$/, '点击 $1 乡村 的研究事件'],
    [/^Click (.+) Research events for Hamlets$/, '点击 $1 村庄 的研究事件'],
    [/^Click (.+) Research events for Towns$/, '点击 $1 城镇 的研究事件'],
    [/^Click (.+) Upgrade events for Villages$/, '点击 $1 乡村 的升级事件'],
    [/^Click (.+) Upgrade events for Hamlets$/, '点击 $1 村庄 的升级事件'],
    [/^Click (.+) Upgrade events for Towns$/, '点击 $1 城镇 的升级事件'],
    [/^Click (.+) Vote events$/, '点击 $1 投票事件'],
    [/^Have a Hamlet with at least (.+) income$/, '拥有一个收入至少 $1 的村庄'],
    [/^Auto-completes Hamlets after (.+) \(from (.+)\) seconds$/, '自动完成村庄在 $1 后 \(原为 $2\)'],
    [/^Reduces autobuy surchage of tier (.+) buildings by (.+)$/, '降低 $1 层建筑的自动购买附加费 $2'],
    [/^Reserves (.+) income to purchase tier (.+) buildings$/, '储备 $1 收入购买第 $2 层建筑'],
    [/^Increases income of tier (.+) by (.+) for each building$/, '每建造一座建筑，增加 $1 级收入 $2'],
    [/^Increases income of tier (.+) by (.+) for each building of tier (.+)$/, '每建造一座 $3 层建筑，增加 $1 层收入 $2'],
    [/^Have a Village with at least (.+) income$/, '拥有一个收入至少 $1 收入的乡村'],
    [/^Have a Town with at least (.+) income$/, '拥有一个收入至少 $1 收入的城镇'],
    [/^Have a Hamlet with at least (.+) income$/, '拥有一个收入至少 $1 收入的村庄'],
    [/^(.+) of (.+) Stored \((.+)\)$/, '$1 \/ $2 已存储 \($3\)'],
    [/^You can have (.+) \(from (.+)\) Hamlets active at once$/, '你可以同时激活 $1 \(从 $2\)村庄'],
    [/^Towns spawn with (.+) \(from (.+)\)$/, '城镇 生成 $1 \(从 $2 开始\)'],
    [/^Villages spawn with (.+) \(from (.+)\)$/, '乡村 生成 $1 \(从 $2 开始\)'],
    [/^Hamlets spawn with (.+) \(from (.+)\)$/, '村庄 生成 $1 \(从 $2 开始\)'],
    [/^Hamlets generate upgrade points (.+) \(from (.+)\) faster$/, '村庄 生成升级点的速度从 $2 提高 $1'],
    [/^Villages generate upgrade points (.+) \(from (.+)\) faster$/, '乡村 生成升级点的速度从 $2 提高 $1'],
    [/^Towns generate upgrade points (.+) \(from (.+)\) faster$/, '城镇 生成升级点的速度从 $2 提高 $1'],
    [/^Town ignore (.+) \(from (.+)\) buildings for cost$/, '城镇 忽略 $1 \(从 $2\) 建筑成本'],
    [/^Village ignore (.+) \(from (.+)\) buildings for cost$/, '乡村 忽略 $1 \(从 $2\) 建筑成本'],
    [/^Hamlet ignore (.+) \(from (.+)\) buildings for cost$/, '村庄 忽略 $1 \(从 $2\) 建筑成本'],
    [/^Town buildings cost (.+) \(from (.+)\) less$/, '城镇 建筑的成本减少 $1 \(原为 $2\)'],
    [/^Village buildings cost (.+) \(from (.+)\) less$/, '乡村 建筑的成本减少 $1 \(原为 $2\)'],
    [/^Hamlet buildings cost (.+) \(from (.+)\) less$/, '村庄 建筑的成本减少 $1 \(原为 $2\)'],
    [/^Autobuy Bloodhound cost (.+) \(from (.+)\)$/, '自动购买 猎犬 的成本 $1 \(原为 $2\)'],
    [/^Autobuy Spearman cost (.+) \(from (.+)\)$/, '自动购买 枪兵 的成本 $1 \(原为 $2\)'],
    [/^Autobuy Shepherd cost (.+) \(from (.+)\)$/, '自动购买 牧羊人 的成本 $1 \(原为 $2\)'],
    [/^Towns are founded after 5 Village \(from (.+)\)$/, '城镇 是在 $1 乡村\(原为 $2\)'],
    [/^Villages are founded after 5 Hamlet \(from (.+)\)$/, '乡村 是在 $1 村庄\(原为 $2\)'],
    [/^\/ sec \(from (.+)\)$/, '\/ 秒 \(从 $1\)'],
    [/^\/ sec \(from (.+)\) to buy Bloodhound$/, '\/ 秒 \(从 $1\) 购买 猎犬'],
    [/^\/ sec \(from (.+)\) to buy Shepherd$/, '\/ 秒 \(从 $1\) 购买 牧羊人'],
    [/^\/ sec \(from (.+)\) to buy Digger$/, '\/ 秒 \(从 $1\) 购买 挖掘机'],
    [/^\/ sec \(from (.+)\) to buy Archer$/, '\/ 秒 \(从 $1\) 购买 弓箭手'],
    [/^\/ sec \(from (.+)\) to buy Sheepdog$/, '\/ 秒 \(从 $1\) 购买 牧羊犬'],
    [/^\/ sec \(from (.+)\) to buy Spearman$/, '\/ 秒 \(从 $1\) 购买 枪兵'],
    [/^(.+) \- Generate (.+) Deer$/, '$1 \- 生成 $2 鹿'],
    [/^(.+) \- Generate (.+) Lamb$/, '$1 \- 生成 $2 羔羊'],
    [/^(.+) \- Have (.+) income from Bloodhound$/, '$1 \- 拥有 $2 来自 猎犬 的收入'],
    [/^(.+) \- Have (.+) income from Shepherd$/, '$1 \- 拥有 $2 来自 牧羊人 的收入'],
    [/^(.+) \- Have (.+) Brick$/, '$1 \- 拥有 $2 砖块'],
    [/^(.+) \- Have (.+) Deer$/, '$1 \- 拥有 $2 鹿'],
    [/^(.+) \- Build (.+) of tiers (.+)$/, '$1 \- 层级 $3 各建造 $2 个'],
    [/^(.+) \- Build (.+) Bloodhound$/, '$1 \- 建造 $2 猎犬'],
    [/^(.+) \- Reach (.+) income!$/, '$1 \- 达到 $2 收入!'],
	[/^([\d\.]+)\/sec$/, '$1\/秒'],
	[/^([\d\.,]+)\/sec$/, '$1\/秒'],
	[/^([\d\.,]+) OOMs\/sec$/, '$1 OOMs\/秒'],
	[/^([\d\.]+) OOMs\/sec$/, '$1 OOMs\/秒'],
	[/^([\d\.]+)e([\d\.,]+)\/sec$/, '$1e$2\/秒'],
    [/^requires ([\d\.]+) more research points$/, '需要$1个研究点'],
    [/^([\d\.]+)e([\d\.,]+) points$/, '$1e$2 点数'],
    [/^Talent ([\d\.]+)\%$/, '天赋 $1\%'],
    [/^([\d\.]+) elves$/, '$1 精灵'],
    [/^([\d\.]+)d ([\d\.]+)h ([\d\.]+)m$/, '$1天 $2小时 $3分'],
    [/^([\d\.]+)e([\d\.,]+) elves$/, '$1e$2 精灵'],
    [/^([\d\.,]+) elves$/, '$1 精灵'],
    [/^XP ([\d\.,]+)$/, '经验值 $1'],
    [/^Level ([\d\.,]+)$/, '等级 $1'],
    [/^Village gain ([\d\.,]+)$/, '乡村 增益 $1'],
    [/^Town gain ([\d\.,]+)$/, '城镇 增益 $1'],
    [/^Reserves ([\d\.,]+)$/, '储备 $1'],
    [/^Day ([\d\.,]+)$/, '天数 $1'],
    [/^Hamlet gain ([\d\.,]+)$/, '村庄增益 $1'],
    [/^\*(.+) to electricity gain$/, '\*$1 到电力增益'],
    [/^Cost: (.+) points$/, '成本：$1 点数'],
    [/^Req: (.+) elves$/, '要求：$1 精灵'],
    [/^Req: (.+) \/ (.+) elves$/, '要求：$1 \/ $2 精灵'],
    [/^Usages: (\d+)\/$/, '用途：$1\/'],
    [/^workers: (\d+)\/$/, '工人：$1\/'],

]);