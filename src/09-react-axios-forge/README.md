# 业务需求文档 (PRD)：09-装备锻造台 (Axios + TS 泛型深度实战)

## 业务背景
在《Word Killer》中，玩家可以在“装备锻造台”消耗背包中的材料来强化武器。
本模块的核心目标是模拟大厂真实的**前后端接口对接流程**：前端需要根据后端提供的纯 API 文档，独立推导出严谨的 TypeScript 类型（Interfaces），并结合 Axios 的泛型 `<T, R>` 彻底消除 `any` 类型，实现真正的**类型安全 (Type-Safe) 数据流**。

## 核心修炼点
* **接口逆向工程**: 根据后端 JSON 数据结构，反向推导并编写严谨的 TS `interface` 图纸。
* **TS 泛型注入**: 掌握 `request.get<any, 你的类型>` 和 `request.post<any, 你的类型>` 的精准用法，打通底层到 UI 的类型推导。
* **参数位置实战**: 强化记忆 `GET` 的 Query 参数 (`params`) 与 `POST` 的 Body 参数 (`data`) 的根本区别。

---

## 研发任务 (架构三部曲)

### 任务 1：底层基建 (`utils/request.ts`)
*跨关卡复用：这是整个前端工程的网络引擎。*

**内部逻辑**：
1. 复制你在上一关完美通关的 Axios 实例代码。
2. 确保包含完整的请求拦截（塞入 Token）与响应拦截（剥离 `data.data` + 兜底 401 和其他错误）逻辑。

### 任务 2：接口抽象层 (`api/forgeApi.ts`)
*这是本关的核心！你需要根据下方的后端文档，纯手写类型定义和请求函数。*

**【后端 API 契约文档】**
> **接口 A：获取材料列表 (GET `/forge/materials`)**
> * 传参：`rarity` (可选, string), `page` (必填, number)
> * 返回：`{ total: number, list: [{ id: string, name: string, count: number, rarity: string }] }`
>
> **接口 B：强化装备 (POST `/forge/enhance`)**
> * 传参：`equipmentId` (必填, string), `materialIds` (必填, string 数组), `safeMode` (必填, boolean)
> * 返回：`{ success: boolean, newLevel: number, currentDurability: number }`

**内部逻辑**：
1. **定义图纸 (Interfaces)**：
   - 必须导出 4 个接口：`MaterialItem`, `FetchMaterialsResponse`, `EnhanceRequestPayload`, `EnhanceResponse`。
2. **封装 `fetchMaterials(params)`**：
   - 使用 `request.get`。
   - **核心考点**：必须使用泛型 `<any, FetchMaterialsResponse>`，并确保参数放在配置对象的 `params` 属性中。
3. **封装 `enhanceEquipment(data)`**：
   - 使用 `request.post`。
   - **核心考点**：必须使用泛型 `<any, EnhanceResponse>`，并确保参数作为 POST 的第二个参数（Body 负载）传入。

### 任务 3：业务视图层 (`components/ForgePanel.tsx`)
*这是锻造台的操作面板，它将享受完美类型推导带来的极度舒适感。*

**内部逻辑**：
1. **定义状态 (`useState`)**：
   - `materials`: 初始为空数组 `[]`（记得用泛型约束为 `MaterialItem[]`）。
   - `loading`: 初始为 `true`。
   - `error`: 初始为 `""`。
2. **生命周期 (`useEffect`)**：
   - 定义异步函数 `initData`，并在 `try...catch...finally` 中调用 `fetchMaterials({ page: 1 })`。
   - 此时鼠标悬停在返回的数据上，TS 必须能精准提示出 `total` 和 `list`！
3. **防御性 UI 渲染 (严格顺序)**：
   - Loading 拦截：`return <div>🔥 熔炉预热中...</div>`
   - Error 拦截：`return <div style={{color: 'red'}}>❌ 炉火熄灭：{error}</div>`
   - 正常渲染：渲染材料列表。

------

### 🧪 黑盒验收测试 (类型与错误流演练)

1. **类型校验通关**：在 `ForgePanel.tsx` 中，输入 `materials[0].` 时，编辑器必须能自动补全 `id`, `name`, `count`, `rarity`。如果没补全或报错，说明 API 层的泛型没写对！
2. **灾难演练**：页面刚刷新显示“🔥 熔炉预热中...”，等待接口超时报错后，UI 平滑降级显示“❌ 炉火熄灭：Network Error”，全程无白屏。
3. **参数透传校验**：打开浏览器的 Network 面板（F12），确认 GET 请求的 URL 上正确挂载了 `?page=1`。