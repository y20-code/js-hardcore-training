# 业务需求文档 (PRD)：08-怪物图鉴大厅 (React + Axios 架构解耦实战)

## 业务背景
在《Word Killer》中，玩家可以通过“怪物图鉴大厅”查看不同区域的怪物资料，并上报自己发现的新怪物。
本模块的核心目标是模拟大厂真实的前端架构分层，实现**“底层请求实例 -> API 接口抽象层 -> React 业务视图层”**的单向数据流闭环。

## 核心修炼点
* **底层复刻**: 凭借肌肉记忆，徒手重写 Axios 拦截器与 Token 验证逻辑。
* **API 层解耦**: 彻底剥离 UI 与网络协议，掌握 `GET` 请求的 `params` (URL参数) 与 `POST` 请求的 `data` (请求体) 的严格区分。
* **React 异步闭环**: 在组件内部完美揉合 `useState`、`useEffect` 与 `try...catch...finally` 防御性编程。
* **异常兜底渲染**: 处理网络延迟 (Loading) 与请求溃散 (Error) 时的 UI 降级展示。

---

## 研发任务 (架构三部曲)

### 任务 1：底层基建 (`utils/request.ts`)
*这是整个模块的网络引擎。*

**内部逻辑**：
1. 通关的 Axios 实例。
2. 包含 `baseURL: 'https://api.word-killer.com'` 和 `timeout: 5000`。
3. 请求拦截器：注入 `localStorage` 中的 `token`。
4. 响应拦截器：脱去 `response.data.data` 的外壳；处理 `401` 状态码重定向；兜底其他网络错误并 `Promise.reject(error)`。

### 任务 2：接口抽象层 (`api/monsterApi.ts`)
export interface Monster {
    id: number;
    name: string;
    hp: number;
}
*这是前端与后端的契约层。UI 组件绝对不允许直接接触 URL。*

**内部逻辑**：
1. 引入写好的 `request` 实例。
2. 封装 `fetchMonsters(region: string)`：
   - 使用 `request.get` 发送请求到 `/monsters`。
   - **核心考点**：GET 请求带参数，必须配置在 `params` 属性中（让 URL 变成 `/monsters?region=xxx`）。
3. 封装 `reportMonster(monsterData: object)`：
   - 使用 `request.post` 发送请求到 `/monsters/report`。
   - **核心考点**：POST 请求提交数据，数据直接作为 `request.post` 的第二个参数（即挂载在 HTTP 请求体 Body 中）。

### 任务 3：业务视图层 (`components/Bestiary.tsx`)
*这是玩家看到的总控台，它只负责调用 API 和控制 UI 状态。*

**内部逻辑**：
1. **定义状态 (`useState`)**：
   - `monsters`: 存放怪物列表，初始为 `[]`。
   - `loading`: 初始为 `true`（挂载即拉取数据）。
   - `error`: 初始为 `""`。
2. **生命周期 (`useEffect`)**：
   - 依赖项为 `[]`（仅挂载执行一次）。
   - 定义异步函数 `loadData`：
     - **try**: 调用 `fetchMonsters('森林')`。将返回的数据 `setMonsters`。
     - **catch**: 捕获异常，提取错误信息（`err.message`）并 `setError`。
     - **finally**: 执行 `setLoading(false)` 彻底关闭加载动画。
3. **防御性 UI 渲染 (严格顺序)**：
   - 如果 `loading === true`，直接 `return <div>⏳ 正在翻阅图鉴...</div>`。
   - 如果 `error` 有值，直接 `return <div style={{color: 'red'}}>❌ 糟糕：{error}</div>`。
   - 如果顺利存活到最后，使用 `.map()` 渲染 `monsters` 列表（必须带 `key`）。

------

### 🧪 黑盒验收测试 (错误流演练)

因为我们目前连接的是一个不存在的假接口 (`https://api.word-killer.com`)，所以这就是一次完美的**灾难演练**：
1. 页面刚刷新，屏幕瞬间显示“⏳ 正在翻阅图鉴...”。
2. 等待几秒钟（触发 timeout 或 DNS 解析失败），底层 Axios 响应拦截器捕获到网络错误，触发 `Promise.reject`。
3. 组件内的 `catch` 成功接到错误，`finally` 强制关闭 Loading。
4. 屏幕上的漏斗消失，变成红色的报错信息：“❌ 糟糕：Network Error”。
5. 这证明你的数据流从底层的崩溃，完美传导到了最上层的 UI 提示，闭环逻辑完全打通！