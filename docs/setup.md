# 環境構築ガイド

本プロジェクトのフロントエンド開発環境を構築・再現するための手順と、発生したトラブルの解決策を記録します。

## 🛠 基本スタック

| コンポーネント | 採用技術 | バージョン |
| :--- | :--- | :--- |
| **Runtime** | Node.js | v22.20.0+ |
| **Frontend Framework** | React | v19 (TypeScript) |
| **Build Tool** | Vite | 最新 |
| **CSS Framework** | Tailwind CSS | v4.0+ |
| **Package Manager** | npm | 10.9.3+ |

## 🚀 セットアップ手順

### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd job_search_ts
```

### 2. フロントエンド依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

---

## 🎨 CSS構成 (Tailwind CSS v4)

本プロジェクトでは最新の Tailwind CSS v4 を採用しています。従来の v3 系とは構成が異なるため注意してください。

!!! warning "設定ファイルの扱い" 
    v4 では tailwind.config.js は必須ではありません。  
    設定は主に src/index.css で行います。

### PostCSS の設定

`postcss.config.js` にて、新しい `@tailwindcss/postcss` プラグインを使用しています。

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
}
```

### エントリポイント

`src/index.css` で基本ディレクティブをインポートしています。

```css
@import "tailwindcss";
```

---

## ❓ トラブルシューティング

開発環境構築時に発生した問題と解決策を記録します。

### npx 実行エラー

!!! failure "現象"
    npx tailwindcss init -p 実行時に could not determine executable to run エラーが発生。

!!! success "解決策"
    WSL環境等のパス問題によりバイナリが正常にリンクされない場合、以下の手順で手動構築を行いました。  
    1. npm install -D tailwindcss @tailwindcss/postcss autoprefixer を実行。  
    2. tailwind.config.js および postcss.config.js を手動で作成。  
    3. src/index.css を v4 形式（@import）に修正。

---

## 📖 ドキュメント管理 (MkDocs)

ドキュメントサイトの編集・閲覧にはPython環境が必要です。

```bash
pip install -r requirements.txt
mkdocs serve
```

!!! tip "Material テーマ"
    本ドキュメントは [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) を使用しています。Mermaid 図法や Admonition（警告・注釈）などの拡張機能が利用可能です。

### トラブルシューティング: Invalid hook call / useRef is null
- **事象**: `BrowserRouter` 導入時に Hooks エラーが発生。
- **原因**: Component の定義形式、または React の二重読み込み。
- **対策**: `App.tsx` を完全な関数コンポーネント形式に修正し、`main.tsx` で `App` をコンポーネントとしてレンダリングするように統一。