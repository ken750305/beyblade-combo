import { useState, useMemo, useCallback } from "react";

// ── 完整資料庫 BX / UX / CX ──────────────────────────────
const ALL_PRODUCTS = [
  // ── BX Basic Line ──
  { id:"BX-01", name:"龍劍", nameEn:"DranSword", code:"BX-01", series:"BX",
    blade:{id:"dransword",name:"龍劍",nameEn:"DranSword",type:"attack"},
    ratchet:{id:"3-60",name:"3-60",protrusions:3,height:60},
    bit:{id:"flat",name:"Flat（F）",type:"attack",desc:"平面底，激進移動"} },
  { id:"BX-02", name:"地獄鐮刀", nameEn:"HellsScythe", code:"BX-02", series:"BX",
    blade:{id:"hellsscythe",name:"地獄鐮刀",nameEn:"HellsScythe",type:"attack"},
    ratchet:{id:"4-60",name:"4-60",protrusions:4,height:60},
    bit:{id:"taper",name:"Taper（T）",type:"stamina",desc:"錐形底，旋轉耐久型"} },
  { id:"BX-03", name:"魔法箭", nameEn:"WizardArrow", code:"BX-03", series:"BX",
    blade:{id:"wizardarrow",name:"魔法箭",nameEn:"WizardArrow",type:"balance"},
    ratchet:{id:"4-80",name:"4-80",protrusions:4,height:80},
    bit:{id:"ball",name:"Ball（B）",type:"balance",desc:"球形底，平衡型"} },
  { id:"BX-04", name:"騎士盾", nameEn:"KnightShield", code:"BX-04", series:"BX",
    blade:{id:"knightshield",name:"騎士盾",nameEn:"KnightShield",type:"defense"},
    ratchet:{id:"3-80",name:"3-80",protrusions:3,height:80},
    bit:{id:"needle",name:"Needle（N）",type:"defense",desc:"針形底，防守定點型"} },
  { id:"BX-13", name:"騎士長槍", nameEn:"KnightLance", code:"BX-13", series:"BX",
    blade:{id:"knightlance",name:"騎士長槍",nameEn:"KnightLance",type:"defense"},
    ratchet:{id:"4-80",name:"4-80",protrusions:4,height:80},
    bit:{id:"highneedle",name:"High Needle（HN）",type:"defense",desc:"高針形底，高重心防守"} },
  { id:"BX-15", name:"獅爪", nameEn:"LeonClaw", code:"BX-15", series:"BX",
    blade:{id:"leonclaw",name:"獅爪",nameEn:"LeonClaw",type:"attack"},
    ratchet:{id:"5-60",name:"5-60",protrusions:5,height:60},
    bit:{id:"point",name:"Point（P）",type:"stamina",desc:"點形底，穩定耐久"} },
  { id:"BX-19", name:"犀牛角", nameEn:"RhinoHorn", code:"BX-19", series:"BX",
    blade:{id:"rhinohorn",name:"犀牛角",nameEn:"RhinoHorn",type:"defense"},
    ratchet:{id:"3-80",name:"3-80",protrusions:3,height:80},
    bit:{id:"spike",name:"Spike（S）",type:"stamina",desc:"尖刺底，耐久穩定"} },
  { id:"BX-20", name:"龍匕套組", nameEn:"DranDagger Deck Set", code:"BX-20", series:"BX",
    blade:{id:"drandagger",name:"龍匕",nameEn:"DranDagger",type:"attack"},
    ratchet:{id:"4-60",name:"4-60",protrusions:4,height:60},
    bit:{id:"rush",name:"Rush（R）",type:"attack",desc:"平面底，高頻X-Dash攻擊"} },
  { id:"BX-21", name:"地獄鏈套組", nameEn:"HellsChain Deck Set", code:"BX-21", series:"BX",
    blade:{id:"hellschain",name:"地獄鏈",nameEn:"HellsChain",type:"attack"},
    ratchet:{id:"4-60",name:"4-60",protrusions:4,height:60},
    bit:{id:"hightaper",name:"High Taper（HT）",type:"stamina",desc:"高錐形底，高重心耐久"} },
  { id:"BX-23", name:"鳳凰飛翼", nameEn:"PhoenixWing", code:"BX-23", series:"BX",
    blade:{id:"phoenixwing",name:"鳳凰飛翼",nameEn:"PhoenixWing",type:"attack"},
    ratchet:{id:"9-60",name:"9-60",protrusions:9,height:60},
    bit:{id:"gearflat",name:"Gear Flat（GF）",type:"attack",desc:"齒輪平面底，更快X-Dash"} },
  { id:"BX-26", name:"獨角獸刺", nameEn:"UnicornSting", code:"BX-26", series:"BX",
    blade:{id:"unicornsting",name:"獨角獸刺",nameEn:"UnicornSting",type:"balance"},
    ratchet:{id:"5-60",name:"5-60",protrusions:5,height:60},
    bit:{id:"gearpoint",name:"Gear Point（GP）",type:"stamina",desc:"齒輪點形底，穩定耐久"} },
  { id:"BX-33", name:"白虎", nameEn:"WeissTiger", code:"BX-33", series:"BX",
    blade:{id:"weisstiger",name:"白虎",nameEn:"WeissTiger",type:"balance"},
    ratchet:{id:"3-60",name:"3-60",protrusions:3,height:60},
    bit:{id:"unite",name:"Unite（U）",type:"balance",desc:"組合底，兼顧攻守"} },
  { id:"BX-34", name:"蒼藍龍", nameEn:"CobaltDragoon", code:"BX-34", series:"BX",
    blade:{id:"cobaltdragoon",name:"蒼藍龍",nameEn:"CobaltDragoon",type:"attack"},
    ratchet:{id:"2-60",name:"2-60",protrusions:2,height:60},
    bit:{id:"cyclone",name:"Cyclone（C）",type:"attack",desc:"旋風底，激進移動攻擊"} },
  { id:"BX-36", name:"鯨浪", nameEn:"WhaleWave", code:"BX-36", series:"BX",
    blade:{id:"whalewave",name:"鯨浪",nameEn:"WhaleWave",type:"stamina"},
    ratchet:{id:"5-80",name:"5-80",protrusions:5,height:80},
    bit:{id:"elevate",name:"Elevate（E）",type:"stamina",desc:"提升底，高重心耐久"} },
  { id:"BX-38", name:"緋紅迦樓羅", nameEn:"CrimsonGaruda", code:"BX-38", series:"BX",
    blade:{id:"crimsongaruda",name:"緋紅迦樓羅",nameEn:"CrimsonGaruda",type:"balance"},
    ratchet:{id:"4-70",name:"4-70",protrusions:4,height:70},
    bit:{id:"transpoint",name:"Trans Point（TP）",type:"balance",desc:"變形點底，可切換模式"} },
  { id:"BX-44", name:"三角龍壓", nameEn:"TriceraPress", code:"BX-44", series:"BX",
    blade:{id:"tricerapress",name:"三角龍壓",nameEn:"TriceraPress",type:"defense"},
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
  { id:"UX-02", name:"地獄鐵鎚", nameEn:"HellsHammer", code:"UX-02", series:"UX",
    blade:{id:"hellshammer",name:"地獄鐵鎚",nameEn:"HellsHammer",type:"attack"},
    ratchet:{id:"3-70",name:"3-70",protrusions:3,height:70},
    bit:{id:"hexa",name:"Hexa（H）",type:"balance",desc:"六角形底，自動扶正平衡"} },
  { id:"UX-03", name:"魔法棒", nameEn:"WizardRod", code:"UX-03", series:"UX",
    blade:{id:"wizardrod",name:"魔法棒",nameEn:"WizardRod",type:"stamina"},
    ratchet:{id:"5-70",name:"5-70",protrusions:5,height:70},
    bit:{id:"diskball",name:"Disk Ball（DB）",type:"stamina",desc:"碟形球底，圓盤穩定耐久"} },
  { id:"UX-05", name:"忍影", nameEn:"ShinobiShadow", code:"UX-05", series:"UX",
    blade:{id:"shinobishadow",name:"忍影",nameEn:"ShinobiShadow",type:"attack"},
    ratchet:{id:"1-80",name:"1-80",protrusions:1,height:80},
    bit:{id:"metalneedle",name:"Metal Needle（MN）",type:"defense",desc:"金屬針底，防守耐久"} },
  { id:"UX-06", name:"獅冠", nameEn:"LeonCrest", code:"UX-06", series:"UX",
    blade:{id:"leoncrest",name:"獅冠",nameEn:"LeonCrest",type:"balance"},
    ratchet:{id:"7-60",name:"7-60",protrusions:7,height:60},
    bit:{id:"gearneedle",name:"Gear Needle（GN）",type:"stamina",desc:"齒輪針底，耐久型"} },
  { id:"UX-07", name:"鳳凰舵套組", nameEn:"PhoenixRudder Deck Set", code:"UX-07", series:"UX",
    blade:{id:"phoenixrudder",name:"鳳凰舵",nameEn:"PhoenixRudder",type:"balance"},
    ratchet:{id:"9-70",name:"9-70",protrusions:9,height:70},
    bit:{id:"glide",name:"Glide（G）",type:"balance",desc:"滑翔底，平衡機動"} },
  { id:"UX-08", name:"銀狼", nameEn:"SilverWolf", code:"UX-08", series:"UX",
    blade:{id:"silverwolf",name:"銀狼",nameEn:"SilverWolf",type:"defense"},
    ratchet:{id:"3-80",name:"3-80",protrusions:3,height:80},
    bit:{id:"freeball",name:"Free Ball（FB）",type:"defense",desc:"自由球底，防守反彈"} },
  { id:"UX-09", name:"武士劍士", nameEn:"SamuraiSaber", code:"UX-09", series:"UX",
    blade:{id:"samuraisaber",name:"武士劍士",nameEn:"SamuraiSaber",type:"balance"},
    ratchet:{id:"2-70",name:"2-70",protrusions:2,height:70},
    bit:{id:"level",name:"Level（L）",type:"balance",desc:"水平底，平衡穩定型"} },
  { id:"UX-10", name:"騎士鎖甲套組", nameEn:"KnightMail Customize Set", code:"UX-10", series:"UX",
    blade:{id:"knightmail",name:"騎士鎖甲",nameEn:"KnightMail",type:"defense"},
    ratchet:{id:"3-85",name:"3-85",protrusions:3,height:85},
    bit:{id:"boundspike",name:"Bound Spike（BS）",type:"defense",desc:"彈跳尖刺底，防守反擊"} },
  { id:"UX-11", name:"衝擊龍", nameEn:"ImpactDrake", code:"UX-11", series:"UX",
    blade:{id:"impactdrake",name:"衝擊龍",nameEn:"ImpactDrake",type:"attack"},
    ratchet:{id:"9-60",name:"9-60",protrusions:9,height:60},
    bit:{id:"lowrush",name:"Low Rush（LR）",type:"attack",desc:"低版Rush，更低重心強衝擊，競技首選"} },
  { id:"UX-12", name:"幽靈圓（隨機包Vol.5）", nameEn:"GhostCircle", code:"UX-12", series:"UX",
    blade:{id:"ghostcircle",name:"幽靈圓",nameEn:"GhostCircle",type:"defense"},
    ratchet:{id:"0-80",name:"0-80",protrusions:0,height:80},
    bit:{id:"gearball",name:"Gear Ball（GB）",type:"defense",desc:"齒輪球底，防守穩定"} },
  { id:"UX-13", name:"石魔岩", nameEn:"GolemRock", code:"UX-13", series:"UX",
    blade:{id:"golemrock",name:"石魔岩",nameEn:"GolemRock",type:"defense"},
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
  { id:"UX-19", name:"子彈獅鷲", nameEn:"BulletGriffon", code:"UX-19", series:"UX",
    blade:{id:"bulletgriffon",name:"子彈獅鷲",nameEn:"BulletGriffon",type:"balance",note:"棘輪內建，受擊後分裂",integratedRatchet:true},
    ratchet:{id:"bulletgriffon-r",name:"（內建於刀片）",protrusions:null,height:null,integrated:true},
    bit:{id:"hexa2",name:"Hexa（H）",type:"balance",desc:"六角形底，自動扶正平衡"} },

  // ── CX Custom Line（五部件：Lock Chip / Main Blade / Assist Blade / Ratchet / Bit）──
  { id:"CX-01", name:"龍勇閃", nameEn:"DranBrave", code:"CX-01", series:"CX",
    blade:{id:"dranbrave",name:"龍勇閃",nameEn:"DranBrave",type:"attack"},
    lockChip:{id:"lc-dran",name:"Dran"},
    mainBlade:{id:"mb-brave",name:"Brave"},
    assistBlade:{id:"ab-slash",name:"Slash"},
    ratchet:{id:"6-60",name:"6-60",protrusions:6,height:60},
    bit:{id:"vortex",name:"Vortex（V）",type:"attack",desc:"渦流底，激進旋轉攻擊"} },
  { id:"CX-02", name:"巫師弧光", nameEn:"WizardArc", code:"CX-02", series:"CX",
    blade:{id:"wizardarc",name:"巫師弧光",nameEn:"WizardArc",type:"stamina"},
    lockChip:{id:"lc-wizard",name:"Wizard"},
    mainBlade:{id:"mb-arc",name:"Arc"},
    assistBlade:{id:"ab-round",name:"Round"},
    ratchet:{id:"4-55",name:"4-55",protrusions:4,height:55},
    bit:{id:"loworb",name:"Low Orb（LO）",type:"stamina",desc:"低球形底，低重心耐久"} },
  { id:"CX-03", name:"英雄暗影", nameEn:"PerseusDark", code:"CX-03", series:"CX",
    blade:{id:"perseusdark",name:"英雄暗影",nameEn:"PerseusDark",type:"defense"},
    lockChip:{id:"lc-perseus",name:"Perseus"},
    mainBlade:{id:"mb-dark",name:"Dark"},
    assistBlade:{id:"ab-bumper",name:"Bumper"},
    ratchet:{id:"6-80",name:"6-80",protrusions:6,height:80},
    bit:{id:"wall",name:"Wall（W）",type:"defense",desc:"牆形底，防守反彈型"} },
  { id:"CX-05", name:"地獄收割（隨機包Vol.6）", nameEn:"HellsReaper", code:"CX-05", series:"CX",
    blade:{id:"hellsreaper",name:"地獄收割",nameEn:"HellsReaper",type:"attack"},
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
  { id:"CX-09", name:"太陽蝕", nameEn:"SolEclipse", code:"CX-09", series:"CX",
    blade:{id:"soleclipse",name:"太陽蝕",nameEn:"SolEclipse",type:"balance"},
    lockChip:{id:"lc-sol",name:"Sol"},
    mainBlade:{id:"mb-eclipse",name:"Eclipse"},
    assistBlade:{id:"ab-dual",name:"Dual"},
    ratchet:{id:"5-70",name:"5-70",protrusions:5,height:70},
    bit:{id:"transtaper",name:"Trans Kick（TK）",type:"balance",desc:"變形底，可切換模式"} },
  { id:"CX-10", name:"狼獵（隨機包Vol.7）", nameEn:"WolfHunt", code:"CX-10", series:"CX",
    blade:{id:"wolfhunt",name:"狼獵",nameEn:"WolfHunt",type:"attack"},
    lockChip:{id:"lc-wolf",name:"Wolf"},
    mainBlade:{id:"mb-hunt",name:"Hunt"},
    assistBlade:{id:"ab-fang",name:"Fang"},
    ratchet:{id:"0-60",name:"0-60",protrusions:0,height:60},
    bit:{id:"diskball2",name:"Disk Ball（DB）",type:"stamina",desc:"碟形球底，穩定耐久"} },
  { id:"CX-11", name:"皇帝強力套組", nameEn:"EmperorMight Deck Set", code:"CX-11", series:"CX",
    blade:{id:"emperormight",name:"皇帝強力",nameEn:"EmperorMight",type:"defense"},
    lockChip:{id:"lc-emperor",name:"Emperor"},
    mainBlade:{id:"mb-might",name:"Might"},
    assistBlade:{id:"ab-shield",name:"Shield"},
    ratchet:{id:"7-70",name:"7-70",protrusions:7,height:70},
    bit:{id:"orbsuction",name:"Orb Suction（O）",type:"stamina",desc:"球形吸力底，耐久型"} },
  { id:"CX-12", name:"鳳凰烈焰", nameEn:"PhoenixFlare", code:"CX-12", series:"CX",
    blade:{id:"phoenixflare",name:"鳳凰烈焰",nameEn:"PhoenixFlare",type:"attack"},
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
  { id:"CX-15", name:"拉格納狂怒", nameEn:"RagnaRage", code:"CX-15", series:"CX",
    blade:{id:"ragnarage",name:"拉格納狂怒",nameEn:"RagnaRage",type:"stamina"},
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

function rateBit(id){
  const s={lowrush:5,underflat:5,rush:4,flat:3,ignition:3,cyclone:3,vortex:3,gearflat:3,accel:2,merge:2,zap:2,hexa:2,hexa2:2,level:2,unite:2,transpoint:2};
  return s[id]??1;
}
function rateRatchet(r,bladeType){
  if(!r||r.protrusions===null) return 0;
  if(bladeType==="attack"){
    if(r.height<=50) return 5;
    if(r.height<=60&&r.protrusions<=3) return 4;
    if(r.height<=60) return 3;
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
  const combos=[];
  if(isIntegrated){
    combos.push({
      blade,
      ratchet:{...product.ratchet,source:product.name,sourceCode:product.code},
      bit:{...product.bit,source:product.name,sourceCode:product.code},
      rating:"B",score:5,style:"原裝一體式",isIntegratedCard:true,
      owned:{blade:ownedPartIds.has(blade.id),ratchet:true,bit:true},
      allOwned:ownedPartIds.has(blade.id),
    });
  }
  const seen=new Set();
  allRatchets.filter(r=>r.protrusions!==null).forEach(r=>{
    allBits.forEach(b=>{
      if(blade.type==="attack"&&b.type==="defense") return;
      const score=rateRatchet(r,blade.type)+rateBit(b.id);
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
        combos.push({blade,ratchet:r,bit:b,rating,score,style,isIntegratedCard:false,owned,allOwned:owned.blade&&owned.ratchet&&owned.bit});
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

function ComboCard({combo,index}){
  const rColor=RATING_COLOR[combo.rating]||"#aaa";
  const rows=[
    {layer:"上層 刀片",val:combo.blade.name,srcName:combo.blade.source,src:combo.blade.sourceCode,owned:combo.owned.blade,integrated:false},
    {layer:"中層 棘輪",val:combo.isIntegratedCard?"Turbo（一體式，無法替換）":combo.ratchet.name,srcName:combo.isIntegratedCard?null:combo.ratchet.source,src:combo.isIntegratedCard?null:combo.ratchet.sourceCode,owned:combo.owned.ratchet,integrated:combo.isIntegratedCard},
    {layer:"底層 Bit",val:combo.isIntegratedCard?"Turbo（一體式，無法替換）":combo.bit.name,srcName:combo.isIntegratedCard?null:combo.bit.source,src:combo.isIntegratedCard?null:combo.bit.sourceCode,owned:combo.owned.bit,integrated:combo.isIntegratedCard},
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
                {!row.integrated&&<OwnTag owned={row.owned}/>}
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

const DEFAULT_OWNED=new Set(["BX-01","BX-45","CX-07","CX-13","UX-14","UX-19"]);

export default function App(){
  const [query,setQuery]=useState("");
  const [selectedProduct,setSelectedProduct]=useState(null);
  const [ownedProducts,setOwnedProducts]=useState(DEFAULT_OWNED);
  const [tab,setTab]=useState("combo");
  const [partQuery,setPartQuery]=useState("");
  const [inventoryQuery,setInventoryQuery]=useState("");
  const [showOwnedOnly,setShowOwnedOnly]=useState(false);
  const [useOwnedOnly,setUseOwnedOnly]=useState(false);
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
    setOwnedProducts(prev=>{const n=new Set(prev);n.has(id)?n.delete(id):n.add(id);return n;});
  };

  const filteredProducts=useMemo(()=>
    seriesFilter==="ALL"?ALL_PRODUCTS:ALL_PRODUCTS.filter(p=>p.series===seriesFilter)
  ,[seriesFilter]);

  const inventoryFiltered=useMemo(()=>{
    let list=seriesFilter==="ALL"?ALL_PRODUCTS:ALL_PRODUCTS.filter(p=>p.series===seriesFilter);
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
        {[["combo","⚔️ 配裝查詢"],["parts","🔍 零件查詢"],["inventory","📦 我的庫存"]].map(([key,label])=>(
          <button key={key} onClick={()=>setTab(key)} style={{
            padding:"8px 20px",borderRadius:99,fontSize:13,fontWeight:700,cursor:"pointer",
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
            <div style={{fontSize:10,color:"#555",marginBottom:8,letterSpacing:1}}>快速選擇（{filteredProducts.length} 顆）</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {filteredProducts.map(p=>(
                <button key={p.id} onClick={()=>{setSelectedProduct(p);setQuery(p.name);}} style={{
                  padding:"5px 12px",borderRadius:99,fontSize:12,cursor:"pointer",fontWeight:600,
                  background:selectedProduct?.id===p.id?"#fbbf24":ownedProducts.has(p.id)?"rgba(34,197,94,0.12)":"rgba(255,255,255,0.06)",
                  color:selectedProduct?.id===p.id?"#000":ownedProducts.has(p.id)?"#34d399":"#888",
                  border:selectedProduct?.id===p.id?"none":`1px solid ${ownedProducts.has(p.id)?"rgba(34,197,94,0.3)":"rgba(255,255,255,0.1)"}`}}>
                  {p.name}
                </button>
              ))}
            </div>
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
                {combos.map((c,i)=><ComboCard key={i} combo={c} index={i}/>)}
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

          {partQuery.trim()===""?(
            <div style={{textAlign:"center",color:"#333",marginTop:40}}>
              <div style={{fontSize:40,marginBottom:10}}>🔍</div>
              <div style={{fontSize:13}}>輸入零件名稱查詢來源陀螺</div>
              <div style={{fontSize:11,color:"#444",marginTop:8}}>例如：1-50、Low Rush、Flat、Ignition、Rush、6-70</div>
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
                if(layer.name.toLowerCase().includes(q)||(layer.nameEn&&layer.nameEn.toLowerCase().includes(q))){
                  results.push({product:p,...layer});
                }
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
                    </div>
                  );
                })}
              </div>
            );
          })()}
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
                <div key={p.id} onClick={()=>toggleOwned(p.id)}
                  style={{display:"flex",alignItems:"flex-start",gap:14,padding:"14px 18px",borderRadius:14,cursor:"pointer",
                    background:owned?"rgba(34,197,94,0.07)":"rgba(255,255,255,0.04)",
                    border:`1px solid ${owned?"rgba(34,197,94,0.3)":"rgba(255,255,255,0.09)"}`}}>
                  <div style={{width:22,height:22,borderRadius:6,flexShrink:0,marginTop:2,
                    background:owned?"#34d399":"rgba(255,255,255,0.08)",
                    border:`2px solid ${owned?"#34d399":"rgba(255,255,255,0.2)"}`,
                    display:"flex",alignItems:"center",justifyContent:"center",color:"#000",fontWeight:900,fontSize:13}}>
                    {owned?"✓":""}
                  </div>
                  <div style={{flex:1}}>
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
