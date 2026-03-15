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

/* ===== サイドバー（企業詳細ページ） ===== */
(function() {
  // top.htmlでは実行しない
  if (location.pathname.endsWith('top.html') || location.pathname === '/') return;



  const nav = document.querySelector('nav');
  if (!nav) return;

  // navの直後にoverlay＋detail-layout(sidebar+main)を挿入
  // navの後の全要素をmain-wrapに移動
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'sidebarOverlay';

  const aside = document.createElement('aside');
  aside.className = 'detail-sidebar';
  aside.id = 'detailSidebar';
  aside.innerHTML = `
  <div class="sb-btns">
    <button class="sb-btn outline">ログイン</button>
    <button class="sb-btn filled">無料登録</button>
  </div>
  <hr class="sidebar-sep">
  <div class="sidebar-label">メニュー</div>
  <a class="sb-item" href="top.html"><span class="sb-item-icon">🏠</span>企業一覧</a>
  <a class="sb-item" href="shindan.html"><span class="sb-item-icon">🤖</span>AI適性診断</a>
  <hr class="sidebar-sep">
  <div class="sidebar-label">企業を探す</div>
  <button class="sb-item" id="sbNavSearch"><span class="sb-item-icon">🔍</span>企業を検索</button>
  <hr class="sidebar-sep">
  <div class="sidebar-label">コンテンツ</div>
  <button class="sb-item" onclick="alert('近日公開予定！')"><span class="sb-item-icon">📰</span>最新ニュース</button>
  <button class="sb-item" onclick="alert('近日公開予定！')"><span class="sb-item-icon">⭐</span>お気に入り</button>`;

  const layout = document.createElement('div');
  layout.className = 'detail-layout';

  const main = document.createElement('div');
  main.className = 'detail-main';

  // navより後の全ノードをmainに移動
  while (nav.nextSibling) {
    main.appendChild(nav.nextSibling);
  }

  layout.appendChild(aside);
  layout.appendChild(main);
  nav.after(overlay, layout);

  // ハンバーガーをnaに追加
  const hamburgerHTML = `<button class="hamburger" id="hamburgerBtn"><span></span><span></span><span></span></button>`;
  const navLogo = nav.querySelector('.nav-logo');
  if (navLogo) navLogo.insertAdjacentHTML('beforebegin', hamburgerHTML);

  // イベント
  document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('detailSidebar');
    const overlay = document.getElementById('sidebarOverlay');

    hamburger?.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    });
    overlay?.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });

    // 企業を検索 → navSearchにフォーカス
    document.getElementById('sbNavSearch')?.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
      const input = document.getElementById('navSearch');
      if (input) { input.focus(); input.select(); }
    });
  });
})();
