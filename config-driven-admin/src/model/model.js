// 通用「电商系统」模板。字段结构跟 ConfigDrivenAdminDemo.jsx 里内置的 dslConfig 完全一致，
// project/*.js 在这份模板基础上做局部覆盖/扩展/删除。
export const model = {
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
            product_id: { type: "string", label: "商品ID", tableOption: { width: 120 } },
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
            create_time: { type: "string", label: "创建时间", tableOption: { width: 160 } },
          },
        },
        tableConfig: {
          headerButtons: [{ label: "新增商品", eventKey: "showComponent", type: "primary" }],
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
            status: { type: "string", label: "状态", tableOption: { width: 120 } },
            create_time: { type: "string", label: "下单时间", tableOption: { width: 160 } },
          },
        },
        tableConfig: {
          headerButtons: [{ label: "新增订单", eventKey: "showComponent", type: "primary" }],
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
  ],
};
