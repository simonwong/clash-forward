import { stringify } from 'yaml';
// 从 extends-scripts.ts 中导入配置构建逻辑
import { extendsCommonConfig } from './extends-scripts';
import type { ClashConfig } from './types';

/**
 * 构建完整的 Clash 配置
 */
export function buildClashConfig(originalConfig: ClashConfig): ClashConfig {
  // 使用 extends-scripts.ts 中的逻辑来构建完整配置
  try {
    const fullConfig = extendsCommonConfig(originalConfig);
    return fullConfig;
  } catch (error) {
    throw new Error(
      `构建 Clash 配置失败: ${error instanceof Error ? error.message : '未知错误'}`
    );
  }
}

/**
 * 将配置转换为 YAML 格式
 */
export function configToYaml(config: ClashConfig): string {
  try {
    // 动态导入 js-yaml
    const yamlStr = stringify(config);

    return yamlStr;
  } catch (error) {
    throw new Error(
      `转换 YAML 失败: ${error instanceof Error ? error.message : '未知错误'}`
    );
  }
}
