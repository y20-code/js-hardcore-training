# 业务需求文档 (PRD)：10-勇者排行榜 (React Query 初体验)

## 业务背景
在《Word Killer》的主城广场中，有一座实时滚动的“全服勇者击杀榜”。由于榜单数据（服务端状态）更新频繁，且可能被多个组件同时共享，传统的 `useEffect` 方案会导致繁琐的状态管理和冗余的网络请求。
本模块的核心目标是引入大厂标配的数据同步工具 **React Query**，彻底告别手动维护 Loading/Error 状态，体验基于 `queryKey` 的**自动缓存 (Cache)** 与**后台静默刷新 (Background Refetch)** 机制，实现代码体积的“降维打击”。

## 核心修炼点
* **Server State 隔离**: 深刻理解前端“服务端状态（随时间过期）”与“客户端状态（本地UI状态）”的本质区别。
* **全局基建配置**: 掌握 `QueryClient` 与 `QueryClientProvider` 的顶层挂载模式。
* **Hook 革命**: 熟练使用 `useQuery` 替代传统的 `useState` + `useEffect` 异步数据流闭环。
* **缓存指纹标识**: 掌握 `queryKey` 数组在 React Query 中作为缓存“条形码”的核心作用。

---

## 研发任务 (架构三部曲)

### 任务 1：全局缓存基建 (`App.tsx` 或 `main.tsx`)
*这是整个前端工程的数据调度总控室。*

**内部逻辑**：
1. 从 `@tanstack/react-query` 引入 `QueryClient` 和 `QueryClientProvider`。
2. 在组件外部实例化一个全局唯一的管家：`const queryClient = new QueryClient()`。
3. 在组件的 `return` 中，使用 `<QueryClientProvider client={queryClient}>` 将你的业务组件（如 `<Leaderboard />`）包裹起来，为下层组件注入缓存能力。

### 任务 2：接口抽象层 (`api/leaderboardApi.ts`)
*保持纯净的 API 层，它只负责和后端通信，绝不掺杂 React 的状态逻辑。*

**【后端 API 契约文档】**
> **接口 A：获取击杀排行榜 (GET `/leaderboard`)**
> * 传参：无
> * 返回（脱壳后）：`[{ id: number, name: string, killCount: number }]` (玩家对象的数组)

**内部逻辑**：
1. **定义图纸 (Interfaces)**：
   - 必须导出 1 个接口：`Player` (包含 `id`, `name`, `killCount`)。
2. **封装 `fetchLeaderboard()`**：
   - 引入你封装好的 `request` 实例。
   - 使用 `request.get` 发送无参请求。
   - **核心考点**：继续保持 TypeScript ，使用泛型 `<any, Player[]>` 告诉底层拦截器返回的数据长什么样。

### 任务 3：业务视图层 (`components/Leaderboard.tsx`)
*大厂历史性的一刻：在这份文件里，绝对不许出现任何 `useState` 和 `useEffect`！*

**内部逻辑**：
1. **调用调度中心**：引入 `useQuery` 和刚才写的 `fetchLeaderboard` API。
2. **声明数据依赖**：
   - 使用 `useQuery` Hook，传入配置对象：
     - `queryKey: ['leaderboard']` (为这批数据贴上专属的缓存条形码)
     - `queryFn: fetchLeaderboard` (指派去后端进货的卡车司机)
   - 直接解构出四个核心状态：`{ data, isLoading, isError, error }`。
3. **防御性 UI 渲染 (严格顺序)**：
   - Loading 拦截：`return <div>🏆 正在拉取全服榜单...</div>`
   - Error 拦截：判定如果是 `isError`，`return <div style={{color: 'red'}}>❌ 榜单加载失败：{error.message}</div>`
   - 正常渲染：此时 `data` 已确认为 `Player[]` 数组，使用 `data.map` 循环渲染出每个玩家的排名、名字和击杀数。

------

### 🧪 黑盒验收测试 (网络层降维打击体验)

1. **代码洁癖校验**：全局搜索 `Leaderboard.tsx`，确认文件内不存在任何手动定义的状态和生命周期钩子，代码行数相比上一关缩减至少 40%。
2. **类型安全联调**：在 `.map((player) => ...)` 中输入 `player.`，编辑器必须能秒出 `killCount` 等属性的类型推导。
3. **缓存共享演练 (脑内推演)**：如果在另一个组件里也写下 `useQuery({ queryKey: ['leaderboard'], ... })`，它不会触发真实的 HTTP 请求，而是瞬间从内存中拿到现成数据。