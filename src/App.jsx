import { useState, useMemo, useCallback } from "react";


// ── Tier 資料（來源：@RENLIgames）──────────────────────────
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
  diskball3:"D",highneedle:"HN",
  ignition:"I",ignition2:"I",gearpoint:"GP",zap:"Z",transpoint:"TP",wallwedge:"WW",accel:"A",accel2:"A",cyclone:"C",
  vortex:"V",vortex2:"V",hightaper:"HT",highTaper:"HT",gearball3:"GB",gearVortex:"V",glide:"G",gearflat6:"GF",spike:"S",spike2:"S",
  needle:"N",needle2:"N",needle3:"N",gearneedle:"GN",merge:"M",metalneedle:"MN",metalneedle2:"MN",boundspike:"BS",boundspike2:"BS",needlerush:"RA",diskball4:"Q",
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

function TierBadge({tier}){
  if(!tier) return null;
  const c=TIER_COLOR[tier]||TIER_COLOR.E;
  return(
    <span style={{fontSize:10,fontWeight:900,padding:"1px 6px",borderRadius:4,
      background:c.bg,color:c.color,border:`1px solid ${c.border}`,marginLeft:4}}>
      {tier}
    </span>
  );
}

// ── 完整資料庫 BX / UX / CX ──────────────────────────────
const ALL_PRODUCTS = [
  // ── BX Basic Line ──
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
  { id:"BX-05", name:"魔導幻箭（加強版）", nameEn:"WizardArrow Booster", code:"BX-05", series:"BX",
    blade:{id:"wizardarrow2",name:"魔導幻箭",nameEn:"WizardArrow",type:"balance"},
    ratchet:{id:"4-80b",name:"4-80",protrusions:4,height:80},
    bit:{id:"ball2",name:"Ball（B）",type:"balance",desc:"球形底，平衡型"} },
  { id:"BX-06", name:"騎士重盾（加強版）", nameEn:"KnightShield Booster", code:"BX-06", series:"BX",
    blade:{id:"knightshield2",name:"騎士重盾",nameEn:"KnightShield",type:"defense"},
    ratchet:{id:"3-80b",name:"3-80",protrusions:3,height:80},
    bit:{id:"needle2",name:"Needle（N）",type:"defense",desc:"針形底，防守定點型"} },
  { id:"BX-07", name:"起跑衝刺組", nameEn:"Start Dash Set", code:"BX-07", series:"BX",
    blade:{id:"dransword2",name:"蒼龍神劍",nameEn:"DranSword",type:"attack"},
    ratchet:{id:"3-60b",name:"3-60",protrusions:3,height:60},
    bit:{id:"flat2",name:"Flat（F）",type:"attack",desc:"平面底，激進移動"} },
  { id:"BX-08", name:"3對3 對戰套組", nameEn:"3on3 Deck Set", code:"BX-08", series:"BX",
    blade:{id:"dransword3",name:"蒼龍神劍",nameEn:"DranSword",type:"attack"},
    ratchet:{id:"3-60c",name:"3-60",protrusions:3,height:60},
    bit:{id:"flat3",name:"Flat（F）",type:"attack",desc:"平面底，激進移動"} },
  { id:"BX-09", name:"通行證組合", nameEn:"Bey Battle Pass", code:"BX-09", series:"BX",
    blade:{id:"dransword4",name:"蒼龍神劍",nameEn:"DranSword",type:"attack"},
    ratchet:{id:"3-60d",name:"3-60",protrusions:3,height:60},
    bit:{id:"flat4",name:"Flat（F）",type:"attack",desc:"平面底，激進移動"} },
  { id:"BX-10", name:"隨機包Vol.1", nameEn:"Random Booster Vol.1", code:"BX-10", series:"BX",
    blade:{id:"hellosscythe2",name:"惡魔紅鐮",nameEn:"HellsScythe",type:"attack"},
    ratchet:{id:"4-60b",name:"4-60",protrusions:4,height:60},
    bit:{id:"taper2",name:"Taper（T）",type:"stamina",desc:"錐形底，旋轉耐久型"} },
  { id:"BX-11", name:"對戰收納盒A", nameEn:"Beybattle Deck Case A", code:"BX-11", series:"BX",
    blade:{id:"dransword5",name:"蒼龍神劍",nameEn:"DranSword",type:"attack"},
    ratchet:{id:"3-60e",name:"3-60",protrusions:3,height:60},
    bit:{id:"flat5",name:"Flat（F）",type:"attack",desc:"平面底，激進移動"} },
  { id:"BX-12", name:"對戰收納盒B", nameEn:"Beybattle Deck Case B", code:"BX-12", series:"BX",
    blade:{id:"knightshield3",name:"騎士重盾",nameEn:"KnightShield",type:"defense"},
    ratchet:{id:"3-80c",name:"3-80",protrusions:3,height:80},
    bit:{id:"needle3",name:"Needle（N）",type:"defense",desc:"針形底，防守定點型"} },
  { id:"BX-13", name:"騎士長槍", nameEn:"KnightLance", code:"BX-13", series:"BX",
    blade:{id:"knightlance",name:"騎士長槍",nameEn:"KnightLance",type:"defense"},
    ratchet:{id:"4-80",name:"4-80",protrusions:4,height:80},
    bit:{id:"highneedle",name:"High Needle（HN）",type:"defense",desc:"高針形底，高重心防守"} },
  { id:"BX-14", name:"隨機包Vol.2", nameEn:"Random Booster Vol.2", code:"BX-14", series:"BX",
    blade:{id:"wizardarrow3",name:"魔導幻箭",nameEn:"WizardArrow",type:"balance"},
    ratchet:{id:"5-80b",name:"5-80",protrusions:5,height:80},
    bit:{id:"highball",name:"High Ball（HB）",type:"balance",desc:"高球形底，高重心平衡"} },
  { id:"BX-15", name:"雄獅獵爪", nameEn:"LeonClaw", code:"BX-15", series:"BX",
    blade:{id:"leonclaw",name:"雄獅獵爪",nameEn:"LeonClaw",type:"attack"},
    ratchet:{id:"5-60",name:"5-60",protrusions:5,height:60},
    bit:{id:"point",name:"Point（P）",type:"stamina",desc:"點形底，穩定耐久"} },
  { id:"BX-16", name:"戰鬥盤組合", nameEn:"Beystadium Set", code:"BX-16", series:"BX",
    blade:{id:"dransword6",name:"蒼龍神劍",nameEn:"DranSword",type:"attack"},
    ratchet:{id:"3-60f",name:"3-60",protrusions:3,height:60},
    bit:{id:"flat6",name:"Flat（F）",type:"attack",desc:"平面底，激進移動"} },
  { id:"BX-17", name:"隨機包Vol.3 精裝版", nameEn:"Ultimate Deck Set", code:"BX-17", series:"BX",
    blade:{id:"leonclaw2",name:"雄獅獵爪",nameEn:"LeonClaw",type:"attack"},
    ratchet:{id:"5-60b",name:"5-60",protrusions:5,height:60},
    bit:{id:"point2",name:"Point（P）",type:"stamina",desc:"點形底，穩定耐久"} },
  { id:"BX-18", name:"雙入門組", nameEn:"2-Pack Starter Set", code:"BX-18", series:"BX",
    blade:{id:"hellsscythe3",name:"惡魔紅鐮",nameEn:"HellsScythe",type:"attack"},
    ratchet:{id:"4-60c",name:"4-60",protrusions:4,height:60},
    bit:{id:"taper3",name:"Taper（T）",type:"stamina",desc:"錐形底，旋轉耐久型"} },
  { id:"BX-19", name:"戰犀獸角", nameEn:"RhinoHorn", code:"BX-19", series:"BX",
    blade:{id:"rhinohorn",name:"戰犀獸角",nameEn:"RhinoHorn",type:"defense"},
    ratchet:{id:"3-80",name:"3-80",protrusions:3,height:80},
    bit:{id:"spike",name:"Spike（S）",type:"stamina",desc:"尖刺底，耐久穩定"} },
  { id:"BX-20", name:"蒼龍利刃", nameEn:"DranDagger Deck Set", code:"BX-20", series:"BX",
    blade:{id:"drandagger",name:"蒼龍利刃",nameEn:"DranDagger",type:"attack"},
    ratchet:{id:"4-60",name:"4-60",protrusions:4,height:60},
    bit:{id:"rush",name:"Rush（R）",type:"attack",desc:"平面底，高頻X-Dash攻擊"} },
  { id:"BX-21", name:"惡魔鎖鏈", nameEn:"HellsChain Deck Set", code:"BX-21", series:"BX",
    blade:{id:"hellschain",name:"惡魔鎖鏈",nameEn:"HellsChain",type:"attack"},
    ratchet:{id:"4-60",name:"4-60",protrusions:4,height:60},
    bit:{id:"hightaper",name:"High Taper（HT）",type:"stamina",desc:"高錐形底，高重心耐久"} },
  { id:"BX-22", name:"隨機包Vol.4", nameEn:"Random Booster Vol.4", code:"BX-22", series:"BX",
    blade:{id:"wizardrod2",name:"魔導神杖",nameEn:"WizardRod",type:"stamina"},
    ratchet:{id:"1-60b",name:"1-60",protrusions:1,height:60},
    bit:{id:"rush3",name:"Rush（R）",type:"attack",desc:"平面底，高頻X-Dash攻擊"} },
  { id:"BX-23", name:"鳳凰飛翼", nameEn:"PhoenixWing", code:"BX-23", series:"BX",
    blade:{id:"phoenixwing",name:"鳳凰飛翼",nameEn:"PhoenixWing",type:"attack"},
    ratchet:{id:"9-60",name:"9-60",protrusions:9,height:60},
    bit:{id:"gearflat",name:"Gear Flat（GF）",type:"attack",desc:"齒輪平面底，更快X-Dash"} },
  { id:"BX-24", name:"暴龍咆哮", nameEn:"TyraNnoRoar", code:"BX-24", series:"BX",
    blade:{id:"tyrannoroar",name:"暴龍咆哮",nameEn:"TyraNnoRoar",type:"attack"},
    ratchet:{id:"5-60c",name:"5-60",protrusions:5,height:60},
    bit:{id:"gearflat2",name:"Gear Flat（GF）",type:"attack",desc:"齒輪平面底，更快X-Dash"} },
  { id:"BX-25", name:"隨機包Vol.5", nameEn:"Random Booster Vol.5", code:"BX-25", series:"BX",
    blade:{id:"cobaltdrake2",name:"蒼穹龍騎士",nameEn:"CobaltDrake",type:"attack"},
    ratchet:{id:"9-60b",name:"9-60",protrusions:9,height:60},
    bit:{id:"lowrush2",name:"Low Rush（LR）",type:"attack",desc:"低版Rush，更低重心強衝擊"} },
  { id:"BX-26", name:"獨角獸刺心", nameEn:"UnicornSting", code:"BX-26", series:"BX",
    blade:{id:"unicornsting",name:"獨角獸刺心",nameEn:"UnicornSting",type:"balance"},
    ratchet:{id:"5-60",name:"5-60",protrusions:5,height:60},
    bit:{id:"gearpoint",name:"Gear Point（GP）",type:"stamina",desc:"齒輪點形底，穩定耐久"} },
  { id:"BX-27", name:"鬼火魔輪（隨機包Vol.6）", nameEn:"OrochiCluster", code:"BX-27", series:"BX",
    blade:{id:"orochicluster",name:"鬼火魔輪",nameEn:"OrochiCluster",type:"stamina"},
    ratchet:{id:"6-60b",name:"6-60",protrusions:6,height:60},
    bit:{id:"lowflat",name:"Low Flat（LF）",type:"attack",desc:"低平面底，低重心攻擊"} },
  { id:"BX-28", name:"對戰雙入門組B", nameEn:"2-Pack Starter Set B", code:"BX-28", series:"BX",
    blade:{id:"phoenixwing2",name:"鳳凰飛翼",nameEn:"PhoenixWing",type:"attack"},
    ratchet:{id:"9-60c",name:"9-60",protrusions:9,height:60},
    bit:{id:"gearflat3",name:"Gear Flat（GF）",type:"attack",desc:"齒輪平面底，更快X-Dash"} },
  { id:"BX-29", name:"帝王威能（特別版）", nameEn:"EmperorMight Special", code:"BX-29", series:"BX",
    blade:{id:"emperormight2",name:"帝王威能",nameEn:"EmperorMight",type:"defense"},
    ratchet:{id:"7-70b",name:"7-70",protrusions:7,height:70},
    bit:{id:"lowrush3",name:"Low Rush（LR）",type:"attack",desc:"低版Rush，競技首選"} },
  { id:"BX-30", name:"隨機包Vol.7", nameEn:"Random Booster Vol.7", code:"BX-30", series:"BX",
    blade:{id:"sharkedge2",name:"鯊刃",nameEn:"SharkEdge",type:"attack"},
    ratchet:{id:"1-60c",name:"1-60",protrusions:1,height:60},
    bit:{id:"accel2",name:"Accel（A）",type:"attack",desc:"加速底，快速機動攻擊"} },
  { id:"BX-31", name:"隨機包Vol.3", nameEn:"Random Booster Vol.3", code:"BX-31", series:"BX",
    blade:{id:"sharkedge",name:"鯊刃",nameEn:"SharkEdge",type:"attack"},
    ratchet:{id:"1-60",name:"1-60",protrusions:1,height:60},
    bit:{id:"accel",name:"Accel（A）",type:"attack",desc:"加速底，快速機動攻擊"} },
  { id:"BX-32", name:"競技對戰組", nameEn:"Competition Deck Set", code:"BX-32", series:"BX",
    blade:{id:"phoenixwing3",name:"鳳凰飛翼",nameEn:"PhoenixWing",type:"attack"},
    ratchet:{id:"9-60d",name:"9-60",protrusions:9,height:60},
    bit:{id:"gearflat4",name:"Gear Flat（GF）",type:"attack",desc:"齒輪平面底，更快X-Dash"} },
  { id:"BX-33", name:"皓戰猛虎", nameEn:"WeissTiger", code:"BX-33", series:"BX",
    blade:{id:"weisstiger",name:"皓戰猛虎",nameEn:"WeissTiger",type:"balance"},
    ratchet:{id:"3-60",name:"3-60",protrusions:3,height:60},
    bit:{id:"unite",name:"Unite（U）",type:"balance",desc:"組合底，兼顧攻守"} },
  { id:"BX-34", name:"蒼穹龍騎士", nameEn:"CobaltDragoon", code:"BX-34", series:"BX",
    blade:{id:"cobaltdragoon",name:"蒼穹龍騎士",nameEn:"CobaltDragoon",type:"attack"},
    ratchet:{id:"2-60",name:"2-60",protrusions:2,height:60},
    bit:{id:"cyclone",name:"Cyclone（C）",type:"attack",desc:"旋風底，激進移動攻擊"} },
  { id:"BX-35", name:"隨機包Vol.4", nameEn:"Random Booster Vol.4", code:"BX-35", series:"BX",
    blade:{id:"wizardrod3",name:"魔導神杖",nameEn:"WizardRod",type:"stamina"},
    ratchet:{id:"1-60d",name:"1-60",protrusions:1,height:60},
    bit:{id:"rush4",name:"Rush（R）",type:"attack",desc:"平面底，高頻X-Dash攻擊"} },
  { id:"BX-36", name:"巨鯨怒濤", nameEn:"WhaleWave", code:"BX-36", series:"BX",
    blade:{id:"whalewave",name:"巨鯨怒濤",nameEn:"WhaleWave",type:"stamina"},
    ratchet:{id:"5-80",name:"5-80",protrusions:5,height:80},
    bit:{id:"elevate",name:"Elevate（E）",type:"stamina",desc:"提升底，高重心耐久"} },
  { id:"BX-37", name:"隨機包Vol.5", nameEn:"Random Booster Vol.5 Rerun", code:"BX-37", series:"BX",
    blade:{id:"tyrannoroar2",name:"暴龍咆哮",nameEn:"TyraNnoRoar",type:"attack"},
    ratchet:{id:"4-60d",name:"4-60",protrusions:4,height:60},
    bit:{id:"gearflat5",name:"Gear Flat（GF）",type:"attack",desc:"齒輪平面底，更快X-Dash"} },
  { id:"BX-38", name:"赫燃天鳳", nameEn:"CrimsonGaruda", code:"BX-38", series:"BX",
    blade:{id:"crimsongaruda",name:"赫燃天鳳",nameEn:"CrimsonGaruda",type:"balance"},
    ratchet:{id:"4-70",name:"4-70",protrusions:4,height:70},
    bit:{id:"transpoint",name:"Trans Point（TP）",type:"balance",desc:"變形點底，可切換模式"} },
  { id:"BX-39", name:"隨機包Vol.8", nameEn:"Random Booster Vol.8", code:"BX-39", series:"BX",
    blade:{id:"orochicluster2",name:"鬼火魔輪",nameEn:"OrochiCluster",type:"stamina"},
    ratchet:{id:"6-60c",name:"6-60",protrusions:6,height:60},
    bit:{id:"lowflat2",name:"Low Flat（LF）",type:"attack",desc:"低平面底，低重心攻擊"} },
  { id:"BX-40", name:"蒼穹龍騎士（對戰套組D）", nameEn:"CobaltDrake Deck Set D", code:"BX-40", series:"BX",
    blade:{id:"cobaltdrake3",name:"蒼穹龍騎士",nameEn:"CobaltDrake",type:"attack"},
    ratchet:{id:"9-60e",name:"9-60",protrusions:9,height:60},
    bit:{id:"lowrush4",name:"Low Rush（LR）",type:"attack",desc:"低版Rush，競技首選"} },
  { id:"BX-41", name:"隨機包Vol.9", nameEn:"Random Booster Vol.9", code:"BX-41", series:"BX",
    blade:{id:"tyrannoroar3",name:"暴龍咆哮",nameEn:"TyraNnoRoar",type:"attack"},
    ratchet:{id:"5-60d",name:"5-60",protrusions:5,height:60},
    bit:{id:"underflat2",name:"Under Flat（UF）",type:"attack",desc:"超低平面底，最低重心攻擊"} },
  { id:"BX-42", name:"天鳳神龍（對戰套組E）", nameEn:"GarudaDran Deck Set E", code:"BX-42", series:"BX",
    blade:{id:"garudadran",name:"天鳳神龍",nameEn:"GarudaDran",type:"attack"},
    ratchet:{id:"9-60f",name:"9-60",protrusions:9,height:60},
    bit:{id:"lowrush5",name:"Low Rush（LR）",type:"attack",desc:"低版Rush，競技首選"} },
  { id:"BX-43", name:"隨機包Vol.10", nameEn:"Random Booster Vol.10 BX", code:"BX-43", series:"BX",
    blade:{id:"whalewave2",name:"巨鯨怒濤",nameEn:"WhaleWave",type:"stamina"},
    ratchet:{id:"5-80b",name:"5-80",protrusions:5,height:80},
    bit:{id:"elevate2",name:"Elevate（E）",type:"stamina",desc:"提升底，高重心耐久"} },
  { id:"BX-44", name:"三角強襲", nameEn:"TriceraPress", code:"BX-44", series:"BX",
    blade:{id:"tricerapress",name:"三角強襲",nameEn:"TriceraPress",type:"defense"},
    ratchet:{id:"m-85",name:"M-85",protrusions:null,height:85},
    bit:{id:"boundspike2",name:"Bound Spike（BS）",type:"defense",desc:"彈跳尖刺底，反擊防守"} },
  { id:"BX-45", name:"武士校刀", nameEn:"SamuraiCalibur", code:"BX-45", series:"BX",
    blade:{id:"samuraicalibur",name:"武士校刀",nameEn:"SamuraiCalibur",type:"balance"},
    ratchet:{id:"6-70",name:"6-70",protrusions:6,height:70},
    bit:{id:"merge",name:"Merge（M）",type:"balance",desc:"橡膠平面+尖底，傾斜攻擊直立耐久"} },

  // ── UX Unique Line ──
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
    bit:{id:"diskball",name:"Disk Ball（DB）",type:"stamina",desc:"碟形球底，圓盤穩定耐久"} },
  { id:"UX-04", name:"隨機包Vol.1 UX", nameEn:"UX Random Booster Vol.1", code:"UX-04", series:"UX",
    blade:{id:"rhinohorn2",name:"戰犀獸角",nameEn:"RhinoHorn",type:"defense"},
    ratchet:{id:"3-80d",name:"3-80",protrusions:3,height:80},
    bit:{id:"spike2",name:"Spike（S）",type:"stamina",desc:"尖刺底，耐久穩定"} },
  { id:"UX-05", name:"忍者闇影", nameEn:"ShinobiShadow", code:"UX-05", series:"UX",
    blade:{id:"shinobishadow",name:"忍者闇影",nameEn:"ShinobiShadow",type:"attack"},
    ratchet:{id:"1-80",name:"1-80",protrusions:1,height:80},
    bit:{id:"metalneedle",name:"Metal Needle（MN）",type:"defense",desc:"金屬針底，防守耐久"} },
  { id:"UX-06", name:"雄獅巔峰", nameEn:"LeonCrest", code:"UX-06", series:"UX",
    blade:{id:"leoncrest",name:"雄獅巔峰",nameEn:"LeonCrest",type:"balance"},
    ratchet:{id:"7-60",name:"7-60",protrusions:7,height:60},
    bit:{id:"gearneedle",name:"Gear Needle（GN）",type:"stamina",desc:"齒輪針底，耐久型"} },
  { id:"UX-07", name:"鳳凰尾翼", nameEn:"PhoenixRudder Deck Set", code:"UX-07", series:"UX",
    blade:{id:"phoenixrudder",name:"鳳凰尾翼",nameEn:"PhoenixRudder",type:"balance"},
    ratchet:{id:"9-70",name:"9-70",protrusions:9,height:70},
    bit:{id:"glide",name:"Glide（G）",type:"balance",desc:"滑翔底，平衡機動"} },
  { id:"UX-08", name:"霜輝銀狼", nameEn:"SilverWolf", code:"UX-08", series:"UX",
    blade:{id:"silverwolf",name:"霜輝銀狼",nameEn:"SilverWolf",type:"defense"},
    ratchet:{id:"3-80",name:"3-80",protrusions:3,height:80},
    bit:{id:"freeball",name:"Free Ball（FB）",type:"defense",desc:"自由球底，防守反彈"} },
  { id:"UX-09", name:"武士星劍", nameEn:"SamuraiSaber", code:"UX-09", series:"UX",
    blade:{id:"samuraisaber",name:"武士星劍",nameEn:"SamuraiSaber",type:"balance"},
    ratchet:{id:"2-70",name:"2-70",protrusions:2,height:70},
    bit:{id:"level",name:"Level（L）",type:"balance",desc:"水平底，平衡穩定型"} },
  { id:"UX-10", name:"騎士圓甲", nameEn:"KnightMail Customize Set", code:"UX-10", series:"UX",
    blade:{id:"knightmail",name:"騎士圓甲",nameEn:"KnightMail",type:"defense"},
    ratchet:{id:"3-85",name:"3-85",protrusions:3,height:85},
    bit:{id:"boundspike",name:"Bound Spike（BS）",type:"defense",desc:"彈跳尖刺底，防守反擊"} },
  { id:"UX-11", name:"衝擊龍神", nameEn:"ImpactDrake", code:"UX-11", series:"UX",
    blade:{id:"impactdrake",name:"衝擊龍神",nameEn:"ImpactDrake",type:"attack"},
    ratchet:{id:"9-60",name:"9-60",protrusions:9,height:60},
    bit:{id:"lowrush",name:"Low Rush（LR）",type:"attack",desc:"低版Rush，更低重心強衝擊，競技首選"} },
  { id:"UX-12", name:"幽靈元魂（隨機包Vol.5）", nameEn:"GhostCircle", code:"UX-12", series:"UX",
    blade:{id:"ghostcircle",name:"幽靈元魂",nameEn:"GhostCircle",type:"defense"},
    ratchet:{id:"0-80",name:"0-80",protrusions:0,height:80},
    bit:{id:"gearball",name:"Gear Ball（GB）",type:"defense",desc:"齒輪球底，防守穩定"} },
  { id:"UX-13", name:"魔像奇岩", nameEn:"GolemRock", code:"UX-13", series:"UX",
    blade:{id:"golemrock",name:"魔像奇岩",nameEn:"GolemRock",type:"defense"},
    ratchet:{id:"1-60",name:"1-60",protrusions:1,height:60},
    bit:{id:"underneedle",name:"Under Needle（UN）",type:"defense",desc:"超低針底，超低重心防守"} },
  { id:"UX-14", name:"天蠍長矛", nameEn:"ScorpioSpear", code:"UX-14", series:"UX",
    blade:{id:"scorpiospear",name:"天蠍長矛",nameEn:"ScorpioSpear",type:"balance",note:"X-Dash時形態切換"},
    ratchet:{id:"0-70",name:"0-70",protrusions:0,height:70},
    bit:{id:"zap",name:"Zap（Z）",type:"balance",desc:"寬平面+圓球，傾斜攻擊直立耐久"} },
  { id:"UX-15", name:"鮫鯊狂鱗", nameEn:"SharkScale Deck Set", code:"UX-15", series:"UX",
    blade:{id:"sharkscale",name:"鮫鯊狂鱗",nameEn:"SharkScale",type:"attack"},
    ratchet:{id:"4-50",name:"4-50",protrusions:4,height:50},
    bit:{id:"underflat",name:"Under Flat（UF）",type:"attack",desc:"超低平面底，最低重心攻擊"} },
  { id:"UX-16", name:"隨機包Vol.6 UX", nameEn:"UX Random Booster Vol.6", code:"UX-16", series:"UX",
    blade:{id:"shinobishadow2",name:"忍者闇影",nameEn:"ShinobiShadow",type:"attack"},
    ratchet:{id:"1-80b",name:"1-80",protrusions:1,height:80},
    bit:{id:"metalneedle2",name:"Metal Needle（MN）",type:"defense",desc:"金屬針底，防守耐久"} },
  { id:"UX-17", name:"隕石龍神", nameEn:"MeteorDragon", code:"UX-17", series:"UX",
    blade:{id:"meteordragon",name:"隕石龍神",nameEn:"MeteorDragon",type:"attack"},
    ratchet:{id:"3-70b",name:"3-70",protrusions:3,height:70},
    bit:{id:"orb",name:"Orb（O）",type:"stamina",desc:"球形底，耐久穩定"} },
  { id:"UX-18", name:"隨機包Vol.8 UX", nameEn:"UX Random Booster Vol.8", code:"UX-18", series:"UX",
    blade:{id:"weisstiger2",name:"皓戰猛虎",nameEn:"WeissTiger",type:"balance"},
    ratchet:{id:"4-80b",name:"4-80",protrusions:4,height:80},
    bit:{id:"lowrush6",name:"Low Rush（LR）",type:"attack",desc:"低版Rush，競技首選"} },
  { id:"UX-19", name:"子彈獅鷲", nameEn:"BulletGriffon", code:"UX-19", series:"UX",
    blade:{id:"bulletgriffon",name:"子彈獅鷲",nameEn:"BulletGriffon",type:"balance",note:"棘輪內建，受擊後分裂",integratedRatchet:true},
    ratchet:{id:"bulletgriffon-r",name:"（內建於刀片）",protrusions:null,height:null,integrated:true},
    bit:{id:"hexa2",name:"Hexa（H）",type:"balance",desc:"六角形底，自動扶正平衡"} },

  // ── CX Custom Line（五部件：Lock Chip / Main Blade / Assist Blade / Ratchet / Bit）──
  { id:"CX-01", name:"蒼龍勇氣", nameEn:"DranBrave", code:"CX-01", series:"CX",
    blade:{id:"dranbrave",name:"蒼龍勇氣",nameEn:"DranBrave",type:"attack"},
    lockChip:{id:"lc-dran",name:"Dran"},
    mainBlade:{id:"mb-brave",name:"Brave"},
    assistBlade:{id:"ab-slash",name:"Slash"},
    ratchet:{id:"6-60",name:"6-60",protrusions:6,height:60},
    bit:{id:"vortex",name:"Vortex（V）",type:"attack",desc:"渦流底，激進旋轉攻擊"} },
  { id:"CX-02", name:"魔導至尊", nameEn:"WizardArc", code:"CX-02", series:"CX",
    blade:{id:"wizardarc",name:"魔導至尊",nameEn:"WizardArc",type:"stamina"},
    lockChip:{id:"lc-wizard",name:"Wizard"},
    mainBlade:{id:"mb-arc",name:"Arc"},
    assistBlade:{id:"ab-round",name:"Round"},
    ratchet:{id:"4-55",name:"4-55",protrusions:4,height:55},
    bit:{id:"loworb",name:"Low Orb（LO）",type:"stamina",desc:"低球形底，低重心耐久"} },
  { id:"CX-03", name:"英仙幽冥", nameEn:"PerseusDark", code:"CX-03", series:"CX",
    blade:{id:"perseusdark",name:"英仙幽冥",nameEn:"PerseusDark",type:"defense"},
    lockChip:{id:"lc-perseus",name:"Perseus"},
    mainBlade:{id:"mb-dark",name:"Dark"},
    assistBlade:{id:"ab-bumper",name:"Bumper"},
    ratchet:{id:"6-80",name:"6-80",protrusions:6,height:80},
    bit:{id:"wall",name:"Wall（W）",type:"defense",desc:"牆形底，防守反彈型"} },
  { id:"CX-04", name:"對戰組A", nameEn:"Battle Entry Set A", code:"CX-04", series:"CX",
    blade:{id:"dranbrave2",name:"蒼龍勇氣",nameEn:"DranBrave",type:"attack"},
    lockChip:{id:"lc-dran2",name:"Dran"},
    mainBlade:{id:"mb-brave2",name:"Brave"},
    assistBlade:{id:"ab-slash2",name:"Slash"},
    ratchet:{id:"6-60d",name:"6-60",protrusions:6,height:60},
    bit:{id:"vortex2",name:"Vortex（V）",type:"attack",desc:"渦流底，激進旋轉攻擊"} },
  { id:"CX-05", name:"惡魔獵魂（隨機包Vol.6）", nameEn:"HellsReaper", code:"CX-05", series:"CX",
    blade:{id:"hellsreaper",name:"惡魔獵魂",nameEn:"HellsReaper",type:"attack"},
    lockChip:{id:"lc-hells",name:"Hells"},
    mainBlade:{id:"mb-reaper",name:"Reaper"},
    assistBlade:{id:"ab-turn",name:"Turn"},
    ratchet:{id:"4-70",name:"4-70",protrusions:4,height:70},
    bit:{id:"kick",name:"Kick（K）",type:"balance",desc:"踢形底，攻守兼備"} },
  { id:"CX-07", name:"天馬爆擊", nameEn:"PegasusBlast", code:"CX-07", series:"CX",
    blade:{id:"blast",name:"Blast（爆擊）",nameEn:"Blast",type:"attack"},
    lockChip:{id:"lc-pegasus",name:"Pegasus"},
    mainBlade:{id:"mb-blast",name:"Blast"},
    assistBlade:{id:"ab-assault",name:"Assault"},
    ratchet:{id:"turbo",name:"Turbo（一體式）",protrusions:null,height:null,integrated:true},
    bit:{id:"turbo-bit",name:"Turbo（一體式）",type:"attack",desc:"棘輪+Bit合體，高速尖底耐久低速平面攻擊",integrated:true} },
  { id:"CX-08", name:"隨機包Vol.7 CX", nameEn:"CX Random Booster Vol.7", code:"CX-08", series:"CX",
    blade:{id:"cerberusflame",name:"地獄三首焰（隨機包Vol.7）",nameEn:"CerberusFlame",type:"attack"},
    lockChip:{id:"lc-cerberus",name:"Cerberus"},
    mainBlade:{id:"mb-flame",name:"Flame"},
    assistBlade:{id:"ab-w2",name:"W"},
    ratchet:{id:"5-80c",name:"5-80",protrusions:5,height:80},
    bit:{id:"wall2",name:"Wall Bound（WB）",type:"defense",desc:"牆面彈跳底，防守反彈"} },
  { id:"CX-09", name:"焰神滅世", nameEn:"SolEclipse", code:"CX-09", series:"CX",
    blade:{id:"soleclipse",name:"焰神滅世",nameEn:"SolEclipse",type:"balance"},
    lockChip:{id:"lc-sol",name:"Sol"},
    mainBlade:{id:"mb-eclipse",name:"Eclipse"},
    assistBlade:{id:"ab-dual",name:"Dual"},
    ratchet:{id:"5-70",name:"5-70",protrusions:5,height:70},
    bit:{id:"transtaper",name:"Trans Kick（TK）",type:"balance",desc:"變形底，可切換模式"} },
  { id:"CX-10", name:"銀狼狩獵（隨機包Vol.7）", nameEn:"WolfHunt", code:"CX-10", series:"CX",
    blade:{id:"wolfhunt",name:"銀狼狩獵",nameEn:"WolfHunt",type:"attack"},
    lockChip:{id:"lc-wolf",name:"Wolf"},
    mainBlade:{id:"mb-hunt",name:"Hunt"},
    assistBlade:{id:"ab-fang",name:"Fang"},
    ratchet:{id:"0-60",name:"0-60",protrusions:0,height:60},
    bit:{id:"diskball2",name:"Disk Ball（DB）",type:"stamina",desc:"碟形球底，穩定耐久"} },
  { id:"CX-11", name:"帝王威能", nameEn:"EmperorMight Deck Set", code:"CX-11", series:"CX",
    blade:{id:"emperormight",name:"帝王威能",nameEn:"EmperorMight",type:"defense"},
    lockChip:{id:"lc-emperor",name:"Emperor"},
    mainBlade:{id:"mb-might",name:"Might"},
    assistBlade:{id:"ab-shield",name:"Shield"},
    ratchet:{id:"7-70",name:"7-70",protrusions:7,height:70},
    bit:{id:"orbsuction",name:"Orb Suction（O）",type:"stamina",desc:"球形吸力底，耐久型"} },
  { id:"CX-12", name:"鳳凰閃焰", nameEn:"PhoenixFlare", code:"CX-12", series:"CX",
    blade:{id:"phoenixflare",name:"鳳凰閃焰",nameEn:"PhoenixFlare",type:"attack"},
    lockChip:{id:"lc-phoenix",name:"Phoenix"},
    mainBlade:{id:"mb-flare",name:"Flare"},
    assistBlade:{id:"ab-zillion",name:"Zillion"},
    ratchet:{id:"9-80",name:"9-80",protrusions:9,height:80},
    bit:{id:"wallwedge",name:"Wall Wedge（WW）",type:"defense",desc:"牆楔底，防守型"} },
  { id:"CX-13", name:"龍王閃擊", nameEn:"BahamutBlitz", code:"CX-13", series:"CX",
    blade:{id:"bahamutblitz",name:"龍王閃擊",nameEn:"BahamutBlitz",type:"attack"},
    lockChip:{id:"lc-bahamut",name:"Bahamut"},
    overBlade:{id:"ob-break",name:"Break"},
    mainBlade:{id:"mb-blitz",name:"Blitz（Metal）"},
    assistBlade:{id:"ab-knuckle",name:"Knuckle"},
    expandBlade:true,
    ratchet:{id:"1-50",name:"1-50",protrusions:1,height:50},
    bit:{id:"ignition",name:"Ignition（I）",type:"attack",desc:"大型圓筒底，強力抓地高速機動"} },
  { id:"CX-14", name:"騎士堡壘", nameEn:"KnightFortress", code:"CX-14", series:"CX",
    blade:{id:"knightfortress",name:"騎士堡壘",nameEn:"KnightFortress",type:"defense"},
    lockChip:{id:"lc-knight2",name:"Knight"},
    overBlade:{id:"ob-fortress",name:"Fortress"},
    mainBlade:{id:"mb-guard",name:"Guard（Metal）"},
    assistBlade:{id:"ab-wall2",name:"Wall"},
    expandBlade:true,
    ratchet:{id:"8-70",name:"8-70",protrusions:8,height:70},
    bit:{id:"underneedle2",name:"Under Needle（UN）",type:"defense",desc:"超低針底，低重心防守"} },
  { id:"CX-06", name:"極狐九尾（隨機包Vol.6）", nameEn:"NineTails", code:"CX-06", series:"CX",
    blade:{id:"ninetails",name:"極狐九尾",nameEn:"NineTails",type:"balance"},
    lockChip:{id:"lc-fox",name:"Fox"},
    mainBlade:{id:"mb-ninetails",name:"Nine Tails"},
    assistBlade:{id:"ab-fox",name:"J"},
    ratchet:{id:"9-70",name:"9-70",protrusions:9,height:70},
    bit:{id:"gearball2",name:"Gear Rush（GR）",type:"balance",desc:"齒輪衝刺底，平衡機動"} },
  { id:"CX-16", name:"龍王閃擊 異色版（對戰組C）", nameEn:"BahamutBlitz Alt", code:"CX-16", series:"CX",
    blade:{id:"bahamutblitz2",name:"龍王閃擊（異色）",nameEn:"BahamutBlitz Alt",type:"attack"},
    lockChip:{id:"lc-bahamut2",name:"Bahamut"},
    overBlade:{id:"ob-break2",name:"Break"},
    mainBlade:{id:"mb-blitz2",name:"Blitz（Metal）"},
    assistBlade:{id:"ab-knuckle2",name:"Knuckle"},
    expandBlade:true,
    ratchet:{id:"1-50",name:"1-50",protrusions:1,height:50},
    bit:{id:"ignition2",name:"Ignition（I）",type:"attack",desc:"大型圓筒底，強力抓地高速機動"} },
  { id:"CX-17", name:"獨角極變（隨機包Vol.10）", nameEn:"UnicornMetamorphosis", code:"CX-17", series:"CX",
    blade:{id:"unicornmeta",name:"獨角極變",nameEn:"UnicornMetamorphosis",type:"balance"},
    lockChip:{id:"lc-unicorn",name:"Unicorn"},
    mainBlade:{id:"mb-meta",name:"Metamorphosis"},
    assistBlade:{id:"ab-o",name:"O"},
    ratchet:{id:"3-60cx17",name:"3-60",protrusions:3,height:60},
    bit:{id:"gearunite",name:"Gear Unite（GU）",type:"balance",desc:"齒輪組合底，平衡型"} },
  { id:"CX-18", name:"腕龍長鞭", nameEn:"WristDragonWhip", code:"CX-18", series:"CX",
    blade:{id:"wristdragon",name:"腕龍鞭擊",nameEn:"WristDragonWhip",type:"attack"},
    lockChip:{id:"lc-wrist",name:"Wrist"},
    mainBlade:{id:"mb-whip",name:"Whip"},
    assistBlade:{id:"ab-w",name:"W"},
    ratchet:{id:"5-70cx18",name:"5-70",protrusions:5,height:70},
    bit:{id:"needlerush",name:"Needle Rush（Nr）",type:"stamina",desc:"針形衝刺底，耐久型"} },
  { id:"CX-15", name:"邪神狂怒", nameEn:"RagnaRage", code:"CX-15", series:"CX",
    blade:{id:"ragnarage",name:"邪神狂怒",nameEn:"RagnaRage",type:"stamina"},
    lockChip:{id:"lc-ragna",name:"Ragna"},
    overBlade:{id:"ob-flow",name:"Flow"},
    mainBlade:{id:"mb-rage",name:"Rage（Metal）"},
    assistBlade:{id:"ab-erase",name:"Erase"},
    expandBlade:true,
    ratchet:{id:"4-55",name:"4-55",protrusions:4,height:55},
    bit:{id:"yielding",name:"Yielding（Y）",type:"stamina",desc:"讓力底，耐久減少衝擊"} },
];

// ── 工具函式 ────────────────────────────────────────────
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

function rateBit(id, bladeType){
  // 依刀片類型給分
  const attack={lowrush:5,underflat:5,rush:4,gearflat:4,flat:3,ignition:3,cyclone:3,vortex:3,accel:3,lowflat:3,merge:2,zap:2,hexa:2,hexa2:2,level:2,unite:2,transpoint:2,taper:1,needle:1,point:1,spike:1,ball:1};
  const defense={needle:5,metalneedle:5,underneedle:5,underneedle2:5,ball:4,freeball:4,spike:4,boundspike:4,boundspike2:4,highball:3,highTaper:3,merge:3,zap:3,hexa:3,hexa2:3,level:3,unite:3,flat:1,rush:1,lowrush:1};
  const stamina={taper:5,hightaper:5,point:5,gearpoint:5,spike:4,diskball:4,diskball2:4,elevate:4,highball:3,gearball:3,ball:3,orb:3,needle:3,merge:2,zap:2,level:2,flat:1,rush:1,lowrush:1};
  const balance={merge:5,zap:5,hexa:5,hexa2:5,level:4,unite:4,transpoint:4,gearunite:4,glide:4,ball:3,highball:3,diskball:3,taper:2,rush:2,lowrush:2,flat:2,needle:2};
  const map={attack,defense,stamina,balance};
  const scores=map[bladeType]||balance;
  return scores[id]??1;
}
function rateRatchet(r,bladeType){
  if(!r||r.protrusions===null) return 0;
  if(bladeType==="attack"){
    if(r.height<=50) return 5;
    if(r.height<=60&&r.protrusions<=3) return 4;
    if(r.height<=60) return 3;
    return 2;
  }
  if(bladeType==="defense"){
    if(r.height>=70) return 5;
    if(r.height>=60) return 3;
    return 2;
  }
  if(bladeType==="stamina"){
    if(r.height>=70) return 4;
    if(r.height>=60) return 3;
    return 2;
  }
  return 3;
}
function getRating(score){
  if(score>=9) return "S";
  if(score>=7) return "A";
  if(score>=5) return "B";
  return "C";
}

function getRecommendedCombos(product,allRatchets,allBits,ownedPartIds){
  if(!product) return [];
  const blade=product.blade;
  const isIntegrated=product.ratchet.integrated&&product.bit.integrated;
  const isIntegratedRatchet=blade.integratedRatchet; // 如子彈獅鷲，棘輪內建於刀片
  const combos=[];

  // 棘輪+Bit全一體式（如天馬爆擊Turbo）
  if(isIntegrated){
    combos.push({
      blade,
      ratchet:{...product.ratchet,source:product.name,sourceCode:product.code},
      bit:{...product.bit,source:product.name,sourceCode:product.code},
      rating:"B",score:5,style:"原裝一體式",isIntegratedCard:true,
      integratedRatchet:false,
      owned:{blade:ownedPartIds.has(blade.id),ratchet:true,bit:true},
      allOwned:ownedPartIds.has(blade.id),
    });
  }

  // 棘輪內建於刀片（如子彈獅鷲），只能換Bit
  if(isIntegratedRatchet){
    const fixedRatchet={...product.ratchet,source:product.name,sourceCode:product.code};
    allBits.forEach(b=>{
      const score=2+rateBit(b.id,blade.type); // 棘輪固定，只評Bit
      const rating=getRating(score);
      const owned={blade:ownedPartIds.has(blade.id),ratchet:true,bit:ownedPartIds.has(b.id)};
      const style=b.type==="attack"?"偏攻":"平衡";
      combos.push({blade,ratchet:fixedRatchet,bit:b,rating,score,style,isIntegratedCard:false,integratedRatchet:true,owned,allOwned:owned.blade&&owned.bit});
    });
    return combos.sort((a,b)=>b.score-a.score).slice(0,7);
  }

  const seen=new Set();
  allRatchets.filter(r=>r.protrusions!==null).forEach(r=>{
    allBits.forEach(b=>{
      if(blade.type==="attack"&&b.type==="defense") return;
      const score=rateRatchet(r,blade.type)+rateBit(b.id,blade.type);
      const rating=getRating(score);
      const owned={
        blade:ownedPartIds.has(blade.id),
        ratchet:ownedPartIds.has(r.id),
        bit:ownedPartIds.has(b.id),
      };
      const style=blade.type==="attack"?(b.type==="attack"?"純攻擊":"攻守平衡"):(b.type==="attack"?"平衡偏攻":"平衡偏守");
      const key=`${blade.id}-${r.id}-${b.id}`;
      if(!seen.has(key)){
        seen.add(key);
        combos.push({blade,ratchet:r,bit:b,rating,score,style,isIntegratedCard:false,integratedRatchet:false,owned,allOwned:owned.blade&&owned.ratchet&&owned.bit});
      }
    });
  });
  const integrated=combos.filter(c=>c.isIntegratedCard);
  const rest=combos.filter(c=>!c.isIntegratedCard).sort((a,b)=>b.score-a.score).slice(0,7);
  return [...integrated,...rest];
}

const RATING_COLOR={S:"#fbbf24",A:"#34d399",B:"#60a5fa",C:"#a78bfa"};
const SERIES_COLOR={BX:"rgba(59,130,246,0.15)",UX:"rgba(168,85,247,0.15)",CX:"rgba(236,72,153,0.15)"};
const SERIES_TEXT={BX:"#60a5fa",UX:"#c084fc",CX:"#f472b6"};

function OwnTag({owned}){
  return(
    <span style={{display:"inline-block",padding:"1px 7px",borderRadius:99,fontSize:10,fontWeight:700,
      background:owned?"rgba(34,197,94,0.15)":"rgba(239,68,68,0.12)",
      color:owned?"#34d399":"#f87171",
      border:`1px solid ${owned?"#34d399":"#f87171"}`,marginLeft:6}}>
      {owned?"✓ 已有":"✕ 待收集"}
    </span>
  );
}

function SeriesBadge({series}){
  return(
    <span style={{fontSize:10,fontWeight:700,padding:"1px 7px",borderRadius:99,
      background:SERIES_COLOR[series]||"rgba(255,255,255,0.1)",
      color:SERIES_TEXT[series]||"#aaa",
      border:`1px solid ${SERIES_TEXT[series]||"#aaa"}`,marginLeft:6}}>
      {series}
    </span>
  );
}

function ComboCard({combo,index,wishlistParts,toggleWishlist}){
  const rColor=RATING_COLOR[combo.rating]||"#aaa";
  const ratchetIntegrated=combo.isIntegratedCard||combo.integratedRatchet;
  const rows=[
    {layer:"上層 刀片",val:combo.blade.name,srcName:combo.blade.source,src:combo.blade.sourceCode,owned:combo.owned.blade,integrated:false},
    {layer:"中層 棘輪",val:combo.isIntegratedCard?"Turbo（一體式，無法替換）":combo.integratedRatchet?"（內建於刀片，無法替換）":combo.ratchet.name,srcName:ratchetIntegrated?null:combo.ratchet.source,src:ratchetIntegrated?null:combo.ratchet.sourceCode,owned:combo.owned.ratchet,integrated:ratchetIntegrated,tier:RATCHET_TIER[combo.ratchet.name]||null},
    {layer:"底層 Bit",val:combo.isIntegratedCard?"Turbo（一體式，無法替換）":combo.bit.name,srcName:combo.isIntegratedCard?null:combo.bit.source,src:combo.isIntegratedCard?null:combo.bit.sourceCode,owned:combo.owned.bit,integrated:combo.isIntegratedCard,tier:BIT_TIER[BIT_ID_TO_ABBR[combo.bit.id]]||null},
  ];
  return(
    <div style={{background:combo.allOwned?"rgba(34,197,94,0.06)":"rgba(255,255,255,0.04)",
      border:`1px solid ${combo.isIntegratedCard?"rgba(251,191,36,0.25)":combo.allOwned?"rgba(34,197,94,0.35)":"rgba(255,255,255,0.1)"}`,
      borderRadius:16,padding:18,position:"relative"}}>
      <div style={{position:"absolute",top:14,right:14,width:34,height:34,borderRadius:"50%",
        background:rColor,color:"#000",fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>
        {combo.rating}
      </div>
      <div style={{fontSize:11,color:combo.isIntegratedCard?"#fbbf24":"#777",marginBottom:12,fontWeight:700,letterSpacing:1}}>
        {combo.isIntegratedCard?"🔒 原裝組合":`組合 #${index} · ${combo.style}`}
        {combo.allOwned&&!combo.isIntegratedCard&&<span style={{color:"#34d399",marginLeft:8}}>● 現在就能組</span>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {rows.map(row=>(
          <div key={row.layer} style={{display:"flex",alignItems:"flex-start",gap:10}}>
            <div style={{fontSize:10,color:"#555",width:64,flexShrink:0,paddingTop:5}}>{row.layer}</div>
            <div style={{flex:1,borderRadius:8,padding:"7px 12px",
              background:row.integrated?"rgba(251,191,36,0.07)":"rgba(255,255,255,0.05)",
              border:row.integrated?"1px solid rgba(251,191,36,0.2)":"none"}}>
              <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:4}}>
                <span style={{fontSize:13,fontWeight:600,color:row.integrated?"#fbbf24":"#fff"}}>{row.val}</span>
                {row.tier&&<TierBadge tier={row.tier}/>}
                {!row.integrated&&<OwnTag owned={row.owned}/>}
                {!row.integrated&&!row.owned&&wishlistParts&&(()=>{
                  const wKey=JSON.stringify({layer:row.layer,name:row.val});
                  const inWishlist=wishlistParts.has(wKey);
                  return(
                    <span onClick={e=>{e.stopPropagation();toggleWishlist(wKey);}}
                      style={{fontSize:10,cursor:"pointer",padding:"1px 7px",borderRadius:99,fontWeight:700,
                        background:inWishlist?"rgba(251,191,36,0.15)":"rgba(255,255,255,0.08)",
                        color:inWishlist?"#fbbf24":"#aaa",
                        border:`1px solid ${inWishlist?"rgba(251,191,36,0.4)":"rgba(255,255,255,0.15)"}`,
                        marginLeft:2}}>
                      {inWishlist?"🎯":"＋目標"}
                    </span>
                  );
                })()}
              </div>
              {row.srcName&&(
                <div style={{fontSize:10,color:"#888",marginTop:3}}>
                  來自 <span style={{color:"#fbbf24",fontWeight:700}}>{row.srcName}</span>
                  <span style={{color:"#555",marginLeft:4}}>（{row.src}）</span>
                </div>
              )}
              {row.integrated&&<div style={{fontSize:10,color:"#f59e0b",marginTop:3}}>⚠ 棘輪與Bit合體，無法單獨替換</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



export default function App(){
  const [query,setQuery]=useState("");
  const [selectedProduct,setSelectedProduct]=useState(null);
  const [ownedProducts,setOwnedProducts]=useState(()=>{
    try{
      const saved=localStorage.getItem("beyblade-owned");
      return saved?new Set(JSON.parse(saved)):new Set();
    }catch{return new Set();}
  });
  const [tab,setTab]=useState("combo");
  const [partQuery,setPartQuery]=useState("");
  const [partLayerFilter,setPartLayerFilter]=useState("ALL");
  const [showWishlistExpanded,setShowWishlistExpanded]=useState(true);
  const [wishlistParts,setWishlistParts]=useState(()=>{
    try{const s=localStorage.getItem("beyblade-wishlist");return s?new Set(JSON.parse(s)):new Set();}
    catch{return new Set();}
  });
  const toggleWishlist=(key)=>{
    setWishlistParts(prev=>{
      const n=new Set(prev);
      n.has(key)?n.delete(key):n.add(key);
      try{localStorage.setItem("beyblade-wishlist",JSON.stringify([...n]));}catch{}
      return n;
    });
  };
  const [inventoryQuery,setInventoryQuery]=useState("");
  const [showOwnedOnly,setShowOwnedOnly]=useState(false);
  const [useOwnedOnly,setUseOwnedOnly]=useState(false);
  const [showQuickSelect,setShowQuickSelect]=useState(false);
  const [seriesFilter,setSeriesFilter]=useState("ALL");

  const {blades,ratchets,bits}=getAllParts();

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
    return ALL_PRODUCTS.filter(p=>
      p.name.toLowerCase().includes(q)||p.nameEn.toLowerCase().includes(q)||p.code.toLowerCase().includes(q)
    );
  },[query]);

  const combos=useMemo(()=>{
    if(!selectedProduct) return [];
    const filteredRatchets=useOwnedOnly?ratchets.filter(r=>ownedPartIds.has(r.id)):ratchets;
    const filteredBits=useOwnedOnly?bits.filter(b=>ownedPartIds.has(b.id)):bits;
    return getRecommendedCombos(selectedProduct,filteredRatchets,filteredBits,ownedPartIds);
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

  const toggleOwned=(id)=>{
    setOwnedProducts(prev=>{
      const n=new Set(prev);
      n.has(id)?n.delete(id):n.add(id);
      try{localStorage.setItem("beyblade-owned",JSON.stringify([...n]));}catch{}
      return n;
    });
  };

  const filteredProducts=useMemo(()=>{
    const list=seriesFilter==="ALL"?[...ALL_PRODUCTS]:ALL_PRODUCTS.filter(p=>p.series===seriesFilter);
    return list.sort((a,b)=>{
      if(a.series!==b.series) return a.series.localeCompare(b.series);
      const numA=parseInt(a.code.split("-")[1]||"0");
      const numB=parseInt(b.code.split("-")[1]||"0");
      return numA-numB;
    });
  },[seriesFilter]);

  const inventoryFiltered=useMemo(()=>{
    let list=seriesFilter==="ALL"?[...ALL_PRODUCTS]:ALL_PRODUCTS.filter(p=>p.series===seriesFilter);
    list=list.sort((a,b)=>{
      if(a.series!==b.series) return a.series.localeCompare(b.series);
      const numA=parseInt(a.code.split("-")[1]||"0");
      const numB=parseInt(b.code.split("-")[1]||"0");
      return numA-numB;
    });
    if(showOwnedOnly) list=list.filter(p=>ownedProducts.has(p.id));
    if(!inventoryQuery.trim()) return list;
    const q=inventoryQuery.toLowerCase();
    return list.filter(p=>
      p.name.toLowerCase().includes(q)||p.nameEn.toLowerCase().includes(q)||p.code.toLowerCase().includes(q)
    );
  },[seriesFilter,inventoryQuery,showOwnedOnly,ownedProducts]);

  return(
    <div style={{minHeight:"100vh",background:"#0a0a0f",fontFamily:"'Segoe UI','Noto Sans TC',sans-serif",color:"#fff",padding:"24px 16px"}}>

      {/* Header */}
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:11,letterSpacing:4,color:"#fbbf24",fontWeight:700,marginBottom:6}}>BEYBLADE X</div>
        <h1 style={{margin:0,fontSize:26,fontWeight:900,background:"linear-gradient(90deg,#fbbf24,#f97316)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
          組合配裝查詢
        </h1>
        <div style={{fontSize:11,color:"#444",marginTop:6}}>
          資料庫：{ALL_PRODUCTS.filter(p=>p.series==="BX").length} BX ·{" "}
          {ALL_PRODUCTS.filter(p=>p.series==="UX").length} UX ·{" "}
          {ALL_PRODUCTS.filter(p=>p.series==="CX").length} CX
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:28,flexWrap:"wrap"}}>
        {[["combo","⚔️配裝"],["parts","🔍零件查詢"],["tier","📊等級表"],["inventory","📦庫存"]].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{
            padding:"7px 14px",borderRadius:99,fontSize:12,fontWeight:700,cursor:"pointer",
            background:tab===key?"#fbbf24":"rgba(255,255,255,0.07)",
            color:tab===key?"#000":"#aaa",
            border:tab===key?"none":"1px solid rgba(255,255,255,0.12)"}}>
            {label}
          </button>
        ))}
      </div>

      {/* ── 配裝查詢 ── */}
      {tab==="combo"&&(
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <div style={{position:"relative",marginBottom:8}}>
            <input value={query} onChange={e=>{setQuery(e.target.value);setSelectedProduct(null);}}
              placeholder="輸入型號（CX-03）或名稱（天馬爆擊、DranSword）..."
              style={{width:"100%",padding:"13px 20px",borderRadius:12,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",fontSize:14,outline:"none",boxSizing:"border-box"}}/>
            {query&&<button onClick={()=>{setQuery("");setSelectedProduct(null);}}
              style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:18}}>✕</button>}
          </div>

          {query.trim()&&searchResults.length===0&&!selectedProduct&&(
            <div style={{fontSize:12,color:"#f87171",padding:"10px 16px",marginBottom:8}}>
              找不到「{query}」，請確認型號或名稱（例如 CX-03、英雄暗影、PerseusDark）
            </div>
          )}

          {searchResults.length>0&&!selectedProduct&&(
            <div style={{background:"#13131f",border:"1px solid rgba(255,255,255,0.12)",borderRadius:12,marginBottom:16,overflow:"hidden"}}>
              {searchResults.map(p=>(
                <div key={p.id} onClick={()=>{setSelectedProduct(p);setQuery(p.name);}}
                  style={{padding:"11px 18px",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(251,191,36,0.08)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <div>
                    <span style={{fontWeight:700}}>{p.name}</span>
                    <span style={{color:"#666",fontSize:12,marginLeft:8}}>{p.nameEn}</span>
                    <SeriesBadge series={p.series}/>
                    <OwnTag owned={ownedProducts.has(p.id)}/>
                  </div>
                  <span style={{fontSize:11,color:"#fbbf24",fontWeight:700}}>{p.code}</span>
                </div>
              ))}
            </div>
          )}

          {/* 系列篩選 */}
          <div style={{marginBottom:12,display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:10,color:"#555"}}>系列</span>
            {["ALL","BX","UX","CX"].map(s=>(
              <button key={s} onClick={()=>setSeriesFilter(s)} style={{
                padding:"3px 12px",borderRadius:99,fontSize:11,cursor:"pointer",fontWeight:700,
                background:seriesFilter===s?(s==="BX"?"#60a5fa":s==="UX"?"#c084fc":s==="CX"?"#f472b6":"#fbbf24"):"rgba(255,255,255,0.06)",
                color:seriesFilter===s?"#000":"#888",
                border:seriesFilter===s?"none":"1px solid rgba(255,255,255,0.1)"}}>
                {s}
              </button>
            ))}
          </div>

          {/* 快速選擇 */}
          <div style={{marginBottom:24}}>
            <div onClick={()=>setShowQuickSelect(v=>!v)}
              style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",marginBottom:showQuickSelect?12:0}}>
              <span style={{fontSize:10,color:"#555",letterSpacing:1}}>快速選擇（{filteredProducts.length} 顆）</span>
              <span style={{fontSize:12,color:"#555",transform:showQuickSelect?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s"}}>▼</span>
            </div>
            {showQuickSelect&&(
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {filteredProducts.map(p=>(
                  <button key={p.id} onClick={()=>{setSelectedProduct(p);setQuery(p.name);}} style={{
                    padding:"5px 12px",borderRadius:99,fontSize:12,cursor:"pointer",fontWeight:600,
                    background:selectedProduct?.id===p.id?"#fbbf24":ownedProducts.has(p.id)?"rgba(34,197,94,0.12)":"rgba(255,255,255,0.06)",
                    color:selectedProduct?.id===p.id?"#000":ownedProducts.has(p.id)?"#34d399":"#888",
                    border:selectedProduct?.id===p.id?"none":`1px solid ${ownedProducts.has(p.id)?"rgba(34,197,94,0.3)":"rgba(255,255,255,0.1)"}`}}>
                    {p.name}
                    <span style={{fontSize:9,opacity:0.6,marginLeft:4}}>{p.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedProduct&&combos.length>0&&(
            <>
              <div style={{fontSize:13,color:"#fbbf24",fontWeight:700,marginBottom:10}}>
                {selectedProduct.name} 推薦組合
                <SeriesBadge series={selectedProduct.series}/>
              </div>
              <div style={{marginBottom:14,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <div onClick={()=>setUseOwnedOnly(v=>!v)}
                  style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"7px 14px",borderRadius:99,
                    background:useOwnedOnly?"rgba(34,197,94,0.15)":"rgba(255,255,255,0.06)",
                    border:`1px solid ${useOwnedOnly?"rgba(34,197,94,0.5)":"rgba(255,255,255,0.12)"}`}}>
                  <div style={{width:18,height:18,borderRadius:4,
                    background:useOwnedOnly?"#34d399":"rgba(255,255,255,0.08)",
                    border:`2px solid ${useOwnedOnly?"#34d399":"rgba(255,255,255,0.2)"}`,
                    display:"flex",alignItems:"center",justifyContent:"center",color:"#000",fontWeight:900,fontSize:11,flexShrink:0}}>
                    {useOwnedOnly?"✓":""}
                  </div>
                  <span style={{fontSize:12,fontWeight:700,color:useOwnedOnly?"#34d399":"#888"}}>只用我現有的零件配</span>
                </div>
                <span style={{fontSize:11,color:"#555"}}>
                  {useOwnedOnly?"只顯示你能馬上組出來的組合":"S → A → B → C · ✓已有 / ✕待收集"}
                </span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(290px, 1fr))",gap:14}}>
                {combos.map((c,i)=><ComboCard key={i} combo={c} index={i} wishlistParts={wishlistParts} toggleWishlist={toggleWishlist}/>)}
              </div>
              {wishlist.length>0&&(
                <div style={{marginTop:24,background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:14,padding:18}}>
                  <div style={{fontSize:12,color:"#f87171",fontWeight:700,marginBottom:12}}>🎯 目標收集（S/A級缺少的零件）</div>
                  {wishlist.map((item,i)=>(
                    <div key={i} style={{fontSize:12,color:"#ccc",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>· {item}</div>
                  ))}
                </div>
              )}
              <div style={{marginTop:14,fontSize:10,color:"#444",textAlign:"center"}}>評級根據零件競技強度，不限於目前擁有的組合</div>
            </>
          )}

          {!selectedProduct&&(
            <div style={{textAlign:"center",color:"#333",marginTop:48}}>
              <div style={{fontSize:44,marginBottom:10}}>🌀</div>
              <div style={{fontSize:13}}>搜尋或點選一顆陀螺開始查詢</div>
            </div>
          )}
        </div>
      )}

      {/* ── 零件查詢 ── */}
      {tab==="parts"&&(
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <div style={{position:"relative",marginBottom:16}}>
            <input value={partQuery} onChange={e=>setPartQuery(e.target.value)}
              placeholder="輸入零件名稱（1-50、Low Rush、Flat、Ignition、6-60...）"
              style={{width:"100%",padding:"13px 20px",borderRadius:12,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",fontSize:14,outline:"none",boxSizing:"border-box"}}/>
            {partQuery&&<button onClick={()=>setPartQuery("")}
              style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:18}}>✕</button>}
          </div>
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
            {[["ALL","全部"],["上層 刀片","🗡️ 刀片"],["中層 棘輪","⚙️ 固鎖"],["底層 Bit","🔵 軸心"]].map(([val,label])=>(
              <button key={val} onClick={()=>setPartLayerFilter(val)} style={{
                padding:"5px 14px",borderRadius:99,fontSize:12,cursor:"pointer",fontWeight:700,
                background:partLayerFilter===val?"#fbbf24":"rgba(255,255,255,0.07)",
                color:partLayerFilter===val?"#000":"#aaa",
                border:partLayerFilter===val?"none":"1px solid rgba(255,255,255,0.12)"}}>
                {label}
              </button>
            ))}
          </div>

          {/* 目標清單區塊 */}
          {wishlistParts.size>0&&(
            <div style={{marginBottom:24,background:"rgba(251,191,36,0.05)",border:"1px solid rgba(251,191,36,0.2)",borderRadius:14,padding:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div onClick={()=>setShowWishlistExpanded(v=>!v)} style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
                  <span style={{fontSize:12,color:"#fbbf24",fontWeight:700}}>🎯 目標清單（{wishlistParts.size}）</span>
                  <span style={{fontSize:11,color:"#f59e0b",transform:showWishlistExpanded?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s"}}>▼</span>
                </div>
                <button onClick={()=>{setWishlistParts(new Set());try{localStorage.removeItem("beyblade-wishlist");}catch{}}}
                  style={{fontSize:10,color:"#f87171",background:"none",border:"1px solid rgba(248,113,113,0.3)",padding:"2px 8px",borderRadius:99,cursor:"pointer"}}>
                  清空
                </button>
              </div>
              {showWishlistExpanded&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
                {[...wishlistParts].map((wKey,i)=>{
                  let layer="",name="";
                  try{const d=JSON.parse(wKey);layer=d.layer;name=d.name;}catch{}
                  const sources=ALL_PRODUCTS.filter(p=>{
                    if(layer==="上層 刀片") return p.blade.name===name;
                    if(layer==="中層 棘輪") return !p.ratchet.integrated&&p.ratchet.name===name;
                    if(layer==="底層 Bit") return !p.bit.integrated&&p.bit.name===name;
                    return false;
                  });
                  return(
                    <div key={i} style={{background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 12px"}}>
                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <span style={{fontSize:10,color:"#f59e0b",background:"rgba(245,158,11,0.12)",padding:"1px 6px",borderRadius:4}}>{layer}</span>
                          <span style={{fontSize:13,fontWeight:700,color:"#fff"}}>{name}</span>
                        </div>
                        <button onClick={()=>toggleWishlist(wKey)}
                          style={{background:"none",border:"none",color:"#f87171",cursor:"pointer",fontSize:16}}>✕</button>
                      </div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                        {sources.map((p,j)=>(
                          <div key={j} style={{fontSize:11,padding:"3px 8px",borderRadius:6,
                            background:ownedProducts.has(p.id)?"rgba(34,197,94,0.12)":"rgba(255,255,255,0.06)",
                            color:ownedProducts.has(p.id)?"#34d399":"#aaa",
                            border:`1px solid ${ownedProducts.has(p.id)?"rgba(34,197,94,0.3)":"rgba(255,255,255,0.1)"}`}}>
                            {p.name} <span style={{opacity:0.5}}>{p.code}</span>
                            {ownedProducts.has(p.id)&&" ✓"}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>}
            </div>
          )}

          {partQuery.trim()===""?(
            <div style={{textAlign:"center",color:"#333",marginTop:40}}>
              <div style={{fontSize:40,marginBottom:10}}>🔍</div>
              <div style={{fontSize:13}}>{partLayerFilter==="ALL"?"選擇類型或輸入名稱查詢":partLayerFilter==="上層 刀片"?"輸入刀片名稱":partLayerFilter==="中層 棘輪"?"輸入棘輪型號（例：1-50、9-60）":"輸入軸心縮寫（例：LR、Rush、Flat）"}</div>
              <div style={{fontSize:11,color:"#444",marginTop:8}}>選擇上方類型按鈕可篩選</div>
            </div>
          ):(()=>{
            const q=partQuery.toLowerCase();
            const results=[];
            ALL_PRODUCTS.forEach(p=>{
              const layers=[
                {layer:"上層 刀片",name:p.blade.name,nameEn:p.blade.nameEn||"",type:p.blade.type,desc:null,integrated:false},
                {layer:"中層 棘輪",name:p.ratchet.name,nameEn:"",type:null,desc:null,integrated:!!p.ratchet.integrated},
                {layer:"底層 Bit",name:p.bit.name,nameEn:"",type:p.bit.type,desc:p.bit.desc,integrated:!!p.bit.integrated},
              ];
              layers.forEach(layer=>{
                if(partLayerFilter!=="ALL"&&layer.layer!==partLayerFilter) return;
                if(q){
                  const nameMatch=layer.name.toLowerCase().includes(q);
                  const enMatch=layer.nameEn&&layer.nameEn.toLowerCase().includes(q);
                  // 軸心篩選時，短查詢（1-2字）改為縮寫完整比對
                  const isAbbrSearch=layer.layer==="底層 Bit"&&q.length<=3;
                  const abbrMatch=isAbbrSearch&&layer.name.match(/（([^）]+)）/)?.[1]?.toLowerCase()===q;
                  if(!nameMatch&&!enMatch&&!abbrMatch) return;
                }
                if(!q&&partLayerFilter==="ALL") return;
                results.push({product:p,...layer});
              });
            });
            if(results.length===0){
              return(
                <div style={{textAlign:"center",color:"#555",padding:32}}>
                  <div style={{fontSize:13}}>找不到「{partQuery}」相關零件</div>
                  <div style={{fontSize:11,color:"#444",marginTop:6}}>試試英文或縮寫，例如 LR、Rush、1-60</div>
                </div>
              );
            }
            return(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{fontSize:11,color:"#666",marginBottom:4}}>找到 {results.length} 個結果</div>
                {results.map((r,i)=>{
                  const owned=ownedProducts.has(r.product.id);
                  return(
                    <div key={i} style={{
                      background:owned?"rgba(34,197,94,0.07)":"rgba(255,255,255,0.04)",
                      border:`1px solid ${owned?"rgba(34,197,94,0.3)":"rgba(255,255,255,0.09)"}`,
                      borderRadius:14,padding:"14px 18px"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                        <span style={{fontSize:10,color:"#555",background:"rgba(255,255,255,0.07)",padding:"2px 8px",borderRadius:6}}>{r.layer}</span>
                        <span style={{fontSize:15,fontWeight:700,color:"#fff"}}>{r.name}</span>
                        {r.layer==="中層 棘輪"&&<TierBadge tier={RATCHET_TIER[r.name]}/>}
                        {r.layer==="底層 Bit"&&<TierBadge tier={BIT_TIER[r.name.match(/（([^）]+)）/)?.[1]||""]}/>}
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
                          return(
                            <div onClick={()=>toggleWishlist(wKey)}
                              style={{display:"inline-flex",alignItems:"center",gap:6,cursor:"pointer",padding:"5px 12px",borderRadius:99,
                                background:inWishlist?"rgba(251,191,36,0.15)":"rgba(255,255,255,0.06)",
                                border:`1px solid ${inWishlist?"rgba(251,191,36,0.5)":"rgba(255,255,255,0.12)"}`}}>
                              <div style={{width:14,height:14,borderRadius:3,
                                background:inWishlist?"#fbbf24":"rgba(255,255,255,0.08)",
                                border:`2px solid ${inWishlist?"#fbbf24":"rgba(255,255,255,0.2)"}`,
                                display:"flex",alignItems:"center",justifyContent:"center",color:"#000",fontWeight:900,fontSize:9}}>
                                {inWishlist?"✓":""}
                              </div>
                              <span style={{fontSize:11,fontWeight:700,color:inWishlist?"#fbbf24":"#888"}}>
                                {inWishlist?"✓ 已加入目標清單":"＋ 加入目標清單"}
                              </span>
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



      {/* ── 等級表 ── */}
      {tab==="tier"&&(
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <div style={{fontSize:11,color:"#666",marginBottom:20,textAlign:"center"}}>資料來源：@RENLIgames</div>

          {/* 三張圖片 */}
          {[
            {title:"⚔️ 刀片 Blade Tier",url:"https://i.postimg.cc/jwCFbnT0/IMG-2187-4K.jpg"},
            {title:"⚙️ 棘輪 Ratchet Tier",url:"https://i.postimg.cc/hzw3P44G/IMG-2188-4K.jpg"},
            {title:"🔵 軸心 Bit Tier",url:"https://i.postimg.cc/TLSHY22d/IMG-2189-4K.jpg"},
          ].map((img,i)=>(
            <div key={i} style={{marginBottom:24}}>
              <div style={{fontSize:13,fontWeight:700,color:"#fbbf24",marginBottom:10}}>{img.title}</div>
              <div style={{overflowX:"auto",borderRadius:12,border:"1px solid rgba(255,255,255,0.1)"}}><img src={img.url} alt={img.title} style={{display:"block",maxWidth:"none",height:"auto"}}/></div>
            </div>
          ))}

        </div>
      )}

      {/* ── 我的庫存 ── */}
      {tab==="inventory"&&(
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <div style={{fontSize:12,color:"#666",marginBottom:16,textAlign:"center"}}>
            勾選你擁有的陀螺，配裝頁面會自動標示哪些零件已有
          </div>
          {/* 系列篩選 */}
          <div style={{marginBottom:16,display:"flex",gap:8,alignItems:"center",justifyContent:"center"}}>
            {["ALL","BX","UX","CX"].map(s=>(
              <button key={s} onClick={()=>setSeriesFilter(s)} style={{
                padding:"4px 14px",borderRadius:99,fontSize:12,cursor:"pointer",fontWeight:700,
                background:seriesFilter===s?(s==="BX"?"#60a5fa":s==="UX"?"#c084fc":s==="CX"?"#f472b6":"#fbbf24"):"rgba(255,255,255,0.06)",
                color:seriesFilter===s?"#000":"#888",
                border:seriesFilter===s?"none":"1px solid rgba(255,255,255,0.1)"}}>
                {s}
              </button>
            ))}
          </div>

          <div style={{position:"relative",marginBottom:16}}>
            <input value={inventoryQuery} onChange={e=>setInventoryQuery(e.target.value)}
              placeholder="搜尋陀螺名稱或型號直接打勾..."
              style={{width:"100%",padding:"12px 20px",borderRadius:12,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",fontSize:14,outline:"none",boxSizing:"border-box"}}/>
            {inventoryQuery&&<button onClick={()=>setInventoryQuery("")}
              style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#888",cursor:"pointer",fontSize:18}}>✕</button>}
          </div>

          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <div onClick={()=>setShowOwnedOnly(v=>!v)}
              style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",padding:"7px 14px",borderRadius:99,
                background:showOwnedOnly?"rgba(34,197,94,0.15)":"rgba(255,255,255,0.06)",
                border:`1px solid ${showOwnedOnly?"rgba(34,197,94,0.5)":"rgba(255,255,255,0.12)"}`}}>
              <div style={{width:18,height:18,borderRadius:4,
                background:showOwnedOnly?"#34d399":"rgba(255,255,255,0.08)",
                border:`2px solid ${showOwnedOnly?"#34d399":"rgba(255,255,255,0.2)"}`,
                display:"flex",alignItems:"center",justifyContent:"center",color:"#000",fontWeight:900,fontSize:11,flexShrink:0}}>
                {showOwnedOnly?"✓":""}
              </div>
              <span style={{fontSize:12,fontWeight:700,color:showOwnedOnly?"#34d399":"#888"}}>只顯示我的陀螺</span>
            </div>
            <span style={{fontSize:11,color:"#555"}}>{inventoryFiltered.length} 顆</span>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:28}}>
            {inventoryFiltered.map(p=>{
              const owned=ownedProducts.has(p.id);
              return(
                <div key={p.id}
                  style={{display:"flex",alignItems:"flex-start",gap:14,padding:"14px 18px",borderRadius:14,
                    background:owned?"rgba(34,197,94,0.07)":"rgba(255,255,255,0.04)",
                    border:`1px solid ${owned?"rgba(34,197,94,0.3)":"rgba(255,255,255,0.09)"}`}}>
                  <div onClick={()=>toggleOwned(p.id)} style={{width:22,height:22,borderRadius:6,flexShrink:0,marginTop:2,cursor:"pointer",
                    background:owned?"#34d399":"rgba(255,255,255,0.08)",
                    border:`2px solid ${owned?"#34d399":"rgba(255,255,255,0.2)"}`,
                    display:"flex",alignItems:"center",justifyContent:"center",color:"#000",fontWeight:900,fontSize:13}}>
                    {owned?"✓":""}
                  </div>
                  <div style={{flex:1,cursor:"pointer"}} onClick={()=>{setSelectedProduct(p);setTab("combo");setQuery(p.name);}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
                      <span style={{fontWeight:700,fontSize:15,color:owned?"#fff":"#aaa"}}>{p.name}</span>
                      <span style={{fontSize:11,color:"#555"}}>{p.nameEn}</span>
                      <span style={{fontSize:11,color:"#fbbf24",fontWeight:700}}>{p.code}</span>
                      <SeriesBadge series={p.series}/>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:4}}>
                      {(p.series==="CX"?[
                        {layer:"鎖定芯",name:p.lockChip?.name||"-",note:null,integrated:false,color:"#c084fc"},
                        ...(p.expandBlade?[
                          {layer:"覆蓋刀片",name:p.overBlade?.name||"-",note:null,integrated:false,color:"#f472b6"},
                          {layer:"金屬刀片",name:p.mainBlade?.name||"-",note:null,integrated:false,color:"#f472b6"},
                        ]:[
                          {layer:"主刀片",name:p.mainBlade?.name||"-",note:null,integrated:false,color:"#f472b6"},
                        ]),
                        {layer:"輔助刀片",name:p.assistBlade?.name||"-",note:null,integrated:false,color:"#f472b6"},
                        {layer:"棘輪",name:p.ratchet.integrated?"Turbo（一體式）":p.ratchet.name,note:p.ratchet.integrated?"⚠ 無法替換":null,integrated:p.ratchet.integrated,color:null},
                        {layer:"底層 Bit",name:p.bit.integrated?"Turbo（一體式）":p.bit.name,note:p.bit.integrated?"⚠ 無法替換":null,integrated:p.bit.integrated,color:null},
                      ]:[
                        {layer:"上層 刀片",name:p.blade.name,note:p.blade.note,integrated:false,color:null},
                        {layer:"中層 棘輪",name:p.ratchet.integrated?"（內建）":p.ratchet.name,note:p.ratchet.integrated?"⚠ 無法替換":null,integrated:p.ratchet.integrated,color:null},
                        {layer:"底層 Bit",name:p.bit.integrated?"Turbo（一體式）":p.bit.name,note:p.bit.integrated?"⚠ 無法替換":null,integrated:p.bit.integrated,color:null},
                      ]).map(row=>(
                        <div key={row.layer} style={{display:"flex",alignItems:"flex-start",gap:8}}>
                          <span style={{fontSize:10,color:"#555",width:64,flexShrink:0,paddingTop:2}}>{row.layer}</span>
                          <span style={{fontSize:12,color:row.integrated?"#f59e0b":row.color||(owned?"#ccc":"#666")}}>{row.name}</span>
                          {row.note&&<span style={{fontSize:10,color:"#f87171"}}>{row.note}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{background:"rgba(251,191,36,0.05)",border:"1px solid rgba(251,191,36,0.15)",borderRadius:14,padding:18}}>
            <div style={{fontSize:12,color:"#fbbf24",fontWeight:700,marginBottom:14}}>📋 目前擁有的可替換零件</div>
            {[
              {label:"上層 刀片",parts:blades.filter(b=>ownedPartIds.has(b.id))},
              {label:"中層 棘輪",parts:ratchets.filter(r=>ownedPartIds.has(r.id))},
              {label:"底層 Bit",parts:bits.filter(b=>ownedPartIds.has(b.id))},
            ].map(section=>(
              <div key={section.label} style={{marginBottom:14}}>
                <div style={{fontSize:10,color:"#888",fontWeight:700,letterSpacing:1,marginBottom:6}}>{section.label}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {section.parts.length===0
                    ?<span style={{fontSize:11,color:"#444"}}>（無）</span>
                    :section.parts.map(part=>(
                      <div key={part.id} style={{fontSize:11,color:"#ccc",background:"rgba(255,255,255,0.07)",padding:"4px 10px",borderRadius:8}}>
                        {part.name}<span style={{color:"#555",marginLeft:6}}>({part.sourceCode})</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
