/* ════════════════════════════════════════════════════════════════
   狗狗證（護照款）— 學生專屬頁用（每隻狗都有；分享圖同一個元件）
   [2026-09-29 老闆批] 尺寸跟真護照資料頁 125×88mm（打橫）。證上只放身份資料；
     呈分試資料（簽證）只喺呈分試專屬頁，用返品牌原本風格，唔用本檔。
   · 用法：<div data-paw-passport [data-logo="corner|wm|both"]></div> 之後載入本檔 → 自動砌好卡
           （元素 id 前綴預設 idc，例：idcAva／idcChip）
           PawPassport.fill({...}) 填資料；PawPassport.markup('sp') 可另砌一張（例：分享圖）
   · 字體大小用 cqw（跟卡闊度縮放），手機同 1080px 分享圖同一個比例
   · 證件米金色系（#E0CFA8／#A08A62 等）同舊狗狗證一致
   ════════════════════════════════════════════════════════════════ */
(function () {
  var BASE = (document.currentScript && document.currentScript.src || '').replace(/[^\/]*$/, '');   // …/assets/
  var LOGO = 'both';   // [2026-09-29 Erica 揀 C] 左上角盾牌 logo＋卡底淡色浮水印（'corner'／'wm'／'both'／''）
  var CSS = [
    /* [2026-09-29 老闆：要更精緻] 幼金邊＋內框線、字重收細、標籤疏字距、機讀碼縮細變淡 */
    '.pp{position:relative;aspect-ratio:125/88;container-type:inline-size;border:1.5px solid #E0CFA8;border-radius:12px;overflow:hidden;',
    '  background:linear-gradient(150deg,#FFFDF8,#FBF4E6 60%,#F6E8CB);box-shadow:0 6px 22px rgba(92,62,39,.13),0 1px 2px rgba(92,62,39,.08);color:#1F3552;',
    '  font-family:"Nunito","Huninn","Helvetica Neue",system-ui,sans-serif;line-height:1.2;text-align:left}',
    '.pp::before{content:"";position:absolute;inset:0;pointer-events:none;',
    '  background-image:repeating-linear-gradient(135deg,rgba(201,141,44,.04) 0 1px,transparent 1px 6px)}',
    '.pp::after{content:"";position:absolute;inset:1.6cqw;border:.22cqw solid rgba(201,141,44,.32);border-radius:1.2cqw;pointer-events:none}',
    '.pp-in{position:absolute;inset:0;display:flex;flex-direction:column;padding:3.4cqw 5cqw 0}',
    '.pp-hd{display:flex;align-items:center;gap:2cqw;padding-bottom:1.5cqw;',
    '  background:linear-gradient(90deg,rgba(201,141,44,.45),rgba(201,141,44,.12)) bottom/100% .22cqw no-repeat}',
    '.pp-hd img.pp-logo{width:7.6cqw;height:auto;flex-shrink:0}',
    '.pp-wm{position:absolute;left:50%;top:52%;width:62cqw;transform:translate(-50%,-50%);opacity:.07;pointer-events:none}',
    '.pp-t1{font-family:"Fredoka","Huninn","Nunito",sans-serif;font-weight:700;font-size:3.6cqw;letter-spacing:.08em;white-space:nowrap}',
    '.pp-t2{font-size:1.55cqw;font-weight:800;color:#A8906A;letter-spacing:.3em;margin-top:.45cqw;white-space:nowrap}',
    '.pp-hr{margin-left:auto;display:flex;gap:3cqw;text-align:left}',
    '.pp-k{font-size:1.55cqw;font-weight:800;color:#A8906A;letter-spacing:.1em;white-space:nowrap}',
    '.pp-v{font-size:2.75cqw;font-weight:800;color:#1F3552;margin-top:.3cqw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:.02em}',
    '.pp-v.no{font-family:"Fredoka","Nunito",sans-serif;font-weight:600;font-size:3.2cqw;letter-spacing:.06em}',
    '.pp-v.over{color:#B91C1C}',
    '.pp-bd{flex:1;display:flex;gap:3.6cqw;margin-top:1.8cqw;min-height:0}',
    '.pp-ph{width:25cqw;height:32.2cqw;flex-shrink:0;border:.25cqw solid #E0CFA8;border-radius:.9cqw;overflow:hidden;',
    '  background:#F5F0E8 center/cover no-repeat;display:flex;align-items:center;justify-content:center;',
    '  box-shadow:inset 0 0 0 .6cqw rgba(255,253,248,.55),0 .3cqw .9cqw rgba(92,62,39,.10)}',
    '.pp-ph img.ph{width:80%;height:auto;object-fit:contain}',
    '.pp-f{flex:1;min-width:0;display:grid;grid-template-columns:1fr 1fr;column-gap:2.6cqw;row-gap:.9cqw;align-content:start}',
    '.pp-f .pp-w{grid-column:1/-1}',
    '.pp-nm{font-family:"Fredoka","Huninn","Nunito",sans-serif;font-weight:600;font-size:5cqw;line-height:1.05;margin-top:.1cqw;letter-spacing:.02em;',
    '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.pp-v small{font-size:1.9cqw;font-weight:700;color:#A8906A;letter-spacing:.05em;margin-left:1cqw}',
    '.pp-mrz{margin:auto 0 0;padding:1.1cqw 0 3.3cqw;border-top:.2cqw dashed rgba(201,141,44,.35);',
    '  font-family:"OCR-B","OCR B","Courier New",Courier,monospace;font-weight:600;font-size:2.3cqw;letter-spacing:.5cqw;',
    '  line-height:1.5;color:#A8906A;white-space:pre;overflow:hidden}'
  ].join('\n');

  function injectCss() {
    if (document.getElementById('pp-css')) return;
    var st = document.createElement('style');
    st.id = 'pp-css'; st.textContent = CSS;
    document.head.appendChild(st);
  }

  // logo：'' 冇／'corner' 左上角／'wm' 浮水印／'both'（2026-09-29 出圖畀 Erica 揀）
  function markup(px, logo) {
    px = px || 'idc';
    logo = logo || LOGO;
    var f = function (id, k, cls, w) {
      return '<div' + (w ? ' class="pp-w"' : '') + '><div class="pp-k">' + k + '</div><div class="pp-v' + (cls ? ' ' + cls : '') + '" id="' + px + id + '">—</div></div>';
    };
    var wm = (logo === 'wm' || logo === 'both') ? '<img class="pp-wm" src="' + BASE + 'pawradise-mark-wm.png" alt="" crossorigin="anonymous">' : '';
    var corner = (logo === 'corner' || logo === 'both') ? '<img class="pp-logo" src="' + BASE + 'pawradise-crest.png" alt="Pawradise" crossorigin="anonymous">' : '';
    return '<div class="pp">' + wm + '<div class="pp-in">' +
      '<div class="pp-hd">' + corner +
        '<div><div class="pp-t1">狗狗證</div><div class="pp-t2">DOG IDENTITY CARD</div></div>' +
        '<div class="pp-hr">' + f('Type', '類別 TYPE') + f('No', '編號 DOG ID', 'no') + '</div></div>' +
      '<div class="pp-bd">' +
        '<div class="pp-ph" id="' + px + 'Ava"><img class="ph" src="' + BASE + 'daki-explore.png" alt="" crossorigin="anonymous"></div>' +
        '<div class="pp-f">' +
          '<div class="pp-w"><div class="pp-k">名字 NAME</div><div class="pp-nm" id="' + px + 'Name">—</div></div>' +
          f('Breed', '品種 BREED', '', true) +
          f('Sex', '性別 SEX') + f('Dob', '出生日期 DATE OF BIRTH') +
          f('Chip', '晶片 MICROCHIP') + f('Home', '居住地 RESIDENCE') +
          f('Issue', '簽發日期 DATE OF ISSUE') + f('Expiry', '有效期至 DATE OF EXPIRY') +
          f('Auth', '簽發機構 AUTHORITY', '', true) +
        '</div></div>' +
      '<div class="pp-mrz" id="' + px + 'Mrz"></div>' +
    '</div></div>';
  }

  // ── 格式 ──
  var MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  function ymdParts(s) {
    var m = String(s || '').match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
    return m ? { y: +m[1], m: +m[2], d: +m[3] } : null;
  }
  function dateEn(s) {           // 2026-03-12 → 12 MAR 2026（護照格式）
    var p = ymdParts(s);
    return p ? ('0' + p.d).slice(-2) + ' ' + MON[p.m - 1] + ' ' + p.y : '';
  }
  function sexOf(v) {            // CRM：男（M）／女（F）
    var s = String(v || '');
    if (/F|女|母/i.test(s)) return { zh: '女生', en: 'F' };
    if (/M|男|公/i.test(s)) return { zh: '男生', en: 'M' };
    return null;
  }
  // ── 機讀碼（跟 ICAO 9303 護照 TD3：兩行各 44 字，7-3-1 校驗碼）──
  function cd(str) {
    var w = [7, 3, 1], sum = 0;
    for (var i = 0; i < str.length; i++) {
      var c = str.charAt(i), v = 0;
      if (c >= '0' && c <= '9') v = +c; else if (c >= 'A' && c <= 'Z') v = c.charCodeAt(0) - 55;
      sum += v * w[i % 3];
    }
    return String(sum % 10);
  }
  function pad(s, n) { s = String(s || ''); while (s.length < n) s += '<'; return s.slice(0, n); }
  function yymmdd(s) { var p = ymdParts(s); return p ? String(p.y).slice(-2) + ('0' + p.m).slice(-2) + ('0' + p.d).slice(-2) : '<<<<<<'; }
  function mrz(p) {
    var nm = String(p.name || '').toUpperCase().replace(/[^A-Z0-9 ]/g, '').trim().replace(/\s+/g, '<') || 'DOG';
    var l1 = pad('D<HKG' + nm + '<<PAWRADISE', 44);
    var doc = pad(String(p.dogId || '').toUpperCase().replace(/[^A-Z0-9]/g, ''), 9);
    var dob = yymmdd(p.dob), exp = yymmdd(p.expiry);
    var sx = sexOf(p.sex); sx = sx ? sx.en : '<';
    var opt = pad('', 14);
    var d1 = doc + cd(doc), d2 = dob + cd(dob), d3 = exp + cd(exp), d4 = opt + cd(opt);
    var l2 = d1 + 'HKG' + d2 + sx + d3 + d4;
    l2 += cd(d1 + d2 + d3 + d4);
    return [l1, l2];
  }

  // root：未放入 document 嘅節點（例：分享圖）
  // p：{ name, typeZh, typeEn, dogId, breed, breedEn, sex, dob, chipLast4, issued, expiry, expired, auth }
  function fill(p, px, root) {
    px = px || 'idc';
    var g = function (id) { return (root || document).querySelector('#' + px + id); };
    var t = function (id, v) { var e = g(id); if (e) e.textContent = v || '—'; };
    var sx = sexOf(p.sex);
    t('Name', p.name);
    t('Type', p.typeZh);   // 標籤已有 TYPE，數值只放中文，唔夠位
    t('No', p.dogId);
    var b = g('Breed');
    if (b) {
      b.textContent = p.breed || '—';
      if (p.breed && p.breedEn) { var sm = document.createElement('small'); sm.textContent = p.breedEn; b.appendChild(sm); }
      b.title = (p.breed || '') + (p.breedEn ? ' ' + p.breedEn : '');
    }
    t('Sex', sx ? sx.zh + ' ' + sx.en : '');
    t('Dob', dateEn(p.dob));
    t('Chip', p.chipLast4 ? '＊＊＊＊ ' + p.chipLast4 : '');
    t('Issue', dateEn(p.issued));
    t('Expiry', dateEn(p.expiry));
    var ex = g('Expiry'); if (ex) ex.classList.toggle('over', !!p.expired);
    t('Home', p.residence || '香港 HK');
    t('Auth', p.auth || 'Pawradise 毛孩社交學院');
    var m = g('Mrz'); if (m) m.textContent = mrz(p).join('\n');
  }

  injectCss();
  var slots = document.querySelectorAll('[data-paw-passport]');
  for (var i = 0; i < slots.length; i++) slots[i].innerHTML = markup(slots[i].getAttribute('data-paw-passport') || 'idc', slots[i].getAttribute('data-logo'));
  window.PawPassport = { markup: markup, fill: fill, mrz: mrz, dateEn: dateEn, sexOf: sexOf, injectCss: injectCss };
})();
