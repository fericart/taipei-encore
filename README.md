# 台北安可 · 101 雲端舞台

粉絲創作，非官方網站。原創方塊城市、巨獸與超人舞台，支援拖曳旋轉、煙火、安可、手機版與 iframe 嵌入。

## 網站

- GitHub Pages：https://fericart.github.io/taipei-encore/
- Sites：https://taipei-encore-rooftop-2026.feric.chatgpt.site/

## 這個版本

- 中央超人裝主角、左右外傾並抓住 101 的巨獸。
- 每 30 秒循環：金剛抬頭捶胸、哥吉拉藍色吐息掃射、兩側蜘蛛人射絲飛躍。
- 全場安可：主角大幅點頭、街道與屋頂群眾隨節拍跳躍。
- 台北大巨蛋、臺北流行音樂中心、三架直播直升機與可點擊政策看板。

## 本機執行

這是無需建置的靜態網站。請透過 HTTP 伺服器開啟，勿直接以 file:// 開啟 ES modules。

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

瀏覽 http://127.0.0.1:4173/ 。

## 發布

GitHub Pages 使用 `codex/github-pages` 分支根目錄，`.nojekyll` 保留靜態檔。推送該分支後 GitHub 自動重新發布。分享與 iframe 連結會採用目前所在網域及子目錄。

## 來源與素材

頁面的「關於與來源」列出市政府原文、建築參考及權利說明。施政成果與未來提案分開呈現；未查得的「黃金十年」標題不冒充官方政見。北流僅作城市地標，不列為本任成果。

人物、建築、蜘蛛絲與視覺效果由幾何模型及程式自行製作，未重製電影畫面、音效、照片或角色模型。原角色與名稱權利屬各自權利人，本站未聲稱取得角色授權，也不代表本人或權利人背書。系統字型不隨網站分發。

Three.js v0.170.0：MIT，見 [授權文件](assets/THREE-LICENSE.txt)。

音樂僅透過使用者點擊後載入的 [YouTube 官方 MV 播放器](https://www.youtube.com/watch?v=uKCiYJdv6Zg)，不託管影音檔。網站不含帳號或分析追蹤系統。

實際驗證及其限制見 [VALIDATION.txt](VALIDATION.txt)。此倉庫僅包含公開網站與文件，不包含 Sites 憑證、其他專案、玩家資料或原始託管 Git 設定。
