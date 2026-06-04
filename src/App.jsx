import { useState, useMemo } from "react";

// ── Tier 資料（@RENLIgames）──────────────────────────────
const RATCHET_TIER = {
  "9-60":"X","7-60":"X","1-60":"X","1-50":"X","1-70":"X",
  "3-60":"S","5-60":"S","6-60":"S","9-70":"S","4-50":"S",
  "0-60":"A","8-70":"A","7-55":"A","7-70":"A","4-60":"A",
  "0-70":"B","3-70":"B","9-80":"B","0-80":"B","7-80":"B",
  "M-85":"C","4-55":"C","9-65":"C","5-70":"C","6-70":"C",
  "4-70":"D","3-85":"D","1-80":"D","3-80":"D","6-80":"D",
  "5-80":"E","4-80":"E","2-70":"E","2-80":"E","2-60":"E",
};
const BIT_TIER = {
  "LR":"X","R":"X","B":"X","H":"X","E":"X","L":"X","K":"X",
  "UN":"S","FB":"S","J":"S","LO":"S","T":"S","UF":"S","FF":"S",
  "O":"A","P":"A","U":"A","LF":"A","OP":"A","W":"A","F":"A",
  "WB":"B","GU":"B","TK":"B","GR":"B","Y":"B","D":"B","HN":"B",
  "I":"C","GP":"C","Z":"C","TP":"C","WW":"C","A":"C","C":"C",
  "V":"D","HT":"D","GB":"D","DB":"D","G":"D","GF":"D","S":"D",
  "N":"E","GN":"E","M":"E","Tr":"E","BS":"E","MN":"E","RA":"E","Q":"E",
};
const BIT_ID_TO_ABBR = {
  lowrush:"LR",rush:"R",ball:"B",hexa:"H",hexa2:"H",elevate:"E",level:"L",kick:"K",
  underneedle:"UN",underneedle2:"UN",freeball:"FB",diskball:"J",diskball2:"J",loworb:"LO",taper:"T",underflat:"UF",underflat2:"UF",
  orb:"O",point:"P",unite:"U",lowflat:"LF",lowflat2:"LF",orbsuction:"OP",wall:"W",flat:"F",flat0:"F",flat2:"F",flat3:"F",flat4:"F",flat5:"F",flat6:"F",
  gearball:"WB",gearball2:"WB",gearunite:"GU",transtaper:"TK",gearflat:"GR",gearflat2:"GR",gearflat3:"GR",gearflat4:"GR",gearflat5:"GR",yielding:"Y",
  highneedle:"HN",ignition:"I",ignition2:"I",gearpoint:"GP",zap:"Z",transpoint:"TP",wallwedge:"WW",accel:"A",accel2:"A",cyclone:"C",
  vortex:"V",vortex2:"V",hightaper:"HT",gearball3:"GB",glide:"G",gearflat6:"GF",spike:"S",spike2:"S",
  needle:"N",needle2:"N",needle3:"N",gearneedle:"GN",merge:"M",metalneedle:"MN",metalneedle2:"MN",boundspike:"BS",boundspike2:"BS",needlerush:"RA",
  "turbo-bit":"Tr",diskball3:"D",highball:"B",gearball4:"WB",lowrush2:"LR",lowrush3:"LR",lowrush4:"LR",lowrush5:"LR",lowrush6:"LR",
  rush2:"R",rush3:"R",rush4:"R",accel3:"A",orb2:"O",
};
const TIER_COLOR = {
  X:{bg:"rgba(255,215,0,0.2)",color:"#fbbf24",border:"rgba(255,215,0,0.5)"},
  S:{bg:"rgba(180,180,180,0.2)",color:"#d1d5db",border:"rgba(180,180,180,0.4)"},
  A:{bg:"rgba(239,68,68,0.2)",color:"#f87171",border:"rgba(239,68,68,0.4)"},
  B:{bg:"rgba(59,130,246,0.2)",color:"#60a5fa",border:"rgba(59,130,246,0.4)"},
  C:{bg:"rgba(234,179,8,0.2)",color:"#fde047",border:"rgba(234,179,8,0.4)"},
  D:{bg:"rgba(34,197,94,0.2)",color:"#4ade80",border:"rgba(34,197,94,0.4)"},
  E:{bg:"rgba(168,85,247,0.2)",color:"#c084fc",border:"rgba(168,85,247,0.4)"},
};

// ── 完整資料庫 ────────────────────────────────────────────
const ALL_PRODUCTS = [
  // BX
  { id:"BX-00", name:"蒼穹龍神", nameEn:"CobaltDragoon", code:"BX-00", series:"BX",
    blade:{id:"cobaltdragoon0",name:"蒼穹龍神",nameEn:"CobaltDragoon",type:"attack"},
    ratchet:{id:"2-60b",name:"2-60",protrusions:2,height:60},
    bit:{id:"flat0",name:"Flat（F）",type:"attack",desc:"平面底，激進移動"} },
  { id:"BX-01", name:"蒼龍神劍", nameEn:"DranSword", code:"BX-01", series:"BX",
    blade:{id:"dransword",name:"蒼龍神劍",nameEn:"DranSword",type:"attack"},
    ratchet:{id:"3-60",name:"3-60",protrusions:3,height:60},
    bit:{id:"flat",name:"Flat（F）",type:"attack",desc:"平面底，激進移動"} },
  { id:"BX-02", name:"惡魔紅鐮", nameEn:"HellsScythe", code:"BX-02", series:"BX",
    blade:{id:"hellsscythe",name:"惡魔紅鐮",nameEn:"HellsScythe",type:"attack"},
    ratchet:{id:"4-60",name:"4-60",protrusions:4,height:60},
    bit:{id:"taper",name:"Taper（T）",type:"stamina",desc:"錐形底，旋轉耐久型"} },
  { id:"BX-03", name:"魔導幻箭", nameEn:"WizardArrow", code:"BX-03", series:"BX",
    blade:{id:"wizardarrow",name:"魔導幻箭",nameEn:"WizardArrow",type:"balance"},
    ratchet:{id:"4-80",name:"4-80",protrusions:4,height:80},
    bit:{id:"ball",name:"Ball（B）",type:"balance",desc:"球形底，平衡型"} },
  { id:"BX-04", name:"騎士重盾", nameEn:"KnightShield", code:"BX-04", series:"BX",
    blade:{id:"knightshield",name:"騎士重盾",nameEn:"KnightShield",type:"defense"},
    ratchet:{id:"3-80",name:"3-80",protrusions:3,height:80},
    bit:{id:"needle",name:"Needle（N）",type:"defense",desc:"針形底，防守定點型"} },
  { id:"BX-13", name:"騎士長槍", nameEn:"KnightLance", code:"BX-13", series:"BX",
    blade:{id:"knightlance",name:"騎士長槍",nameEn:"KnightLance",type:"defense"},
    ratchet:{id:"4-80b",name:"4-80",protrusions:4,height:80},
    bit:{id:"highneedle",name:"High Needle（HN）",type:"defense",desc:"高針形底，高重心防守"} },
  { id:"BX-15", name:"雄獅獵爪", nameEn:"LeonClaw", code:"BX-15", series:"BX",
    blade:{id:"leonclaw",name:"雄獅獵爪",nameEn:"LeonClaw",type:"attack"},
    ratchet:{id:"5-60",name:"5-60",protrusions:5,height:60},
    bit:{id:"point",name:"Point（P）",type:"stamina",desc:"點形底，穩定耐久"} },
  { id:"BX-19", name:"戰犀獸角", nameEn:"RhinoHorn", code:"BX-19", series:"BX",
    blade:{id:"rhinohorn",name:"戰犀獸角",nameEn:"RhinoHorn",type:"defense"},
    ratchet:{id:"3-80b",name:"3-80",protrusions:3,height:80},
    bit:{id:"spike",name:"Spike（S）",type:"stamina",desc:"尖刺底，耐久穩定"} },
  { id:"BX-20", name:"蒼龍利刃", nameEn:"DranDagger", code:"BX-20", series:"BX",
    blade:{id:"drandagger",name:"蒼龍利刃",nameEn:"DranDagger",type:"attack"},
    ratchet:{id:"4-60b",name:"4-60",protrusions:4,height:60},
    bit:{id:"rush",name:"Rush（R）",type:"attack",desc:"平面底，高頻X-Dash攻擊"} },
  { id:"BX-21", name:"惡魔鎖鏈", nameEn:"HellsChain", code:"BX-21", series:"BX",
    blade:{id:"hellschain",name:"惡魔鎖鏈",nameEn:"HellsChain",type:"attack"},
    ratchet:{id:"4-60c",name:"4-60",protrusions:4,height:60},
    bit:{id:"hightaper",name:"High Taper（HT）",type:"stamina",desc:"高錐形底，高重心耐久"} },
  { id:"BX-23", name:"鳳凰飛翼", nameEn:"PhoenixWing", code:"BX-23", series:"BX",
    blade:{id:"phoenixwing",name:"鳳凰飛翼",nameEn:"PhoenixWing",type:"attack"},
    ratchet:{id:"9-60",name:"9-60",protrusions:9,height:60},
    bit:{id:"gearflat",name:"Gear Flat（GR）",type:"attack",desc:"齒輪平面底，更快X-Dash"} },
  { id:"BX-26", name:"獨角獸刺心", nameEn:"UnicornSting", code:"BX-26", series:"BX",
    blade:{id:"unicornsting",name:"獨角獸刺心",nameEn:"UnicornSting",type:"balance"},
    ratchet:{id:"5-60b",name:"5-60",protrusions:5,height:60},
    bit:{id:"gearpoint",name:"Gear Point（GP）",type:"stamina",desc:"齒輪點形底，穩定耐久"} },
  { id:"BX-31", name:"暴龍擊（隨機包Vol.3）", nameEn:"TyrannoBeat", code:"BX-31", series:"BX",
    blade:{id:"tyrannobeat",name:"暴龍霸擊",nameEn:"TyrannoBeat",type:"attack"},
    ratchet:{id:"4-70c",name:"4-70",protrusions:4,height:70},
    bit:{id:"quake",name:"Quake（Q）",type:"attack",desc:"橢圓平面底，不規則彈跳攻擊"} },
  { id:"BX-33", name:"皓戰猛虎", nameEn:"WeissTiger", code:"BX-33", series:"BX",
    blade:{id:"weisstiger",name:"皓戰猛虎",nameEn:"WeissTiger",type:"balance"},
    ratchet:{id:"3-60b",name:"3-60",protrusions:3,height:60},
    bit:{id:"unite",name:"Unite（U）",type:"balance",desc:"組合底，兼顧攻守"} },
  { id:"BX-34", name:"蒼穹龍騎士", nameEn:"CobaltDragoon", code:"BX-34", series:"BX",
    blade:{id:"cobaltdragoon",name:"蒼穹龍騎士",nameEn:"CobaltDragoon",type:"attack"},
    ratchet:{id:"2-60",name:"2-60",protrusions:2,height:60},
    bit:{id:"cyclone",name:"Cyclone（C）",type:"attack",desc:"旋風底，激進移動攻擊"} },
  { id:"BX-36", name:"巨鯨怒濤", nameEn:"WhaleWave", code:"BX-36", series:"BX",
    blade:{id:"whalewave",name:"巨鯨怒濤",nameEn:"WhaleWave",type:"stamina"},
    ratchet:{id:"5-80",name:"5-80",protrusions:5,height:80},
    bit:{id:"elevate",name:"Elevate（E）",type:"stamina",desc:"提升底，高重心耐久"} },
  { id:"BX-38", name:"赫燃天鳳", nameEn:"CrimsonGaruda", code:"BX-38", series:"BX",
    blade:{id:"crimsongaruda",name:"赫燃天鳳",nameEn:"CrimsonGaruda",type:"balance"},
    ratchet:{id:"4-70",name:"4-70",protrusions:4,height:70},
    bit:{id:"transpoint",name:"Trans Point（TP）",type:"balance",desc:"變形點底，可切換模式"} },
  { id:"BX-44", name:"三角強襲", nameEn:"TriceraPress", code:"BX-44", series:"BX",
    blade:{id:"tricerapress",name:"三角強襲",nameEn:"TriceraPress",type:"defense"},
    ratchet:{id:"m-85",name:"M-85",protrusions:null,height:85},
    bit:{id:"boundspike",name:"Bound Spike（BS）",type:"defense",desc:"彈跳尖刺底，反擊防守"} },
  { id:"BX-45", name:"武士校刀", nameEn:"SamuraiCalibur", code:"BX-45", series:"BX",
    blade:{id:"samuraicalibur",name:"武士校刀",nameEn:"SamuraiCalibur",type:"balance"},
    ratchet:{id:"6-70",name:"6-70",protrusions:6,height:70},
    bit:{id:"merge",name:"Merge（M）",type:"balance",desc:"橡膠平面+尖底，傾斜攻擊直立耐久"} },
  // UX
  { id:"UX-01", name:"蒼龍爆刃", nameEn:"DranBuster", code:"UX-01", series:"UX",
    blade:{id:"dranbuster",name:"蒼龍爆刃",nameEn:"DranBuster",type:"attack"},
    ratchet:{id:"1-60",name:"1-60",protrusions:1,height:60},
    bit:{id:"accel",name:"Accel（A）",type:"attack",desc:"加速底，快速機動攻擊"} },
  { id:"UX-02", name:"惡魔戰槌", nameEn:"HellsHammer", code:"UX-02", series:"UX",
    blade:{id:"hellshammer",name:"惡魔戰槌",nameEn:"HellsHammer",type:"attack"},
    ratchet:{id:"3-70",name:"3-70",protrusions:3,height:70},
    bit:{id:"hexa",name:"Hexa（H）",type:"balance",desc:"六角形底，自動扶正平衡"} },
  { id:"UX-03", name:"魔導神杖", nameEn:"WizardRod", code:"UX-03", series:"UX",
    blade:{id:"wizardrod",name:"魔導神杖",nameEn:"WizardRod",type:"stamina"},
    ratchet:{id:"5-70",name:"5-70",protrusions:5,height:70},
    bit:{id:"diskball",name:"Disk Ball（J）",type:"stamina",desc:"碟形球底，圓盤穩定耐久"} },
  { id:"UX-05", name:"忍者闇影", nameEn:"ShinobiShadow", code:"UX-05", series:"UX",
    blade:{id:"shinobishadow",name:"忍者闇影",nameEn:"ShinobiShadow",type:"attack"},
    ratchet:{id:"1-80",name:"1-80",protrusions:1,height:80},
    bit:{id:"metalneedle",name:"Metal Needle（MN）",type:"defense",desc:"金屬針底，防守耐久"} },
  { id:"UX-06", name:"雄獅巔峰", nameEn:"LeonCrest", code:"UX-06", series:"UX",
    blade:{id:"leoncrest",name:"雄獅巔峰",nameEn:"LeonCrest",type:"balance"},
    ratchet:{id:"7-60",name:"7-60",protrusions:7,height:60},
    bit:{id:"gearneedle",name:"Gear Needle（GN）",type:"stamina",desc:"齒輪針底，耐久型"} },
  { id:"UX-07", name:"鳳凰尾翼", nameEn:"PhoenixRudder", code:"UX-07", series:"UX",
    blade:{id:"phoenixrudder",name:"鳳凰尾翼",nameEn:"PhoenixRudder",type:"balance"},
    ratchet:{id:"9-70",name:"9-70",protrusions:9,height:70},
    bit:{id:"glide",name:"Glide（G）",type:"balance",desc:"滑翔底，平衡機動"} },
  { id:"UX-08", name:"霜輝銀狼", nameEn:"SilverWolf", code:"UX-08", series:"UX",
    blade:{id:"silverwolf",name:"霜輝銀狼",nameEn:"SilverWolf",type:"defense"},
    ratchet:{id:"3-80c",name:"3-80",protrusions:3,height:80},
    bit:{id:"freeball",name:"Free Ball（FB）",type:"defense",desc:"自由球底，防守反彈"} },
  { id:"UX-09", name:"武士星劍", nameEn:"SamuraiSaber", code:"UX-09", series:"UX",
    blade:{id:"samuraisaber",name:"武士星劍",nameEn:"SamuraiSaber",type:"balance"},
    ratchet:{id:"2-70",name:"2-70",protrusions:2,height:70},
    bit:{id:"level",name:"Level（L）",type:"balance",desc:"水平底，平衡穩定型"} },
  { id:"UX-10", name:"騎士圓甲", nameEn:"KnightMail", code:"UX-10", series:"UX",
    blade:{id:"knightmail",name:"騎士圓甲",nameEn:"KnightMail",type:"defense"},
    ratchet:{id:"3-85",name:"3-85",protrusions:3,height:85},
    bit:{id:"boundspike2",name:"Bound Spike（BS）",type:"defense",desc:"彈跳尖刺底，防守反擊"} },
  { id:"UX-11", name:"衝擊龍神", nameEn:"ImpactDrake", code:"UX-11", series:"UX",
    blade:{id:"impactdrake",name:"衝擊龍神",nameEn:"ImpactDrake",type:"attack"},
    ratchet:{id:"9-60b",name:"9-60",protrusions:9,height:60},
    bit:{id:"lowrush",name:"Low Rush（LR）",type:"attack",desc:"低版Rush，更低重心強衝擊，競技首選"} },
  { id:"UX-12", name:"幽靈元魂（隨機包Vol.5）", nameEn:"GhostCircle", code:"UX-12", series:"UX",
    blade:{id:"ghostcircle",name:"幽靈元魂",nameEn:"GhostCircle",type:"defense"},
    ratchet:{id:"0-80",name:"0-80",protrusions:0,height:80},
    bit:{id:"gearball",name:"Gear Ball（WB）",type:"defense",desc:"齒輪球底，防守穩定"} },
  { id:"UX-13", name:"魔像奇岩", nameEn:"GolemRock", code:"UX-13", series:"UX",
    blade:{id:"golemrock",name:"魔像奇岩",nameEn:"GolemRock",type:"defense"},
    ratchet:{id:"1-60b",name:"1-60",protrusions:1,height:60},
    bit:{id:"underneedle",name:"Under Needle（UN）",type:"defense",desc:"超低針底，超低重心防守"} },
  { id:"UX-14", name:"天蠍長矛", nameEn:"ScorpioSpear", code:"UX-14", series:"UX",
    blade:{id:"scorpiospear",name:"天蠍長矛",nameEn:"ScorpioSpear",type:"balance",note:"X-Dash時形態切換"},
    ratchet:{id:"0-70",name:"0-70",protrusions:0,height:70},
    bit:{id:"zap",name:"Zap（Z）",type:"balance",desc:"寬平面+圓球，傾斜攻擊直立耐久"} },
  { id:"UX-15-1", name:"鮫鯊狂鱗", nameEn:"SharkScale", code:"UX-15", series:"UX",
    blade:{id:"sharkscale",name:"鮫鯊狂鱗",nameEn:"SharkScale",type:"attack"},
    ratchet:{id:"4-50",name:"4-50",protrusions:4,height:50},
    bit:{id:"underflat",name:"Under Flat（UF）",type:"attack",desc:"超低平面底，最低重心攻擊"} },
  { id:"UX-17", name:"隕石龍神", nameEn:"MeteorDragoon", code:"UX-17", series:"UX",
    blade:{id:"meteordragoon",name:"隕石龍神",nameEn:"MeteorDragoon",type:"attack",note:"左旋攻擊型"},
    ratchet:{id:"3-70c",name:"3-70",protrusions:3,height:70},
    bit:{id:"jolt",name:"Jolt（J）",type:"attack",desc:"快速激進移動，類似Hexa操作感"} },
  { id:"UX-18", name:"詛咒木乃伊（隨機包Vol.8）", nameEn:"MummyCurse", code:"UX-18", series:"UX",
    blade:{id:"mummycurse",name:"詛咒木乃伊",nameEn:"MummyCurse",type:"defense",note:"主動變形刀片，受攻擊時改變行為"},
    ratchet:{id:"7-55",name:"7-55",protrusions:7,height:55},
    bit:{id:"wedge",name:"Wedge（W）",type:"defense",desc:"楔形底，控制耐久"} },
  { id:"UX-15-2", name:"暴龍咆哮", nameEn:"TyrannoRoar", code:"UX-15", series:"BX",
    blade:{id:"tyrannoroar2",name:"暴龍咆哮",nameEn:"TyrannoRoar",type:"attack"},
    ratchet:{id:"1-70b",name:"1-70",protrusions:1,height:70},
    bit:{id:"level2",name:"Level（L）",type:"balance",desc:"水平底，平衡穩定型"} },
  { id:"UX-15-3", name:"惡魔勇氣", nameEn:"HellsBrave", code:"UX-15", series:"CX",
    blade:{id:"hellsbrave",name:"惡魔勇氣",nameEn:"HellsBrave",type:"attack"},
    lockChip:{id:"lc-hellsbrave",name:"J"},mainBlade:{id:"mb-hellsbrave",name:"HellsBrave"},assistBlade:{id:"ab-hellsbrave",name:"Assist"},
    ratchet:{id:"3-60g",name:"3-60",protrusions:3,height:60},
    bit:{id:"gearflat3",name:"Gear Flat（GF）",type:"attack",desc:"齒輪平面底，高速X-Dash"} },
  { id:"UX-19", name:"子彈獅鷲", nameEn:"BulletGriffon", code:"UX-19", series:"UX",
    blade:{id:"bulletgriffon",name:"子彈獅鷲",nameEn:"BulletGriffon",type:"balance",note:"棘輪內建，受擊後分裂",integratedRatchet:true},
    ratchet:{id:"bulletgriffon-r",name:"（內建於刀片）",protrusions:null,height:null,integrated:true},
    bit:{id:"hexa2",name:"Hexa（H）",type:"balance",desc:"六角形底，自動扶正平衡"} },
  // CX
  { id:"CX-01", name:"蒼龍勇氣", nameEn:"DranBrave", code:"CX-01", series:"CX",
    blade:{id:"dranbrave",name:"蒼龍勇氣",nameEn:"DranBrave",type:"attack"},
    lockChip:{id:"lc-dran",name:"Dran"},mainBlade:{id:"mb-brave",name:"Brave"},assistBlade:{id:"ab-slash",name:"Slash"},
    ratchet:{id:"6-60",name:"6-60",protrusions:6,height:60},
    bit:{id:"vortex",name:"Vortex（V）",type:"attack",desc:"渦流底，激進旋轉攻擊"} },
  { id:"CX-02", name:"魔導至尊", nameEn:"WizardArc", code:"CX-02", series:"CX",
    blade:{id:"wizardarc",name:"魔導至尊",nameEn:"WizardArc",type:"stamina"},
    lockChip:{id:"lc-wizard",name:"Wizard"},mainBlade:{id:"mb-arc",name:"Arc"},assistBlade:{id:"ab-round",name:"Round"},
    ratchet:{id:"4-55",name:"4-55",protrusions:4,height:55},
    bit:{id:"loworb",name:"Low Orb（LO）",type:"stamina",desc:"低球形底，低重心耐久"} },
  { id:"CX-03", name:"英仙幽冥", nameEn:"PerseusDark", code:"CX-03", series:"CX",
    blade:{id:"perseusdark",name:"英仙幽冥",nameEn:"PerseusDark",type:"defense"},
    lockChip:{id:"lc-perseus",name:"Perseus"},mainBlade:{id:"mb-dark",name:"Dark"},assistBlade:{id:"ab-bumper",name:"Bumper"},
    ratchet:{id:"6-80",name:"6-80",protrusions:6,height:80},
    bit:{id:"wall",name:"Wall（W）",type:"defense",desc:"牆形底，防守反彈型"} },
  { id:"CX-05", name:"惡魔獵魂（隨機包Vol.6）", nameEn:"HellsReaper", code:"CX-05", series:"CX",
    blade:{id:"hellsreaper",name:"惡魔獵魂",nameEn:"HellsReaper",type:"attack"},
    lockChip:{id:"lc-hells",name:"Hells"},mainBlade:{id:"mb-reaper",name:"Reaper"},assistBlade:{id:"ab-turn",name:"Turn"},
    ratchet:{id:"4-70b",name:"4-70",protrusions:4,height:70},
    bit:{id:"kick",name:"Kick（K）",type:"balance",desc:"踢形底，攻守兼備"} },
  { id:"CX-07", name:"天馬爆擊", nameEn:"PegasusBlast", code:"CX-07", series:"CX",
    blade:{id:"blast",name:"Blast（爆擊）",nameEn:"Blast",type:"attack",note:"CX系列，含Main+Assist刀片"},
    lockChip:{id:"lc-pegasus",name:"Pegasus"},mainBlade:{id:"mb-blast",name:"Blast"},assistBlade:{id:"ab-assault",name:"Assault"},
    ratchet:{id:"turbo",name:"Turbo（Tr）",protrusions:null,height:null,integrated:true},
    bit:{id:"turbo-bit",name:"Turbo（Tr）",type:"attack",desc:"棘輪+Bit合體，高速尖底耐久低速平面攻擊",integrated:true} },
  { id:"CX-08-01", name:"魔犬烈焰（CX-08 01）", nameEn:"CerberusBlaze", code:"CX-08", series:"CX",
    blade:{id:"cerberusblaze",name:"魔犬烈焰",nameEn:"CerberusBlaze",type:"attack"},
    lockChip:{id:"lc-cerberus",name:"Cerberus"},mainBlade:{id:"mb-blaze",name:"Blaze"},assistBlade:{id:"ab-wall-cx08",name:"Wall（W）"},
    ratchet:{id:"5-80cx08",name:"5-80",protrusions:5,height:80},
    bit:{id:"wallbound",name:"Wall Bound（WB）",type:"defense",desc:"牆面彈跳底，防守反彈"} },
  { id:"CX-08-02", name:"巨鯨烈焰（CX-08 02）", nameEn:"WhaleBlaze", code:"CX-08", series:"CX",
    blade:{id:"whaleblaze",name:"巨鯨烈焰",nameEn:"WhaleBlaze",type:"stamina"},
    lockChip:{id:"lc-whale",name:"Whale"},mainBlade:{id:"mb-blaze2",name:"Blaze"},assistBlade:{id:"ab-t-cx08",name:"T"},
    ratchet:{id:"3-85cx08",name:"3-85",protrusions:3,height:85},
    bit:{id:"hightaper2",name:"High Taper（HT）",type:"stamina",desc:"高錐形底，高重心耐久"} },
  { id:"CX-08-03", name:"魔犬幽冥（CX-08 03）", nameEn:"CerberusDark", code:"CX-08", series:"CX",
    blade:{id:"cerberusdark",name:"魔犬幽冥",nameEn:"CerberusDark",type:"defense"},
    lockChip:{id:"lc-cerberus2",name:"Cerberus"},mainBlade:{id:"mb-dark2",name:"Dark"},assistBlade:{id:"ab-wall2-cx08",name:"Wall（W）"},
    ratchet:{id:"1-60cx08",name:"1-60",protrusions:1,height:60},
    bit:{id:"flat7",name:"Flat（F）",type:"attack",desc:"平面底，激進移動"} },
  { id:"CX-08-04", name:"蒼龍爆刃（CX-08 04）", nameEn:"DranBusterCX", code:"CX-08", series:"CX",
    blade:{id:"dranbustercx",name:"蒼龍爆刃",nameEn:"DranBusterCX",type:"attack"},
    lockChip:{id:"lc-dran2",name:"Dran"},mainBlade:{id:"mb-buster",name:"Buster"},assistBlade:{id:"ab-mn-cx08",name:"MN"},
    ratchet:{id:"5-80cx08b",name:"5-80",protrusions:5,height:80},
    bit:{id:"metalneedle3",name:"Metal Needle（MN）",type:"defense",desc:"金屬針底，防守耐久"} },
  { id:"CX-08-05", name:"玄冥戰甲（CX-08 05）", nameEn:"DarkArmor", code:"CX-08", series:"CX",
    blade:{id:"darkarmor",name:"玄冥戰甲",nameEn:"DarkArmor",type:"defense"},
    lockChip:{id:"lc-dark",name:"Dark"},mainBlade:{id:"mb-armor",name:"Armor"},assistBlade:{id:"ab-wb-cx08",name:"WB"},
    ratchet:{id:"7-70cx08",name:"7-70",protrusions:7,height:70},
    bit:{id:"wallbound2",name:"Wall Bound（WB）",type:"defense",desc:"牆面彈跳底，防守反彈"} },
  { id:"CX-08-06", name:"蒼穹龍騎士（CX-08 06）", nameEn:"CobaltDrakeCX", code:"CX-08", series:"CX",
    blade:{id:"cobaltdrakecx",name:"蒼穹龍騎士",nameEn:"CobaltDrakeCX",type:"attack"},
    lockChip:{id:"lc-cobalt",name:"Cobalt"},mainBlade:{id:"mb-drake",name:"Drake"},assistBlade:{id:"ab-wb2-cx08",name:"WB"},
    ratchet:{id:"4-55cx08",name:"4-55",protrusions:4,height:55},
    bit:{id:"wallbound3",name:"Wall Bound（WB）",type:"defense",desc:"牆面彈跳底，防守反彈"} },
  { id:"CX-09", name:"焰神滅世", nameEn:"SolEclipse", code:"CX-09", series:"CX",
    blade:{id:"soleclipse",name:"焰神滅世",nameEn:"SolEclipse",type:"balance"},
    lockChip:{id:"lc-sol",name:"Sol"},mainBlade:{id:"mb-eclipse",name:"Eclipse"},assistBlade:{id:"ab-dual",name:"Dual"},
    ratchet:{id:"5-70b",name:"5-70",protrusions:5,height:70},
    bit:{id:"transtaper",name:"Trans Kick（TK）",type:"balance",desc:"變形底，可切換模式"} },
  { id:"CX-10", name:"銀狼狩獵（隨機包Vol.7）", nameEn:"WolfHunt", code:"CX-10", series:"CX",
    blade:{id:"wolfhunt",name:"銀狼狩獵",nameEn:"WolfHunt",type:"attack"},
    lockChip:{id:"lc-wolf",name:"Wolf"},mainBlade:{id:"mb-hunt",name:"Hunt"},assistBlade:{id:"ab-fang",name:"Fang"},
    ratchet:{id:"0-60",name:"0-60",protrusions:0,height:60},
    bit:{id:"diskball2",name:"Disk Ball（J）",type:"stamina",desc:"碟形球底，穩定耐久"} },
  { id:"CX-11", name:"帝王威能", nameEn:"EmperorMight", code:"CX-11", series:"CX",
    blade:{id:"emperormight",name:"帝王威能",nameEn:"EmperorMight",type:"defense"},
    lockChip:{id:"lc-emperor",name:"Emperor"},mainBlade:{id:"mb-might",name:"Might"},assistBlade:{id:"ab-shield",name:"Shield"},
    ratchet:{id:"7-70",name:"7-70",protrusions:7,height:70},
    bit:{id:"orbsuction",name:"Orb Suction（OP）",type:"stamina",desc:"球形吸力底，耐久型"} },
  { id:"CX-12", name:"鳳凰閃焰", nameEn:"PhoenixFlare", code:"CX-12", series:"CX",
    blade:{id:"phoenixflare",name:"鳳凰閃焰",nameEn:"PhoenixFlare",type:"attack"},
    lockChip:{id:"lc-phoenix",name:"Phoenix"},mainBlade:{id:"mb-flare",name:"Flare"},assistBlade:{id:"ab-zillion",name:"Zillion"},
    ratchet:{id:"9-80",name:"9-80",protrusions:9,height:80},
    bit:{id:"wallwedge",name:"Wall Wedge（WW）",type:"defense",desc:"牆楔底，防守型"} },
  { id:"CX-13", name:"龍王閃擊", nameEn:"BahamutBlitz", code:"CX-13", series:"CX",
    blade:{id:"bahamutblitz",name:"龍王閃擊",nameEn:"BahamutBlitz",type:"attack",note:"CX系列，含Main+Assist刀片"},
    lockChip:{id:"lc-bahamut",name:"Bahamut"},overBlade:{id:"ob-break",name:"Break"},mainBlade:{id:"mb-blitz",name:"Blitz（Metal）"},assistBlade:{id:"ab-knuckle",name:"Knuckle"},expandBlade:true,
    ratchet:{id:"1-50",name:"1-50",protrusions:1,height:50},
    bit:{id:"ignition",name:"Ignition（I）",type:"attack",desc:"大型圓筒底，強力抓地高速機動"} },
  { id:"CX-14", name:"騎士堡壘", nameEn:"KnightFortress", code:"CX-14", series:"CX",
    blade:{id:"knightfortress",name:"騎士堡壘",nameEn:"KnightFortress",type:"defense"},
    lockChip:{id:"lc-knight2",name:"Knight"},overBlade:{id:"ob-fortress",name:"Fortress"},mainBlade:{id:"mb-guard",name:"Guard（Metal）"},assistBlade:{id:"ab-wall2",name:"Wall"},expandBlade:true,
    ratchet:{id:"8-70",name:"8-70",protrusions:8,height:70},
    bit:{id:"underneedle2",name:"Under Needle（UN）",type:"defense",desc:"超低針底，低重心防守"} },
  { id:"CX-15", name:"邪神狂怒", nameEn:"RagnaRage", code:"CX-15", series:"CX",
    blade:{id:"ragnarage",name:"邪神狂怒",nameEn:"RagnaRage",type:"stamina"},
    lockChip:{id:"lc-ragna",name:"Ragna"},overBlade:{id:"ob-flow",name:"Flow"},mainBlade:{id:"mb-rage",name:"Rage（Metal）"},assistBlade:{id:"ab-erase",name:"Erase"},expandBlade:true,
    ratchet:{id:"4-55b",name:"4-55",protrusions:4,height:55},
    bit:{id:"yielding",name:"Yielding（Y）",type:"stamina",desc:"讓力底，耐久減少衝擊"} },
  { id:"CX-18", name:"腕龍長鞭", nameEn:"WristDragonWhip", code:"CX-18", series:"CX",
    blade:{id:"wristdragon",name:"腕龍長鞭",nameEn:"WristDragonWhip",type:"attack"},
    lockChip:{id:"lc-wrist",name:"Wrist"},mainBlade:{id:"mb-whip",name:"Whip"},assistBlade:{id:"ab-w",name:"W"},
    ratchet:{id:"5-70c",name:"5-70",protrusions:5,height:70},
    bit:{id:"needlerush",name:"Needle Rush（RA）",type:"stamina",desc:"針形衝刺底，耐久型"} },
];

// ── 工具函式 ──────────────────────────────────────────────
function getAllParts() {
  const blades={}, ratchets={}, bits={};
  ALL_PRODUCTS.forEach(p => {
    if(!blades[p.blade.id]) blades[p.blade.id]={...p.blade,source:p.name,sourceCode:p.code};
    if(!p.ratchet.integrated && !ratchets[p.ratchet.id])
      ratchets[p.ratchet.id]={...p.ratchet,source:p.name,sourceCode:p.code};
    if(!p.bit.integrated && !bits[p.bit.id])
      bits[p.bit.id]={...p.bit,source:p.name,sourceCode:p.code};
  });
  return {blades:Object.values(blades),ratchets:Object.values(ratchets),bits:Object.values(bits)};
}

// ── 主流配裝資料（來源：台灣 YTR）───────────────────────
// 括號內為備選，主要為前幾個
const META_COMBOS = {
  // 鮫鯊狂鱗（UX-15）
  sharkscale: {
    attack:   {ratchets:["4-50","3-60","1-60","1-70"],         bits:["level","rush","lowrush","underflat","kick"]},
    stamina:  {ratchets:["1-60","3-60","9-60","1-70"],         bits:["loworb","freeball","underneedle","hexa"]},
  },
  // 魔導神杖（UX-03）
  wizardrod: {
    attack:   {ratchets:["1-60","3-60"],                       bits:["level","rush","lowrush","kick"]},
    stamina:  {ratchets:["1-60","3-60","9-60"],                bits:["freeball","loworb","ball","underneedle","hexa"]},
  },
  // 魔像奇岩（UX-13）
  golemrock: {
    attack:   {ratchets:["3-60","1-60","7-70","1-70"],         bits:["rush","lowrush"]},
    stamina:  {ratchets:["1-60","1-70"],                       bits:["freeball","hexa","underneedle"]},
  },
  // 蒼龍爆刃（UX-01）
  dranbuster: {
    attack:   {ratchets:["4-50","1-60","3-60","9-60","4-60","5-60"], bits:["lowrush","underflat","rush"]},
  },
  // 帝王威能（CX-11）
  emperormight: {
    attack:   {ratchets:["1-60","3-60","4-50","7-60"],         bits:["lowrush","underflat","level","rush"]},
  },
  // 天馬爆擊（CX-07）
  blast: {
    attack:   {ratchets:["1-60","7-60","9-60"],                bits:["rush","lowrush","level"]},
    stamina:  {ratchets:["1-60","3-60","7-60","9-60"],         bits:["freeball","highneedle","hexa"]},
  },
  // 天蠍長矛（UX-14）
  scorpiospear: {
    balance:  {ratchets:["1-60","3-60","9-60"],  bits:["level","wall","lowrush","rush","zap","merge"]},
  },
  // 龍王閃擊（CX-13）
  bahamutblitz: {
    attack:   {ratchets:["1-60","1-50","7-60","5-60","3-60","9-60","8-70"],  bits:["rush","lowrush","level","unite","diskball","diskball2","hexa","hexa2","needle","ignition"]},
  },
};

function getMetaScore(bladeId, ratchetName, bitId) {
  const meta = META_COMBOS[bladeId];
  if(!meta) return null;
  let bestScore = 0;
  for(const style of Object.values(meta)) {
    const rIdx = style.ratchets.indexOf(ratchetName);
    const bIdx = style.bits.indexOf(bitId);
    if(rIdx>=0 && bIdx>=0) {
      // 越前面分數越高，組合匹配加分
      const score = 10 - rIdx*0.5 - bIdx*0.5;
      bestScore = Math.max(bestScore, score);
    }
  }
  return bestScore > 0 ? bestScore : null;
}

function rateBit(id, bladeType) {
  const attack={lowrush:5,underflat:5,ignition:5,rush:5,needle:5,level:5,gearflat:4,flat:4,cyclone:4,vortex:4,accel:3,lowflat:3,merge:2,zap:2,hexa:2,hexa2:2,unite:2,transpoint:2,taper:1,point:1,spike:1,ball:1};
  const defense={needle:5,metalneedle:5,underneedle:5,underneedle2:5,highneedle:5,freeball:5,ball:4,spike:4,boundspike:4,boundspike2:4,hexa:3,hexa2:3,merge:3,zap:3,level:3,flat:1,rush:1,lowrush:1};
  const stamina={freeball:5,loworb:5,ball:5,hexa:5,hexa2:5,underneedle:4,highneedle:4,diskball:4,diskball2:4,taper:4,hightaper:4,point:3,merge:2,zap:2,level:2,flat:1,rush:1,lowrush:1};
  const balance={merge:5,zap:5,hexa:5,hexa2:5,freeball:5,ball:5,level:5,unite:4,transpoint:4,glide:4,taper:2,rush:2,lowrush:2,flat:2,needle:2};
  const map={attack,defense,stamina,balance};
  return (map[bladeType]||balance)[id]||1;
}
function rateRatchet(r, bladeType) {
  if(!r||r.protrusions===null) return 0;
  const isTop=(r.protrusions===1&&r.height===60)||(r.protrusions===3&&r.height===60)||(r.protrusions===9&&r.height===60);
  if(isTop) return 5;
  if(bladeType==="attack") {
    if(r.height<=50) return 5;
    if(r.protrusions===7&&r.height===60) return 4;
    if(r.height===70&&r.protrusions===7) return 4;
    if(r.height<=60) return 3;
    if(r.height===70) return 3;
    return 2;
  }
  if(bladeType==="defense") {
    if(r.protrusions===1&&r.height===70) return 4;
    if(r.height>=70) return 4;
    if(r.height>=60) return 3;
    return 2;
  }
  if(bladeType==="stamina") {
    if(r.protrusions===1&&r.height===70) return 4;
    if(r.height>=70) return 3;
    if(r.height>=60) return 2;
    return 1;
  }
  if(bladeType==="balance") {
    if(r.protrusions===1&&r.height===70) return 4;
    if(r.height>=60) return 3;
    return 2;
  }
  return 3;
}
function getRating(score) {
  if(score>=9) return "S";
  if(score>=7) return "A";
  if(score>=5) return "B";
  return "C";
}
function getRatingFromMeta(metaScore) {
  if(metaScore===null) return null;
  if(metaScore>=9.5) return "S";
  if(metaScore>=8.5) return "A";
  return "B";
}

function getRecommendedCombos(product, allRatchets, allBits, ownedPartIds) {
  if(!product) return [];
  const blade = product.blade;
  const isIntegrated = product.ratchet.integrated && product.bit.integrated;
  const isIntegratedRatchet = blade.integratedRatchet;
  const combos = [];

  if(isIntegrated) {
    combos.push({
      blade, isIntegratedCard:true, integratedRatchet:false,
      ratchet:{...product.ratchet,source:product.name,sourceCode:product.code},
      bit:{...product.bit,source:product.name,sourceCode:product.code},
      rating:"E", score:2, style:"原裝一體式",
      owned:{blade:ownedPartIds.has(blade.id),ratchet:true,bit:true},
      allOwned:ownedPartIds.has(blade.id),
    });
  }

  if(isIntegratedRatchet) {
    const fixedRatchet={...product.ratchet,source:product.name,sourceCode:product.code};
    allBits.forEach(b => {
      const score=2+rateBit(b.id,blade.type);
      combos.push({blade,ratchet:fixedRatchet,bit:b,rating:getRating(score),score,style:"平衡",
        isIntegratedCard:false,integratedRatchet:true,
        owned:{blade:ownedPartIds.has(blade.id),ratchet:true,bit:ownedPartIds.has(b.id)},
        allOwned:ownedPartIds.has(blade.id)&&ownedPartIds.has(b.id)});
    });
    return combos.sort((a,b)=>b.score-a.score).slice(0,7);
  }

  const seen = new Set();
  allRatchets.filter(r=>r.protrusions!==null).forEach(r => {
    allBits.forEach(b => {
      if(blade.type==="attack"&&b.type==="defense") return;
      const metaScore=getMetaScore(blade.id,r.name,b.id);
      const baseScore=rateRatchet(r,blade.type)+rateBit(b.id,blade.type);
      const score=metaScore!==null?metaScore+10:baseScore; // meta 配裝優先排前
      const key=`${blade.id}-${r.id}-${b.id}`;
      if(seen.has(key)) return;
      seen.add(key);
      const owned={blade:ownedPartIds.has(blade.id),ratchet:ownedPartIds.has(r.id),bit:ownedPartIds.has(b.id)};
      const style=metaScore!==null?"主流配裝":(blade.type==="attack"?(b.type==="attack"?"純攻擊":"攻守平衡"):(b.type==="attack"?"平衡偏攻":"平衡偏守"));
      const rating=metaScore!==null?getRatingFromMeta(metaScore):getRating(baseScore);
      combos.push({blade,ratchet:r,bit:b,rating:rating||"B",score,style,isIntegratedCard:false,integratedRatchet:false,isMeta:metaScore!==null,owned,allOwned:owned.blade&&owned.ratchet&&owned.bit});
    });
  });

  const integrated=combos.filter(c=>c.isIntegratedCard);
  const rest=combos.filter(c=>!c.isIntegratedCard).sort((a,b)=>b.score-a.score).slice(0,7);
  return [...integrated,...rest];
}

function sortProducts(list) {
  return [...list].sort((a,b)=>{
    if(a.series!==b.series) return a.series.localeCompare(b.series);
    return parseInt(a.code.split("-")[1]||"0")-parseInt(b.code.split("-")[1]||"0");
  });
}

// ── UI 元件 ───────────────────────────────────────────────
const RATING_COLOR = {S:"#fbbf24",A:"#34d399",B:"#60a5fa",C:"#a78bfa",E:"#888"};
const SERIES_COLOR = {BX:"#60a5fa",UX:"#c084fc",CX:"#f472b6"};

function TierBadge({tier}) {
  if(!tier) return null;
  const c=TIER_COLOR[tier]||TIER_COLOR.E;
  return <span style={{fontSize:10,fontWeight:900,padding:"1px 6px",borderRadius:4,background:c.bg,color:c.color,border:`1px solid ${c.border}`,marginLeft:4}}>{tier}</span>;
}

function SeriesBadge({series}) {
  const color=SERIES_COLOR[series]||"#aaa";
  return <span style={{fontSize:10,fontWeight:700,padding:"1px 7px",borderRadius:99,background:`${color}22`,color,border:`1px solid ${color}44`,marginLeft:6}}>{series}</span>;
}

function OwnTag({owned}) {
  return <span style={{display:"inline-block",padding:"1px 7px",borderRadius:99,fontSize:10,fontWeight:700,background:owned?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.12)",color:owned?"#34d399":"#f87171",border:`1px solid ${owned?"#34d399":"#f87171"}`,marginLeft:6}}>{owned?"✓ 已有":"✕ 待收集"}</span>;
}

function ComboCard({combo, index, wishlistParts, toggleWishlist}) {
  const rColor=RATING_COLOR[combo.rating]||"#aaa";
  const ratchetIntegrated=combo.isIntegratedCard||combo.integratedRatchet;
  const isCXcombo=combo.blade.sourceCode&&ALL_PRODUCTS.find(p=>p.code===combo.blade.sourceCode)?.series==="CX";
  const cxProduct=isCXcombo?ALL_PRODUCTS.find(p=>p.code===combo.blade.sourceCode):null;
  const rows=[
    ...(isCXcombo&&cxProduct?[
      ...(cxProduct.overBlade?[{layer:"超越戰刃",val:cxProduct.overBlade?.name||"-",srcName:combo.blade.source,src:combo.blade.sourceCode,owned:combo.owned.blade,integrated:false,tier:null,cx:true}]:[]),
      {layer:"鋼鐵戰刃",val:cxProduct.mainBlade?.name||"-",srcName:combo.blade.source,src:combo.blade.sourceCode,owned:combo.owned.blade,integrated:false,tier:null,cx:true},
      {layer:"鎖定紋章",val:cxProduct.lockChip?.name||"-",srcName:combo.blade.source,src:combo.blade.sourceCode,owned:combo.owned.blade,integrated:false,tier:null,cx:true},
      {layer:"輔助戰刃",val:cxProduct.assistBlade?.name||"-",srcName:combo.blade.source,src:combo.blade.sourceCode,owned:combo.owned.blade,integrated:false,tier:null,cx:true},
    ]:[
      {layer:"上層 刀片",val:combo.blade.name,srcName:combo.blade.source,src:combo.blade.sourceCode,owned:combo.owned.blade,integrated:false,tier:null,cx:false},
    ]),
    {layer:"中層 棘輪",val:combo.isIntegratedCard?"Turbo（Tr）（無法替換）":combo.integratedRatchet?"（內建於刀片，無法替換）":combo.ratchet.name,srcName:ratchetIntegrated?null:combo.ratchet.source,src:ratchetIntegrated?null:combo.ratchet.sourceCode,owned:combo.owned.ratchet,integrated:ratchetIntegrated,tier:RATCHET_TIER[combo.ratchet.name]||null,cx:false},
    {layer:"底層 Bit",val:combo.isIntegratedCard?"Turbo（Tr）（無法替換）":combo.bit.name,srcName:combo.isIntegratedCard?null:combo.bit.source,src:combo.isIntegratedCard?null:combo.bit.sourceCode,owned:combo.owned.bit,integrated:combo.isIntegratedCard,tier:BIT_TIER[BIT_ID_TO_ABBR[combo.bit.id]]||null,cx:false},
  ];
  return (
    <div style={{background:combo.allOwned?"rgba(34,197,94,0.06)":"rgba(255,255,255,0.04)",border:`1px solid ${combo.isIntegratedCard?"rgba(251,191,36,0.25)":combo.allOwned?"rgba(34,197,94,0.35)":"rgba(255,255,255,0.1)"}`,borderRadius:16,padding:18,position:"relative"}}>
      <div style={{position:"absolute",top:14,right:14,width:34,height:34,borderRadius:"50%",background:rColor,color:"#000",fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>{combo.rating}</div>
      <div style={{fontSize:11,color:combo.isMeta?"#f97316":combo.isIntegratedCard?"#fbbf24":"#777",marginBottom:12,fontWeight:700,letterSpacing:1}}>
        {combo.isIntegratedCard?"🔒 原裝組合":`組合 #${index} · ${combo.style}`}
        {combo.allOwned&&!combo.isIntegratedCard&&<span style={{color:"#34d399",marginLeft:8}}>● 現在就能組</span>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {rows.map(row=>(
          <div key={row.layer} style={{display:"flex",alignItems:"flex-start",gap:10}}>
            <div style={{fontSize:10,color:"#555",width:64,flexShrink:0,paddingTop:5}}>{row.layer}</div>
            <div style={{flex:1,borderRadius:8,padding:"7px 12px",background:row.integrated?"rgba(251,191,36,0.07)":"rgba(255,255,255,0.05)",border:row.integrated?"1px solid rgba(251,191,36,0.2)":"none"}}>
              <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:4}}>
                <span style={{fontSize:13,fontWeight:600,color:row.integrated?"#fbbf24":"#fff"}}>{row.val}</span>
                {row.tier&&<TierBadge tier={row.tier}/>}
                {!row.integrated&&<OwnTag owned={row.owned}/>}
                {!row.integrated&&!row.owned&&wishlistParts&&(()=>{
                  const wKey=JSON.stringify({layer:row.layer,name:row.val});
                  const inWishlist=wishlistParts.has(wKey);
                  return <span onClick={e=>{e.stopPropagation();toggleWishlist(wKey);}} style={{fontSize:10,cursor:"pointer",padding:"1px 7px",borderRadius:99,fontWeight:700,background:inWishlist?"rgba(251,191,36,0.15)":"rgba(255,255,255,0.08)",color:inWishlist?"#fbbf24":"#aaa",border:`1px solid ${inWishlist?"rgba(251,191,36,0.4)":"rgba(255,255,255,0.15)"}`,marginLeft:2}}>{inWishlist?"🎯":"＋目標"}</span>;
                })()}
              </div>
              {row.srcName&&<div style={{fontSize:10,color:"#888",marginTop:3}}>來自 <span style={{color:"#fbbf24",fontWeight:700}}>{row.srcName}</span><span style={{color:"#555",marginLeft:4}}>（{row.src}）</span></div>}
              {row.integrated&&<div style={{fontSize:10,color:"#f59e0b",marginTop:3}}>⚠ 棘輪與Bit合體，無法單獨替換</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 主應用 ────────────────────────────────────────────────
export default function App() {
  const {blades,ratchets,bits}=getAllParts();

  // 狀態
  const [tab,setTab]=useState("combo");
  const [comboSubTab,setComboSubTab]=useState("recommend");
  const [partSubTab,setPartSubTab]=useState("search");
  const [query,setQuery]=useState("");
  const [selectedProduct,setSelectedProduct]=useState(null);
  const [seriesFilter,setSeriesFilter]=useState("ALL");
  const [showQuickSelect,setShowQuickSelect]=useState(false);
  const [useOwnedOnly,setUseOwnedOnly]=useState(false);
  const [partQuery,setPartQuery]=useState("");
  const [partLayerFilter,setPartLayerFilter]=useState("ALL");
  const [inventoryQuery,setInventoryQuery]=useState("");
  const [showOwnedOnly,setShowOwnedOnly]=useState(false);
  const [wishlistExpanded,setWishlistExpanded]=useState(true);

  const [ownedProducts,setOwnedProducts]=useState(()=>{
    try{const s=localStorage.getItem("beyblade-owned");return s?new Set(JSON.parse(s)):new Set();}
    catch{return new Set();}
  });
  const [wishlistParts,setWishlistParts]=useState(()=>{
    try{const s=localStorage.getItem("beyblade-wishlist");return s?new Set(JSON.parse(s)):new Set();}
    catch{return new Set();}
  });
  const [myCombos,setMyCombos]=useState(()=>{
    try{const s=localStorage.getItem("beyblade-mycombos");return s?JSON.parse(s):[];}
    catch{return [];}
  });

  // 新增配裝表單狀態
  const [showAddCombo,setShowAddCombo]=useState(false);
  const [newComboName,setNewComboName]=useState("");
  const [newComboBladeId,setNewComboBladeId]=useState("");
  const [newComboRatchetId,setNewComboRatchetId]=useState("");
  const [newComboBitId,setNewComboBitId]=useState("");
  const [bladeSearch,setBladeSearch]=useState("");
  const [ratchetSearch,setRatchetSearch]=useState("");
  const [bitSearch,setBitSearch]=useState("");

  // localStorage 操作
  const toggleOwned=(id)=>{
    setOwnedProducts(prev=>{const n=new Set(prev);n.has(id)?n.delete(id):n.add(id);try{localStorage.setItem("beyblade-owned",JSON.stringify([...n]));}catch{}return n;});
  };
  const toggleWishlist=(key)=>{
    setWishlistParts(prev=>{const n=new Set(prev);n.has(key)?n.delete(key):n.add(key);try{localStorage.setItem("beyblade-wishlist",JSON.stringify([...n]));}catch{}return n;});
  };
  const saveMyCombo=()=>{
    if(!newComboName.trim()||!newComboBladeId) return;
    const bp=ALL_PRODUCTS.find(p=>p.blade.id===newComboBladeId);
    const isIntegratedRatchetBlade=bp?.blade.integratedRatchet;
    const rp=isIntegratedRatchetBlade?bp:ALL_PRODUCTS.find(p=>p.ratchet.id===newComboRatchetId);
    const isIR=rp?.ratchet.integrated&&!isIntegratedRatchetBlade;
    const bitp=isIR?rp:ALL_PRODUCTS.find(p=>p.bit.id===newComboBitId);
    const combo={
      id:Date.now(), name:newComboName.trim(),
      blade:{id:newComboBladeId,name:bp?.blade.name||"",source:bp?.name||"",code:bp?.code||""},
      ratchet:{id:newComboRatchetId,name:isIntegratedRatchetBlade?"（內建於刀片）":isIR?"Turbo（Tr）":rp?.ratchet.name||"（未選）",source:rp?.name||"",code:rp?.code||"",integrated:isIR||isIntegratedRatchetBlade},
      bit:{id:newComboBitId,name:isIR?"Turbo（Tr）":bitp?.bit.name||"",source:bitp?.name||"",code:bitp?.code||"",integrated:isIR},
    };
    const updated=[...myCombos,combo];
    setMyCombos(updated);
    try{localStorage.setItem("beyblade-mycombos",JSON.stringify(updated));}catch{}
    setNewComboName("");setNewComboBladeId("");setNewComboRatchetId("");setNewComboBitId("");
    setShowAddCombo(false);
  };
  const deleteMyCombo=(id)=>{
    const updated=myCombos.filter(c=>c.id!==id);
    setMyCombos(updated);
    try{localStorage.setItem("beyblade-mycombos",JSON.stringify(updated));}catch{}
  };

  // 計算
  const ownedPartIds=useMemo(()=>{
    const ids=new Set();
    ALL_PRODUCTS.filter(p=>ownedProducts.has(p.id)).forEach(p=>{
      ids.add(p.blade.id);
      if(!p.ratchet.integrated) ids.add(p.ratchet.id);
      if(!p.bit.integrated) ids.add(p.bit.id);
    });
    return ids;
  },[ownedProducts]);

  const searchResults=useMemo(()=>{
    if(!query.trim()) return [];
    const q=query.toLowerCase();
    return sortProducts(ALL_PRODUCTS.filter(p=>p.name.toLowerCase().includes(q)||p.nameEn.toLowerCase().includes(q)||p.code.toLowerCase().includes(q)));
  },[query]);

  const filteredProducts=useMemo(()=>{
    let list=seriesFilter==="ALL"?ALL_PRODUCTS:ALL_PRODUCTS.filter(p=>p.series===seriesFilter);
    return sortProducts(list);
  },[seriesFilter]);

  const combos=useMemo(()=>{
    if(!selectedProduct) return [];
    const fr=useOwnedOnly?ratchets.filter(r=>ownedPartIds.has(r.id)):ratchets;
    const fb=useOwnedOnly?bits.filter(b=>ownedPartIds.has(b.id)):bits;
    return getRecommendedCombos(selectedProduct,fr,fb,ownedPartIds);
  },[selectedProduct,ratchets,bits,ownedPartIds,useOwnedOnly]);

  const wishlist=useMemo(()=>{
    if(!selectedProduct) return [];
    const needed=new Set();
    combos.filter(c=>!c.isIntegratedCard&&(c.rating==="S"||c.rating==="A")).forEach(c=>{
      if(!c.owned.ratchet) needed.add(`${c.ratchet.name}　來自 ${c.ratchet.source}（${c.ratchet.sourceCode}）`);
      if(!c.owned.bit) needed.add(`${c.bit.name}　來自 ${c.bit.source}（${c.bit.sourceCode}）`);
    });
    return [...needed];
  },[combos,selectedProduct]);

  const inventoryFiltered=useMemo(()=>{
    let list=seriesFilter==="ALL"?ALL_PRODUCTS:ALL_PRODUCTS.filter(p=>p.series===seriesFilter);
    list=sortProducts(list);
    if(showOwnedOnly) list=list.filter(p=>ownedProducts.has(p.id));
    if(!inventoryQuery.trim()) return list;
    const q=inventoryQuery.toLowerCase();
    return list.filter(p=>p.name.toLowerCase().includes(q)||p.nameEn.toLowerCase().includes(q)||p.code.toLowerCase().includes(q));
  },[seriesFilter,inventoryQuery,showOwnedOnly,ownedProducts]);

  // ── 渲染 ──
  const s={
    page:{minHeight:"100vh",background:"#0a0a0f",fontFamily:"Segoe UI, Noto Sans TC, sans-serif",color:"#fff",padding:"24px 16px"},
    tabBtn:(active)=>({padding:"7px 14px",borderRadius:99,fontSize:12,fontWeight:700,cursor:"pointer",background:active?"#fbbf24":"rgba(255,255,255,0.07)",color:active?"#000":"#aaa",border:active?"none":"1px solid rgba(255,255,255,0.12)"}),
    subTabBtn:(active)=>({flex:1,padding:"9px",borderRadius:12,fontSize:13,fontWeight:700,cursor:"pointer",background:active?"#fbbf24":"rgba(255,255,255,0.07)",color:active?"#000":"#aaa",border:active?"none":"1px solid rgba(255,255,255,0.12)"}),
    input:{width:"100%",padding:"13px 20px",borderRadius:12,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",fontSize:14,outline:"none",boxSizing:"border-box"},
    smallInput:{width:"100%",padding:"10px 14px",borderRadius:10,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",fontSize:13,outline:"none",boxSizing:"border-box"},
  };

  const SearchableField=({label,selectedId,setId,search,setSearch,options,getName,getId,placeholder,onSelect})=>(
    <div style={{position:"relative"}}>
      <div style={{fontSize:10,color:"#666",marginBottom:4}}>{label}</div>
      {selectedId?(
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderRadius:10,background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.3)"}}>
          <span style={{flex:1,fontSize:13,color:"#fff"}}>{getName(options.find(p=>getId(p)===selectedId)||{})}</span>
          <button onClick={()=>{setId("");setSearch("");if(onSelect)onSelect(null);}} style={{background:"none",border:"none",color:"#f87171",cursor:"pointer",fontSize:14}}>✕</button>
        </div>
      ):(
        <div style={{position:"relative"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={placeholder} style={s.smallInput}/>
          {search&&(
            <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#13131f",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,maxHeight:160,overflowY:"auto",zIndex:10}}>
              {options.filter(p=>{const n=getName(p).toLowerCase();const c=(p.code||"").toLowerCase();return n.includes(search.toLowerCase())||c.includes(search.toLowerCase());})
                .map(p=>(
                  <div key={getId(p)} onClick={()=>{setId(getId(p));setSearch("");if(onSelect)onSelect(p);}}
                    style={{padding:"8px 14px",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.06)",fontSize:12,display:"flex",justifyContent:"space-between"}}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(251,191,36,0.1)"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span style={{color:"#fff"}}>{getName(p)}</span>
                    <span style={{color:"#555",fontSize:10}}>{p.code}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:11,letterSpacing:4,color:"#fbbf24",fontWeight:700,marginBottom:6}}>BEYBLADE X</div>
        <h1 style={{margin:0,fontSize:26,fontWeight:900,background:"linear-gradient(90deg,#fbbf24,#f97316)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>組合配裝查詢</h1>
        <div style={{fontSize:11,color:"#444",marginTop:6}}>資料庫：{ALL_PRODUCTS.filter(p=>p.series==="BX").length} BX · {ALL_PRODUCTS.filter(p=>p.series==="UX").length} UX · {ALL_PRODUCTS.filter(p=>p.series==="CX").length} CX</div>
      </div>

      {/* 主 Tab */}
      <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:28,flexWrap:"wrap"}}>
        {[["combo","⚔️配裝"],["parts","🔍零件查詢"],["tier","📊等級表"],["inventory","🔍陀螺查詢"],["myinventory","🐉我的陀螺"]].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={s.tabBtn(tab===key)}>{label}</button>
        ))}
      </div>

      {/* ══ 配裝查詢 ══ */}
      {tab==="combo"&&(
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <div style={{display:"flex",gap:8,marginBottom:20}}>
            <button style={s.subTabBtn(comboSubTab==="recommend")} onClick={()=>setComboSubTab("recommend")}>🔍 推薦配裝</button>
            <button style={s.subTabBtn(comboSubTab==="mycombo")} onClick={()=>setComboSubTab("mycombo")}>🏆 我的配裝</button>
          </div>

          {comboSubTab==="recommend"&&(
            <div>
              {/* 搜尋 */}
              <div style={{position:"relative",marginBottom:8}}>
                <input value={query} onChange={e=>{setQuery(e.target.value);setSelectedProduct(null);}} placeholder="輸入型號（CX-13）或名稱（龍王閃擊）..." style={s.input}/>
                {query&&<button onClick={()=>{setQuery("");setSelectedProduct(null);}} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:18}}>✕</button>}
              </div>
              {query.trim()&&searchResults.length===0&&!selectedProduct&&(
                <div style={{fontSize:12,color:"#f87171",padding:"10px 16px",marginBottom:8}}>找不到「{query}」，請確認型號或名稱</div>
              )}
              {searchResults.length>0&&!selectedProduct&&(
                <div style={{background:"#13131f",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,marginBottom:16,overflow:"hidden"}}>
                  {searchResults.map(p=>(
                    <div key={p.id} onClick={()=>{setSelectedProduct(p);setQuery(p.name);}}
                      style={{padding:"11px 18px",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}
                      onMouseEnter={e=>e.currentTarget.style.background="rgba(251,191,36,0.08)"}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <div><span style={{fontWeight:700}}>{p.name}</span><span style={{color:"#666",fontSize:12,marginLeft:8}}>{p.nameEn}</span><SeriesBadge series={p.series}/><OwnTag owned={ownedProducts.has(p.id)}/></div>
                      <span style={{fontSize:11,color:"#fbbf24",fontWeight:700}}>{p.code}</span>
                    </div>
                  ))}
                </div>
              )}
              {/* 系列篩選 */}
              <div style={{marginBottom:12,display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:10,color:"#555"}}>系列</span>
                {["ALL","BX","UX","CX"].map(s2=>(
                  <button key={s2} onClick={()=>setSeriesFilter(s2)} style={{padding:"3px 12px",borderRadius:99,fontSize:11,cursor:"pointer",fontWeight:700,background:seriesFilter===s2?"#fbbf24":"rgba(255,255,255,0.06)",color:seriesFilter===s2?"#000":"#888",border:seriesFilter===s2?"none":"1px solid rgba(255,255,255,0.1)"}}>{s2}</button>
                ))}
              </div>
              {/* 快速選擇 */}
              <div style={{marginBottom:24}}>
                <div onClick={()=>setShowQuickSelect(v=>!v)} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",marginBottom:showQuickSelect?12:0}}>
                  <span style={{fontSize:10,color:"#555",letterSpacing:1}}>快速選擇（{filteredProducts.length} 顆）</span>
                  <span style={{fontSize:12,color:"#555",transform:showQuickSelect?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s"}}>▼</span>
                </div>
                {showQuickSelect&&(
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    {filteredProducts.map(p=>(
                      <button key={p.id} onClick={()=>{setSelectedProduct(p);setQuery(p.name);}} style={{padding:"5px 12px",borderRadius:99,fontSize:12,cursor:"pointer",fontWeight:600,background:selectedProduct?.id===p.id?"#fbbf24":ownedProducts.has(p.id)?"rgba(34,197,94,0.12)":"rgba(255,255,255,0.06)",color:selectedProduct?.id===p.id?"#000":ownedProducts.has(p.id)?"#34d399":"#888",border:selectedProduct?.id===p.id?"none":`1px solid ${ownedProducts.has(p.id)?"rgba(34,197,94,0.3)":"rgba(255,255,255,0.1)"}`}}>
                        {p.name}<span style={{fontSize:9,opacity:0.6,marginLeft:4}}>{p.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* 推薦組合 */}
              {selectedProduct&&combos.length>0&&(
                <div>
                  <div style={{fontSize:13,color:"#fbbf24",fontWeight:700,marginBottom:10}}>{selectedProduct.name} 推薦組合<SeriesBadge series={selectedProduct.series}/></div>
                  <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <div onClick={()=>setUseOwnedOnly(v=>!v)} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"7px 14px",borderRadius:99,background:useOwnedOnly?"rgba(34,197,94,0.15)":"rgba(255,255,255,0.06)",border:`1px solid ${useOwnedOnly?"rgba(34,197,94,0.5)":"rgba(255,255,255,0.12)"}`}}>
                      <div style={{width:18,height:18,borderRadius:4,background:useOwnedOnly?"#34d399":"rgba(255,255,255,0.08)",border:`2px solid ${useOwnedOnly?"#34d399":"rgba(255,255,255,0.2)"}`,display:"flex",alignItems:"center",justifyContent:"center",color:"#000",fontWeight:900,fontSize:11}}>{useOwnedOnly?"✓":""}</div>
                      <span style={{fontSize:12,fontWeight:700,color:useOwnedOnly?"#34d399":"#888"}}>只用我現有的零件配</span>
                    </div>
                    <span style={{fontSize:11,color:"#555"}}>{useOwnedOnly?"只顯示你能馬上組出來的組合":"S → A → B → C · ✓已有 / ✕待收集"}</span>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(290px, 1fr))",gap:14}}>
                    {combos.map((c,i)=><ComboCard key={i} combo={c} index={i} wishlistParts={wishlistParts} toggleWishlist={toggleWishlist}/>)}
                  </div>
                  {wishlist.length>0&&(
                    <div style={{marginTop:24,background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:14,padding:18}}>
                      <div style={{fontSize:12,color:"#f87171",fontWeight:700,marginBottom:12}}>🎯 目標收集（S/A級缺少的零件）</div>
                      {wishlist.map((item,i)=><div key={i} style={{fontSize:12,color:"#ccc",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>· {item}</div>)}
                    </div>
                  )}
                  <div style={{marginTop:14,fontSize:10,color:"#444",textAlign:"center"}}>評級根據零件競技強度，不限於目前擁有的組合</div>
                </div>
              )}
              {!selectedProduct&&(
                <div style={{textAlign:"center",color:"#333",marginTop:48}}>
                  <div style={{fontSize:44,marginBottom:10}}>🌀</div>
                  <div style={{fontSize:13}}>搜尋或點選一顆陀螺開始查詢</div>
                </div>
              )}
            </div>
          )}

          {comboSubTab==="mycombo"&&(
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <span style={{fontSize:12,color:"#666"}}>共 {myCombos.length} 組配裝</span>
                <button onClick={()=>setShowAddCombo(v=>!v)} style={{padding:"7px 18px",borderRadius:99,fontSize:12,fontWeight:700,cursor:"pointer",background:showAddCombo?"rgba(255,255,255,0.1)":"#fbbf24",color:showAddCombo?"#aaa":"#000",border:"none"}}>
                  {showAddCombo?"✕ 取消":"＋ 新增配裝"}
                </button>
              </div>
              {showAddCombo&&(
                <div style={{background:"rgba(251,191,36,0.06)",border:"1px solid rgba(251,191,36,0.25)",borderRadius:14,padding:18,marginBottom:20}}>
                  <div style={{display:"flex",flexDirection:"column",gap:12}}>
                    <div>
                      <div style={{fontSize:10,color:"#666",marginBottom:4}}>配裝名稱</div>
                      <input value={newComboName} onChange={e=>setNewComboName(e.target.value)} placeholder="例如：攻擊主力、防守備用..." style={s.smallInput}/>
                    </div>
                    <SearchableField label="上層 刀片" selectedId={newComboBladeId} setId={setNewComboBladeId} search={bladeSearch} setSearch={setBladeSearch}
                      options={[...new Map(ALL_PRODUCTS.map(p=>[p.blade.id,p])).values()]}
                      getName={p=>p.blade?.name||""} getId={p=>p.blade?.id||""} placeholder="搜尋刀片名稱..."/>
                    <div style={{position:"relative"}}>
                      <div style={{fontSize:10,color:"#666",marginBottom:4}}>中層 棘輪</div>
                      {ALL_PRODUCTS.find(p=>p.blade.id===newComboBladeId)?.blade.integratedRatchet?(
                        <div style={{padding:"8px 14px",borderRadius:10,background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.3)",fontSize:12,color:"#f59e0b"}}>⚠ 棘輪內建於刀片，無法替換</div>
                      ):ALL_PRODUCTS.find(p=>p.ratchet.id===newComboRatchetId)?.ratchet.integrated?(
                        <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderRadius:10,background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.3)"}}>
                          <span style={{flex:1,fontSize:13,color:"#fff"}}>Turbo（Tr）</span>
                          <button onClick={()=>{setNewComboRatchetId("");setRatchetSearch("");setNewComboBitId("");}} style={{background:"none",border:"none",color:"#f87171",cursor:"pointer",fontSize:14}}>✕</button>
                        </div>
                      ):newComboRatchetId?(
                        <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px",borderRadius:10,background:"rgba(34,197,94,0.08)",border:"1px solid rgba(34,197,94,0.3)"}}>
                          <span style={{flex:1,fontSize:13,color:"#fff"}}>{ALL_PRODUCTS.find(p=>p.ratchet.id===newComboRatchetId)?.ratchet.name}</span>
                          <button onClick={()=>{setNewComboRatchetId("");setRatchetSearch("");}} style={{background:"none",border:"none",color:"#f87171",cursor:"pointer",fontSize:14}}>✕</button>
                        </div>
                      ):(
                        <div style={{position:"relative"}}>
                          <input value={ratchetSearch} onChange={e=>setRatchetSearch(e.target.value)} placeholder="搜尋棘輪型號..." style={s.smallInput}/>
                          {ratchetSearch&&(
                            <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#13131f",border:"1px solid rgba(255,255,255,0.15)",borderRadius:10,maxHeight:160,overflowY:"auto",zIndex:10}}>
                              {[...new Map(ALL_PRODUCTS.map(p=>[p.ratchet.id,p])).values()]
                                .filter(p=>{const n=(p.ratchet.integrated?"Turbo（Tr）":p.ratchet.name).toLowerCase();return n.includes(ratchetSearch.toLowerCase())||p.name.toLowerCase().includes(ratchetSearch.toLowerCase())||p.code.toLowerCase().includes(ratchetSearch.toLowerCase());})
                                .map(p=>(
                                  <div key={p.ratchet.id} onClick={()=>{setNewComboRatchetId(p.ratchet.id);setRatchetSearch("");if(p.ratchet.integrated)setNewComboBitId("turbo-bit");}}
                                    style={{padding:"8px 14px",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.06)",fontSize:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}
                                    onMouseEnter={e=>e.currentTarget.style.background="rgba(251,191,36,0.1)"}
                                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                                    <span style={{color:"#fff"}}>{p.ratchet.integrated?"Turbo（Tr）":p.ratchet.name}{p.ratchet.integrated&&<span style={{fontSize:10,color:"#f59e0b",marginLeft:6}}>⚠一體式</span>}</span>
                                    <span style={{color:"#555",fontSize:10}}>{p.code} {p.name}</span>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <div style={{fontSize:10,color:"#666",marginBottom:4}}>底層 軸心</div>
                      {ALL_PRODUCTS.find(p=>p.ratchet.id===newComboRatchetId)?.ratchet.integrated&&!ALL_PRODUCTS.find(p=>p.blade.id===newComboBladeId)?.blade.integratedRatchet?(
                        <div style={{padding:"8px 14px",borderRadius:10,background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.3)",fontSize:12,color:"#f59e0b"}}>⚠ Turbo 一體式，軸心已自動帶入</div>
                      ):(
                        <SearchableField label="" selectedId={newComboBitId} setId={setNewComboBitId} search={bitSearch} setSearch={setBitSearch}
                          options={[...new Map(ALL_PRODUCTS.filter(p=>!p.bit.integrated).map(p=>[p.bit.id,p])).values()]}
                          getName={p=>p.bit?.name||""} getId={p=>p.bit?.id||""} placeholder="搜尋軸心..."/>
                      )}
                    </div>
                    <button onClick={saveMyCombo} disabled={!newComboName.trim()||!newComboBladeId} style={{padding:"10px",borderRadius:10,fontWeight:700,fontSize:13,cursor:"pointer",background:(!newComboName.trim()||!newComboBladeId)?"rgba(255,255,255,0.1)":"#fbbf24",color:(!newComboName.trim()||!newComboBladeId)?"#555":"#000",border:"none"}}>儲存配裝</button>
                  </div>
                </div>
              )}
              {myCombos.length===0&&!showAddCombo?(
                <div style={{textAlign:"center",color:"#444",padding:"32px 0",fontSize:12}}>還沒有儲存的配裝，點＋新增</div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  {myCombos.map(combo=>(
                    <div key={combo.id} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:16}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <span style={{fontSize:15,fontWeight:800,color:"#fbbf24"}}>{combo.name}</span>
                        <button onClick={()=>deleteMyCombo(combo.id)} style={{background:"none",border:"none",color:"#f87171",cursor:"pointer",fontSize:18}}>✕</button>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:6}}>
                        {[{layer:"上層",name:combo.blade.name,code:combo.blade.code},{layer:"中層",name:combo.ratchet.name,code:combo.ratchet.code},{layer:"底層",name:combo.bit.name,code:combo.bit.code}].map(row=>(
                          <div key={row.layer} style={{display:"flex",alignItems:"center",gap:8}}>
                            <span style={{fontSize:10,color:"#555",width:32,flexShrink:0}}>{row.layer}</span>
                            <span style={{fontSize:12,fontWeight:600,color:"#fff"}}>{row.name}</span>
                            {row.code&&<span style={{fontSize:10,color:"#555"}}>（{row.code}）</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══ 零件查詢 ══ */}
      {tab==="parts"&&(
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <div style={{display:"flex",gap:8,marginBottom:20}}>
            <button style={s.subTabBtn(partSubTab==="search")} onClick={()=>setPartSubTab("search")}>🔍 搜尋零件</button>
            <button style={s.subTabBtn(partSubTab==="wishlist")} onClick={()=>setPartSubTab("wishlist")}>{`🎯 目標零件${wishlistParts.size>0?" ("+wishlistParts.size+")":""}`}</button>
          </div>

          {partSubTab==="search"&&(
            <div>
              <div style={{position:"relative",marginBottom:16}}>
                <input value={partQuery} onChange={e=>setPartQuery(e.target.value)} placeholder="輸入零件名稱（1-50、Low Rush、Flat...）" style={s.input}/>
                {partQuery&&<button onClick={()=>setPartQuery("")} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:18}}>✕</button>}
              </div>
              <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
                {[["ALL","全部"],["上層 刀片","🗡️ 刀片"],["中層 棘輪","⚙️ 固鎖"],["底層 Bit","🔵 軸心"],["鎖定紋章","🔰 紋章"],["鋼鐵戰刃","⚔️ 主刃"],["輔助戰刃","🛡️ 輔刃"]].map(([val,label])=>(
                  <button key={val} onClick={()=>setPartLayerFilter(val)} style={{padding:"5px 14px",borderRadius:99,fontSize:12,cursor:"pointer",fontWeight:700,background:partLayerFilter===val?"#fbbf24":"rgba(255,255,255,0.07)",color:partLayerFilter===val?"#000":"#aaa",border:partLayerFilter===val?"none":"1px solid rgba(255,255,255,0.12)"}}>{label}</button>
                ))}
              </div>
              {(()=>{
                if(!partQuery.trim()&&partLayerFilter==="ALL") return (
                  <div style={{textAlign:"center",color:"#333",marginTop:40}}>
                    <div style={{fontSize:40,marginBottom:10}}>🔍</div>
                    <div style={{fontSize:13}}>選擇類型或輸入名稱查詢</div>
                  </div>
                );
                const q=partQuery.toLowerCase();
                const results=[];
                ALL_PRODUCTS.forEach(p=>{
                  const isCXp=p.series==="CX";
                  const layers=[
                    {layer:"上層 刀片",name:p.blade.name,nameEn:p.blade.nameEn||"",type:p.blade.type,desc:null,integrated:false},
                    {layer:"中層 棘輪",name:(p.ratchet.integrated&&p.id==="CX-07")?"Turbo（Tr）":p.ratchet.name,nameEn:"",type:null,desc:null,integrated:!!p.ratchet.integrated},
                    {layer:"底層 Bit",name:(p.bit.integrated&&p.id==="CX-07")?"Turbo（Tr）":p.bit.name,nameEn:"",type:p.bit.type,desc:p.bit.desc,integrated:!!p.bit.integrated},
                    ...(isCXp&&p.lockChip?[{layer:"鎖定紋章",name:p.lockChip.name,nameEn:"",type:null,desc:"CX 鎖定芯",integrated:false}]:[]),
                    ...(isCXp&&p.mainBlade?[{layer:"鋼鐵戰刃",name:p.mainBlade.name,nameEn:"",type:null,desc:"CX 主刀片",integrated:false}]:[]),
                    ...(isCXp&&p.assistBlade?[{layer:"輔助戰刃",name:p.assistBlade.name,nameEn:"",type:null,desc:"CX 輔助刀片",integrated:false}]:[]),
                  ];
                  const seen=new Set();
                  layers.forEach(layer=>{
                    const key=`${p.id}-${layer.layer}`;
                    if(seen.has(key)) return;
                    if(partLayerFilter!=="ALL"&&layer.layer!==partLayerFilter) return;
                    if(q){
                      const nm=layer.name.toLowerCase().includes(q);
                      const em=layer.nameEn&&layer.nameEn.toLowerCase().includes(q);
                      const isAbbrSearch=q.length<=3;
                      const am=isAbbrSearch&&layer.name.match(/（([^）]+)）/)?.[1]?.toLowerCase()===q;
                      if(!nm&&!em&&!am) return;
                    }
                    seen.add(key);
                    results.push({product:p,...layer});
                  });
                });
                if(results.length===0) return <div style={{textAlign:"center",color:"#555",padding:32}}><div style={{fontSize:13}}>找不到「{partQuery}」相關零件</div></div>;
                return (
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    <div style={{fontSize:11,color:"#666",marginBottom:4}}>找到 {results.length} 個結果</div>
                    {results.map((r,i)=>{
                      const owned=ownedProducts.has(r.product.id);
                      const rTier=r.layer==="中層 棘輪"?RATCHET_TIER[r.name]:null;
                      const bTier=r.layer==="底層 Bit"?BIT_TIER[r.name.match(/（([^）]+)）/)?.[1]||""]||null:null;
                      return (
                        <div key={i} style={{background:owned?"rgba(34,197,94,0.07)":"rgba(255,255,255,0.04)",border:`1px solid ${owned?"rgba(34,197,94,0.3)":"rgba(255,255,255,0.09)"}`,borderRadius:14,padding:"14px 18px"}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                            <span style={{fontSize:10,color:"#555",background:"rgba(255,255,255,0.07)",padding:"2px 8px",borderRadius:6}}>{r.layer}</span>
                            <span style={{fontSize:15,fontWeight:700,color:"#fff"}}>{r.name}</span>
                            {(rTier||bTier)&&<TierBadge tier={rTier||bTier}/>}
                            {r.integrated&&<span style={{fontSize:10,color:"#f59e0b"}}>⚠ 一體式</span>}
                          </div>
                          {r.desc&&<div style={{fontSize:11,color:"#888",marginBottom:8}}>{r.desc}</div>}
                          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                            <span style={{fontSize:12,color:"#aaa"}}>來自</span>
                            <span style={{fontSize:13,fontWeight:700,color:"#fbbf24"}}>{r.product.name}</span>
                            <span style={{fontSize:11,color:"#555"}}>{r.product.nameEn}</span>
                            <span style={{fontSize:11,color:"#fbbf24",fontWeight:700,background:"rgba(251,191,36,0.1)",padding:"2px 8px",borderRadius:6}}>{r.product.code}</span>
                            <SeriesBadge series={r.product.series}/>
                            <OwnTag owned={owned}/>
                          </div>
                          <div style={{marginTop:8}}>
                            {(()=>{
                              const wKey=JSON.stringify({layer:r.layer,name:r.name});
                              const inWishlist=wishlistParts.has(wKey);
                              return (
                                <div onClick={()=>toggleWishlist(wKey)} style={{display:"inline-flex",alignItems:"center",gap:6,cursor:"pointer",padding:"5px 12px",borderRadius:99,background:inWishlist?"rgba(251,191,36,0.15)":"rgba(255,255,255,0.06)",border:`1px solid ${inWishlist?"rgba(251,191,36,0.5)":"rgba(255,255,255,0.12)"}`}}>
                                  <div style={{width:14,height:14,borderRadius:3,background:inWishlist?"#fbbf24":"rgba(255,255,255,0.08)",border:`2px solid ${inWishlist?"#fbbf24":"rgba(255,255,255,0.2)"}`,display:"flex",alignItems:"center",justifyContent:"center",color:"#000",fontWeight:900,fontSize:9}}>{inWishlist?"✓":""}</div>
                                  <span style={{fontSize:11,fontWeight:700,color:inWishlist?"#fbbf24":"#888"}}>{inWishlist?"✓ 已加入目標清單":"＋ 加入目標清單"}</span>
                                </div>
                              );
                            })()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {partSubTab==="wishlist"&&(
            <div>
              {wishlistParts.size===0?(
                <div style={{textAlign:"center",color:"#333",marginTop:48}}>
                  <div style={{fontSize:44,marginBottom:10}}>🎯</div>
                  <div style={{fontSize:13}}>還沒有目標零件</div>
                  <div style={{fontSize:11,color:"#444",marginTop:8}}>去搜尋零件頁面打勾加入</div>
                </div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:11,color:"#666"}}>共 {wishlistParts.size} 個目標零件</span>
                    <button onClick={()=>{setWishlistParts(new Set());try{localStorage.removeItem("beyblade-wishlist");}catch{}}} style={{fontSize:11,color:"#f87171",background:"none",border:"1px solid rgba(248,113,113,0.3)",padding:"3px 10px",borderRadius:99,cursor:"pointer"}}>清空清單</button>
                  </div>
                  {[...wishlistParts].map((wKey,i)=>{
                    let layer="",name="";
                    try{const d=JSON.parse(wKey);layer=d.layer;name=d.name;}catch{}
                    const sources=ALL_PRODUCTS.filter(p=>{
                      if(layer==="上層 刀片") return p.blade.name===name;
                      if(layer==="中層 棘輪") return !p.ratchet.integrated&&p.ratchet.name===name;
                      if(layer==="底層 Bit") return !p.bit.integrated&&p.bit.name===name;
                      return false;
                    });
                    return (
                      <div key={i} style={{background:"rgba(251,191,36,0.05)",border:"1px solid rgba(251,191,36,0.25)",borderRadius:14,padding:"16px 18px"}}>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                            <span style={{fontSize:10,color:"#f59e0b",background:"rgba(245,158,11,0.12)",padding:"1px 6px",borderRadius:4}}>{layer}</span>
                            <span style={{fontSize:16,fontWeight:800,color:"#fff"}}>{name}</span>
                          </div>
                          <button onClick={()=>toggleWishlist(wKey)} style={{background:"none",border:"none",color:"#f87171",cursor:"pointer",fontSize:18}}>✕</button>
                        </div>
                        <div style={{fontSize:11,color:"#666",marginBottom:8,fontWeight:700,letterSpacing:1}}>可從以下陀螺獲得：</div>
                        <div style={{display:"flex",flexDirection:"column",gap:6}}>
                          {sources.length===0?<div style={{fontSize:11,color:"#444"}}>查無資料</div>:sources.map((p,j)=>(
                            <div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",background:"rgba(255,255,255,0.05)",borderRadius:8}}>
                              <span style={{fontSize:13,fontWeight:700,color:"#fbbf24"}}>{p.name}</span>
                              <span style={{fontSize:11,color:"#555"}}>（{p.code}）</span>
                              <SeriesBadge series={p.series}/>
                              {ownedProducts.has(p.id)&&<span style={{fontSize:10,color:"#34d399",fontWeight:700}}>✓ 已有</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══ 等級表 ══ */}
      {tab==="tier"&&(
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <div style={{fontSize:11,color:"#666",marginBottom:20,textAlign:"center"}}>資料來源：@RENLIgames</div>
          {[{title:"⚔️ 刀片 Blade Tier",url:"/IMG_2187_4K.jpg"},{title:"⚙️ 棘輪 Ratchet Tier",url:"/IMG_2188_4K.jpg"},{title:"🔵 軸心 Bit Tier",url:"/IMG_2189_4K.jpg"}].map((img,i)=>(
            <div key={i} style={{marginBottom:24}}>
              <div style={{fontSize:13,fontWeight:700,color:"#fbbf24",marginBottom:10}}>{img.title}</div>
              <img src={img.url} alt={img.title} style={{width:"100%",height:"auto",borderRadius:12,border:"1px solid rgba(255,255,255,0.1)"}}/>
            </div>
          ))}
        </div>
      )}


      {/* ══ 陀螺查詢 ══ */}
      {tab==="inventory"&&(
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <div style={{fontSize:12,color:"#666",marginBottom:16,textAlign:"center"}}>勾選你擁有的陀螺</div>
          <div style={{position:"relative",marginBottom:16}}>
            <input value={inventoryQuery} onChange={e=>setInventoryQuery(e.target.value)} placeholder="搜尋陀螺名稱或型號..." style={s.input}/>
            {inventoryQuery&&<button onClick={()=>setInventoryQuery("")} style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:18}}>✕</button>}
          </div>
          <div style={{marginBottom:12,display:"flex",gap:8,alignItems:"center",justifyContent:"center",flexWrap:"wrap"}}>
            {["ALL","BX","UX","CX"].map(s2=>(
              <button key={s2} onClick={()=>setSeriesFilter(s2)} style={{padding:"4px 14px",borderRadius:99,fontSize:12,cursor:"pointer",fontWeight:700,background:seriesFilter===s2?"#fbbf24":"rgba(255,255,255,0.06)",color:seriesFilter===s2?"#000":"#888",border:seriesFilter===s2?"none":"1px solid rgba(255,255,255,0.1)"}}>{s2}</button>
            ))}
            <div onClick={()=>setShowOwnedOnly(v=>!v)} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer",padding:"4px 12px",borderRadius:99,background:showOwnedOnly?"rgba(34,197,94,0.15)":"rgba(255,255,255,0.06)",border:`1px solid ${showOwnedOnly?"rgba(34,197,94,0.4)":"rgba(255,255,255,0.1)"}`}}>
              <div style={{width:14,height:14,borderRadius:3,background:showOwnedOnly?"#34d399":"rgba(255,255,255,0.1)",border:`2px solid ${showOwnedOnly?"#34d399":"rgba(255,255,255,0.2)"}`,display:"flex",alignItems:"center",justifyContent:"center",color:"#000",fontWeight:900,fontSize:9}}>{showOwnedOnly?"✓":""}</div>
              <span style={{fontSize:11,fontWeight:700,color:showOwnedOnly?"#34d399":"#888"}}>只顯示我的陀螺</span>
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:28}}>
            {inventoryFiltered.map(p=>{
              const owned=ownedProducts.has(p.id);
              const isCX=p.series==="CX";
              return (
                <div key={p.id} style={{display:"flex",alignItems:"flex-start",gap:14,padding:"14px 18px",borderRadius:14,background:owned?"rgba(34,197,94,0.07)":"rgba(255,255,255,0.04)",border:`1px solid ${owned?"rgba(34,197,94,0.3)":"rgba(255,255,255,0.09)"}`}}>
                  <div onClick={()=>toggleOwned(p.id)} style={{width:22,height:22,borderRadius:6,flexShrink:0,marginTop:2,cursor:"pointer",background:owned?"#34d399":"rgba(255,255,255,0.08)",border:`2px solid ${owned?"#34d399":"rgba(255,255,255,0.2)"}`,display:"flex",alignItems:"center",justifyContent:"center",color:"#000",fontWeight:900,fontSize:13}}>{owned?"✓":""}</div>
                  <div style={{flex:1,cursor:"pointer"}} onClick={()=>{setSelectedProduct(p);setTab("combo");setQuery(p.name);}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                      <span style={{fontWeight:700,fontSize:15,color:owned?"#fff":"#aaa"}}>{p.name}</span>
                      <span style={{fontSize:11,color:"#fbbf24",fontWeight:700}}>{p.code}</span>
                      <SeriesBadge series={p.series}/>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:4}}>
                      {(isCX?[
                        {layer:"鎖定芯",name:p.lockChip?.name||"-",color:"#c084fc"},
                        ...(p.expandBlade?[{layer:"覆蓋刀片",name:p.overBlade?.name||"-",color:"#f472b6"},{layer:"金屬刀片",name:p.mainBlade?.name||"-",color:"#f472b6"}]:[{layer:"主刀片",name:p.mainBlade?.name||"-",color:"#f472b6"}]),
                        {layer:"輔助刀片",name:p.assistBlade?.name||"-",color:"#f472b6"},
                        {layer:"棘輪",name:p.ratchet.integrated?"Turbo（Tr）":p.ratchet.name,color:p.ratchet.integrated?"#f59e0b":null},
                        {layer:"底層 Bit",name:p.bit.integrated?"Turbo（Tr）":p.bit.name,color:p.bit.integrated?"#f59e0b":null},
                      ]:[
                        {layer:"上層 刀片",name:p.blade.name,color:null},
                        {layer:"中層 棘輪",name:p.ratchet.integrated?"（內建）":p.ratchet.name,color:p.ratchet.integrated?"#f59e0b":null},
                        {layer:"底層 Bit",name:p.bit.integrated?"Turbo（Tr）":p.bit.name,color:p.bit.integrated?"#f59e0b":null},
                      ]).map(row=>(
                        <div key={row.layer} style={{display:"flex",alignItems:"flex-start",gap:8}}>
                          <span style={{fontSize:10,color:"#555",width:64,flexShrink:0,paddingTop:2}}>{row.layer}</span>
                          <span style={{fontSize:12,color:row.color||(owned?"#ccc":"#666")}}>{row.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* 擁有零件彙整 */}
          <div style={{background:"rgba(251,191,36,0.05)",border:"1px solid rgba(251,191,36,0.15)",borderRadius:14,padding:18}}>
            <div style={{fontSize:12,color:"#fbbf24",fontWeight:700,marginBottom:14}}>📋 目前擁有的可替換零件</div>
            {[{label:"上層 刀片",parts:blades.filter(b=>ownedPartIds.has(b.id))},{label:"中層 棘輪",parts:ratchets.filter(r=>ownedPartIds.has(r.id))},{label:"底層 Bit",parts:bits.filter(b=>ownedPartIds.has(b.id))}].map(sec=>(
              <div key={sec.label} style={{marginBottom:14}}>
                <div style={{fontSize:10,color:"#888",fontWeight:700,letterSpacing:1,marginBottom:6}}>{sec.label}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {sec.parts.length===0?<span style={{fontSize:11,color:"#444"}}>（無）</span>:sec.parts.map(part=>(
                    <div key={part.id} style={{fontSize:11,color:"#ccc",background:"rgba(255,255,255,0.07)",padding:"4px 10px",borderRadius:8}}>{part.name}<span style={{color:"#555",marginLeft:6}}>({part.sourceCode})</span></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ 我的陀螺 ══ */}
      {tab==="myinventory"&&(
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <div style={{fontSize:12,color:"#666",marginBottom:16,textAlign:"center"}}>點名稱可跳到配裝查詢</div>
          {ALL_PRODUCTS.filter(p=>ownedProducts.has(p.id)).length===0?(
            <div style={{textAlign:"center",color:"#333",marginTop:48}}>
              <div style={{fontSize:44,marginBottom:10}}>🐉</div>
              <div style={{fontSize:13}}>還沒有勾選陀螺</div>
              <div style={{fontSize:11,color:"#444",marginTop:8}}>去陀螺查詢頁勾選你擁有的陀螺</div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {sortProducts(ALL_PRODUCTS.filter(p=>ownedProducts.has(p.id))).map(p=>(
                <div key={p.id} style={{background:"rgba(34,197,94,0.07)",border:"1px solid rgba(34,197,94,0.3)",borderRadius:14,padding:"14px 18px",display:"flex",alignItems:"flex-start",gap:14}}>
                  <div onClick={()=>toggleOwned(p.id)} style={{width:22,height:22,borderRadius:6,flexShrink:0,marginTop:2,cursor:"pointer",background:"#34d399",border:"2px solid #34d399",display:"flex",alignItems:"center",justifyContent:"center",color:"#000",fontWeight:900,fontSize:13}}>✓</div>
                  <div style={{flex:1,cursor:"pointer"}} onClick={()=>{setSelectedProduct(p);setTab("combo");setQuery(p.name);}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                      <span style={{fontWeight:700,fontSize:15,color:"#fff"}}>{p.name}</span>
                      <span style={{fontSize:11,color:"#fbbf24",fontWeight:700}}>{p.code}</span>
                      <SeriesBadge series={p.series}/>
                    </div>
                    <div style={{display:"flex",gap:8}}>
                      <span style={{fontSize:11,color:"#888"}}>{p.blade.name}</span>
                      <span style={{color:"#555"}}>·</span>
                      <span style={{fontSize:11,color:"#888"}}>{p.ratchet.integrated?"Turbo":p.ratchet.name}</span>
                      <span style={{color:"#555"}}>·</span>
                      <span style={{fontSize:11,color:"#888"}}>{p.bit.integrated?"Turbo":p.bit.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
