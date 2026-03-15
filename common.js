/* ============================================================
   企業図鑑 - 共通JavaScript (common.js)
   企業詳細ページ共通JS（タブ切替・ニュースフィルター）
   最終更新: 2026-03-15
   ============================================================ */
function switchTab(name, el) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + name).classList.add('active');
  el.classList.add('active');
}
function filterNews(type, el) {
  document.querySelectorAll('.news-filter-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.news-card').forEach(card => {
    if (type === 'all' || card.dataset.type === type) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}
