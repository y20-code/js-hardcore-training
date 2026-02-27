# 业务需求文档 (PRD)：铁匠铺图纸商店 (React 性能优化与状态边界)

## 业务背景
在“Word Killer”游戏中，玩家可以在铁匠铺使用金币购买并锻造装备图纸。
我们需要从服务器拉取图纸列表，支持按“武器/防具”分类筛选，并在玩家锻造时，安全地扣除其全局钱包中的金币（包含余额不足的边界拦截）。

## 核心修炼点
* **Zustand**: 全局资产（金币）的安全管控与边界值计算。
* **React.memo**: 配合 Zustand 动作的稳定引用 (Stable Reference)，精准拦截子组件的无效重渲染。
* **状态边界隔离**: 明确区分“全局共享状态”与“局部临时状态”。
* **前端衍生计算 (Derived State)**: 基于源数据和筛选条件，动态计算渲染列表。

---

## 研发任务

### 任务 1：搭建金币仓库 (`store/useShopStore.ts`)

**接口图纸**：
```typescript
interface ShopStore {
    gold: number;
    spendGold: (cost: number) => void; // 动作：花费金币
}
```

**内部逻辑**：

- 初始玩家拥有金币 `gold: 1000`。
- `spendGold` 需要接收一个 `cost` 参数。
- **核心校验**：如果当前 `gold >= cost`，则扣除对应金币；如果余额不足，必须使用 `alert("金币不足！")` 拦截，且**绝对不能扣除金币**。

### 任务 2：编写纯展示图纸卡片 (`components/BlueprintCard.tsx`)

*这是一个纯净的 UI 组件，必须被 React.memo 保护。*

**接口图纸**：

```
export interface Blueprint {
    id: number;
    name: string;
    type: string;
    price: number;
}

interface BlueprintProps {
    blueprint: Blueprint;
    onForge: (price: number) => void;
}
```

**内部逻辑**：

- 接收 `blueprint` 数据对象和 `onForge` 动作函数。
- 渲染出装备名称、类型和价格。注意 CSS 布局，如果使用 `gap` 必须配合 `display: 'flex'`。
- 放置一个“锻造”按钮，点击时调用 `onForge(blueprint.price)`。
- **【绝杀要求】**：导出组件时，必须使用 `React.memo` 包裹以切断无意义的渲染扩散。

### 任务 3：编写铁匠铺智能父组件 (`Blacksmith.tsx`)

*这是连接数据源、筛选逻辑和子组件的总控台。*

**内部逻辑**：

1. **连接 Zustand**：提取出 `gold` 和 `spendGold`。
2. **本地状态 (`useState`)**：
   - `blueprints`: 用于存放拉取的图纸列表，初始为 `[]`。
   - `filterType`: 用于存放当前的筛选条件，**初始值必须为 `"全部"`**。
3. **初始化请求 (`useEffect`)**：
   - 组件挂载时，设置一个 1.5 秒的 `setTimeout` 模拟网络延迟。
   - 延迟结束后，向 `blueprints` 塞入假数据：`[{id: 1, name: "铁剑", type: "武器", price: 200}, {id: 2, name: "皮甲", type: "防具", price: 150}, {id: 3, name: "斩骨刀", type: "武器", price: 800}]`。
   - 别忘了在 return 中清理 timer。
4. **数据过滤（衍生计算）**：
   - 声明 `filteredBlueprints`。如果 `filterType` 是 `'全部'`，直接返回原数组；否则，使用 `filter` 筛出 `type === filterType` 的图纸。
5. **UI 渲染**：
   - 顶部展示当前金币余额。
   - 渲染三个分类按钮：[显示全部]、[只看武器]、[只看防具]，点击时修改 `filterType`。
   - 下方通过 `filteredBlueprints.map()` 渲染 `BlueprintCard`。
   - **核心传值**：将 Zustand 的 `spendGold` 直接作为 `onForge` 属性传递给子组件。

------

### 🧪 黑盒验收测试

1. 页面刚刷新时，列表显示“加载中”或为空，顶部显示金币 `1000`。
2. 1.5秒后，出现 3 张图纸卡片。
3. 点击“只看武器”按钮，列表瞬间只剩下“铁剑”和“斩骨刀”。
4. 点击“铁剑”的锻造按钮，顶部金币瞬间变为 `800`（1000 - 200）。
5. 紧接着点击“斩骨刀”（800金币）的锻造按钮，成功扣款，金币变为 `0`。
6. 刷新页面重置金币为 `1000`。点击“斩骨刀”（800）扣除后剩 `200`，再点“斩骨刀”，弹出“金币不足！”，余额保持 `200` 不变。

------

### 💡 Tech Lead 战前指导：

**1. 为什么这次图纸列表不用 Zustand？** 状态的边界感！如果这个图纸列表只有当前《铁匠铺》页面会用到，离开铁匠铺就销毁了，那就坚决用 `useState`。只有像“金币”这种你在《酒馆》、《背包》里都要跨页面共享的数据，才配进入 Zustand 全局仓库。

**2. 为什么你的 `React.memo` 能完美生效？** 大厂面试常考：父组件每次渲染都会生成新的箭头函数，导致子组件的 `memo` 失效。但在这里，你传给子组件的是 Zustand 的 `spendGold` 动作。**Zustand 内部保证了 action 永远是同一个内存引用（Stable Reference）**。所以无论父组件的金币怎么变，子组件绝对不会发生多余的 re-render，底层逻辑彻底打通！