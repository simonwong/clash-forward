import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { converter } from '@/core/converter';
export const dynamic = 'force-dynamic';

const app = new Hono().basePath('/clash');

app.get('/:base64Url', async (c) => {
  const base64Url = c.req.param('base64Url');
  const res = await converter.convert(base64Url);

  if (res.success) {
    // biome-ignore lint/style/noMagicNumbers: 200
    return c.newResponse(res.data!, 200, {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'Content-Type': 'text/yaml; charset=UTF-8',
      'Content-Disposition': 'attachment; filename="clash-config.yaml"',
      ...res.headers,
    });
  }
  return c.text(res.message ?? '');
});

export const GET = handle(app);
