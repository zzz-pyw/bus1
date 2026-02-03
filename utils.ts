
// 智能图片处理
export const getProxyImage = (url: string, width = 400): string => {
  if (!url) return 'https://images.weserv.nl/?url=https://picsum.photos/400/600&w=400';
  
  // 处理 API 可能返回的相对路径
  let absoluteUrl = url;
  if (url.startsWith('//')) {
    absoluteUrl = 'https:' + url;
  } else if (!url.startsWith('http')) {
    absoluteUrl = 'https://www.javbus.com' + (url.startsWith('/') ? '' : '/') + url;
  }

  // 使用 images.weserv.nl 代理，这是一个极其稳定的全球 CDN 代理
  // l=9 加强压缩，af 忽略防盗链头部
  return `https://images.weserv.nl/?url=${encodeURIComponent(absoluteUrl)}&w=${width}&fit=cover&errorredirect=https://picsum.photos/400/600`;
};

export const truncate = (str: string, length: number) => {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
};

export const copyToClipboard = async (text: string) => {
  try {
    // 兼容性更好的复制方法
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (err) {
        document.body.removeChild(textArea);
        return false;
      }
    }
  } catch (err) {
    return false;
  }
};
