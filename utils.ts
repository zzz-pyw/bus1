
// 统一占位图地址
export const IMAGE_PLACEHOLDER = 'https://wsrv.nl/?url=https://www.javbus.com/pics/thumb/placeholder.jpg&w=400&fit=cover';

// 智能图片处理
export const getProxyImage = (url: string | undefined, width = 600): string => {
  if (!url || url.trim() === '') return IMAGE_PLACEHOLDER;
  
  let absoluteUrl = url;
  if (url.startsWith('//')) {
    absoluteUrl = 'https:' + url;
  } else if (!url.startsWith('http')) {
    // 补全 JavBus 相对路径
    absoluteUrl = 'https://www.javbus.com' + (url.startsWith('/') ? '' : '/') + url;
  }
  
  // 使用 wsrv.nl 代理解决防盗链和尺寸问题
  // af=忽略防盗链, n=-1不缓存保证最新
  return `https://wsrv.nl/?url=${encodeURIComponent(absoluteUrl)}&w=${width}&fit=cover&af&n=-1`;
};

// 备用图片逻辑：当主封面加载失败时，尝试根据番号构造官方路径
export const getFallbackImage = (id: string, isThumb = true): string => {
  if (!id) return IMAGE_PLACEHOLDER;
  const folder = isThumb ? 'thumb' : 'cover';
  // JavBus 的图片资源通常可以通过番号小写化构造
  const fallbackUrl = `https://www.javbus.com/pics/${folder}/${id.toLowerCase()}.jpg`;
  return getProxyImage(fallbackUrl);
};

// 构造外部参考链接 (取长补短逻辑)
export const getExternalLinks = (id: string) => {
  const code = id.toUpperCase();
  return [
    { name: 'JavDB (查评分/文件数)', url: `https://javdb.com/search?q=${code}&f=all`, color: 'bg-emerald-500' },
    { name: 'JavLibrary (冷门补全)', url: `http://www.javlibrary.com/cn/vl_searchbyid.php?keyword=${code}`, color: 'bg-amber-500' },
    { name: 'MissAV (预览/在线)', url: `https://missav.ai/search/${code}`, color: 'bg-slate-800' },
  ];
};

export const copyToClipboard = async (text: string) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (err) { return false; }
};
