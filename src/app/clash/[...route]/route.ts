import { Hono } from 'hono';
import { handle } from 'hono/vercel';
export const dynamic = 'force-dynamic';

const app = new Hono().basePath('/clash');

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono on Vercel!',
  });
});

app.get('/:base64Url', async (c) => {
  const base64Url = c.req.param('base64Url');

  // 解码 base64 URL
  const decodedUrl = atob(base64Url);

  // 验证是否为有效的 URL
  new URL(decodedUrl);

  const response = await fetch(decodedUrl, {
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

  return c.json({
    message: data,
  });
});

export const GET = handle(app);
