'use client';

import { useState } from 'react';

export default function Home() {
  const [subscriptionUrl, setSubscriptionUrl] = useState('');
  const [convertedUrl, setConvertedUrl] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'copied'>(
    'idle'
  );

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleConvert = () => {
    if (!subscriptionUrl.trim()) {
      return;
    }

    if (!isValidUrl(subscriptionUrl)) {
      alert('请输入有效的 URL 格式');
      return;
    }
    // 对订阅链接进行 Base64 编码
    const encoded = btoa(encodeURIComponent(subscriptionUrl));
    const currentDomain =
      typeof window !== 'undefined' ? window.location.origin : '';
    const converted = `${currentDomain}/clash/${encoded}`;
    setConvertedUrl(converted);
  };

  const handleCopy = async () => {
    if (!convertedUrl) return;

    setCopyStatus('copying');
    try {
      await navigator.clipboard.writeText(convertedUrl);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      console.error('复制失败:', err);
      setCopyStatus('idle');
      // 降级方案：选择文本
      const textArea = document.createElement('textarea');
      textArea.value = convertedUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const handleClear = () => {
    setSubscriptionUrl('');
    setConvertedUrl('');
    setCopyStatus('idle');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="mb-6 font-bold text-5xl text-gray-900 leading-tight">
            智能 Clash 订阅转换
          </h1>
          <p className="mx-auto mb-4 max-w-3xl text-gray-600 text-xl leading-relaxed">
            一键将机场订阅转换为包含
            <span className="font-semibold text-blue-600">智能分流规则</span>的
            Clash 配置
          </p>
          <p className="mx-auto max-w-2xl text-gray-500 text-lg">
            内置广告过滤、国内外分流、延迟优选等高级功能，让你的网络体验更上一层楼
          </p>
        </div>

        {/* 转换工具 */}
        <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 font-semibold text-2xl text-gray-800">
            🚀 快速转换
          </h2>

          <div className="space-y-4">
            <div>
              <label
                className="mb-2 block font-medium text-gray-700 text-sm"
                htmlFor="subscription-url"
              >
                粘贴你的订阅链接
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-black text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                id="subscription-url"
                onChange={(e) => setSubscriptionUrl(e.target.value)}
                placeholder="https://example.com/api/v1/client/subscribe?token=your-token"
                type="url"
                value={subscriptionUrl}
              />
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                disabled={!subscriptionUrl.trim()}
                onClick={handleConvert}
                type="button"
              >
                生成转换链接
              </button>
              <button
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                onClick={handleClear}
                type="button"
              >
                清空
              </button>
            </div>

            {convertedUrl && (
              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <label className="mb-2 block font-medium text-gray-700 text-sm">
                  转换后的链接（复制此链接到 Clash 客户端，将自动下载 YAML
                  配置文件）
                </label>
                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-black text-sm"
                    readOnly
                    type="text"
                    value={convertedUrl}
                  />
                  <button
                    className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                      copyStatus === 'copied'
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } disabled:opacity-50`}
                    disabled={copyStatus === 'copying'}
                    onClick={handleCopy}
                    type="button"
                  >
                    {copyStatus === 'copying' && '复制中...'}
                    {copyStatus === 'copied' && '已复制!'}
                    {copyStatus === 'idle' && '复制'}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 rounded-lg bg-blue-50 p-4">
              <p className="text-blue-800 text-sm">
                💡 <strong>使用提示：</strong>{' '}
                粘贴你的机场订阅链接，点击"生成转换链接"即可获得包含自定义规则的
                Clash 配置链接。转换后的链接将直接提供 YAML 配置文件下载。
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-6 font-semibold text-2xl text-gray-800">
            📋 使用方法
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-medium text-gray-700 text-lg">
                简单模式（推荐）
              </h3>
              <p className="text-gray-600">
                使用上方的<strong>快速转换工具</strong>
                ，直接粘贴订阅链接即可一键生成转换链接。
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-gray-700 text-lg">
                手动模式（高级用户）
              </h3>
              <p className="text-gray-600">
                如果需要手动操作：
                <br />
                1. 获取机场订阅链接
                <br />
                2. 进行 Base64 编码：
                <code className="rounded bg-gray-100 px-2 py-1 text-sm">
                  echo "url" | base64
                </code>
                <br />
                3. 访问：
                <code className="rounded bg-gray-100 px-2 py-1 text-sm">
                  {typeof window !== 'undefined' ? window.location.origin : ''}
                  /clash/{'<base64-url>'}
                </code>
                <br />
                4. 浏览器将自动下载生成的 YAML 配置文件
              </p>
            </div>

            <div>
              <h3 className="mb-2 font-medium text-gray-700 text-lg">
                在 Clash 中添加订阅
              </h3>
              <p className="text-gray-600">
                将生成的转换链接添加到你的 Clash
                客户端订阅配置中，客户端将自动下载并使用 YAML 配置文件。
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-8 text-center font-semibold text-2xl text-gray-800">
            ✨ 核心功能特性
          </h2>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl">
                  🎯
                </div>
                <h3 className="ml-3 font-semibold text-gray-800 text-lg">
                  智能分流规则
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                基于 <strong>Loyalsoldier</strong>{' '}
                规则集，自动识别国内外网站，实现精准分流。
                内置广告过滤、恶意网站拦截，提升浏览体验。
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-2xl">
                  🌐
                </div>
                <h3 className="ml-3 font-semibold text-gray-800 text-lg">
                  优化 DNS 配置
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                国内使用 <strong>阿里云DNS</strong>，海外使用{' '}
                <strong>Cloudflare DNS</strong>， 并配置 Fake-IP
                模式，大幅提升解析速度。
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-2xl">
                  ⚡
                </div>
                <h3 className="ml-3 font-semibold text-gray-800 text-lg">
                  多重代理策略
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                支持<strong>延迟选优</strong>、<strong>故障转移</strong>、
                <strong>负载均衡</strong>， 按地区自动分组，智能选择最佳节点。
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-2xl">
                  🛡️
                </div>
                <h3 className="ml-3 font-semibold text-gray-800 text-lg">
                  隐私与安全
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                <strong>零日志</strong>
                政策，所有转换过程在服务端完成，不存储用户数据。 基于 Vercel
                全球边缘网络部署。
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 text-2xl">
                  🚀
                </div>
                <h3 className="ml-3 font-semibold text-gray-800 text-lg">
                  高性能转换
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                毫秒级配置生成，支持 <strong>VMess</strong>、
                <strong>Trojan</strong>、<strong>Shadowsocks</strong>{' '}
                等主流协议，直接输出标准 YAML 格式。
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-6 transition-shadow hover:shadow-md">
              <div className="mb-4 flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-2xl">
                  🎨
                </div>
                <h3 className="ml-3 font-semibold text-gray-800 text-lg">
                  即开即用
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                无需复杂配置，<strong>一键转换</strong>即可获得 YAML
                格式的优化配置。 支持所有主流 Clash 客户端，更新订阅即刻生效。
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-8 text-center font-semibold text-2xl text-gray-800">
            🔧 API 接口说明
          </h2>

          <div className="space-y-6">
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-3 flex items-center font-medium text-gray-700 text-lg">
                <span className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                订阅转换接口
              </h3>
              <div className="mb-3 rounded bg-gray-800 px-4 py-3 font-mono text-green-400 text-sm">
                GET /clash/{'{base64-encoded-url}'}
              </div>
              <div className="grid gap-4 text-sm md:grid-cols-2">
                <div>
                  <p className="mb-2 text-gray-600">
                    <strong>请求参数：</strong>
                  </p>
                  <ul className="space-y-1 text-gray-600">
                    <li>
                      • <code>base64-url</code>: Base64 编码的订阅链接
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-gray-600">
                    <strong>响应格式：</strong>
                  </p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 直接返回 YAML 配置文件</li>
                    <li>• Content-Type: text/yaml</li>
                    <li>• 浏览器自动下载为 clash-config.yaml</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h4 className="mb-2 font-medium text-blue-800">
                  ✅ 支持的协议
                </h4>
                <ul className="space-y-1 text-blue-700 text-sm">
                  <li>• VMess</li>
                  <li>• Trojan</li>
                  <li>• Shadowsocks (SS)</li>
                  <li>• ShadowsocksR (SSR)</li>
                </ul>
              </div>

              <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
                <h4 className="mb-2 font-medium text-purple-800">
                  🎯 自动添加的规则
                </h4>
                <ul className="space-y-1 text-purple-700 text-sm">
                  <li>• 广告拦截规则</li>
                  <li>• 国内外网站分流</li>
                  <li>• DNS 劫持防护</li>
                  <li>• 延迟测试优化</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 技术架构说明 */}
        <div className="mb-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-lg">
          <h2 className="mb-6 text-center font-semibold text-2xl">
            🏗️ 技术架构优势
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white bg-opacity-20 text-3xl">
                ⚡
              </div>
              <h3 className="mb-2 font-semibold text-lg">边缘计算</h3>
              <p className="text-blue-100 text-sm">
                基于 Vercel，全球 300+ 城市边缘节点，毫秒级响应
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white bg-opacity-20 text-3xl">
                🔒
              </div>
              <h3 className="mb-2 font-semibold text-lg">安全可靠</h3>
              <p className="text-blue-100 text-sm">
                无服务器架构，零数据存储，所有转换过程在内存中完成
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white bg-opacity-20 text-3xl">
                🚀
              </div>
              <h3 className="mb-2 font-semibold text-lg">高可用性</h3>
              <p className="text-blue-100 text-sm">
                99.9% 可用性保证，自动故障转移，无需担心服务中断
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-12">
          <div className="rounded-lg bg-gray-50 p-8 text-center">
            <div className="mb-4 flex items-center justify-center">
              <span className="mr-2 text-2xl">⚡</span>
              <span className="font-medium text-gray-700 text-lg">
                智能 Clash 订阅转换
              </span>
            </div>
            <p className="mb-4 text-gray-600">
              为全球用户提供高速、安全、智能的 Clash 配置转换服务
            </p>
            <div className="mb-4 flex items-center justify-center space-x-6 text-gray-500 text-sm">
              <span className="flex items-center">
                <span className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                服务正常运行
              </span>
              <span>|</span>
              <span>基于 Vercel</span>
              <span>|</span>
              <span>全球边缘加速</span>
            </div>
            <div className="border-gray-200 border-t pt-4">
              <p className="text-gray-500 text-sm">
                © 2024 Clash 订阅转换工具 · 开源项目 · 免费使用
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
