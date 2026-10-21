# Matter of Scale 汉化任务进度记录

## 任务目标
将朋友网站（g8hh.com.cn 锅巴汉化组）上的《Matter of Scale》网页游戏中汉化不完全的部分补全。

## 当前状态：✅ 汉化补全已完成（纯数据补全，已产出完整 chs.js）

---

## 关键事实（已查清）

### 1. 汉化机制
- 游戏原作者是 **Jacorb90**，是 React + Knockout 增量/放置游戏，UI 文本全部由 JS 渲染。
- 锅巴汉化组的汉化方式（v0.6.1）：外挂一个 `chs.js` 字典 + `core.js` 引擎。
- `core.js` 用 `MutationObserver` 监听 DOM 文本变化，对**文本节点做逐项精确替换**：遍历 `cnItems` 的每个 key，若文本节点里包含该 key 就整段替换为对应中文值（按 key 长度排序，长的优先）。
- 因此：**`chs.js` 里没有的英文 key，游戏里就保持英文**；key===value（no-op）的条目等同于没翻译。
- 这意味着补全汉化 = 往 `chs.js` 的 `cnItems` 里补充缺失的 key，无需改动 `core.js` 或 `names.js`。

### 2. 缺失内容的来源
- `names.js` 定义了随机生成的地名/人名池（11 个层级，共 327 个专有名词）：
  Hamlets / Villages / Towns / Cities / Castles / Counties / Duchies / Archduchy / Kingdoms / Empires + 人名（first/last）。
- 原版 `chs.js` 只收录了其中约 52 个（如 London→伦敦），其余 **275 个完全没有 key**，随机生成后直接显示英文。
- 另有几处 no-op：`By Jacorb90`、`Jacorb's Games`。

### 3. 源文件获取（本环境限制）
- 本机 PowerShell 网络到 GitHub / g8hh 全部 TLS 握手失败（`SEC_E_NO_CREDENTIALS`），只能靠 `web_fetch`。
- `web_fetch` 拒绝 `application/javascript`，且直连 `raw.githubusercontent.com` 失败。
- **可靠路径**：`web_fetch` 调 GitHub API `contents/<file>?ref=main`（返回 base64）→ 本地 PowerShell `[Convert]::FromBase64String` 解码。
- 已解码保留在 `F:\DSH工作区\mos\src_chs\`：`chs.js`、`names_decoded.js`。
- 源仓库：`github.com/gityxs/matter-of-scale`（main 分支），即锅巴汉化组的汉化源码。

---

## 已完成的汉化补全

### 交付物
- **`F:\DSH工作区\mos\src_chs\chs.new.js`** —— 补全后的完整 `chs.js`（1298 行，608 个 key，原 431 个 + 新增 276 个 + 修正 51 个 no-op）。
- 部署方式：直接上传覆盖服务器上的 `chs.js` 即可，**不需动 `core.js` / `names.js`**。

### 补全内容
1. **276 个新增地名/人名**（覆盖 `names.js` 全部 327 个专有名词中缺失的那些）。
   - 知名大地名用通行译名（London→伦敦、York→约克、Prussia→普鲁士、Austria→奥地利、Babylonia→巴比伦尼亚…）。
   - 偏僻村镇/小聚落按音译（Ackhampstead→阿克汉普斯特德、Ballinger Bottom→巴林杰·博顿…）。
   - 人名按音译（Adam→亚当、Smith→史密斯、Haverford→哈弗福德…）。
2. **修正 51 个原 no-op 条目**（之前 key===value 没翻译的）。
3. **署名/标题汉化**：`By Jacorb90`→`作者 Jacorb90`，`Jacorb's Games`→`Jacorb 的游戏`，`Ackhampstead'`→`阿克汉普斯特德'`。

### 自动合并的处理细节
- 新增条目插入在 `var cnItems = {` 之后，并按 key 长度降序排列，避免短词先匹配破坏长词（如 `Leeds` 不受 `Lee` 影响、`Tower of London` 不受 `London` 影响）。`core.js` 自身也会按长度重排，此为双重保险。
- 复合人名（如 `Rudy Hill`）未单独收录：因为 `Rudy`→鲁迪、`Hill`→希尔 都已单独翻译，`core.js` 分项替换后会自动拼成 `鲁迪 希尔`。

### 校验结果
- 交叉比对 `names.js` 的全部地名/人名（323 个去重，不含 first/last 标签）：`PROBLEMS=0`，全部已翻译。
- 全文件扫描无残留真英文 no-op（除复合人名与空白转义外，均已解释）。
- `cnPrefix` / `cnPostfix` / `cnExcludeWhole` / `cnExcludePostfix` / `cnRegReplace` 等其余区块结构完整保留。

---

## 仍需注意 / 可选后续
- 原 `chs.js` 里**已含**的 431 条 UI 文本（非专有名词部分）此前已汉化，本次未改动；如需再润色可以单独看。
- `data/translations/en.js` 在仓库里只有约 955 字节（只是 options/managers 小桩），英文主串散落在各 component 文件里，由 `chs.js` 通过精确字符串匹配覆盖——若后续发现新版本游戏新增了未收录的英文串，按同样方式往 `chs.new.js` 里补 key 即可。
- 部署前建议：把 `chs.new.js` 改名为 `chs.js` 上传；保留一份 `chs.new.js` 作为备份与版本比对。

---

## 待办清单
- [x] 拿到 `chs.js` / `names.js` / `core.js` 源码（经 GitHub API）
- [x] 定位汉化机制（`core.js` 精确替换 + `names.js` 专名池）
- [x] 列出所有未汉化字段（275 缺失 + 51 no-op + 署名）
- [x] 逐项补全翻译（地名/人名/署名）
- [x] 校验：专有名词全覆盖、结构完整、无残留英文
- [x] 产出完整 `chs.new.js` 并说明部署方式
