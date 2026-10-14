interface Context {
  request: Request;
}

const routePrefix = '/api/cms/github/';
const repositoryPath = '/repos/fironwoo/goldconcentrator.com';
const allowedOrigins = new Set(['https://www.goldconcentrator.com']);
const maxPayloadBytes = 36 * 1024 * 1024;
const responseHeaders = ['content-type', 'retry-after', 'x-ratelimit-remaining', 'x-ratelimit-reset'];

function errorResponse(message: string, status: number): Response {
  return Response.json({ message }, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function onRequest({ request }: Context): Promise<Response> {
  const url = new URL(request.url);
  const origin = request.headers.get('Origin');
  if (origin && !allowedOrigins.has(origin)) {
    return errorResponse('This CMS endpoint only accepts requests from the site admin.', 403);
  }

  const authorization = request.headers.get('Authorization');
  if (!authorization || !/^(Bearer|token) [A-Za-z0-9_]{16,300}$/i.test(authorization)) {
    return errorResponse('Sign in with GitHub before using the CMS.', 401);
  }

  let path: string;
  if (url.pathname === `${routePrefix}graphql` && request.method === 'POST') {
    path = '/graphql';
  } else if (url.pathname.startsWith(`${routePrefix}rest/api/v3/`)) {
    path = url.pathname.slice(`${routePrefix}rest/api/v3`.length);
    if (path !== '/user' && path !== '/users/fironwoo' &&
        path !== repositoryPath && !path.startsWith(`${repositoryPath}/`)) {
      return errorResponse('This CMS endpoint only supports the configured repository.', 403);
    }
  } else {
    return errorResponse('Unknown CMS endpoint.', 404);
  }

  if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'].includes(request.method)) {
    return errorResponse('Unsupported request method.', 405);
  }

  const headers = new Headers({
    Authorization: authorization,
    Accept: request.headers.get('Accept') ?? 'application/json',
    'User-Agent': 'GoldConcentrator-CMS',
    'X-GitHub-Api-Version': '2022-11-28',
  });
  if (request.headers.has('Content-Type')) {
    headers.set('Content-Type', request.headers.get('Content-Type')!);
  }

  let body: ArrayBuffer | undefined;
  if (!['GET', 'HEAD'].includes(request.method)) {
    if (Number(request.headers.get('Content-Length')) > maxPayloadBytes) {
      return errorResponse('Save fewer files at once. The upload exceeds 36 MB.', 413);
    }
    body = await request.arrayBuffer();
    if (body.byteLength > maxPayloadBytes) {
      return errorResponse('Save fewer files at once. The upload exceeds 36 MB.', 413);
    }
  }

  try {
    // Never retry a write automatically: the commit may have reached GitHub before a timeout.
    const upstream = await fetch(`https://api.github.com${path}${url.search}`, {
      method: request.method,
      headers,
      body,
      redirect: 'manual',
      signal: AbortSignal.timeout(60_000),
    });
    if (upstream.status >= 300 && upstream.status < 400) {
      return errorResponse('GitHub returned an unexpected redirect.', 502);
    }
    const resultHeaders = new Headers({
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    for (const name of responseHeaders) {
      const value = upstream.headers.get(name);
      if (value) resultHeaders.set(name, value);
    }
    return new Response(upstream.body, { status: upstream.status, headers: resultHeaders });
  } catch {
    return errorResponse('The connection to GitHub was interrupted. Your save has not been confirmed; please retry.', 502);
  }
}
