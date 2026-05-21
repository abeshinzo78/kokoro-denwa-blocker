# 心のでんわブロッカー

Googleで自殺関連のことなどを検索した際に検索結果に表示される「相談窓口」「いのちの電話」などの特定の情報パネルを非表示にするブラウザ拡張機能です。

Chrome と Firefox に対応しています。

## ダウンロード

[最新リリース](https://github.com/abeshinzo78/kokoro-denwa-blocker/releases/latest) から `kokoro-denwa-blocker.xpi` をダウンロードしてください。

## インストール

### Firefox

ダウンロードした `.xpi` ファイルを Firefox にドラッグ&ドロップするか、Firefox のメニュー → アドオンとテーマ → 歯車アイコン → 「ファイルからアドオンをインストール」から `.xpi` ファイルを選択します。

### Chrome / Edge (Chromium系)

1. `chrome://extensions/` を開く
2. デベロッパーモードを有効にする
3. 「パッケージ化されていない拡張機能を読み込む」からこのフォルダを選択

## 動作

- 検索結果ページで「相談窓口」「いのちの電話」「自殺予防」などのキーワードを含む Google の情報パネルを検出し非表示にします
- 通常の検索結果（ウェブページのスニペット）には影響しません
- 動的に読み込まれる要素にも即座に反応します

## ファイル構成

```
kokoro-denwa-blocker/
├── manifest.json  # 拡張機能の設定（Manifest V3）
├── content.js     # 要素検出・非表示スクリプト
└── styles.css     # 非表示スタイル
```

## ライセンス

MIT
