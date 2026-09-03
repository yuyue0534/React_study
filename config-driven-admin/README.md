# config-driven-admin

验证配置驱动架构核心链路的最小可运行骨架，包含两部分：

1. **ConfigDrivenAdminDemo.jsx** —— 上一轮生成的组件，原样未改动，验证 menu 树解析 /
   buildDtoSchema 字段拆分 / eventKey 事件系统这条核心链路在真实构建工具下能跑通。
2. **project 继承 model** —— `src/model/` 下实现了合并算法，`scripts/test-merge.mjs`
   提供了不依赖浏览器的快速验证。

## 目录结构

```
src/
  components/
    ConfigDrivenAdminDemo.jsx   上一步的 demo，原样拷贝
    MergeDemo.jsx               可视化展示 project 继承 model 的合并结果
  model/
    model.js                    通用「电商系统」模板
    projectExtendModel.js       合并算法：改 / 增 / 删 / 继承
    project/
      pdd.js                    只重载 name（继承演示）
      jd.js                     重载 + 扩展按钮 + 新增模块（追加演示）
      taobao.js                 用 _deleted 删除一个模块（删除演示）
scripts/
  test-merge.mjs                不启浏览器，直接跑合并算法的断言
```

## 运行

```bash
npm install

# 方式一：不启浏览器，几秒钟内验证合并算法四种语义（改/增/删/继承）
npm run test:merge

# 方式二：启动开发服务器，在浏览器里同时看两个 tab
#   - 核心链路 demo（上一步生成的组件）
#   - project 继承 model 的可视化对比（model / project / 合并结果 三栏）
npm run dev

# 方式三：生产构建，验证组件在真实工具链下能否编译通过
npm run build
```

## 关于合并算法的一个已知限制

`projectExtendModel` 按数组元素的 `key` 字段做递归合并识别。像
`tableConfig.headerButtons` 这类数组，元素本身没有 `key`，所以 project
里追加的按钮只会**追加**在 model 已有按钮后面，而不是整体替换。如果业务上
需要"整体覆盖某个无 key 数组"，需要给这类数组元素也约定 key，或者单独写
一条合并规则——这不是 bug，是这个简化版合并算法的设计边界，实际项目里
根据需要调整。
