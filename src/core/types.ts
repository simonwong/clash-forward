// Clash 代理节点类型定义
/** biome-ignore-all lint/suspicious/noExplicitAny: allow any */
import type { ClashProxy } from './clash-proxy';

export interface ClashConfig {
  port?: number;
  'socks-port'?: number;
  'redir-port'?: number;
  'tproxy-port'?: number;
  'mixed-port'?: number;
  'allow-lan'?: boolean;
  mode?: string;
  'log-level'?: string;
  'external-controller'?: string;
  'external-ui'?: string;
  secret?: string;
  'interface-name'?: string;
  'routing-mark'?: number;
  proxies?: ClashProxy[];
  'proxy-groups'?: any[];
  'rule-providers'?: any;
  rules?: string[];
  dns?: any;
  hosts?: Record<string, string>;
  profile?: {
    'store-selected'?: boolean;
    'store-fake-ip'?: boolean;
  };
  experimental?: any;
  'proxy-providers'?: any;
}

// 订阅转换响应
export interface ConvertResponse {
  success: boolean;
  data?: string;
  headers?: Record<string, string>;
  error?: string;
  message?: string;
}

// URL 解析结果
export interface ParsedUrl {
  originalUrl: string;
  base64Url: string;
}
