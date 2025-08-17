// @see https://github.com/clash-verge-rev/clash-verge-rev/blob/dev/src/services/types.d.ts

type NetworkType = 'ws' | 'http' | 'h2' | 'grpc' | 'tcp';

interface RealityOptions {
  'public-key'?: string;
  'short-id'?: string;
}

interface GrpcOptions {
  'grpc-service-name'?: string;
}

interface WsOptions {
  path?: string;
  headers?: {
    [key: string]: string;
  };
  'max-early-data'?: number;
  'early-data-header-name'?: string;
  'v2ray-http-upgrade'?: boolean;
  'v2ray-http-upgrade-fast-open'?: boolean;
}

interface HttpOptions {
  method?: string;
  path?: string[];
  headers?: {
    [key: string]: string[];
  };
}

interface H2Options {
  path?: string;
  host?: string;
}

type ClientFingerprint =
  | 'chrome'
  | 'firefox'
  | 'safari'
  | 'iOS'
  | 'android'
  | 'edge'
  | '360'
  | 'qq'
  | 'random';

export type CipherType =
  | 'none'
  | 'auto'
  | 'dummy'
  | 'aes-128-gcm'
  | 'aes-192-gcm'
  | 'aes-256-gcm'
  | 'lea-128-gcm'
  | 'lea-192-gcm'
  | 'lea-256-gcm'
  | 'aes-128-gcm-siv'
  | 'aes-256-gcm-siv'
  | '2022-blake3-aes-128-gcm'
  | '2022-blake3-aes-256-gcm'
  | 'aes-128-cfb'
  | 'aes-192-cfb'
  | 'aes-256-cfb'
  | 'aes-128-ctr'
  | 'aes-192-ctr'
  | 'aes-256-ctr'
  | 'chacha20'
  | 'chacha20-ietf'
  | 'chacha20-ietf-poly1305'
  | '2022-blake3-chacha20-poly1305'
  | 'rabbit128-poly1305'
  | 'xchacha20-ietf-poly1305'
  | 'xchacha20'
  | 'aegis-128l'
  | 'aegis-256'
  | 'aez-384'
  | 'deoxys-ii-256-128'
  | 'rc4-md5';

// base
interface ProxyBaseConfig {
  tfo?: boolean;
  mptcp?: boolean;
  'interface-name'?: string;
  'routing-mark'?: number;
  'ip-version'?: 'dual' | 'ipv4' | 'ipv6' | 'ipv4-prefer' | 'ipv6-prefer';
  'dialer-proxy'?: string;
}

// direct
interface ProxyDirectConfig extends ProxyBaseConfig {
  name: string;
  type: 'direct';
}
// dns
interface ProxyDnsConfig extends ProxyBaseConfig {
  name: string;
  type: 'dns';
}
// http
interface ProxyHttpConfig extends ProxyBaseConfig {
  name: string;
  type: 'http';
  server?: string;
  port?: number;
  username?: string;
  password?: string;
  tls?: boolean;
  sni?: string;
  'skip-cert-verify'?: boolean;
  fingerprint?: string;
  headers?: {
    [key: string]: string;
  };
}
// socks5
interface ProxySocks5Config extends ProxyBaseConfig {
  name: string;
  type: 'socks5';
  server?: string;
  port?: number;
  username?: string;
  password?: string;
  tls?: boolean;
  udp?: boolean;
  'skip-cert-verify'?: boolean;
  fingerprint?: string;
}
// ssh
interface ProxySshConfig extends ProxyBaseConfig {
  name: string;
  type: 'ssh';
  server?: string;
  port?: number;
  username?: string;
  password?: string;
  'private-key'?: string;
  'private-key-passphrase'?: string;
  'host-key'?: string;
  'host-key-algorithms'?: string;
}
// trojan
export interface ProxyTrojanConfig extends ProxyBaseConfig {
  name: string;
  type: 'trojan';
  server?: string;
  port?: number;
  password?: string;
  alpn?: string[];
  sni?: string;
  'skip-cert-verify'?: boolean;
  fingerprint?: string;
  udp?: boolean;
  network?: NetworkType;
  'reality-opts'?: RealityOptions;
  'grpc-opts'?: GrpcOptions;
  'ws-opts'?: WsOptions;
  'ss-opts'?: {
    enabled?: boolean;
    method?: string;
    password?: string;
  };
  'client-fingerprint'?: ClientFingerprint;
}
// tuic
interface ProxyTuicConfig extends ProxyBaseConfig {
  name: string;
  type: 'tuic';
  server?: string;
  port?: number;
  token?: string;
  uuid?: string;
  password?: string;
  ip?: string;
  'heartbeat-interval'?: number;
  alpn?: string[];
  'reduce-rtt'?: boolean;
  'request-timeout'?: number;
  'udp-relay-mode'?: string;
  'congestion-controller'?: string;
  'disable-sni'?: boolean;
  'max-udp-relay-packet-size'?: number;
  'fast-open'?: boolean;
  'max-open-streams'?: number;
  cwnd?: number;
  'skip-cert-verify'?: boolean;
  fingerprint?: string;
  ca?: string;
  'ca-str'?: string;
  'recv-window-conn'?: number;
  'recv-window'?: number;
  'disable-mtu-discovery'?: boolean;
  'max-datagram-frame-size'?: number;
  sni?: string;
  'udp-over-stream'?: boolean;
  'udp-over-stream-version'?: number;
}
// vless
interface ProxyVlessConfig extends ProxyBaseConfig {
  name: string;
  type: 'vless';
  server?: string;
  port?: number;
  uuid?: string;
  flow?: string;
  tls?: boolean;
  alpn?: string[];
  udp?: boolean;
  'packet-addr'?: boolean;
  xudp?: boolean;
  'packet-encoding'?: string;
  network?: NetworkType;
  'reality-opts'?: RealityOptions;
  'http-opts'?: HttpOptions;
  'h2-opts'?: H2Options;
  'grpc-opts'?: GrpcOptions;
  'ws-opts'?: WsOptions;
  'ws-path'?: string;
  'ws-headers'?: {
    [key: string]: string;
  };
  'skip-cert-verify'?: boolean;
  fingerprint?: string;
  servername?: string;
  'client-fingerprint'?: ClientFingerprint;
  smux?: boolean;
}
// vmess
export interface ProxyVmessConfig extends ProxyBaseConfig {
  name: string;
  type: 'vmess';
  server?: string;
  port?: number;
  uuid?: string;
  alterId?: number;
  cipher?: CipherType;
  udp?: boolean;
  network?: NetworkType;
  tls?: boolean;
  alpn?: string[];
  'skip-cert-verify'?: boolean;
  fingerprint?: string;
  servername?: string;
  'reality-opts'?: RealityOptions;
  'http-opts'?: HttpOptions;
  'h2-opts'?: H2Options;
  'grpc-opts'?: GrpcOptions;
  'ws-opts'?: WsOptions;
  'packet-addr'?: boolean;
  xudp?: boolean;
  'packet-encoding'?: string;
  'global-padding'?: boolean;
  'authenticated-length'?: boolean;
  'client-fingerprint'?: ClientFingerprint;
  smux?: boolean;
}

interface WireGuardPeerOptions {
  server?: string;
  port?: number;
  'public-key'?: string;
  'pre-shared-key'?: string;
  reserved?: number[];
  'allowed-ips'?: string[];
}
// wireguard
interface ProxyWireguardConfig extends ProxyBaseConfig, WireGuardPeerOptions {
  name: string;
  type: 'wireguard';
  ip?: string;
  ipv6?: string;
  'private-key'?: string;
  workers?: number;
  mtu?: number;
  udp?: boolean;
  'persistent-keepalive'?: number;
  peers?: WireGuardPeerOptions[];
  'remote-dns-resolve'?: boolean;
  dns?: string[];
  'refresh-server-ip-interval'?: number;
}
// hysteria
interface ProxyHysteriaConfig extends ProxyBaseConfig {
  name: string;
  type: 'hysteria';
  server?: string;
  port?: number;
  ports?: string;
  protocol?: string;
  'obfs-protocol'?: string;
  up?: string;
  'up-speed'?: number;
  down?: string;
  'down-speed'?: number;
  auth?: string;
  'auth-str'?: string;
  obfs?: string;
  sni?: string;
  'skip-cert-verify'?: boolean;
  fingerprint?: string;
  alpn?: string[];
  ca?: string;
  'ca-str'?: string;
  'recv-window-conn'?: number;
  'recv-window'?: number;
  'disable-mtu-discovery'?: boolean;
  'fast-open'?: boolean;
  'hop-interval'?: number;
}
// hysteria2
interface ProxyHysteria2Config extends ProxyBaseConfig {
  name: string;
  type: 'hysteria2';
  server?: string;
  port?: number;
  ports?: string;
  'hop-interval'?: number;
  protocol?: string;
  'obfs-protocol'?: string;
  up?: string;
  down?: string;
  password?: string;
  obfs?: string;
  'obfs-password'?: string;
  sni?: string;
  'skip-cert-verify'?: boolean;
  fingerprint?: string;
  alpn?: string[];
  ca?: string;
  'ca-str'?: string;
  cwnd?: number;
  'udp-mtu'?: number;
}
// shadowsocks
export interface ProxyShadowsocksConfig extends ProxyBaseConfig {
  name: string;
  type: 'ss';
  server?: string;
  port?: number;
  password?: string;
  cipher?: CipherType;
  udp?: boolean;
  plugin?: 'obfs' | 'v2ray-plugin' | 'shadow-tls' | 'restls';
  'plugin-opts'?: {
    mode?: string;
    host?: string;
    password?: string;
    path?: string;
    tls?: string;
    fingerprint?: string;
    headers?: {
      [key: string]: string;
    };
    'skip-cert-verify'?: boolean;
    version?: number;
    mux?: boolean;
    'v2ray-http-upgrade'?: boolean;
    'v2ray-http-upgrade-fast-open'?: boolean;
    'version-hint'?: string;
    'restls-script'?: string;
  };
  'udp-over-tcp'?: boolean;
  'udp-over-tcp-version'?: number;
  'client-fingerprint'?: ClientFingerprint;
  smux?: boolean;
}
// shadowsocksR
export interface ProxyshadowsocksRConfig extends ProxyBaseConfig {
  name: string;
  type: 'ssr';
  server?: string;
  port?: number;
  password?: string;
  cipher?: CipherType;
  obfs?: string;
  'obfs-param'?: string;
  protocol?: string;
  'protocol-param'?: string;
  udp?: boolean;
}

// sing-mux
interface ProxySmuxConfig {
  smux?: {
    enabled?: boolean;
    protocol?: 'smux' | 'yamux' | 'h2mux';
    'max-connections'?: number;
    'min-streams'?: number;
    'max-streams'?: number;
    padding?: boolean;
    statistic?: boolean;
    'only-tcp'?: boolean;
    'brutal-opts'?: {
      enabled?: boolean;
      up?: string;
      down?: string;
    };
  };
}
// snell
interface ProxySnellConfig extends ProxyBaseConfig {
  name: string;
  type: 'snell';
  server?: string;
  port?: number;
  psk?: string;
  udp?: boolean;
  version?: number;
  'obfs-opts'?: Record<string, unknown>;
}

export type ClashProxy =
  | ProxyDirectConfig
  | ProxyDnsConfig
  | ProxyHttpConfig
  | ProxySocks5Config
  | ProxySshConfig
  | ProxyTrojanConfig
  | ProxyTuicConfig
  | ProxyVlessConfig
  | ProxyVmessConfig
  | ProxyWireguardConfig
  | ProxyHysteriaConfig
  | ProxyHysteria2Config
  | ProxyShadowsocksConfig
  | ProxyshadowsocksRConfig
  | ProxySmuxConfig
  | ProxySnellConfig;
