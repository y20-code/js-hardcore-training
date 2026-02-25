# 业务需求文档 (PRD)：天网监控与封号系统

## 业务背景
在“Word Killer”游戏中，公屏聊天经常会有违规发言。我们需要在后台搭建一个“天网监控系统”，用于扫描玩家的不定长聊天记录，自动过滤违规词汇，并对合规的发言进行系统签章认证。

## 研发任务
请根据以下 TS 接口图纸，创建一个对象 `chatMonitor`，实现以下业务：

### 1. 前置接口图纸 (TypeScript)
```typescript
interface ChatMonitor {
    systemName: string;         
    bannedWord: string;         
    scanMessages: (replaceChar?: string, ...messages: string[]) => { threatCount: number, safeMessages: string[] };
    startPatrol: () => void;
}

~~~ts
# 业务需求文档 (PRD)：天网监控与封号系统

## 业务背景
在“Word Killer”游戏中，公屏聊天经常会有违规发言。我们需要在后台搭建一个“天网监控系统”，用于扫描玩家的不定长聊天记录，自动过滤违规词汇，并对合规的发言进行系统签章认证。

## 研发任务
请根据以下 TS 接口图纸，创建一个对象 `chatMonitor`，实现以下业务：

### 1. 前置接口图纸 (TypeScript)
```typescript
interface ChatMonitor {
    systemName: string;         
    bannedWord: string;         
    scanMessages: (replaceChar?: string, ...messages: string[]) => { threatCount: number, safeMessages: string[] };
    startPatrol: () => void;
}
```

### 2. 基础配置

- `systemName`: 初始化为 "天网监控"。
- `bannedWord`: 初始化为 "挂机"。

### 3. 核心动作：扫描玩家聊天记录 (`scanMessages`)

**输入要求**：

- 第一个参数：替换字符 `replaceChar`。如果没传，**默认用 `"\*"`**。
- 剩余参数：不确定数量的聊天句子（如 "今天真开心", "有人挂机吗"）。全部打包收好。

**内部计算**：

- **找坏人**：遍历这些聊天句子，找出有多少句话包含了 `this.bannedWord`，统计出违规句子的**总数量**。（提示：取反逻辑，可用 `filter` 配合 `includes`）。
- **净化环境**：把**没有违规**的句子挑出来，并在每句话前面加上系统签章。例如把 `"今天真开心"` 变成 `"[天网监控]审核通过: 今天真开心"`。（提示：必须动态读取自身属性 `systemName`）。

**输出交付**：

- 返回一个对象，包含 `threatCount` (违规句子总数) 和 `safeMessages` (净化后加上签章的安全句子数组)。

### 4. 核心动作：启动巡逻 (`startPatrol`)

- 不需要接参数，不需要返回结果。
- 触发后**等待 1 秒钟**。
- 1 秒后打印：“[天网监控] 启动完毕，正在严厉打击包含 [挂机] 的发言！”（必须动态读取系统名和违规词）。

------

### 黑盒测试用例 (写完后用这个验证)


```ts
// 测试 1：传入了替换字符 "和谐"，以及 3 句话。其中一句包含违规词。
const report = chatMonitor.scanMessages("和谐", "哈喽啊", "这人一直挂机", "一起组队");
console.log(report);
// 预期打印：
// { 
//   threatCount: 1, 
//   safeMessages: ["[天网监控]审核通过: 哈喽啊", "[天网监控]审核通过: 一起组队"] 
// }

// 测试 2：启动巡逻
chatMonitor.startPatrol();
// 预期 1 秒后打印：[天网监控] 启动完毕，正在严厉打击包含 [挂机] 的发言！
```

