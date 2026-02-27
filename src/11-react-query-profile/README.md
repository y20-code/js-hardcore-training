# 业务需求文档 (PRD)：11-冒险者档案局 (文件上传与 React Query 突变)

## 业务背景
在《Word Killer》的冒险者档案局中，玩家不仅可以查看自己的英雄档案，还被允许**上传自定义的公会旗帜（图片文件）**。
普通的 JSON 提交已经无法满足包含物理文件的业务需求。前端必须打破常规的 Axios 拦截器限制，使用原生 `FormData` 组装二进制文件流，并向玩家展示实时的上传进度条。最重要的是，上传成功后，主页的头像必须通过 React Query 实现**无感自动刷新**，绝不允许出现页面白屏重载。

## 核心修炼点
* **Axios 变种 (文件流)**: 脱离单纯的 JSON 交互，实战原生 `FormData` 对象的组装，重写局部请求头 `Content-Type: multipart/form-data`。
* **Axios 变种 (进度监听)**: 挂载 Axios 第三参数 `onUploadProgress` 回调，捕获真实的 HTTP 底层物理上传进度。
* **React Query 终极杀招**: 深度使用 `useMutation` 处理非幂等请求 (POST 请求)。
* **状态融合架构**: 学会在 `useMutation` 的声明式生命周期中，巧妙揉入局部状态 `useState`，完美接管并渲染 0%~100% 的进度条。
* **DOM 桥接技术**: 掌握原生 `<input type="file">` 的 `e.target.files[0]` 提取逻辑。

---

## 研发任务 (架构三部曲)

### 任务 1：底层基建保持纯净 (`utils/request.ts`)
*架构原则：绝对不为了单个上传业务去修改全局的 Axios 拦截器。全局保持 JSON 模板，特权在 API 层单独开。*

### 任务 2：接口层变种突围 (`api/profileApi.ts`)
*这是打破常规的阵地。*

**【后端 API 契约文档】**
> **接口 A：获取个人档案 (GET `/profile`)**
> * 返回：`{ id: string, name: string, avatarUrl: string }`
>
> **接口 B：上传头像 (POST `/profile/avatar`)**
> * 请求格式：必须是 `multipart/form-data`
> * 参数 (Body)：`file` (二进制文件对象)
> * 返回：`{ success: boolean, newAvatarUrl: string }`

**内部逻辑**：
1. **定义图纸**：导出 `Profile` 和 `UploadResponse` 接口。
2. **常规查询**：导出 `fetchProfile`，返回 `request.get<any, Profile>('/profile')`。
3. **核心变种 (上传函数)**：导出 `uploadAvatar(file: File, onProgress: (percent: number) => void)`。
   - 必须使用 `new FormData()` 并 `append('file', file)`。
   - `request.post` 第三个参数传入 `{ headers: { 'Content-Type': 'multipart/form-data' }, onUploadProgress: (...) }`。
   - 在进度回调中通过 `Math.round((loaded * 100) / total)` 计算百分比，并触发 `onProgress`。

### 任务 3：视图层与突变的狂舞 (`components/ProfileBureau.tsx`)
*见证复杂交互收拢为极简代码的时刻。*

**内部逻辑**：
1. **状态定义**：`const [uploadPercent, setUploadPercent] = useState(0)`。
2. **管家获取**：`const queryClient = useQueryClient()`。
3. **读数据 (盾)**：使用 `useQuery` 拉取 `['profile']` 档案。
4. **写数据 (剑)**：
   - 使用 `useMutation` 包装上传函数：`mutationFn: (file: File) => uploadAvatar(file, setUploadPercent)`。
   - 核心魔法：在 `onSuccess` 中执行 `queryClient.invalidateQueries({ queryKey: ['profile'] })`，并重置进度条。
5. **DOM 事件处理**：在 `<input type="file" onChange={...}>` 中，提取 `e.target.files?.[0]`，并触发 `mutation.mutate(file)`。
6. **动态 UI 渲染**：利用 `mutation.isPending` 切换展示状态：上传中显示百分比进度条，平时显示文件选择框。

------

### 🧪 黑盒验收测试 (复杂链路跑通验证)

1. **变种校验**：打开浏览器 Network 面板，选中图片上传，确认 Request Payload 不是标准的 JSON 字符串，而是 `multipart/form-data` 的二进制流分隔符格式。
2. **进度反馈**：选择大文件（或用浏览器 Network 模拟慢速 3G 网络），UI 必须平滑展示 `0% -> 34% -> 100%` 的数值变化。
3. **缓存作废魔法**：上传达到 100% 且接口返回成功后，页面没有发生刷新（没有白屏闪烁），但 `useQuery` 自动发起了新的 GET 请求，头像瞬间变成最新图片。