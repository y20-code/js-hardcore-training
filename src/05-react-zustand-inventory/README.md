# 业务需求文档 (PRD)：装备背包系统 (React + Zustand)

## 业务背景
在“Word Killer”游戏中，我们需要为玩家开发一个可视化的装备背包系统。
架构师要求：**严禁使用传统的父子组件 Props 传值**，必须引入 Zustand 作为全局数据总线，实现“数据逻辑”与“UI 渲染”的彻底解耦。

## 📁 强制目录结构
你的代码必须拆分成以下四个文件：
```text
05-react-zustand-inventory/
├── store/
│   └── useInventoryStore.ts   <-- 纯数据仓库 (不准写任何 HTML)
├── components/
│   ├── AddItemBtn.tsx         <-- 生产组件 (只管发信号)
│   └── BackpackList.tsx       <-- 消费组件 (只管查数据)
└── App.tsx                    <-- 组装车间 (把两个组件摆到页面上)
```
## 研发任务

### 任务 1：搭建核心数据仓库 (`store/useInventoryStore.ts`)

**前置图纸 (TS Interface)**：

TypeScript

```
interface InventoryState {
    items: string[];                      // 状态：背包里的物品数组
    addItem: (newItem: string) => void;   // 动作：塞入新物品
    clearAll: () => void;                 // 动作：清空背包
}
```

**业务要求**：

- 引入 `create` from 'zustand'。
- 初始 `items` 为空数组 `[]`。
- `addItem` 必须保留背包里原有的东西，并把新物品追加进去。（提示：使用展开运算符 `...`）。
- `clearAll` 直接把 `items` 变成空数组。

### 任务 2：编写生产组件 (`components/AddItemBtn.tsx`)

**业务要求**：

- 这是一个纯粹的 React 组件。
- 从 `useInventoryStore` 中**只**提取出 `addItem` 这个动作。
- 渲染一个 `<button>`，按钮文字为“锻造一把大剑”。
- 点击按钮时，调用 `addItem`，向背包里塞入字符串 `"🗡️ 破败王者之刃"`。

### 任务 3：编写消费组件 (`components/BackpackList.tsx`)

**业务要求**：

- 从 `useInventoryStore` 中提取出 `items` (数据) 和 `clearAll` (动作)。
- 如果 `items` 是空的，页面显示 `<div>背包空空如也...</div>`。
- 如果有东西，使用 `items.map()` 渲染出一个 `<ul>` 列表，展示所有的装备。
- 在列表下方渲染一个 `<button>`，文字为“一键丢弃”，点击后触发 `clearAll`。

### 任务 4：组装页面 (`App.tsx`)

**业务要求**：

- 把 `AddItemBtn` 和 `BackpackList` 引入进来。
- 像搭积木一样，把它们并排放在页面上。它们之间不需要传任何 Props！

------

### 🧪 黑盒验收测试

1. 页面刚刷新时，屏幕只显示“背包空空如也...”和一个“锻造大剑”的按钮。
2. 疯狂点击“锻造大剑” 3 次。
3. 屏幕瞬间同步渲染出 3 行 `🗡️ 破败王者之刃`，并且出现“一键丢弃”按钮。
4. 点击“一键丢弃”，屏幕瞬间回到“背包空空如也...”的初始状态。