import type { ClashConfig } from './types';

// 国内DNS服务器
const domesticNameservers = [
  'https://dns.alidns.com/dns-query', // 阿里云公共DNS
  'https://doh.pub/dns-query', // 腾讯DNSPod
  'https://doh.360.cn/dns-query', // 360安全DNS
];
// 国外DNS服务器
const foreignNameservers = [
  'https://1.1.1.1/dns-query', // Cloudflare(主)
  'https://1.0.0.1/dns-query', // Cloudflare(备)
  'https://208.67.222.222/dns-query', // OpenDNS(主)
  'https://208.67.220.220/dns-query', // OpenDNS(备)
  'https://194.242.2.2/dns-query', // Mullvad(主)
  'https://194.242.2.3/dns-query', // Mullvad(备)
];
// DNS配置
const dnsConfig = {
  enable: true,
  listen: '0.0.0.0:1053',
  ipv6: true,
  'use-system-hosts': false,
  'cache-algorithm': 'arc',
  'enhanced-mode': 'fake-ip',
  'fake-ip-range': '198.18.0.1/16',
  'fake-ip-filter': [
    // 本地主机/设备
    '+.lan',
    '+.local',
    // Windows网络出现小地球图标
    '+.msftconnecttest.com',
    '+.msftncsi.com',
    // QQ快速登录检测失败
    'localhost.ptlogin2.qq.com',
    'localhost.sec.qq.com',
    // 微信快速登录检测失败
    'localhost.work.weixin.qq.com',
  ],
  'default-nameserver': ['223.5.5.5', '119.29.29.29', '1.1.1.1', '8.8.8.8'],
  nameserver: [...domesticNameservers, ...foreignNameservers],
  'proxy-server-nameserver': [...domesticNameservers, ...foreignNameservers],
  'nameserver-policy': {
    'geosite:private,cn,geolocation-cn': domesticNameservers,
    'geosite:google,youtube,telegram,gfw,geolocation-!cn': foreignNameservers,
  },
};
// 规则集通用配置
const ruleProviderCommon = {
  type: 'http',
  format: 'yaml',
  interval: 86_400,
};
// 规则集配置
const ruleProviders = {
  reject: {
    ...ruleProviderCommon,
    behavior: 'domain',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt',
    path: './ruleset/loyalsoldier/reject.yaml',
  },
  icloud: {
    ...ruleProviderCommon,
    behavior: 'domain',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt',
    path: './ruleset/loyalsoldier/icloud.yaml',
  },
  apple: {
    ...ruleProviderCommon,
    behavior: 'domain',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt',
    path: './ruleset/loyalsoldier/apple.yaml',
  },
  google: {
    ...ruleProviderCommon,
    behavior: 'domain',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt',
    path: './ruleset/loyalsoldier/google.yaml',
  },
  proxy: {
    ...ruleProviderCommon,
    behavior: 'domain',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt',
    path: './ruleset/loyalsoldier/proxy.yaml',
  },
  direct: {
    ...ruleProviderCommon,
    behavior: 'domain',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt',
    path: './ruleset/loyalsoldier/direct.yaml',
  },
  private: {
    ...ruleProviderCommon,
    behavior: 'domain',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt',
    path: './ruleset/loyalsoldier/private.yaml',
  },
  gfw: {
    ...ruleProviderCommon,
    behavior: 'domain',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt',
    path: './ruleset/loyalsoldier/gfw.yaml',
  },
  'tld-not-cn': {
    ...ruleProviderCommon,
    behavior: 'domain',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt',
    path: './ruleset/loyalsoldier/tld-not-cn.yaml',
  },
  telegramcidr: {
    ...ruleProviderCommon,
    behavior: 'ipcidr',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt',
    path: './ruleset/loyalsoldier/telegramcidr.yaml',
  },
  cncidr: {
    ...ruleProviderCommon,
    behavior: 'ipcidr',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt',
    path: './ruleset/loyalsoldier/cncidr.yaml',
  },
  lancidr: {
    ...ruleProviderCommon,
    behavior: 'ipcidr',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt',
    path: './ruleset/loyalsoldier/lancidr.yaml',
  },
  applications: {
    ...ruleProviderCommon,
    behavior: 'classical',
    url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt',
    path: './ruleset/loyalsoldier/applications.yaml',
  },
  openai: {
    ...ruleProviderCommon,
    behavior: 'classical',
    url: 'https://fastly.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/OpenAI/OpenAI.yaml',
    path: './ruleset/blackmatrix7/openai.yaml',
  },
};
// 规则
const rules = [
  // 自定义规则
  'DOMAIN-SUFFIX,googleapis.cn,节点选择', // Google服务
  'DOMAIN-SUFFIX,gstatic.com,节点选择', // Google静态资源
  'DOMAIN-SUFFIX,xn--ngstr-lra8j.com,节点选择', // Google Play下载服务
  'DOMAIN-SUFFIX,github.io,节点选择', // Github Pages
  'DOMAIN,v2rayse.com,节点选择', // V2rayse节点工具
  // Gemini API & GoogleAI
  'DOMAIN-SUFFIX,generativelanguage.googleapis.com,GoogleAI',
  'DOMAIN-SUFFIX,gemini.google.com,GoogleAI',
  'DOMAIN-SUFFIX,notebooklm.google,GoogleAI',
  'DOMAIN-SUFFIX,notebooklm.google.com,GoogleAI',
  // blackmatrix7 规则集
  'RULE-SET,openai,ChatGPT',
  // Loyalsoldier 规则集
  'RULE-SET,applications,全局直连',
  'RULE-SET,private,全局直连',
  'RULE-SET,reject,广告过滤',
  'RULE-SET,icloud,微软服务',
  'RULE-SET,apple,苹果服务',
  'RULE-SET,google,谷歌服务',
  'RULE-SET,proxy,节点选择',
  'RULE-SET,gfw,节点选择',
  'RULE-SET,tld-not-cn,节点选择',
  'RULE-SET,direct,全局直连',
  'RULE-SET,lancidr,全局直连,no-resolve',
  'RULE-SET,cncidr,全局直连,no-resolve',
  'RULE-SET,telegramcidr,电报消息,no-resolve',
  // 其他规则
  'GEOIP,LAN,全局直连,no-resolve',
  'GEOIP,CN,全局直连,no-resolve',
  'MATCH,漏网之鱼',
];
// 代理组通用配置
const groupBaseOption = {
  interval: 300,
  timeout: 3000,
  url: 'https://www.google.com/generate_204',
  lazy: true,
  'max-failed-times': 3,
  hidden: false,
};

const ReginMap = {
  // CN: ['🇨🇳', 'CN', 'China', '中国'],
  HK: ['🇭🇰', 'HK', 'Hong Kong', 'HongKong', '香港'],
  TW: ['TW', 'TW', 'Taiwan', '台湾'],
  SG: ['🇸🇬', 'SG', 'Singapore', '新加坡'],
  JP: ['🇯🇵', 'JP', 'Japan', '日本'],
  US: ['🇺🇸', 'US', 'United States', 'UnitedStates', '美国'],
  MY: ['🇲🇾', 'MY', 'Malaysia', '马来西亚'],
  ID: ['🇮🇩', 'ID', 'Indonesia', '印尼'],
  PH: ['🇵🇭', 'PH', 'Philippines', '菲律宾'],
};

const getReginFilter = (reginKeys: (keyof typeof ReginMap)[]) => {
  return reginKeys
    .map((reginKey) => {
      return ReginMap[reginKey].join('|');
    })
    .join('|');
};

// 程序入口
export const extendsCommonConfig = (config: ClashConfig) => {
  const proxyCount = config?.proxies?.length ?? 0;
  const proxyProviderCount =
    typeof config?.['proxy-providers'] === 'object'
      ? Object.keys(config['proxy-providers']).length
      : 0;

  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error('配置文件中未找到任何代理');
  }

  // 覆盖原配置中DNS配置
  config.dns = dnsConfig;

  // 覆盖原配置中的代理组
  config['proxy-groups'] = [
    {
      ...groupBaseOption,
      name: '节点选择',
      type: 'select',
      proxies: [
        '香港节点',
        '台湾节点',
        '日本节点',
        '新加坡节点',
        '美国节点',
        '延迟选优',
        '故障转移',
        '负载均衡(散列)',
        '负载均衡(轮询)',
      ],
      'include-all': true,
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg',
    },
    {
      ...groupBaseOption,
      name: '香港节点',
      type: 'select',
      'include-all': true,
      filter: getReginFilter(['HK']),
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/hk.svg',
    },
    {
      ...groupBaseOption,
      name: '台湾节点',
      type: 'select',
      'include-all': true,
      filter: getReginFilter(['TW']),
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/tw.svg',
    },
    {
      ...groupBaseOption,
      name: '日本节点',
      type: 'select',
      'include-all': true,
      filter: getReginFilter(['JP']),
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/jp.svg',
    },
    {
      ...groupBaseOption,
      name: '新加坡节点',
      type: 'select',
      'include-all': true,
      filter: getReginFilter(['SG']),
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/sg.svg',
    },
    {
      ...groupBaseOption,
      name: '美国节点',
      type: 'select',
      'include-all': true,
      filter: getReginFilter(['US']),
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/flags/us.svg',
    },
    {
      ...groupBaseOption,
      name: '延迟选优',
      type: 'url-test',
      tolerance: 100,
      'include-all': true,
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speed.svg',
    },
    {
      ...groupBaseOption,
      name: '故障转移',
      type: 'fallback',
      'include-all': true,
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/ambulance.svg',
    },
    {
      ...groupBaseOption,
      name: '负载均衡(散列)',
      type: 'load-balance',
      strategy: 'consistent-hashing',
      'include-all': true,
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/merry_go.svg',
    },
    {
      ...groupBaseOption,
      name: '负载均衡(轮询)',
      type: 'load-balance',
      strategy: 'round-robin',
      'include-all': true,
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/balance.svg',
    },
    {
      ...groupBaseOption,
      name: '谷歌服务',
      type: 'select',
      proxies: [
        '节点选择',
        '延迟选优',
        '故障转移',
        '负载均衡(散列)',
        '负载均衡(轮询)',
        '全局直连',
      ],
      'include-all': true,
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/google.svg',
    },
    {
      ...groupBaseOption,
      name: '国外媒体',
      type: 'select',
      proxies: [
        '节点选择',
        '延迟选优',
        '故障转移',
        '负载均衡(散列)',
        '负载均衡(轮询)',
        '全局直连',
      ],
      'include-all': true,
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/youtube.svg',
    },
    {
      ...groupBaseOption,
      name: '电报消息',
      type: 'select',
      proxies: [
        '节点选择',
        '延迟选优',
        '故障转移',
        '负载均衡(散列)',
        '负载均衡(轮询)',
        '全局直连',
      ],
      'include-all': true,
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/telegram.svg',
    },
    {
      ...groupBaseOption,
      url: 'https://chatgpt.com',
      'expected-status': '200',
      name: 'ChatGPT',
      type: 'select',
      'include-all': true,
      filter: getReginFilter(['HK', 'TW', 'SG', 'JP', 'US']),
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/chatgpt.svg',
    },
    {
      ...groupBaseOption,
      name: 'GoogleAI',
      type: 'select',
      proxies: ['台湾节点', '日本节点', '香港节点', '新加坡节点', '美国节点'],
      'include-all': true,
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/google.svg',
    },
    {
      ...groupBaseOption,
      name: '微软服务',
      type: 'select',
      proxies: [
        '全局直连',
        '节点选择',
        '延迟选优',
        '故障转移',
        '负载均衡(散列)',
        '负载均衡(轮询)',
      ],
      'include-all': true,
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/microsoft.svg',
    },
    {
      ...groupBaseOption,
      name: '苹果服务',
      type: 'select',
      proxies: [
        '节点选择',
        '延迟选优',
        '故障转移',
        '负载均衡(散列)',
        '负载均衡(轮询)',
        '全局直连',
      ],
      'include-all': true,
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/apple.svg',
    },
    {
      ...groupBaseOption,
      name: '广告过滤',
      type: 'select',
      proxies: ['REJECT', 'DIRECT'],
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/bug.svg',
    },
    {
      ...groupBaseOption,
      name: '全局直连',
      type: 'select',
      proxies: [
        'DIRECT',
        '节点选择',
        '延迟选优',
        '故障转移',
        '负载均衡(散列)',
        '负载均衡(轮询)',
      ],
      'include-all': true,
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/link.svg',
    },
    {
      ...groupBaseOption,
      name: '全局拦截',
      type: 'select',
      proxies: ['REJECT', 'DIRECT'],
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/block.svg',
    },
    {
      ...groupBaseOption,
      name: '漏网之鱼',
      type: 'select',
      proxies: [
        '节点选择',
        '延迟选优',
        '故障转移',
        '负载均衡(散列)',
        '负载均衡(轮询)',
        '全局直连',
      ],
      'include-all': true,
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg',
    },
  ];

  // 覆盖原配置中的规则
  config['rule-providers'] = ruleProviders;
  config.rules = rules;
  // 返回修改后的配置
  return config;
};
