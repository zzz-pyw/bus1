
// 智能图片处理
export const getProxyImage = (url: string, width = 400): string => {
  if (!url) return '';
  
  let absoluteUrl = url;
  if (url.startsWith('//')) {
    absoluteUrl = 'https:' + url;
  } else if (!url.startsWith('http')) {
    // 补全 JavBus 常见的图片路径
    absoluteUrl = 'https://www.javbus.com' + (url.startsWith('/') ? '' : '/') + url;
  }

  // 使用 wsrv.nl 代理，n=-1 表示不使用缓存，强制获取最新内容，af 忽略防盗链
  // 移除之前的 errorredirect，防止显示随机风景图
  return `https://wsrv.nl/?url=${encodeURIComponent(absoluteUrl)}&w=${width}&fit=cover&n=-1`;
};

export const truncate = (str: string, length: number) => {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
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
  } catch (err) {
    return false;
  }
};
