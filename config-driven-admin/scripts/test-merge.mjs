import { model } from "../src/model/model.js";
import { pdd } from "../src/model/project/pdd.js";
import { jd } from "../src/model/project/jd.js";
import { taobao } from "../src/model/project/taobao.js";
import { projectExtendModel } from "../src/model/projectExtendModel.js";

let failed = 0;
function check(desc, actual, expected) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  console.log(`${pass ? "✓" : "✗"} ${desc}`);
  if (!pass) {
    failed++;
    console.log("  期望:", JSON.stringify(expected));
    console.log("  实际:", JSON.stringify(actual));
  }
}

console.log("\n=== 拼多多：只重载 name，其余继承 ===");
const pddMerged = projectExtendModel(model, pdd);
const pddProduct = pddMerged.menu.find((m) => m.key === "product");
check("name 被覆盖", pddProduct.name, "商品管理(拼多多)");
check("schemaConfig.api 原样继承自 model", pddProduct.schemaConfig.api, "/api/proj/product");
check(
  "字段定义原样继承（未被 pdd.js 提及）",
  Object.keys(pddProduct.schemaConfig.schema.properties),
  Object.keys(model.menu.find((m) => m.key === "product").schemaConfig.schema.properties)
);
check("order 模块未受影响，原样保留", pddMerged.menu.find((m) => m.key === "order").name, "订单管理");

console.log("\n=== 京东：改名 + 追加按钮 + 追加新模块 ===");
const jdMerged = projectExtendModel(model, jd);
const jdProduct = jdMerged.menu.find((m) => m.key === "product");
check("name 被覆盖", jdProduct.name, "商品管理(京东)");
check(
  "headerButtons 追加了新按钮，原有按钮保留",
  jdProduct.schemaConfig.tableConfig.headerButtons.map((b) => b.label),
  ["新增商品", "批量导入"]
);
check(
  "project 独有的 coupon 模块被追加到 menu 里",
  jdMerged.menu.map((m) => m.key),
  ["product", "order", "coupon"]
);

console.log("\n=== 淘宝：_deleted 删除语义 ===");
const taobaoMerged = projectExtendModel(model, taobao);
check(
  "order 模块被删除，menu 里只剩 product",
  taobaoMerged.menu.map((m) => m.key),
  ["product"]
);
check("product name 仍然正常覆盖", taobaoMerged.menu.find((m) => m.key === "product").name, "商品管理(淘宝)");

console.log("\n=== model 本身不会被 project 合并操作污染（纯函数） ===");
check("原始 model.menu 长度未变", model.menu.length, 2);
check("原始 model 里 product 的 name 未被改写", model.menu.find((m) => m.key === "product").name, "商品管理");

console.log(`\n${failed === 0 ? "全部通过 ✓" : `${failed} 项失败 ✗`}\n`);
process.exit(failed === 0 ? 0 : 1);
