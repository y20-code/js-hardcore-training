# 业务需求文档 (PRD)：连击技能工厂

## 业务背景
在“Word Killer”游戏中，玩家可以自创连击技能。我们需要一个“技能生成工厂”（工厂函数），每次调用它，都能给系统吐出一个全新的、互相独立且带有内部状态的技能对象。

## 研发任务
写一个工厂函数 `createCombo`，它接收一个字符串名字 `name`，并返回一个符合以下 `ComboSkill` 接口的崭新对象：

### 1. 前置接口图纸 (TypeScript)
```typescript
interface ComboSkill {
    skillName: string;         
    damageList: number[];      
    addHits: (...hits: number[]) => void;         
    calculateTotal: (baseDamage?: number) => number; 
}
```
### 2. 基础属性配置

- `skillName`: 值为创建时传进来的 `name`。
- `damageList`: 初始值必须是一个**空数组 `[]`**。

### 3. 核心动作：追加连击伤害 (`addHits`)

**输入要求**：

- 接收不确定数量的伤害数字（如传 10, 20，或传 50, 60, 70）。全部打包收好。

**内部操作**：

- 把接收到的这些伤害数字，**全部追加进对象自身的 `damageList` 数组里**。（提示：需修改自身的数组属性，可使用 `push` 结合展开运算符）。

**输出交付**：

- 无需返回结果 (`void`)。

### 4. 核心动作：计算总伤害 (`calculateTotal`)

**输入要求**：

- 接收一个基础伤害值 `baseDamage`。如果没传，**默认基础伤害是 50**。

**内部计算**：

- 把自身 `damageList` 里面存着的所有连击伤害加总，再加上传进来的基础伤害。

**输出交付**：

- 最后 `return` 这个总和（数字）。

------

### 黑盒测试用例 (写完后用这个验证)
```ts
// 1. 造出一个叫“雷霆剑法”的技能对象
const mySkill = createCombo("雷霆剑法");
console.log(mySkill.skillName); // 预期打印："雷霆剑法"

// 2. 玩家打出了一套连招，追加了 3 次伤害
mySkill.addHits(10, 20, 30);
// 此时 mySkill 内部的 damageList 应该变成了 [10, 20, 30]

// 3. 玩家又补了一刀
mySkill.addHits(40);
// 此时 damageList 变成了 [10, 20, 30, 40]

// 4. 结算总伤害（不传基础伤害，触发默认值 50）
const total = mySkill.calculateTotal(); 
console.log("最终伤害：", total);
// 预期打印：最终伤害： 150  (计算过程：50 + 10+20+30+40 = 150)
```


