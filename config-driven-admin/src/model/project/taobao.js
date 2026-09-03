// 淘宝：商品管理改名；订单管理模块通过 _deleted 标记从最终菜单里摘掉。
// 普通的 merge 做不到"删除"，所以需要一个约定好的标记字段，解析时识别并过滤。
export const taobao = {
  name: "电商系统（淘宝）",
  menu: [
    { key: "product", name: "商品管理(淘宝)" },
    { key: "order", _deleted: true },
  ],
};
