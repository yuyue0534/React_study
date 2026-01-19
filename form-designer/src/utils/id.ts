export function uid(): string {
    // 足够做本地设计器 id（后续可换 uuid）
    return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
