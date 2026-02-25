# 业务需求文档 (PRD)：排位赛匹配引擎 (Class 面向对象)

## 业务背景
“Word Killer”游戏推出了 1v1 排位赛模式。为了保证匹配引擎在未来可以多开房间（比如新手房、白银房互不干扰），架构师要求必须使用 ES6 的 `Class` (类) 来构建底层，彻底抛弃传统的单例对象。

## 研发任务
请写一个类 `class MatchMaker { ... }`，严格按照以下架构图纸实现：

### 1. 前置类的骨架设计 (TypeScript)
```typescript
class MatchMaker {
    static serverStatus: string;                  // 静态属性：服务器状态
    playerQueue: string[];                        // 实例属性：玩家排队队列

    constructor(initialPlayers?: string[]);       // 构造器
    joinQueue(playerName: string): void;          // 动作：玩家加入队列
    startMatch(): [string, string] | null;        // 动作：匹配并抽出两人
}
```
### 2. 静态属性配置 (Static)

- 在类的内部声明静态属性 `serverStatus`，初始值为 `"运行中"`。
- *提示：静态属性属于类本身，不需要 new 就能直接读取。*

### 3. 构造函数初始化 (`constructor`)

**输入要求**：

- 接收一个字符串数组 `initialPlayers`。如果外部没传，**默认值为一个空数组 `[]`**。

**内部操作**：

- 把传进来的数组，赋值给机器自身的实例属性 `this.playerQueue`。

### 4. 核心动作：加入队列 (`joinQueue`)

**输入要求**：

- 接收一个玩家名字 `playerName`。

**内部操作**：

- 把这个名字塞进 `this.playerQueue` 数组的**最后面**。无需返回值 (`void`)。

### 5. 核心动作：开始匹配 (`startMatch`)

**内部操作与输出交付**：

- 检查 `this.playerQueue` 的长度。
- **如果少于 2 人**：打印 `"匹配失败：人数不足"`，并且**返回 `null`**。
- **如果大于等于 2 人**：从队列的**最前面**抽出两名玩家。（*注意：必须把他们从原队列中真实剔除，使用 `.shift()`*）。
- 把抽出来的这两个玩家，打包成一个严格的元组 `[玩家A, 玩家B]` 并 `return` 交给系统。

------

### 🧪 黑盒测试用例 (写完后用这个验证)

```ts
// 1. 测试静态属性（直接用类名读取）
console.log("当前服务器状态：", MatchMaker.serverStatus); // 预期："运行中"

// 2. new 一个匹配引擎实例（比如开了一个青铜匹配房）
const bronzeRoom = new MatchMaker(["大剑豪"]);

// 3. 只有 1 个人，尝试匹配
const match1 = bronzeRoom.startMatch(); 
// 预期打印："匹配失败：人数不足"
// 此时 match1 的值为 null

// 4. 新来两个玩家加入青铜房队列
bronzeRoom.joinQueue("魔法师");
bronzeRoom.joinQueue("弓箭手");
// 此时队列为：["大剑豪", "魔法师", "弓箭手"]

// 5. 再次尝试匹配
const match2 = bronzeRoom.startMatch();
console.log("匹配成功，对战双方是：", match2); 
// 预期打印：匹配成功，对战双方是：["大剑豪", "魔法师"]

// 6. 验证队列是否剔除了已匹配的人
console.log("剩余排队玩家：", bronzeRoom.playerQueue);
// 预期打印：["弓箭手"]
```

