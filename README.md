# 🎙️ AI 會議記錄助手

使用 Google Gemini AI 將會議錄音自動轉換成結構化的 Word 會議記錄文件。

---

## 📋 目錄

- [功能介紹](#-功能介紹)
- [系統需求](#-系統需求)
- [事前準備](#-事前準備)
- [安裝步驟](#-安裝步驟)
- [啟動專案](#-啟動專案)
- [使用方式](#-使用方式)
- [常見問題](#-常見問題)

---

## ✨ 功能介紹

- 📤 上傳會議錄音檔案（支援 MP3、M4A、WAV 等格式）
- 🤖 使用 Google Gemini AI 自動分析錄音內容
- 📝 自動生成結構化會議記錄，包含：
  - 會議主題
  - 參與者
  - 討論重點摘要
  - 待辦事項 (Action Items)
- 📄 匯出為 Word (.docx) 文件

---

## 💻 系統需求

在開始之前，請確保你的電腦已安裝以下軟體：

### 1. Node.js（必須）

Node.js 是執行這個專案的運行環境。

**檢查是否已安裝：**

打開終端機（Terminal）或命令提示字元（CMD），輸入：

```bash
node -v
```

如果顯示版本號碼（例如 `v20.10.0`），表示已安裝。

**如果沒有安裝：**

1. 前往 [Node.js 官網](https://nodejs.org/)
2. 下載 **LTS 版本**（長期支援版，較穩定）
3. 執行安裝程式，一路點擊「下一步」直到完成
4. 安裝完成後，重新開啟終端機，再次執行 `node -v` 確認安裝成功

---

## 🔑 事前準備

### 取得 Google Gemini API Key

這個專案需要使用 Google Gemini API，你需要先取得 API Key。

**步驟：**

1. 前往 [Google AI Studio](https://aistudio.google.com/)

2. 使用你的 Google 帳號登入

3. 點擊左側選單的「**Get API key**」或「**取得 API 金鑰**」

4. 點擊「**Create API key**」或「**建立 API 金鑰**」

5. 選擇一個 Google Cloud 專案（如果沒有會自動建立）

6. 複製產生的 API Key（格式類似：`AIzaSy...`）

7. **重要：請妥善保管你的 API Key，不要分享給他人或上傳到公開的地方！**

---

## 📥 安裝步驟

### 步驟 1：下載專案

**方法 A：使用 Git（推薦）**

如果你有安裝 Git，打開終端機，輸入：

```bash
git clone https://github.com/Michael-Yan-wun/gemini-meeting-tool.git
```

**方法 B：直接下載**

1. 前往 [專案 GitHub 頁面](https://github.com/Michael-Yan-wun/gemini-meeting-tool)
2. 點擊綠色的「**Code**」按鈕
3. 選擇「**Download ZIP**」
4. 解壓縮下載的檔案

### 步驟 2：進入專案資料夾

```bash
cd gemini-meeting-tool
```

> 💡 **提示**：如果你用方法 B 下載，資料夾名稱可能是 `gemini-meeting-tool-master`，請改成：
> ```bash
> cd gemini-meeting-tool-master
> ```

### 步驟 3：安裝相依套件

在專案資料夾內執行：

```bash
npm install
```

這個指令會自動下載並安裝專案需要的所有套件，請耐心等待。

> ⏳ 第一次執行可能需要 1-3 分鐘，取決於你的網路速度。

### 步驟 4：設定環境變數

你需要建立一個 `.env` 檔案來存放你的 API Key。

> 📺 **詳細操作請參考課程影片**

1. 在專案資料夾內建立一個新檔案，命名為 `.env`（注意前面有一個點）
2. 打開 `.env` 檔案，複製貼上以下內容：

```
GEMINI_API_KEY=在這裡貼上你的API金鑰
```

3. 將 `在這裡貼上你的API金鑰` 替換成你在 Google AI Studio 取得的 API Key
4. 儲存檔案

---

## 🚀 啟動專案

### 開發模式

在專案資料夾內執行：

```bash
npm run dev
```

成功啟動後，你會看到類似這樣的訊息：

```
Nuxt 4.x.x with Nitro 2.x.x

  ➜ Local:    http://localhost:3000/
  ➜ Network:  http://192.168.x.x:3000/
```

### 開啟應用程式

1. 打開你的瀏覽器（Chrome、Edge、Safari 等）
2. 在網址列輸入：`http://localhost:3000`
3. 按下 Enter，就能看到應用程式介面了！

### 停止伺服器

在終端機中按下 `Ctrl + C` 即可停止伺服器。

---

## 📖 使用方式

### 步驟 1：上傳錄音檔

- 點擊上傳區域，或將檔案拖曳到上傳區域
- 支援的格式：MP3、M4A、WAV 等音訊格式

### 步驟 2：開始處理

- 點擊「**開始整理**」按鈕
- 等待 AI 處理（根據錄音長度，可能需要 30 秒到數分鐘）

### 步驟 3：下載會議記錄

- 處理完成後，會自動下載 Word 文件
- 檔案名稱格式：`meeting-minutes-日期.docx`

---

## ❓ 常見問題

### Q1：執行 `npm install` 時出現錯誤

**可能原因：**
- Node.js 版本過舊

**解決方法：**
- 確認 Node.js 版本至少為 18 以上：`node -v`
- 如果版本過舊，請重新下載安裝最新的 LTS 版本

### Q2：啟動後出現「GEMINI_API_KEY is not defined」錯誤

**可能原因：**
- `.env` 檔案未建立或內容錯誤

**解決方法：**
1. 確認專案根目錄有 `.env` 檔案
2. 確認檔案內容格式正確：`GEMINI_API_KEY=你的API金鑰`
3. 確認 API Key 沒有多餘的空格或換行
4. 重新執行 `npm run dev`

### Q3：上傳檔案後出現「處理失敗」

**可能原因：**
- API Key 無效或已過期
- 檔案格式不支援
- 檔案太大

**解決方法：**
- 確認 API Key 正確且有效
- 確認上傳的是音訊檔案（MP3、M4A、WAV）
- 嘗試較短的錄音檔案測試

### Q4：瀏覽器顯示「無法連線到這個網站」

**可能原因：**
- 伺服器未啟動
- 連接埠被佔用

**解決方法：**
1. 確認終端機有顯示 `Local: http://localhost:3000/`
2. 嘗試重新執行 `npm run dev`

### Q5：如何在其他裝置上使用？

當伺服器啟動時，終端機會顯示一個 Network 網址（如 `http://192.168.x.x:3000/`）。  
在同一個 Wi-Fi 網路下的其他裝置，可以透過這個網址存取應用程式。

---

## 🛠️ 技術資訊

本專案使用以下技術：

- **[Nuxt 4](https://nuxt.com/)** - Vue.js 框架
- **[Vue 3](https://vuejs.org/)** - 前端框架
- **[TailwindCSS](https://tailwindcss.com/)** - CSS 框架
- **[Google Gemini AI](https://ai.google.dev/)** - AI 語音辨識與文字生成
- **[docx](https://docx.js.org/)** - Word 文件生成

---

## 📄 授權

MIT License

---

## 🤝 貢獻

歡迎提交 Issue 或 Pull Request！
