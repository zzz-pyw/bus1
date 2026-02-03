
// 使用 wsrv.nl 绕过防盗链，n=-1 表示不缓存（有时更稳）
export const getProxyImage = (url: string, width = 400): string => {
  if (!url) return 'https://picsum.photos/300/400?blur=2';
  // 转换为 wsrv.nl 代理地址
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&q=80&output=webp&n=-1`;
};

export const truncate = (str: string, length: number) => {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
};

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('复制失败: ', err);
    return false;
  }
};
