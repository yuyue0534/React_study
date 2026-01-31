核心业务流程（骨架阶段）
登录 & 鉴权流程

登录 → 获取 token

拉取用户信息

生成权限映射

注入路由 & 功能控制

通用列表页流程

查询条件 → React Query

分页 / 排序 / 筛选

批量操作 Hook

最终项目目录结构（完整）
```
crm-erp-desktop/
├─ electron/
│  ├─ main.js
│  └─ preload.js
├─ src/
│  ├─ api/
│  │  ├─ auth.api.js
│  │  └─ user.api.js
│  ├─ components/
│  │  ├─ layout/
│  │  │  ├─ MainLayout.jsx
│  │  │  ├─ Sidebar.jsx
│  │  │  └─ Header.jsx
│  │  ├─ common/
│  │  │  ├─ Button.jsx
│  │  │  ├─ Modal.jsx
│  │  │  ├─ Table.jsx
│  │  │  └─ Loading.jsx
│  │  └─ navigation/
│  │     └─ Breadcrumb.jsx
│  ├─ constants/
│  │  ├─ roles.js
│  │  ├─ permissions.js
│  │  └─ routes.js
│  ├─ hooks/
│  │  ├─ useAuth.js
│  │  ├─ usePermission.js
│  │  └─ useTable.js
│  ├─ pages/
│  │  ├─ Login.jsx
│  │  ├─ Dashboard.jsx
│  │  └─ NotFound.jsx
│  ├─ stores/
│  │  ├─ auth.store.js
│  │  └─ theme.store.js
│  ├─ utils/
│  │  ├─ request.js
│  │  ├─ storage.js
│  │  └─ encrypt.js
│  ├─ router/
│  │  └─ index.jsx
│  ├─ styles/
│  │  └─ index.css
│  ├─ App.jsx
│  └─ main.jsx
├─ tailwind.config.js
├─ vite.config.js
├─ package.json
└─ .env.example

```
