import { parse } from 'yaml';
import type {
  CipherType,
  ClashProxy,
  ProxyShadowsocksConfig,
  ProxyshadowsocksRConfig,
  ProxyTrojanConfig,
  ProxyVmessConfig,
} from './clash-proxy';
import type { ClashConfig, ParsedUrl } from './types';

/**
 * 解析 URL 路径，提取 Base64 编码的订阅链接
 */
export function parseUrl(base64Url: string): ParsedUrl {
  try {
    // 解码 base64 URL
    const decodedUrl = decodeURIComponent(atob(base64Url));
    // 验证是否为有效的 URL
    new URL(decodedUrl);

    return {
      originalUrl: decodedUrl,
      base64Url,
    };
  } catch (error) {
    throw new Error('无效的 Base64 编码或 URL 格式', { cause: error });
  }
}

/**
 * 从订阅链接获取原始配置数据
 */
export async function fetchSubscriptionData(url: string): Promise<{
  data: string;
  headers: Record<string, string>;
}> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'clash-verge/v2.3.2',
        Accept: '*/*',
      },
    });
    if (!response.ok) {
      throw new Error(
        `获取订阅数据失败: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.text();
    return {
      data,
      headers: {
        'subscription-userinfo':
          response.headers.get('subscription-userinfo') || '',
      },
    };
  } catch (error) {
    throw new Error(
      `获取订阅数据失败: ${error instanceof Error ? error.message : '未知错误'}`
    );
  }
}

/**
 * 解析 VMess 配置
 */
function parseVmess(vmessUrl: string): ProxyVmessConfig {
  try {
    const base64Data = vmessUrl.replace('vmess://', '');
    const config = JSON.parse(atob(base64Data));

    const proxy: ProxyVmessConfig = {
      name: config.ps || config.remarks || 'VMess',
      type: 'vmess',
      server: config.add || config.address,
      port: Number.parseInt(config.port, 10),
      uuid: config.id,
      alterId: Number.parseInt(config.aid || '0', 10),
      cipher: config.scy || 'auto',
      network: config.net || 'tcp',
      tls: config.tls === 'tls' || config.tls === true,
    };

    // WebSocket 配置
    if (proxy.network === 'ws') {
      proxy['ws-opts'] = {
        path: config.path || '/',
        headers: config.host ? { Host: config.host } : undefined,
      };
    }

    // HTTP/2 配置
    if (proxy.network === 'h2') {
      proxy['h2-opts'] = {
        path: config.path || '/',
        host: config.host,
      };
    }

    // gRPC 配置
    if (proxy.network === 'grpc') {
      proxy['grpc-opts'] = {
        'grpc-service-name': config.path || '',
      };
    }

    // TLS 配置
    if (proxy.tls) {
      proxy.tls = config.sni || config.host;
      proxy['skip-cert-verify'] = config.allowInsecure === true;
    }

    return proxy;
  } catch (error) {
    throw new Error(
      `解析 VMess 配置失败: ${error instanceof Error ? error.message : '未知错误'}`
    );
  }
}

/**
 * 解析 Trojan 配置
 */
function parseTrojan(trojanUrl: string): ProxyTrojanConfig {
  try {
    const url = new URL(trojanUrl);
    const params = new URLSearchParams(url.search);

    const proxy: ProxyTrojanConfig = {
      name: decodeURIComponent(url.hash.slice(1)) || 'Trojan',
      type: 'trojan',
      server: url.hostname,
      port: Number.parseInt(url.port || '443', 10),
      password: url.username,
      sni: params.get('sni') || url.hostname,
      'skip-cert-verify': params.get('allowInsecure') === '1',
    };

    // WebSocket 配置
    if (params.get('type') === 'ws') {
      proxy.network = 'ws';
      proxy['ws-opts'] = {
        path: params.get('path') || '/',
        headers: params.get('host') ? { Host: params.get('host')! } : undefined,
      };
    }

    return proxy;
  } catch (error) {
    throw new Error(
      `解析 Trojan 配置失败: ${error instanceof Error ? error.message : '未知错误'}`
    );
  }
}

/**
 * 解析 Shadowsocks 配置
 */
function parseShadowsocks(ssUrl: string): ProxyShadowsocksConfig {
  try {
    const url = new URL(ssUrl);

    // 解析用户信息
    let method = '';
    let password = '';

    if (url.username && url.password) {
      // 格式: ss://method:password@server:port
      method = url.username;
      password = url.password;
    } else {
      // 格式: ss://base64(method:password)@server:port
      const userInfo = atob(url.username);
      const [m, p] = userInfo.split(':');
      method = m;
      password = p;
    }

    const proxy: ProxyShadowsocksConfig = {
      name: decodeURIComponent(url.hash.slice(1)) || 'Shadowsocks',
      type: 'ss',
      server: url.hostname,
      port: Number.parseInt(url.port, 10),
      cipher: method as CipherType,
      password,
    };

    return proxy;
  } catch (error) {
    throw new Error(
      `解析 Shadowsocks 配置失败: ${error instanceof Error ? error.message : '未知错误'}`
    );
  }
}

/**
 * 解析 ShadowsocksR 配置
 */
function parseShadowsocksR(ssrUrl: string): ProxyshadowsocksRConfig {
  try {
    const base64Data = ssrUrl.replace('ssr://', '');
    const decoded = atob(base64Data);
    const parts = decoded.split(':');

    if (parts.length < 6) {
      throw new Error('无效的 SSR 格式');
    }

    const [server, port, protocol, method, obfs, passwordBase64] = parts;
    const password = atob(passwordBase64.split('/?')[0]);

    const proxy: ProxyshadowsocksRConfig = {
      name: 'ShadowsocksR',
      type: 'ssr',
      server,
      port: Number.parseInt(port, 10),
      cipher: method as CipherType,
      password,
      protocol,
      obfs,
    };

    return proxy;
  } catch (error) {
    throw new Error(
      `解析 ShadowsocksR 配置失败: ${error instanceof Error ? error.message : '未知错误'}`
    );
  }
}

/**
 * 解析订阅数据中的代理配置
 */
export function parseProxies(data: string): ClashConfig {
  const lines = data.split('\n').filter((line) => line.trim());
  const proxies: ClashProxy[] = [];

  for (const line of lines) {
    try {
      if (line.startsWith('vmess://')) {
        proxies.push(parseVmess(line));
      } else if (line.startsWith('trojan://')) {
        proxies.push(parseTrojan(line));
      } else if (line.startsWith('ss://')) {
        proxies.push(parseShadowsocks(line));
      } else if (line.startsWith('ssr://')) {
        proxies.push(parseShadowsocksR(line));
      }
      // 可以继续添加其他协议的解析
    } catch (error) {
      console.warn(`跳过无效配置: ${line.substring(0, 50)}...`, error);
    }
  }

  return {
    proxies,
  };
}

/**
 * 尝试解析 YAML 格式的 Clash 配置
 */
export function parseClashConfig(data: string): ClashConfig {
  try {
    // 动态导入 js-yaml
    const config = parse(data) as ClashConfig;

    return config;
  } catch (error) {
    console.log('error', error);
    // 如果不是 YAML 格式，尝试解析为订阅链接
    return parseProxies(data);
  }
}
