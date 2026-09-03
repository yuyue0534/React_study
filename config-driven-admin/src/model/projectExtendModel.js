import _ from "lodash";

/**
 * project 继承 model 的合并规则：
 *   - 两边同一个 key           -> project 覆盖 model（改）
 *   - 只有 project 有          -> 追加（增）
 *   - 只有 model 有            -> 原样保留（继承）
 *   - project 项带 _deleted    -> 从结果中移除该项（删）
 *
 * lodash 的 mergeWith 本身就会对"普通对象"做深度合并（递归调用），
 * 我们只需要给它一个 customizer，专门接管"数组"类型的属性——
 * 因为 lodash 对数组的默认行为是按下标覆盖，不是我们要的"按 key 识别"。
 *
 * 注意：这套按 key 合并只对"数组元素本身是带 key 字段的对象"生效，
 * 比如 menu / subMenu / sliderConfig.menu。像 tableConfig.headerButtons
 * 这种数组元素通常没有 key，customizer 会直接把 project 里的项追加在后面，
 * 而不是替换——如果业务上需要"整体覆盖某个无 key 数组"，
 * 需要额外给这类数组的元素也约定 key，或者单独写一条合并规则。
 */
function arrayCustomizer(modelValue, projValue) {
  if (!Array.isArray(modelValue) || !Array.isArray(projValue)) {
    return undefined; // 交还给 lodash 走默认合并逻辑（对象继续深度合并，基本类型直接覆盖）
  }

  const result = [...modelValue];
  const keyIndex = new Map();
  modelValue.forEach((item, i) => {
    if (item && typeof item === "object" && item.key != null) {
      keyIndex.set(item.key, i);
    }
  });

  for (const projItem of projValue) {
    if (!projItem || typeof projItem !== "object" || projItem.key == null) {
      // 没有 key，无法定位对应关系，直接追加
      result.push(projItem);
      continue;
    }

    const idx = keyIndex.get(projItem.key);

    if (idx === undefined) {
      // project 独有 -> 追加（增）
      result.push(projItem);
      continue;
    }

    if (projItem._deleted) {
      // 显式标记删除 -> 从结果里摘掉
      result[idx] = null;
      continue;
    }

    // 同 key -> 递归合并（改），复用同一个 customizer 处理更深层的数组
    result[idx] = _.mergeWith({}, result[idx], projItem, arrayCustomizer);
  }

  return result.filter((item) => item !== null);
}

export function projectExtendModel(model, project) {
  return _.mergeWith({}, model, project, arrayCustomizer);
}
