已实现功能清单（自检项）
- ✅ 组件库（左侧）：点击快速添加字段（输入/数字/选择/结构等）
- ✅ 画布（中间）：字段列表展示 + 拖拽排序（dnd-kit）+ 选中高亮 + 删除
- ✅ 属性面板（右侧）：

表单级：标题/描述

字段级：name/label/helpText/required/disabled/placeholder/colSpan

select/radio：options 增删改

section/divider：有专属属性编辑
- ✅ 预览模式：同一份 Schema 直接走渲染引擎 FormRenderer
- ✅ 导入/导出 Schema JSON：顶栏一键打开 JSON 面板，可直接粘贴导入
- ✅ Schema 校验：标题空、name 重复、options 为空、colSpan 越界等会提示
