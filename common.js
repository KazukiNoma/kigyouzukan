/* ============================================================
   企業図鑑 - 共通JavaScript (common.js)
   最終更新: 2026-03-15
   ============================================================ */

/* タブ切替 */
function switchTab(name, el) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  el.classList.add('active');
}

/* ニュースフィルター */
function filterNews(type, el) {
  document.querySelectorAll('.news-filter-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.news-card').forEach(card => {
    card.style.display = (type === 'all' || card.dataset.type === type) ? 'flex' : 'none';
  });
}

/* ナビ企業検索 */
const COMPANIES = [
  { name: "ファーストリテイリング", sub: "アパレル", url: "firstretailing.html" },
  { name: "トヨタ自動車", sub: "自動車", url: "toyota.html" },
  { name: "ソフトバンク", sub: "IT・通信", url: "softbank.html" },
  { name: "NTTデータグループ", sub: "IT・通信", url: "nttdata.html" },
  { name: "富士通", sub: "IT・通信", url: "fujitsu.html" },
  { name: "三菱UFJフィナンシャルG", sub: "金融", url: "mufg.html" },
  { name: "野村ホールディングス", sub: "金融", url: "nomura.html" },
  { name: "ソニーグループ", sub: "製造", url: "sony.html" },
  { name: "パナソニックHD", sub: "製造", url: "panasonic.html" },
  { name: "キーエンス", sub: "製造", url: "keyence.html" },
  { name: "イオン", sub: "小売", url: "aeon.html" },
  { name: "セブン&アイHD", sub: "小売", url: "7i.html" },
  { name: "味の素", sub: "食品", url: "ajinomoto.html" },
  { name: "日清食品HD", sub: "食品", url: "nissin.html" },
  { name: "三菱商事", sub: "商社", url: "mitsubishi.html" },
  { name: "伊藤忠商事", sub: "商社", url: "itochu.html" },
  { name: "三井物産", sub: "商社", url: "mitsui.html" },
  { name: "住友商事", sub: "商社", url: "sumitomo.html" },
  { name: "丸紅", sub: "商社", url: "marubeni.html" },
  { name: "三菱地所", sub: "不動産", url: "mec.html" },
  { name: "三井不動産", sub: "不動産", url: "mitsuifudosan.html" },
  { name: "武田薬品工業", sub: "医薬品", url: "takeda.html" },
];

document.addEventListener('DOMContentLoaded', function() {
  // ロゴクリックでトップへ
  const logo = document.querySelector('.nav-logo');
  if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => window.location.href = 'top.html');
  }

  const input = document.getElementById('navSearch');
  const suggest = document.getElementById('navSuggest');
  if (!input || !suggest) return;

  input.addEventListener('input', function() {
    const q = this.value.trim();
    if (!q) { suggest.style.display = 'none'; return; }

    const results = COMPANIES.filter(c =>
      c.name.includes(q) || c.sub.includes(q)
    ).slice(0, 6);

    if (results.length === 0) { suggest.style.display = 'none'; return; }

    suggest.innerHTML = results.map(c => `
      <a href="${c.url}" style="display:flex;align-items:center;gap:10px;padding:10px 16px;text-decoration:none;color:var(--ink);transition:background 0.15s;border-bottom:1px solid var(--border)" onmouseover="this.style.background='rgba(168,85,247,0.08)'" onmouseout="this.style.background=''" >
        <span style="font-size:12px;padding:2px 8px;border-radius:20px;background:rgba(168,85,247,0.1);color:#C084FC;white-space:nowrap">${c.sub}</span>
        <span style="font-size:13px;font-weight:600">${c.name}</span>
        <span style="margin-left:auto;color:var(--p1);font-size:13px">→</span>
      </a>`).join('');
    suggest.style.display = 'block';
  });

  // 外クリックで閉じる
  document.addEventListener('click', function(e) {
    if (!input.contains(e.target) && !suggest.contains(e.target)) {
      suggest.style.display = 'none';
    }
  });

  // Escで閉じる
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { suggest.style.display = 'none'; input.value = ''; }
  });
});
