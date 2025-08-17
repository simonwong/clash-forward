import { buildClashConfig, configToYaml } from './config-builder';
import {
  fetchSubscriptionData,
  parseClashConfig,
  parseUrl,
} from './subscription-parser';
import type { ConvertResponse } from './types';

/**
 * 主要的订阅转换服务
 */
export class SubscriptionConverter {
  /**
   * 转换订阅链接
   * @param pathname URL 路径，格式: /clash/base64url
   */
  async convert(pathname: string): Promise<ConvertResponse> {
    try {
      // 1. 解析 URL
      const { originalUrl } = parseUrl(pathname);

      // 2. 获取订阅数据
      const { data: subscriptionData, headers: subscriptionHeaders } =
        await fetchSubscriptionData(originalUrl);

      // 3. 解析代理节点
      const originalConfig = await parseClashConfig(subscriptionData);
      // 4. 构建 Clash 配置
      const config = await buildClashConfig(originalConfig);

      // 5. 转换为 YAML
      const yamlConfig = await configToYaml(config);

      // 直接返回 YAML 格式
      return {
        success: true,
        data: yamlConfig,
        headers: subscriptionHeaders,
        message: '成功转换',
      };
    } catch (error) {
      console.error('订阅转换失败:', error);

      return {
        success: false,
        error: 'CONVERSION_FAILED',
        message: error instanceof Error ? error.message : '转换失败',
      };
    }
  }

  /**
   * 获取转换状态信息
   */
  getInfo(): { version: string; description: string; usage: string } {
    return {
      version: '1.0.0',
      description: 'Clash 订阅链接转换工具',
      usage: '访问 /clash/{base64-encoded-subscription-url} 获取 YAML 配置文件',
    };
  }
}

/**
 * 单例实例
 */
export const converter = new SubscriptionConverter();
