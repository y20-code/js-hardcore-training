# 业务需求文档 (PRD)：冒险者任务大厅 (React 综合实战)

## 业务背景
在“Word Killer”游戏中，玩家每天可以去酒馆（Tavern）的任务大厅接取悬赏任务。
我们需要从服务器“拉取”任务列表，玩家可以在本地搜索任务，并接取（接取后任务从大厅消失）。

## 核心修炼点
* **Zustand**: 全局状态存储与修改。
* **useEffect**: 模拟组件挂载时的网络请求（生命周期）。
* **useState**: 控制本地的搜索框输入状态。
* **props + memo**: 父子组件传值，并使用 `memo` 防止子组件无意义的重复渲染。

---

## 研发任务

### 任务 1：搭建全局任务仓库 (`store/useQuestStore.ts`)
**接口图纸**：
```typescript
interface Quest {
    id: number;
    title: string;
    reward: number;
}

interface QuestState {
    quests: Quest[];
    setQuests: (newQuests: Quest[]) => void; // 动作：初始化/覆盖任务列表
    removeQuest: (id: number) => void;       // 动作：玩家接取后，从列表中剔除该任务
}
```

**内部逻辑**：

- 初始 `quests` 为空数组 `[]`。
- `removeQuest` 需要利用数组的 `filter` 方法，把传入 `id` 的那个任务剔除掉。

### 任务 2：编写纯展示子组件 (`components/QuestCard.tsx`)

*这是一个“没脑子”的笨组件，它不接触 Zustand，只听父组件的指挥。*

**接口图纸**：

TypeScript

```
interface QuestCardProps {
    quest: { id: number, title: string, reward: number };
    onAccept: (id: number) => void;
}
```

**内部逻辑**：

- 接收 `props`（解构出 `quest` 和 `onAccept`）。
- 渲染出一个卡片 UI（包含任务标题、赏金，以及一个“接取任务”的按钮）。
- 按钮点击时，调用 `onAccept(quest.id)`。
- **【绝杀要求】**：导出组件时，必须用 `React.memo()` 包裹，例如：`export const QuestCard = React.memo((props: QuestCardProps) => { ... })`。

### 任务 3：编写智能父组件酒馆 (`Tavern.tsx`)

*这是整个系统的总控室。*

**内部逻辑**：

1. **连接 Zustand**：提取出 `quests`、`setQuests`、`removeQuest`。
2. **本地状态 (`useState`)**：创建一个 `searchInput` 状态，初始值为 `""`，用于绑定搜索框。
3. **初始化请求 (`useEffect`)**：
   - 写一个 `useEffect`，依赖项为空数组 `[]`（代表只在组件刚出现时执行一次）。
   - 在里面写一个 `setTimeout` 模拟网络延迟（1秒后执行）。
   - 1秒后，调用 `setQuests`，塞入 3 个假数据： `[{id: 1, title: "击杀史莱姆", reward: 100}, {id: 2, title: "护送商人", reward: 500}, {id: 3, title: "清理地精营地", reward: 300}]`
4. **数据过滤（衍生计算）**：
   - 结合 `quests` 和 `searchInput`，用 `filter` 计算出一个 `filteredQuests` 数组（只保留标题包含搜索词的任务）。
5. **UI 渲染**：
   - 顶部渲染一个 `<input>` 搜索框，通过 `onChange` 实时更新 `searchInput`。
   - 下方使用 `filteredQuests.map()`，循环渲染出 `<QuestCard />` 组件。
   - 把数据和 `removeQuest` 动作，通过 `props` 传给 `<QuestCard />`。

------

### 🧪 黑盒验收测试

1. 页面刚刷新时，列表是空的。
2. 1秒钟后，突然出现 3 个任务卡片（`useEffect` 触发成功）。
3. 在搜索框输入“史莱姆”，列表瞬间只剩下 1 个任务（`useState` 触发本地过滤成功）。
4. 清空搜索框，3 个任务恢复显示。点击“护送商人”的接取按钮，该任务永久消失（Zustand 全局状态修改成功）。

```
---

### 💡 Tech Lead 战前指导：

为什么这个模块里 `useState` 和 `Zustand` 要混用？
大厂的绝对规范：**“只在这个页面用的临时数据（比如用户正在输入的搜索词），用 `useState`；跨页面、跨组件都要用的核心数据（比如任务列表），才放进 `Zustand`。”** 绝对不要把搜索框的文字塞进全局仓库里，那会极大地消耗性能！
```

