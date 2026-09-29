/* ════════════════════════════════════════════════════════════════
   狗狗證（護照款）— 學生專屬頁同呈分試專屬頁共用
   [2026-09-29 老闆批] 兩張狗狗證統一；尺寸跟真護照資料頁 125×88mm（打橫）。
   · 證上只放身份資料；學籍／歷屆紀錄／活動印章放證下面嘅「簽證頁」（各頁自己砌，樣式用呢度嘅 .pp-visa）
   · 用法：<div data-paw-passport></div> 之後載入本檔 → 自動砌好卡（元素 id 前綴預設 idc，例：idcAva／idcChip）
           PawPassport.fill({...}) 填資料；PawPassport.markup('sp') 可另砌一張（例：分享圖）
   · 字體大小用 cqw（跟卡闊度縮放），手機同 1080px 分享圖同一個比例
   · 證件米金色系（#E0CFA8／#A08A62 等）同舊狗狗證一致；印章用品牌 token（有 fallback，呈分試頁冇載入 tokens）
   ════════════════════════════════════════════════════════════════ */
(function () {
  var BASE = (document.currentScript && document.currentScript.src || '').replace(/[^\/]*$/, '');   // …/assets/
  var CSS = [
    '.pp{position:relative;aspect-ratio:125/88;container-type:inline-size;border:2px solid #E0CFA8;border-radius:14px;overflow:hidden;',
    '  background:linear-gradient(150deg,#FFFDF7,#FBF3E4 62%,#F7E7C6);box-shadow:0 4px 20px rgba(92,62,39,.12);color:#1F3552;',
    '  font-family:"Nunito","Huninn","Helvetica Neue",system-ui,sans-serif;line-height:1.2;text-align:left}',
    '.pp::before{content:"";position:absolute;inset:0;pointer-events:none;',
    '  background-image:repeating-linear-gradient(135deg,rgba(201,141,44,.055) 0 2px,transparent 2px 9px)}',
    '.pp-in{position:absolute;inset:0;display:flex;flex-direction:column;padding:2.6cqw 4cqw 0}',
    '.pp-hd{display:flex;align-items:center;gap:2.2cqw;border-bottom:.45cqw solid rgba(201,141,44,.3);padding-bottom:1.6cqw}',
    '.pp-hd img{width:8cqw;height:auto;flex-shrink:0}',
    '.pp-t1{font-family:"Fredoka","Huninn","Nunito",sans-serif;font-weight:700;font-size:3.9cqw;letter-spacing:.05em;white-space:nowrap}',
    '.pp-t2{font-size:1.75cqw;font-weight:800;color:#A08A62;letter-spacing:.2em;margin-top:.5cqw;white-space:nowrap}',
    '.pp-hr{margin-left:auto;display:flex;gap:3.2cqw;text-align:left}',
    '.pp-k{font-size:1.75cqw;font-weight:900;color:#A08A62;letter-spacing:.06em;white-space:nowrap}',
    '.pp-v{font-size:2.9cqw;font-weight:900;color:#1F3552;margin-top:.35cqw;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.pp-v.no{font-family:"Fredoka","Nunito",sans-serif;font-size:3.3cqw;letter-spacing:.04em}',
    '.pp-v.over{color:#B91C1C}',
    '.pp-bd{flex:1;display:flex;gap:3.6cqw;margin-top:1.6cqw;min-height:0}',
    '.pp-ph{width:26cqw;height:33.4cqw;flex-shrink:0;border:.4cqw solid #E0CFA8;border-radius:1cqw;overflow:hidden;',
    '  background:#F5F0E8 center/cover no-repeat;display:flex;align-items:center;justify-content:center}',
    '.pp-ph img.ph{width:80%;height:auto;object-fit:contain}',
    '.pp-f{flex:1;min-width:0;display:grid;grid-template-columns:1fr 1fr;column-gap:2.6cqw;row-gap:.8cqw;align-content:start}',
    '.pp-f .w{grid-column:1/-1}',
    '.pp-nm{font-family:"Fredoka","Huninn","Nunito",sans-serif;font-weight:700;font-size:5cqw;line-height:1.05;margin-top:.1cqw;',
    '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.pp-v small{font-size:2cqw;font-weight:800;color:#A08A62;letter-spacing:.04em;margin-left:1cqw}',
    '.pp-mrz{margin:1cqw -4cqw 0;padding:1.3cqw 4cqw 1.7cqw;background:rgba(255,253,247,.78);border-top:.3cqw solid #E6D8BC;',
    '  font-family:"OCR-B","OCR B","Courier New",Courier,monospace;font-weight:700;font-size:3.3cqw;letter-spacing:.07cqw;',
    '  line-height:1.3;color:#5C4A33;white-space:pre;overflow:hidden}',
    /* 簽證頁（卡下面：學籍／紀錄／活動印章） */
    '.pp-visa{margin-top:10px;border:1.5px dashed #E0CFA8;border-radius:14px;background:#FFFDF7;padding:12px 14px 14px;color:#1F3552}',
    '.pp-visa-t{display:flex;justify-content:space-between;align-items:baseline;font-size:10.5px;font-weight:900;color:#A08A62;letter-spacing:.16em}',
    '.pp-visa-t span{letter-spacing:.08em;font-weight:800}',
    '.pp-vrow{display:flex;align-items:baseline;gap:8px;padding:6px 0;border-bottom:1px solid rgba(160,138,98,.22)}',
    '.pp-vrow .k{width:118px;flex-shrink:0;font-size:10.5px;font-weight:900;color:#A08A62;letter-spacing:.06em}',
    '.pp-vrow .v{font-size:13px;font-weight:900;color:#1F3552;word-break:break-word}',
    '.pp-vrow .v.over{color:#B91C1C}',
    '.pp-rec{display:flex;margin-top:8px}',
    '.pp-rec .c{flex:1;text-align:center}',
    '.pp-rec .c .k{font-size:10.5px;font-weight:900;color:#A08A62;letter-spacing:.06em;line-height:1.4}',
    '.pp-rec .c .k span{display:block;font-size:8.5px;letter-spacing:.14em;opacity:.8}',
    '.pp-rec .c .v{font-family:"Fredoka","Nunito",sans-serif;font-weight:700;font-size:16px;color:#1F3552;margin-top:2px}',
    '.pp-stamps{display:flex;gap:10px;justify-content:space-around;margin-top:12px;flex-wrap:wrap}',
    '.pp-st{--c:#D98877;font-family:"Nunito","Huninn",sans-serif;box-sizing:border-box;width:92px;height:92px;border-radius:50%;border:3px double var(--c);display:flex;flex-direction:column;',
    '  align-items:center;justify-content:center;text-align:center;transform:rotate(-8deg);background:rgba(255,255,255,.4);line-height:1.2;',
    '  box-shadow:inset 0 0 0 4px rgba(255,255,255,.6),inset 0 0 0 5px var(--c)}',
    '.pp-st:nth-child(2){transform:rotate(6deg)}.pp-st:nth-child(3){transform:rotate(-3deg)}',
    '.pp-st b{font-size:11.5px;font-weight:900;color:#1F3552;line-height:1.2;max-width:90%;word-break:keep-all}',
    '.pp-st i{font-style:normal;font-size:7.5px;font-weight:900;color:#1F3552;letter-spacing:.06em;margin-top:2px;white-space:nowrap}',
    '.pp-st u{text-decoration:none;font-size:9.5px;font-weight:900;color:#1F3552;margin-top:3px;letter-spacing:.04em;white-space:nowrap}',
    '.pp-st.todo{border:2px dashed #CBBFA8;box-shadow:none;background:transparent;transform:none}',
    '.pp-st.todo b,.pp-st.todo i,.pp-st.todo u{color:#A8B2C0}',
    '.pp-big .pp-st{width:210px;height:210px;border-width:7px}.pp-big .pp-st b{font-size:27px}.pp-big .pp-st i{font-size:16px}',
    '.pp-big .pp-st u{font-size:21px;margin-top:8px}.pp-big .pp-st.todo{border-width:4px}',
    '.pp-st.c1{--c:var(--pw-terracotta,#D98877)}.pp-st.c2{--c:var(--pw-dusty-blue,#8FA7C4)}.pp-st.c3{--c:var(--pw-sage,#7C8F76)}'
  ].join('\n');

  function injectCss() {
    if (document.getElementById('pp-css')) return;
    var st = document.createElement('style');
    st.id = 'pp-css'; st.textContent = CSS;
    document.head.appendChild(st);
  }

  function markup(px) {
    px = px || 'idc';
    var f = function (id, k, cls, w) {
      return '<div' + (w ? ' class="w"' : '') + '><div class="pp-k">' + k + '</div><div class="pp-v' + (cls ? ' ' + cls : '') + '" id="' + px + id + '">—</div></div>';
    };
    return '<div class="pp"><div class="pp-in">' +
      '<div class="pp-hd">' +
        '<div><div class="pp-t1">狗狗證</div><div class="pp-t2">DOG IDENTITY CARD</div></div>' +
        '<div class="pp-hr">' + f('Type', '類別 TYPE') + f('No', '編號 DOG ID', 'no') + '</div></div>' +
      '<div class="pp-bd">' +
        '<div class="pp-ph" id="' + px + 'Ava"><img class="ph" src="' + BASE + 'daki-explore.png" alt="" crossorigin="anonymous"></div>' +
        '<div class="pp-f">' +
          '<div class="w"><div class="pp-k">名字 NAME</div><div class="pp-nm" id="' + px + 'Name">—</div></div>' +
          f('Breed', '品種 BREED', '', true) +
          f('Sex', '性別 SEX') + f('Dob', '出生日期 DATE OF BIRTH') +
          f('Chip', '晶片 MICROCHIP') + '<div></div>' +
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
    t('Auth', p.auth || 'Pawradise 毛孩社交學院');
    var m = g('Mrz'); if (m) m.textContent = mrz(p).join('\n');
  }

  // 簽證頁印章：{ zh, en, date, when, done, color:1|2|3 }（未蓋印顯示 when，例：10月24日）
  function stamp(s) {
    var esc = function (x) { return String(x || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    return '<div class="pp-st c' + (s.color || 1) + (s.done ? '' : ' todo') + '"><b>' + esc(s.zh) + '</b><i>' + esc(s.en) + '</i><u>' +
      esc(s.done ? dateEn(s.date) : (s.when || '待蓋印')) + '</u></div>';
  }

  injectCss();
  var slots = document.querySelectorAll('[data-paw-passport]');
  for (var i = 0; i < slots.length; i++) slots[i].innerHTML = markup(slots[i].getAttribute('data-paw-passport') || 'idc');
  window.PawPassport = { markup: markup, fill: fill, mrz: mrz, stamp: stamp, dateEn: dateEn, sexOf: sexOf, injectCss: injectCss };
})();
