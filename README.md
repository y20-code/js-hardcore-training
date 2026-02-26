# 前端硬核特训营

> **目标**：备战 2026 届大厂春招（米哈游/字节等前端岗）
> **核心**：拒绝背八股文，用真实业务需求打通 JavaScript/TypeScript 底层逻辑。

## 关卡目录 (随时点进去重刷盲写)

### 第一阶段：函数与对象的高级突围（this / 闭包 / 数据聚合）

* **[01-铁匠铺锻造功能(Forge System)](./src/01-forge-system/)**
  * **修炼点**：对象方法声明、`this` 穿透、默认参数、`reduce` 数据聚合、延迟执行。
* **[02-天网监控与封号功能 (Chat Monitor)](./src/02-chat-monitor/)**
  * **修炼点**：TS 接口约束 (Interface)、`filter` 与 `map` 链式调用清洗数据、业务逻辑取反。
* **[03-连击技能工厂 (Combo Skill Factory)](./src/03-combo-skill/)**
  * **修炼点**：工厂函数模型、数组原地追加 (`push` + 展开运算符)、内部状态变异。
* **[04-排位赛匹配引擎 (Match Maker Engine)](./src/04-match-macker/)**
  * **修炼点**：面向对象编程 (OOP) Class 类、构造器 (`constructor`) 与静态属性 (`static`)、数组首位真实剔除 (`shift`)、严格元组约束 (`Tuple`)。

### 🔵 第二阶段：React 架构与全局状态管理 (Hooks / Zustand)

* **[05-装备背包系统 (React + Zustand Inventory)](./src/05-react-zustand-inventory/)**
  * **修炼点**：Zustand Store 剥离、跨组件通信、React 组件层级拆分、UI 与数据逻辑解耦。
* **[06-冒险者任务大厅 (React Quest Board)](./src/06-react-quest-board/)**
  * **修炼点**：Zustand 仓库提取、`useState` 双向绑定、`useEffect` 模拟生命周期与网络请求、父子组件 `props` 传值与 `React.memo` 性能优化、数组 `map` 列表渲染与 `filter` 衍生计算。
* **[07-铁匠铺图纸商店 (Blacksmith Shop)](./src/07-react-blacksmith-shop/)**
  * **修炼点**：Zustand 稳定引用 (Stable Reference) 配合 `React.memo` 精准拦截多余渲染、全局状态与局部 `useState` 的严格边界隔离、`useEffect` 异步数据加载与边界值 Bug 规避、基于过滤条件的衍生计算 (Derived State)。
---
*持续更新中...*