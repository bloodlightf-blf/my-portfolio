/** 格式化日期为 YYYY-MM-DD */
export function formatDate(input: string | number | Date): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return String(input);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * 根据标题生成博客 slug：转小写、空格转连字符、去除首尾空格。
 * 中文标题会原样保留（React Router 会自动进行 URL 编码），
 * 若结果为空则回退为 post- 时间戳。
 */
export function slugify(title: string): string {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
  if (!slug) {
    return `post-${Date.now().toString(36)}`;
  }
  return slug;
}

/** 将逗号分隔的字符串拆分为去重、去空的标签数组 */
export function parseTags(input: string): string[] {
  return Array.from(
    new Set(
      input
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  );
}
