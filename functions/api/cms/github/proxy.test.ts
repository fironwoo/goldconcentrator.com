import { afterEach, describe, expect, it, vi } from 'vitest';
import { onRequest } from './[[path]]';

const token = `token ${'a'.repeat(40)}`;
const root = 'https://www.goldconcentrator.com/api/cms/github/';

function request(path: string, init: RequestInit = {}) {
  return new Request(`${root}${path}`, {
    ...init,
    headers: { Authorization: token, Origin: 'https://www.goldconcentrator.com', ...init.headers },
  });
}

afterEach(() => vi.unstubAllGlobals());

describe('CMS GitHub transport', () => {
  it('forwards authenticated GraphQL writes without cookies and never caches the response', async () => {
    const payload = JSON.stringify({ query: 'mutation($input: CreateCommitOnBranchInput!) { createCommitOnBranch(input: $input) { commit { oid } } }', variables: { input: {} } });
    const upstream = vi.fn().mockResolvedValue(Response.json({ data: { commit: { oid: 'saved' } } }));
    vi.stubGlobal('fetch', upstream);
    const response = await onRequest({ request: request('graphql', {
      method: 'POST', body: payload,
      headers: { 'Content-Type': 'application/json', Cookie: 'private-browser-cookie' },
    }) });

    expect(upstream).toHaveBeenCalledOnce();
    const [url, options] = upstream.mock.calls[0];
    expect(url).toBe('https://api.github.com/graphql');
    expect(options.headers.get('Authorization')).toBe(token);
    expect(options.headers.has('Cookie')).toBe(false);
    expect(new TextDecoder().decode(options.body)).toBe(payload);
    expect(options.redirect).toBe('manual');
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(await response.json()).toEqual({ data: { commit: { oid: 'saved' } } });
  });

  it('returns media bytes from the configured repository without changing content type', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(new Uint8Array([1, 2, 3]), {
      headers: { 'Content-Type': 'application/octet-stream' },
    })));
    const response = await onRequest({ request: request('rest/api/v3/repos/fironwoo/goldconcentrator.com/git/blobs/abc?raw=1', {
      headers: { Accept: 'application/vnd.github.raw' },
    }) });

    expect(response.headers.get('Content-Type')).toBe('application/octet-stream');
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(new Uint8Array([1, 2, 3]));
    expect(fetch).toHaveBeenCalledWith('https://api.github.com/repos/fironwoo/goldconcentrator.com/git/blobs/abc?raw=1', expect.any(Object));
  });

  it('rejects missing credentials, foreign origins and unrelated REST repositories', async () => {
    const upstream = vi.fn();
    vi.stubGlobal('fetch', upstream);
    const unauthenticated = await onRequest({ request: new Request(`${root}graphql`, { method: 'POST' }) });
    const foreign = await onRequest({ request: request('graphql', { method: 'POST', headers: { Origin: 'https://foreign.example' } }) });
    const unrelated = await onRequest({ request: request('rest/api/v3/repos/other/private') });

    expect(unauthenticated.status).toBe(401);
    expect(foreign.status).toBe(403);
    expect(unrelated.status).toBe(403);
    expect(upstream).not.toHaveBeenCalled();
  });

  it('refuses upstream redirects and does not retry uncertain commits', async () => {
    const upstream = vi.fn().mockResolvedValueOnce(new Response(null, { status: 302, headers: { Location: 'https://foreign.example' } }))
      .mockRejectedValueOnce(new TypeError('network interrupted'));
    vi.stubGlobal('fetch', upstream);
    const redirected = await onRequest({ request: request('graphql', { method: 'POST', body: '{}' }) });
    const interrupted = await onRequest({ request: request('graphql', { method: 'POST', body: '{}' }) });

    expect(redirected.status).toBe(502);
    expect(interrupted.status).toBe(502);
    expect(upstream).toHaveBeenCalledTimes(2);
    expect(await interrupted.text()).not.toContain(token);
  });

  it('rejects an oversized declared payload before reading or sending it', async () => {
    const upstream = vi.fn();
    vi.stubGlobal('fetch', upstream);
    const response = await onRequest({ request: request('graphql', {
      method: 'POST', body: '{}', headers: { 'Content-Length': String(37 * 1024 * 1024) },
    }) });

    expect(response.status).toBe(413);
    expect(upstream).not.toHaveBeenCalled();
  });
});
