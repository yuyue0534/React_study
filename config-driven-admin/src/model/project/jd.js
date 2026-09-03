// 京东：
//  1. 商品管理 -> 改名 + 在 headerButtons 上追加一个"批量导入"按钮（同 key 递归合并进 schemaConfig）
//  2. 新增一个 model 里完全没有的模块：优惠券管理（project 独有 -> 追加到 menu 末尾）
export const jd = {
  name: "电商系统（京东）",
  menu: [
    {
      key: "product",
      name: "商品管理(京东)",
      schemaConfig: {
        tableConfig: {
          headerButtons: [
            { label: "批量导入", eventKey: "showComponent", type: "default" },
          ],
        },
      },
    },
    {
      key: "coupon",
      name: "优惠券管理",
      menuType: "module",
      moduleType: "schema",
      schemaConfig: {
        api: "/api/proj/coupon",
        schema: {
          type: "object",
          properties: {
            coupon_id: { type: "string", label: "优惠券ID", tableOption: { width: 140 } },
            title: {
              type: "string",
              label: "名称",
              tableOption: { width: 180 },
              searchOption: { comType: "input", placeholder: "搜索名称" },
              formOption: { comType: "input", required: true },
            },
            discount: { type: "number", label: "折扣", tableOption: { width: 100 }, formOption: { comType: "input" } },
          },
        },
        tableConfig: {
          headerButtons: [{ label: "新增优惠券", eventKey: "showComponent", type: "primary" }],
          rowButtons: [
            { label: "修改", eventKey: "showComponent", type: "warning" },
            { label: "删除", eventKey: "remove", type: "danger", eventOption: { params: { coupon_id: "schema::coupon_id" } } },
          ],
        },
      },
    },
  ],
};
