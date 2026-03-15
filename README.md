# 企業図鑑 📊

Z世代の就活・転職を支援する企業データベースサイト。
有価証券報告書に基づく財務データ・平均年収・社風スコア・最新ニュースを集約。

🔗 **本番サイト**: https://kigyouzukan.vercel.app/top.html

---

## 掲載企業（14社）

| 業界 | 企業 |
|------|------|
| アパレル | ファーストリテイリング |
| 自動車 | トヨタ自動車 |
| IT・通信 | ソフトバンク・NTTデータG・富士通 |
| 金融 | 三菱UFJ・野村HD |
| 製造 | ソニーG・パナソニックHD・キーエンス |
| 小売 | イオン・セブン&アイHD |
| 食品 | 味の素・日清食品HD |

---

## ファイル構成

```
kigyouzukan/
├── top.html              # トップページ
├── shindan.html          # 企業診断
├── common.css            # 共通スタイルシート（企業詳細ページ用）
├── common.js             # 共通JavaScript（企業詳細ページ用）
├── vercel.json           # Vercelセキュリティヘッダー設定
├── CHANGELOG.md          # 変更履歴
├── README.md             # このファイル
├── firstretailing.html   # 各企業詳細ページ
├── toyota.html
├── softbank.html
├── nttdata.html
├── fujitsu.html
├── mufg.html
├── nomura.html
├── sony.html
├── panasonic.html
├── keyence.html
├── aeon.html
├── 7i.html
├── ajinomoto.html
└── nissin.html
```

---

## ローカル確認方法

1. [Local by Flywheel](https://localwp.com/) を起動
2. ファイルをpublicフォルダに配置:
```
/Users/nomakazuki/Local Sites/kigyouzukan/app/public/
```
3. ブラウザで開く: http://kigyouzukan.local/top.html

---

## デプロイ方法

GitHubのmainブランチにpushすると**Vercelに自動デプロイ**されます。

```
GitHub（main）→ Vercel（自動）→ https://kigyouzukan.vercel.app/
```

---

## ブランチ運用ルール

| ブランチ名 | 用途 |
|-----------|------|
| `main` | 本番環境。直接pushは原則禁止 |
| `feature/add-{企業名}` | 新企業ページ追加時 |
| `feature/{機能名}` | 新機能追加時 |
| `fix/{バグ内容}` | バグ修正時 |
| `update/news-{日付}` | ニュース更新時 |

### コミットメッセージ規則

```
feat: ソニーページを追加
fix: カードクリックが飛ばない問題を修正
update: 全社ニュースを2026年3月版に更新
refactor: common.css/jsに共通コードを分離
docs: 仕様書v1.0を追加
security: vercel.jsonにセキュリティヘッダーを追加
```

---

## 技術スタック

- **フロントエンド**: HTML / CSS / JavaScript（フレームワークなし）
- **ホスティング**: Vercel
- **バージョン管理**: GitHub
- **ローカル開発**: Local by Flywheel（WordPress環境）
- **データソース**: EDINET 有価証券報告書・各社IR資料

---

## 免責事項

- 財務データはEDINET有価証券報告書に基づきますが、最新情報と異なる場合があります
- 社風スコアは独自調査・推定値であり、各社の公式見解ではありません
- 株価はダミーデータです
- 本情報を投資判断・就職判断の唯一の根拠とすることはお控えください

© 2026 企業図鑑
