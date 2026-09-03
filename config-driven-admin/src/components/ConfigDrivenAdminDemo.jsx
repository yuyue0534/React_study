import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Plus, Pencil, Trash2, X, ChevronRight, Braces, Terminal, Search, RotateCcw } from "lucide-react";

/* ============================================================================
 * 第一步：DSL 配置层
 * ----------------------------------------------------------------------------
 * 这是"地基"。menu 数组可无限嵌套，每一项由 menuType / moduleType 决定形态。
 * 这里先只实现 moduleType: 'schema'，对应文章里的"增删改查主力模板"。
 * ========================================================================== */

const dslConfig = {
  model: "dashboard",
  name: "电商系统",
  menu: [
    {
      key: "product",
      name: "商品管理",
      menuType: "module",
      moduleType: "schema",
      schemaConfig: {
        api: "/api/proj/product",
        schema: {
          type: "object",
          properties: {
            product_id: {
              type: "string",
              label: "商品ID",
              tableOption: { width: 120 },
            },
            product_name: {
              type: "string",
              label: "商品名称",
              tableOption: { width: 200 },
              searchOption: { comType: "input", placeholder: "搜索商品名称" },
              formOption: { comType: "input", required: true },
            },
            price: {
              type: "number",
              label: "价格",
              tableOption: { width: 120, prefix: "$" },
              searchOption: {
                comType: "select",
                enumList: [
                  { label: "全部", value: -999 },
                  { label: "$39.9", value: 39.9 },
                  { label: "$199", value: 199 },
                  { label: "$899", value: 899 },
                ],
              },
              formOption: { comType: "input", required: true },
            },
            inventory: {
              type: "number",
              label: "库存",
              tableOption: { width: 100 },
              searchOption: { comType: "input", placeholder: "库存数量" },
              formOption: { comType: "input" },
            },
            create_time: {
              type: "string",
              label: "创建时间",
              tableOption: { width: 160 },
            },
          },
        },
        tableConfig: {
          headerButtons: [
            { label: "新增商品", eventKey: "showComponent", type: "primary" },
          ],
          rowButtons: [
            { label: "修改", eventKey: "showComponent", type: "warning" },
            {
              label: "删除",
              eventKey: "remove",
              type: "danger",
              eventOption: { params: { product_id: "schema::product_id" } },
            },
          ],
        },
      },
    },
    {
      key: "order",
      name: "订单管理",
      menuType: "module",
      moduleType: "schema",
      schemaConfig: {
        api: "/api/proj/order",
        schema: {
          type: "object",
          properties: {
            order_id: { type: "string", label: "订单号", tableOption: { width: 160 } },
            buyer: {
              type: "string",
              label: "买家",
              tableOption: { width: 140 },
              searchOption: { comType: "input", placeholder: "搜索买家" },
              formOption: { comType: "input", required: true },
            },
            amount: {
              type: "number",
              label: "金额",
              tableOption: { width: 100, prefix: "$" },
              formOption: { comType: "input", required: true },
            },
            status: {
              type: "string",
              label: "状态",
              tableOption: { width: 120 },
              searchOption: {
                comType: "select",
                enumList: [
                  { label: "全部", value: "" },
                  { label: "待发货", value: "待发货" },
                  { label: "已发货", value: "已发货" },
                  { label: "已完成", value: "已完成" },
                ],
              },
              formOption: { comType: "input" },
            },
            create_time: { type: "string", label: "下单时间", tableOption: { width: 160 } },
          },
        },
        tableConfig: {
          headerButtons: [
            { label: "新增订单", eventKey: "showComponent", type: "primary" },
          ],
          rowButtons: [
            { label: "修改", eventKey: "showComponent", type: "warning" },
            {
              label: "删除",
              eventKey: "remove",
              type: "danger",
              eventOption: { params: { order_id: "schema::order_id" } },
            },
          ],
        },
      },
    },
    // ---- 下面三个是这一步新增的：iframe / custom / slider ----
    {
      key: "help",
      name: "帮助中心",
      menuType: "module",
      moduleType: "iframe",
      iframeConfig: {
        path: "https://docs.example.com/help",
      },
    },
    {
      key: "workspace",
      name: "工作台",
      menuType: "module",
      moduleType: "custom",
      customConfig: {
        path: "/workspace",
      },
    },
    {
      key: "data",
      name: "数据分析",
      menuType: "module",
      moduleType: "slider",
      // slider 的侧边栏是一棵独立的子菜单树，节点形状跟顶层 menu 完全一样，
      // 所以能塞 custom / iframe / group 套 schema —— 复用的是同一套节点结构。
      sliderConfig: {
        menu: [
          {
            key: "analysis",
            name: "电商罗盘",
            menuType: "module",
            moduleType: "custom",
            customConfig: { path: "/data/analysis" },
          },
          {
            key: "slider-search",
            name: "信息查询",
            menuType: "module",
            moduleType: "iframe",
            iframeConfig: { path: "https://search.example.com" },
          },
          {
            key: "categories",
            name: "分类数据",
            menuType: "group",
            subMenu: [
              {
                key: "category_l1",
                name: "一级分类",
                menuType: "module",
                moduleType: "schema",
                schemaConfig: {
                  api: "/api/proj/category_l1",
                  schema: {
                    type: "object",
                    properties: {
                      category_id: { type: "string", label: "分类ID", tableOption: { width: 120 } },
                      category_name: {
                        type: "string",
                        label: "分类名称",
                        tableOption: { width: 200 },
                        searchOption: { comType: "input", placeholder: "搜索分类名称" },
                        formOption: { comType: "input", required: true },
                      },
                      sort: { type: "number", label: "排序", tableOption: { width: 100 }, formOption: { comType: "input" } },
                    },
                  },
                  tableConfig: {
                    headerButtons: [{ label: "新增分类", eventKey: "showComponent", type: "primary" }],
                    rowButtons: [
                      { label: "修改", eventKey: "showComponent", type: "warning" },
                      { label: "删除", eventKey: "remove", type: "danger", eventOption: { params: { category_id: "schema::category_id" } } },
                    ],
                  },
                },
              },
              {
                key: "category_l2",
                name: "二级分类",
                menuType: "module",
                moduleType: "schema",
                schemaConfig: {
                  api: "/api/proj/category_l2",
                  schema: {
                    type: "object",
                    properties: {
                      category_id: { type: "string", label: "分类ID", tableOption: { width: 120 } },
                      parent_name: { type: "string", label: "所属一级分类", tableOption: { width: 160 } },
                      category_name: {
                        type: "string",
                        label: "分类名称",
                        tableOption: { width: 180 },
                        searchOption: { comType: "input", placeholder: "搜索分类名称" },
                        formOption: { comType: "input", required: true },
                      },
                    },
                  },
                  tableConfig: {
                    headerButtons: [{ label: "新增分类", eventKey: "showComponent", type: "primary" }],
                    rowButtons: [
                      { label: "修改", eventKey: "showComponent", type: "warning" },
                      { label: "删除", eventKey: "remove", type: "danger", eventOption: { params: { category_id: "schema::category_id" } } },
                    ],
                  },
                },
              },
            ],
          },
        ],
      },
    },
  ],
};

/* ============================================================================
 * 第一步：解析层 —— 菜单树遍历工具
 * ----------------------------------------------------------------------------
 * findMenuItem 递归穿透 group 的 subMenu，在任意深度定位目标菜单项。
 * 这里的菜单还比较浅（未嵌套 group/slider），但工具本身要按"任意深度"来写，
 * 这样以后加 group/slider 不需要改这个函数。
 * ========================================================================== */

function findMenuItem(tree, predicate, childrenKeys = ["subMenu"]) {
  for (const node of tree) {
    if (predicate(node)) return node;
    for (const ck of childrenKeys) {
      if (node[ck]) {
        const found = findMenuItem(node[ck], predicate, childrenKeys);
        if (found) return found;
      }
    }
    if (node.sliderConfig?.menu) {
      const found = findMenuItem(node.sliderConfig.menu, predicate, childrenKeys);
      if (found) return found;
    }
  }
  return null;
}

// menu 树 -> 路由表（module 节点才生成路由，group 只用于分组不生成）
function menuTreeToRoutes(tree, parentPath = "") {
  const routes = [];
  for (const node of tree) {
    const path = `${parentPath}/${node.key}`;
    if (node.menuType === "module") {
      routes.push({ path, key: node.key, name: node.name, moduleType: node.moduleType, node });
    }
    if (node.subMenu) {
      routes.push(...menuTreeToRoutes(node.subMenu, path));
    }
  }
  return routes;
}

/* ============================================================================
 * 第二步：buildDtoSchema —— 按用途拆分 schema
 * ----------------------------------------------------------------------------
 * 同一份 schema 里，字段身上挂了 tableOption / searchOption / formOption。
 * buildDtoSchema(schema, 'table') 只挑出配了 tableOption 的字段，
 * 并把 tableOption 提到 option 上，供表格组件消费；
 * 换成 'search' / 'form' 同理。三个视图天生共享同一份字段定义，不会走样。
 * ========================================================================== */

function buildDtoSchema(_schema, comName) {
  const dtoSchema = { type: "object", properties: {} };
  for (const key in _schema.properties) {
    const props = _schema.properties[key];
    // 只有配了对应 Option 的字段，才会出现在这个视图里
    if (props[`${comName}Option`]) {
      let dtoProps = {};
      for (const pKey in props) {
        if (pKey.indexOf("Option") < 0) dtoProps[pKey] = props[pKey];
      }
      dtoProps = { ...dtoProps, option: props[`${comName}Option`] };
      dtoSchema.properties[key] = dtoProps;
    }
  }
  return dtoSchema;
}

/* ============================================================================
 * 第二步：eventKey 事件系统
 * ----------------------------------------------------------------------------
 * 按钮的行为由 eventKey 声明式指定，eventOption.params 里能用
 * 'schema::product_id' 这种写法，从当前行数据取值。
 * resolveParams 专门解这种占位符协议；eventHandlers 是可扩展的事件注册表，
 * 以后加新动作（比如 export、approve）只需要往这个表里加一条。
 * ========================================================================== */

function resolveParams(paramsConfig, rowData) {
  if (!paramsConfig) return {};
  const result = {};
  for (const k in paramsConfig) {
    const v = paramsConfig[k];
    if (typeof v === "string" && v.startsWith("schema::")) {
      const field = v.split("::")[1];
      result[k] = rowData ? rowData[field] : undefined;
    } else {
      result[k] = v;
    }
  }
  return result;
}

const eventHandlers = {
  showComponent: (button, ctx) => {
    ctx.openModal(ctx.rowData || null);
  },
  remove: (button, ctx) => {
    const params = resolveParams(button.eventOption?.params, ctx.rowData);
    ctx.removeRow(params);
  },
};

function dispatchEvent(button, ctx) {
  const handler = eventHandlers[button.eventKey];
  if (!handler) {
    ctx.log(`未注册的 eventKey: ${button.eventKey}`, "error");
    return;
  }
  handler(button, ctx);
}

/* ============================================================================
 * 运行时层：内存 mock API（模拟 RESTful list/create/update/remove）
 * ========================================================================== */

const seedData = {
  "/api/proj/product": [
    { product_id: "P10001", product_name: "无线机械键盘", price: 199, inventory: 86, create_time: "2026-06-02 10:12" },
    { product_id: "P10002", product_name: "降噪耳机 Pro", price: 899, inventory: 23, create_time: "2026-06-08 14:30" },
    { product_id: "P10003", product_name: "USB-C 数据线", price: 39.9, inventory: 512, create_time: "2026-07-01 09:05" },
  ],
  "/api/proj/order": [
    { order_id: "ORD-88291", buyer: "陈小雨", amount: 199, status: "待发货", create_time: "2026-08-20 16:40" },
    { order_id: "ORD-88305", buyer: "林墨", amount: 39.9, status: "已发货", create_time: "2026-08-22 09:11" },
    { order_id: "ORD-88312", buyer: "周意", amount: 899, status: "已完成", create_time: "2026-08-25 19:02" },
  ],
  "/api/proj/category_l1": [
    { category_id: "C001", category_name: "数码电器", sort: 1 },
    { category_id: "C002", category_name: "家居生活", sort: 2 },
  ],
  "/api/proj/category_l2": [
    { category_id: "C001-01", parent_name: "数码电器", category_name: "耳机音箱" },
    { category_id: "C001-02", parent_name: "数码电器", category_name: "键盘鼠标" },
    { category_id: "C002-01", parent_name: "家居生活", category_name: "厨房用品" },
  ],
};

function useMockApi(logFn) {
  const store = useRef(JSON.parse(JSON.stringify(seedData)));
  const idSeq = useRef(20000);

  const delay = (ms) => new Promise((r) => setTimeout(r, ms));

  const list = useCallback(async (api, filters) => {
    logFn(`GET  ${api}  ${filters && Object.keys(filters).length ? JSON.stringify(filters) : ""}`, "req");
    await delay(220);
    let rows = store.current[api] || [];
    if (filters) {
      rows = rows.filter((row) =>
        Object.entries(filters).every(([k, v]) => {
          if (v === undefined || v === null || v === "" || v === -999) return true;
          if (typeof v === "number") return row[k] === v;
          return String(row[k] ?? "").toLowerCase().includes(String(v).toLowerCase());
        })
      );
    }
    logFn(`200  ${api}  返回 ${rows.length} 条`, "res");
    return rows;
  }, [logFn]);

  const create = useCallback(async (api, data, idField) => {
    logFn(`POST ${api}  ${JSON.stringify(data)}`, "req");
    await delay(200);
    idSeq.current += 1;
    const row = { ...data, [idField]: data[idField] || `NEW-${idSeq.current}`, create_time: new Date().toISOString().slice(0, 16).replace("T", " ") };
    store.current[api] = [row, ...(store.current[api] || [])];
    logFn(`201  ${api}  新增成功`, "res");
    return row;
  }, [logFn]);

  const update = useCallback(async (api, data, idField) => {
    logFn(`PUT  ${api}  ${JSON.stringify(data)}`, "req");
    await delay(200);
    store.current[api] = (store.current[api] || []).map((row) =>
      row[idField] === data[idField] ? { ...row, ...data } : row
    );
    logFn(`200  ${api}  更新成功`, "res");
  }, [logFn]);

  const remove = useCallback(async (api, params) => {
    logFn(`DELETE ${api}  ${JSON.stringify(params)}`, "req");
    await delay(200);
    const [idField, idValue] = Object.entries(params)[0] || [];
    store.current[api] = (store.current[api] || []).filter((row) => row[idField] !== idValue);
    logFn(`200  ${api}  删除成功`, "res");
  }, [logFn]);

  return { list, create, update, remove };
}

/* ============================================================================
 * UI —— 视觉设定
 * ========================================================================== */

const C = {
  bg: "#0F1115",
  panel: "#171A21",
  panelAlt: "#1D212B",
  border: "#272C37",
  borderSoft: "#20242E",
  text: "#E7E9EE",
  muted: "#8B92A5",
  mutedDim: "#5B6272",
  accent: "#4FD1C5",
  accentDim: "#245E58",
  warn: "#F0B429",
  warnDim: "#4A3B15",
  danger: "#F16063",
  dangerDim: "#4A2224",
  key: "#7DD3FC",
  str: "#A7E3A0",
  num: "#F0B429",
};

const mono = { fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace" };
const sans = { fontFamily: "Inter, -apple-system, 'Segoe UI', sans-serif" };

function JsonView({ value, indent = 0 }) {
  const pad = { paddingLeft: indent * 14 };
  if (Array.isArray(value)) {
    return (
      <div>
        <span style={{ color: C.mutedDim }}>[</span>
        {value.map((v, i) => (
          <div key={i} style={pad}>
            <JsonView value={v} indent={indent + 1} />
            {i < value.length - 1 && <span style={{ color: C.mutedDim }}>,</span>}
          </div>
        ))}
        <div style={pad}><span style={{ color: C.mutedDim }}>]</span></div>
      </div>
    );
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    return (
      <div>
        <span style={{ color: C.mutedDim }}>{"{"}</span>
        {entries.map(([k, v], i) => (
          <div key={k} style={pad}>
            <span style={{ color: C.key }}>"{k}"</span>
            <span style={{ color: C.mutedDim }}>: </span>
            <JsonView value={v} indent={indent + 1} />
            {i < entries.length - 1 && <span style={{ color: C.mutedDim }}>,</span>}
          </div>
        ))}
        <div style={pad}><span style={{ color: C.mutedDim }}>{"}"}</span></div>
      </div>
    );
  }
  if (typeof value === "string") return <span style={{ color: C.str }}>"{value}"</span>;
  if (typeof value === "number") return <span style={{ color: C.num }}>{value}</span>;
  if (typeof value === "boolean") return <span style={{ color: C.accent }}>{String(value)}</span>;
  return <span style={{ color: C.mutedDim }}>null</span>;
}

const btnStyleFor = (type) => {
  if (type === "primary") return { bg: C.accentDim, fg: C.accent, border: C.accent };
  if (type === "warning") return { bg: C.warnDim, fg: C.warn, border: C.warn };
  if (type === "danger") return { bg: C.dangerDim, fg: C.danger, border: C.danger };
  return { bg: C.panelAlt, fg: C.text, border: C.border };
};

function ConfigButton({ button, onClick }) {
  const s = btnStyleFor(button.type);
  const Icon = button.eventKey === "remove" ? Trash2 : button.eventKey === "showComponent" && button.type === "primary" ? Plus : Pencil;
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 text-xs font-medium transition-colors"
      style={{ background: s.bg, color: s.fg, border: `1px solid ${s.border}33` }}
    >
      <Icon size={13} />
      {button.label}
    </button>
  );
}

/* ============================================================================
 * SchemaView —— moduleType: 'schema' 的渲染器
 * 拿到 schemaConfig，内部用 buildDtoSchema 拆出 search / table / form 三个视图
 * ========================================================================== */

function SchemaView({ node, log }) {
  const { schemaConfig } = node;
  const searchSchema = useMemo(() => buildDtoSchema(schemaConfig.schema, "search"), [schemaConfig]);
  const tableSchema = useMemo(() => buildDtoSchema(schemaConfig.schema, "table"), [schemaConfig]);
  const formSchema = useMemo(() => buildDtoSchema(schemaConfig.schema, "form"), [schemaConfig]);
  const idField = Object.keys(schemaConfig.schema.properties)[0];

  const api = useMockApi(log);
  const [rows, setRows] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null); // null | { mode: 'add'|'edit', data }

  const refresh = useCallback(async (f = filters) => {
    setLoading(true);
    const data = await api.list(schemaConfig.api, f);
    setRows(data);
    setLoading(false);
  }, [api, schemaConfig.api, filters]);

  useEffect(() => {
    setRows([]);
    setFilters({});
    refresh({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schemaConfig.api]);

  const ctxFor = (rowData) => ({
    rowData,
    log,
    openModal: (data) => setModal({ mode: data ? "edit" : "add", data: data ? { ...data } : {} }),
    removeRow: async (params) => {
      await api.remove(schemaConfig.api, params);
      refresh();
    },
  });

  const handleSearch = () => refresh(filters);
  const handleResetFilters = () => {
    setFilters({});
    refresh({});
  };

  const submitModal = async () => {
    if (modal.mode === "add") {
      await api.create(schemaConfig.api, modal.data, idField);
    } else {
      await api.update(schemaConfig.api, modal.data, idField);
    }
    setModal(null);
    refresh();
  };

  return (
    <div>
      {/* ---- searchConfig 渲染出的搜索栏 ---- */}
      <div
        className="flex flex-wrap items-end gap-3 rounded-lg p-4 mb-4"
        style={{ background: C.panel, border: `1px solid ${C.border}` }}
      >
        {Object.entries(searchSchema.properties).map(([key, field]) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-xs" style={{ color: C.muted, ...sans }}>{field.label}</label>
            {field.option.comType === "select" ? (
              <select
                value={filters[key] ?? ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  const num = Number(raw);
                  setFilters((f) => ({ ...f, [key]: raw !== "" && !isNaN(num) && field.type === "number" ? num : raw }));
                }}
                className="text-sm rounded px-2.5 py-1.5 outline-none"
                style={{ background: C.panelAlt, color: C.text, border: `1px solid ${C.border}`, minWidth: 140 }}
              >
                {field.option.enumList.map((opt) => (
                  <option key={String(opt.value)} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                value={filters[key] ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={field.option.placeholder}
                className="text-sm rounded px-2.5 py-1.5 outline-none"
                style={{ background: C.panelAlt, color: C.text, border: `1px solid ${C.border}`, minWidth: 160 }}
              />
            )}
          </div>
        ))}
        <button
          onClick={handleSearch}
          className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-sm font-medium"
          style={{ background: C.accentDim, color: C.accent, border: `1px solid ${C.accent}33` }}
        >
          <Search size={14} /> 搜索
        </button>
        <button
          onClick={handleResetFilters}
          className="inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-sm"
          style={{ background: "transparent", color: C.muted, border: `1px solid ${C.border}` }}
        >
          <RotateCcw size={13} /> 重置
        </button>
      </div>

      {/* ---- tableConfig.headerButtons ---- */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs" style={{ color: C.mutedDim, ...mono }}>
          {schemaConfig.api} · {rows.length} 条
        </div>
        <div className="flex gap-2">
          {schemaConfig.tableConfig.headerButtons.map((btn, i) => (
            <ConfigButton key={i} button={btn} onClick={() => dispatchEvent(btn, ctxFor(null))} />
          ))}
        </div>
      </div>

      {/* ---- tableSchema 渲染出的表格 ---- */}
      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.panelAlt }}>
              {Object.entries(tableSchema.properties).map(([key, field]) => (
                <th
                  key={key}
                  className="text-left px-3 py-2.5 font-medium"
                  style={{ color: C.muted, width: field.option.width, borderBottom: `1px solid ${C.border}`, ...sans }}
                >
                  {field.label}
                </th>
              ))}
              <th className="text-left px-3 py-2.5 font-medium" style={{ color: C.muted, borderBottom: `1px solid ${C.border}`, ...sans }}>
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={99} className="px-3 py-6 text-center text-sm" style={{ color: C.mutedDim }}>加载中…</td></tr>
            )}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={99} className="px-3 py-6 text-center text-sm" style={{ color: C.mutedDim }}>暂无数据</td></tr>
            )}
            {!loading && rows.map((row, ri) => (
              <tr key={ri} style={{ borderBottom: ri < rows.length - 1 ? `1px solid ${C.borderSoft}` : "none" }}>
                {Object.entries(tableSchema.properties).map(([key, field]) => (
                  <td key={key} className="px-3 py-2.5" style={{ color: C.text, ...sans }}>
                    {field.option.prefix}{row[key]}
                  </td>
                ))}
                <td className="px-3 py-2.5">
                  <div className="flex gap-2">
                    {schemaConfig.tableConfig.rowButtons.map((btn, i) => (
                      <ConfigButton key={i} button={btn} onClick={() => dispatchEvent(btn, ctxFor(row))} />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---- formSchema 渲染出的新增/编辑弹窗 ---- */}
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "#000000aa" }}>
          <div className="rounded-lg w-full max-w-sm mx-4" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${C.border}` }}>
              <div className="text-sm font-medium" style={{ color: C.text, ...sans }}>
                {modal.mode === "add" ? "新增" : "编辑"} · eventKey: showComponent
              </div>
              <button onClick={() => setModal(null)} style={{ color: C.muted }}><X size={16} /></button>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {Object.entries(formSchema.properties).map(([key, field]) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-xs" style={{ color: C.muted, ...sans }}>
                    {field.label}{field.option.required && <span style={{ color: C.danger }}> *</span>}
                  </label>
                  <input
                    value={modal.data[key] ?? ""}
                    onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, [key]: field.type === "number" ? Number(e.target.value) : e.target.value } }))}
                    className="text-sm rounded px-2.5 py-1.5 outline-none"
                    style={{ background: C.panelAlt, color: C.text, border: `1px solid ${C.border}` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2 px-4 py-3" style={{ borderTop: `1px solid ${C.border}` }}>
              <button onClick={() => setModal(null)} className="text-sm px-3 py-1.5 rounded" style={{ color: C.muted, border: `1px solid ${C.border}` }}>取消</button>
              <button onClick={submitModal} className="text-sm px-3 py-1.5 rounded font-medium" style={{ background: C.accentDim, color: C.accent, border: `1px solid ${C.accent}33` }}>保存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
 * IframeView —— moduleType: 'iframe' 的渲染器
 * ----------------------------------------------------------------------------
 * 配置里只有一个 path，交给 <iframe> 就完事。这里为了不依赖外部网络能否加载
 * （沙箱环境里跨域 iframe 大概率会被目标站点的 X-Frame-Options 挡掉），
 * 用一个"浏览器地址栏"式的壳子模拟外部页面被嵌入的效果，实际项目里
 * 把占位内容换成 <iframe src={path} style={{width:'100%',height:'100%'}} /> 即可。
 * ========================================================================== */

function IframeView({ node, log }) {
  const { path } = node.iframeConfig;

  useEffect(() => {
    log(`加载 iframe: ${path}`, "req");
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2 px-3 py-2" style={{ background: C.panelAlt, borderBottom: `1px solid ${C.border}` }}>
        <div className="flex gap-1.5">
          {["#f16063", "#f0b429", "#4fd17c"].map((c) => (
            <span key={c} style={{ width: 9, height: 9, borderRadius: 999, background: c, opacity: 0.7, display: "inline-block" }} />
          ))}
        </div>
        <div className="text-xs flex-1 px-2.5 py-1 rounded truncate" style={{ background: C.bg, color: C.muted, ...mono }}>
          {path}
        </div>
      </div>
      <div style={{ height: 340, background: "#f4f5f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#6b7280", ...sans }}>iframeConfig.path 指向的外部页面会渲染在这里</div>
          <div style={{ fontSize: 11, color: "#9aa1af", marginTop: 6, ...mono }}>{`<iframe src="${path}" />`}</div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * CustomView —— moduleType: 'custom' 的渲染器
 * ----------------------------------------------------------------------------
 * custom 类型是 DSL 覆盖不到的场景的逃生舱：DSL 层只登记一个路由入口，
 * 具体页面由业务方在对应路由自己写组件实现，解析器不管这部分渲染逻辑。
 * ========================================================================== */

function CustomView({ node, log }) {
  useEffect(() => {
    log(`custom 入口命中: ${node.customConfig.path}`, "info");
  }, [node.customConfig.path]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="rounded-lg p-10 text-center" style={{ border: `1px dashed ${C.border}`, background: C.panel }}>
      <div style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>自定义页面入口</div>
      <div className="mt-2 text-xs" style={{ color: C.mutedDim, ...mono }}>customConfig.path: {node.customConfig.path}</div>
      <div className="mt-3 text-xs mx-auto" style={{ color: C.muted, maxWidth: 360, lineHeight: 1.7, ...sans }}>
        custom 类型只在 DSL 层声明一个入口，具体渲染逻辑由业务方在对应路由自己实现，
        不受解析器管辖——留给"配置驱动覆盖不到的场景"用。
      </div>
    </div>
  );
}

/* ============================================================================
 * SliderView —— moduleType: 'slider' 的渲染器
 * ----------------------------------------------------------------------------
 * sliderConfig.menu 是一棵独立的子菜单树，节点形状跟顶层 menu 完全一样
 * （都是 { key, name, menuType, moduleType, xxxConfig }），
 * 所以子菜单里能再塞 custom / iframe，甚至 group 套 schema，
 * 靠的就是"侧边栏选中的节点 -> ModuleRenderer 统一分发"这条路复用顶层同一套逻辑。
 * ========================================================================== */

function findFirstModuleNode(tree) {
  for (const node of tree) {
    if (node.menuType === "group" && node.subMenu) {
      const found = findFirstModuleNode(node.subMenu);
      if (found) return found;
    } else if (node.menuType === "module") {
      return node;
    }
  }
  return null;
}

function SliderTreeMenu({ tree, activeKey, onSelect, depth = 0 }) {
  return (
    <>
      {tree.map((node) => {
        if (node.menuType === "group") {
          return (
            <div key={node.key}>
              <div
                className="px-3 py-2 text-[11px] font-medium"
                style={{ color: C.mutedDim, paddingLeft: 12 + depth * 12, ...sans }}
              >
                {node.name}
              </div>
              <SliderTreeMenu tree={node.subMenu} activeKey={activeKey} onSelect={onSelect} depth={depth + 1} />
            </div>
          );
        }
        const active = activeKey === node.key;
        return (
          <button
            key={node.key}
            onClick={() => onSelect(node)}
            className="w-full text-left px-3 py-2 text-sm transition-colors"
            style={{
              paddingLeft: 12 + depth * 12,
              color: active ? C.accent : C.muted,
              background: active ? C.panelAlt : "transparent",
              borderLeft: `2px solid ${active ? C.accent : "transparent"}`,
            }}
          >
            {node.name}
          </button>
        );
      })}
    </>
  );
}

function SliderView({ node, log }) {
  const tree = node.sliderConfig.menu;
  const [active, setActive] = useState(() => findFirstModuleNode(tree));

  return (
    <div className="flex rounded-lg overflow-hidden" style={{ minHeight: 420, border: `1px solid ${C.border}` }}>
      <div className="w-44 shrink-0 py-2" style={{ background: C.panel, borderRight: `1px solid ${C.border}` }}>
        <SliderTreeMenu tree={tree} activeKey={active?.key} onSelect={setActive} />
      </div>
      <div className="flex-1 p-4" style={{ background: C.bg }}>
        {active ? <ModuleRenderer node={active} log={log} /> : <div style={{ color: C.mutedDim }}>该分组下暂无可渲染模块</div>}
      </div>
    </div>
  );
}

/* ============================================================================
 * 顶层：菜单树 -> 路由 -> moduleType 分发
 * ----------------------------------------------------------------------------
 * 新增 moduleType 只需要往这个注册表里加一条，不用改解析器和渲染入口。
 * ========================================================================== */

const moduleRegistry = {
  schema: SchemaView,
  iframe: IframeView,
  custom: CustomView,
  slider: SliderView,
};

function ModuleRenderer({ node, log }) {
  const Component = moduleRegistry[node.moduleType];
  if (!Component) {
    return (
      <div className="rounded-lg p-4 text-sm" style={{ background: C.dangerDim, color: C.danger, border: `1px solid ${C.danger}33` }}>
        未注册的 moduleType: {node.moduleType}
      </div>
    );
  }
  return <Component node={node} log={log} />;
}

// 根据 moduleType 取出对应的 xxxConfig，供右侧配置面板展示
function getNodeConfig(node) {
  return node[`${node.moduleType}Config`];
}

export default function ConfigDrivenAdminDemo() {
  const routes = useMemo(() => menuTreeToRoutes(dslConfig.menu), []);
  const [activeKey, setActiveKey] = useState(routes[0]?.key);
  const [showConfig, setShowConfig] = useState(true);
  const [logs, setLogs] = useState([]);
  const logEndRef = useRef(null);

  const log = useCallback((msg, kind = "info") => {
    setLogs((prev) => [...prev.slice(-40), { msg, kind, t: new Date().toLocaleTimeString("zh-CN", { hour12: false }) }]);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [logs]);

  const activeRoute = findMenuItem(dslConfig.menu, (n) => n.key === activeKey) ? routes.find((r) => r.key === activeKey) : routes[0];

  return (
    <div className="w-full min-h-screen flex" style={{ background: C.bg, ...sans }}>
      {/* 左侧：由 menu 树渲染出的导航 */}
      <div className="w-52 shrink-0 flex flex-col" style={{ background: C.panel, borderRight: `1px solid ${C.border}` }}>
        <div className="px-4 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="text-xs" style={{ color: C.mutedDim, ...mono }}>model: {dslConfig.model}</div>
          <div className="text-sm font-semibold mt-0.5" style={{ color: C.text }}>{dslConfig.name}</div>
        </div>
        <div className="flex-1 py-2">
          {routes.map((r) => (
            <button
              key={r.key}
              onClick={() => setActiveKey(r.key)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors"
              style={{
                color: activeKey === r.key ? C.accent : C.muted,
                background: activeKey === r.key ? C.panelAlt : "transparent",
                borderLeft: `2px solid ${activeKey === r.key ? C.accent : "transparent"}`,
              }}
            >
              <span>{r.name}</span>
              <ChevronRight size={14} style={{ opacity: activeKey === r.key ? 1 : 0.3 }} />
            </button>
          ))}
        </div>
        <div className="px-4 py-3 text-[11px] leading-relaxed" style={{ color: C.mutedDim, borderTop: `1px solid ${C.border}` }}>
          由 menuTreeToRoutes() 从 menu 数组生成，findMenuItem() 负责按 key 递归定位。
        </div>
      </div>

      {/* 主区域 */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div>
            <div className="text-base font-semibold" style={{ color: C.text }}>{activeRoute.name}</div>
            <div className="text-xs mt-0.5" style={{ color: C.mutedDim, ...mono }}>moduleType: {activeRoute.moduleType}</div>
          </div>
          <button
            onClick={() => setShowConfig((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded"
            style={{ color: showConfig ? C.accent : C.muted, border: `1px solid ${showConfig ? C.accent + "55" : C.border}`, background: showConfig ? C.accentDim : "transparent" }}
          >
            <Braces size={13} /> 驱动配置
          </button>
        </div>

        <div className="flex-1 flex min-h-0">
          <div className="flex-1 overflow-auto p-6">
            <ModuleRenderer node={activeRoute.node} log={log} />
          </div>

          {showConfig && (
            <div className="w-80 shrink-0 flex flex-col" style={{ borderLeft: `1px solid ${C.border}`, background: C.panel }}>
              <div className="flex items-center gap-1.5 px-4 py-3 text-xs font-medium" style={{ color: C.muted, borderBottom: `1px solid ${C.border}` }}>
                <Braces size={13} /> {activeRoute.moduleType}Config（驱动上面渲染的原始配置）
              </div>
              <div className="flex-1 overflow-auto px-4 py-3 text-[11px] leading-relaxed" style={{ ...mono }}>
                <JsonView value={getNodeConfig(activeRoute.node)} />
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium" style={{ color: C.muted, borderTop: `1px solid ${C.border}` }}>
                <Terminal size={13} /> 运行时请求日志
              </div>
              <div className="h-40 overflow-auto px-4 py-2 text-[11px]" style={{ ...mono }}>
                {logs.length === 0 && <div style={{ color: C.mutedDim }}>等待交互…</div>}
                {logs.map((l, i) => (
                  <div key={i} className="py-0.5" style={{ color: l.kind === "req" ? C.accent : l.kind === "res" ? C.str : l.kind === "error" ? C.danger : C.mutedDim }}>
                    <span style={{ color: C.mutedDim }}>{l.t}</span> {l.msg}
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
