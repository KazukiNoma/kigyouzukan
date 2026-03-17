/* ============================================================
   カイシャーク - 共通JavaScript (common.js)
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

/* ナビ企業検索 - companies.json から動的ロード */
let COMPANIES = [];
let COMPANIES_DATA = [];
let _companiesReady = false;
const _companiesCallbacks = [];

/** companies.json 読み込み完了後にコールバックを実行 */
function onCompaniesReady(fn) {
  if (_companiesReady) { fn(COMPANIES_DATA); return; }
  _companiesCallbacks.push(fn);
}

(function loadCompanies() {
  fetch('companies.json', { cache: 'no-store' })
    .then(r => r.json())
    .then(data => {
      COMPANIES_DATA = data;
      COMPANIES = data.map(c => ({ name: c.nameShort, sub: c.industry, url: c.url }));
      _companiesReady = true;
      _companiesCallbacks.forEach(fn => fn(COMPANIES_DATA));
      _companiesCallbacks.length = 0;
    })
    .catch(() => {
      // フォールバック: JSONロード失敗時は静的リスト
      _companiesReady = true;
      _companiesCallbacks.forEach(fn => fn([]));
      _companiesCallbacks.length = 0;
      COMPANIES = [
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
        { name: "KDDI", sub: "IT・通信", url: "kddi.html" },
        { name: "みずほフィナンシャルグループ", sub: "金融", url: "mizuho.html" },
        { name: "三井住友フィナンシャルグループ", sub: "金融", url: "smbc.html" },
      ];
    });
})();

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

/* ===== 企業詳細ページ: 比較ボタン + AI診断マッチスコア ===== */
(function() {
  if (location.pathname.endsWith('top.html') || location.pathname === '/' ||
      location.pathname.endsWith('compare.html') || location.pathname.endsWith('shindan.html')) return;

  document.addEventListener('DOMContentLoaded', function() {
    // 現在のページIDを取得
    const pageId = location.pathname.split('/').pop().replace('.html', '');

    // --- 比較ボタンをhero-actionsに追加 ---
    const heroActions = document.querySelector('.hero-actions');
    if (heroActions) {
      const compareBtn = document.createElement('a');
      compareBtn.href = `compare.html?ids=${pageId}`;
      compareBtn.className = 'btn-outline';
      compareBtn.style.cssText = 'text-decoration:none;display:inline-flex;align-items:center;gap:5px';
      compareBtn.innerHTML = '⚡ 比較する';
      heroActions.appendChild(compareBtn);
    }

    // --- AI診断結果からマッチスコアを表示 ---
    const diagData = JSON.parse(localStorage.getItem('kigyouzukan_diagnosis') || 'null');
    if (!diagData || !diagData.results) return;

    const myResult = diagData.results.find(r => r.id === pageId);
    if (!myResult) return;

    const score = myResult.match;

    // 社風タブにマッチスコアバナーを挿入
    const cultureTab = document.getElementById('tab-culture');
    if (cultureTab) {
      const banner = document.createElement('div');
      banner.style.cssText = 'background:linear-gradient(135deg,rgba(168,85,247,0.12),rgba(236,72,153,0.08));border:1px solid rgba(168,85,247,0.3);border-radius:14px;padding:16px 20px;margin-bottom:20px;display:flex;align-items:center;gap:16px';
      banner.innerHTML = `
        <div style="font-size:36px;font-weight:900;font-family:'Space Grotesk',sans-serif;background:linear-gradient(135deg,#A855F7,#EC4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;flex-shrink:0">${score}%</div>
        <div>
          <div style="font-size:13px;font-weight:700;margin-bottom:4px">🤖 あなたとのAI適性マッチ度</div>
          <div style="font-size:12px;color:var(--ink3)">AI社風診断の結果をもとに算出しています</div>
          <a href="shindan.html" style="font-size:11px;color:#C084FC;text-decoration:none">診断をやり直す →</a>
        </div>
      `;
      cultureTab.insertBefore(banner, cultureTab.firstChild);
    }

    // ヒーロー部分にも小バッジを追加
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
      const badge = document.createElement('span');
      badge.style.cssText = 'font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.3);color:#C084FC;vertical-align:middle;margin-left:8px';
      badge.textContent = `🤖 適性${score}%`;
      heroName.appendChild(badge);
    }
  });
})();

/* ===== 企業詳細ページ: 類似企業を動的レンダリング ===== */
(function() {
  if (location.pathname.endsWith('top.html') || location.pathname === '/' ||
      location.pathname.endsWith('compare.html') || location.pathname.endsWith('shindan.html')) return;

  document.addEventListener('DOMContentLoaded', function() {
    const pageId = location.pathname.split('/').pop().replace('.html', '');
    onCompaniesReady(function(data) {
      const current = data.find(c => c.id === pageId);
      if (!current || !current.similar || !current.similar.length) return;

      // sidebar-cardの「似たような企業」セクションを探す
      const allCards = document.querySelectorAll('.sidebar-card');
      let simCard = null;
      allCards.forEach(card => {
        const title = card.querySelector('.sidebar-title');
        if (title && title.textContent.includes('似た')) simCard = card;
      });
      if (!simCard) return;

      const simCompanies = current.similar
        .map(id => data.find(c => c.id === id))
        .filter(Boolean);

      // 既存の .similar-company を全部削除して再レンダリング
      simCard.querySelectorAll('.similar-company').forEach(el => el.remove());

      simCompanies.forEach(c => {
        const initials = (c.nameShort || c.name).replace(/[株式会社HD]/g,'').slice(0,2).toUpperCase();
        const colors = {
          'IT・通信': '#6366F1,#8B5CF6', '金融': '#10B981,#059669',
          '製造': '#F59E0B,#D97706', '自動車': '#3B82F6,#2563EB',
          '商社': '#EC4899,#DB2777', '小売': '#14B8A6,#0D9488',
          '食品': '#F97316,#EA580C', '不動産': '#8B5CF6,#7C3AED',
          '医薬品': '#06B6D4,#0891B2', 'アパレル': '#F43F5E,#E11D48',
        };
        const grad = colors[c.industry] || '#A855F7,#EC4899';
        const div = document.createElement('div');
        div.className = 'similar-company';
        div.style.cursor = 'pointer';
        div.onclick = () => location.href = c.url;
        div.innerHTML = `
          <div class="sim-logo" style="background:linear-gradient(135deg,#1a1a2e,#16213e)">
            <span style="background:linear-gradient(135deg,${grad});-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:800;font-size:13px">${initials}</span>
          </div>
          <div class="sim-info">
            <div class="sim-name">${c.nameShort || c.name}</div>
            <div class="sim-sub">${c.industry}${c.avgSalary ? ' | ' + c.avgSalary.toLocaleString() + '万円' : ''}</div>
          </div>`;
        simCard.appendChild(div);
      });

      // 「比較する」ボタンを追加
      const compareIds = [pageId, ...current.similar.slice(0,2)].join(',');
      const existingBtn = simCard.querySelector('.sim-compare-btn');
      if (!existingBtn) {
        const btn = document.createElement('a');
        btn.className = 'sim-compare-btn';
        btn.href = `compare.html?ids=${compareIds}`;
        btn.style.cssText = 'display:block;margin-top:12px;text-align:center;padding:8px;border-radius:10px;background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.25);color:#C084FC;font-size:12px;font-weight:600;text-decoration:none;transition:background 0.15s';
        btn.onmouseover = () => btn.style.background = 'rgba(168,85,247,0.2)';
        btn.onmouseout  = () => btn.style.background = 'rgba(168,85,247,0.1)';
        btn.textContent = '⚡ これらを比較する';
        simCard.appendChild(btn);
      }
    });
  });
})();

/* ===== 企業詳細ページ: 社風タブに事実データ（有価証券報告書）を動的注入 ===== */
(function() {
  if (location.pathname.endsWith('top.html') || location.pathname === '/' ||
      location.pathname.endsWith('compare.html') || location.pathname.endsWith('shindan.html')) return;

  function injectCultureFactData(companyData) {
    const cultureTab = document.getElementById('tab-culture');
    if (!cultureTab || cultureTab.querySelector('.culture-fact-data')) return;

    const salary    = companyData.avgSalary    ? companyData.avgSalary.toLocaleString() + '万円' : 'データなし';
    const tenure    = companyData.avgTenure    || 'データなし';
    const age       = companyData.avgAge       ? companyData.avgAge + '歳'                       : 'データなし';
    const femaleMgr = companyData.femaleMgrRatio || 'データなし';

    const factBlock = document.createElement('div');
    factBlock.className = 'culture-fact-data';
    factBlock.innerHTML = `
      <div class="section-title" style="margin-top:0">📋 <span>実態データ（有価証券報告書より）</span></div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px;margin-bottom:12px">
        ${[
          ['平均年収',     salary],
          ['平均勤続年数', tenure],
          ['平均年齢',     age],
          ['女性管理職比率', femaleMgr],
        ].map(([label, val]) => `
          <div style="background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:12px;text-align:center">
            <div style="font-size:20px;font-weight:900;font-family:'Space Grotesk',sans-serif;background:linear-gradient(135deg,#A855F7,#EC4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.2">${val}</div>
            <div style="font-size:11px;color:var(--ink3);margin-top:4px">${label}</div>
          </div>`).join('')}
      </div>
      <div style="font-size:11px;color:var(--ink3);padding:7px 12px;background:rgba(168,85,247,0.05);border-radius:8px">
        📌 出典：EDINET 有価証券報告書・各社IR資料（独自調査・推定値を含む）
      </div>`;

    // AI適性バナーがあればその直後、なければ先頭に挿入
    const aiMatchBanner = cultureTab.querySelector('[style*="AI適性マッチ度"]');
    if (aiMatchBanner) {
      aiMatchBanner.insertAdjacentElement('afterend', factBlock);
    } else {
      cultureTab.insertBefore(factBlock, cultureTab.firstChild);
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    const pageId = location.pathname.split('/').pop().replace('.html', '');
    onCompaniesReady(function(data) {
      const company = data.find(c => c.id === pageId);
      if (company) injectCultureFactData(company);
    });
  });
})();

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
  <a class="sb-item" href="compare.html"><span class="sb-item-icon">⚡</span>企業比較</a>
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
