// worker.js
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

// Define the subpath prefix
const SUBPATH_PREFIX = '/email-builder-js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Remove the subpath prefix if it exists
    if (pathname.startsWith(SUBPATH_PREFIX)) {
      pathname = pathname.substring(SUBPATH_PREFIX.length);
      // Ensure the path starts with a '/' after removing the prefix
      if (!pathname.startsWith('/')) {
          pathname = '/' + pathname;
      }
    }

    // Construct a new request with the modified pathname for asset lookup
    const assetRequest = new Request(url.origin + pathname, {
        headers: request.headers,
        method: request.method,
        redirect: request.redirect,
        body: request.body,
        mode: request.mode,
        credentials: request.credentials,
        cache: request.cache,
        integrity: request.integrity,
        keepalive: request.keepalive,
        signal: request.signal,
        referrer: request.referrer,
        referrerPolicy: request.referrerPolicy,
    });


    try {
      // Try to serve the static asset using the modified request
      return await getAssetFromKV(
        {
          request: assetRequest, // Use the request with the modified pathname
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: __STATIC_CONTENT_MANIFEST,
        }
      );
    } catch (e) {
      // If the asset is not found, check if it's a potential SPA route
      // Check if the original request path looks like a file (has an extension)
      const originalPathname = new URL(request.url).pathname;
      const isFile = /\.\w+$/.test(originalPathname);

      // If it's not a file, try serving index.html for SPA routing
      if (!isFile) {
        try {
          // Always request /index.html from the bucket for SPA fallback
          const indexUrl = new URL(request.url);
          indexUrl.pathname = '/index.html';
          const indexRequest = new Request(indexUrl.toString(), request);
          return await getAssetFromKV(
            {
              request: indexRequest,
              waitUntil: ctx.waitUntil.bind(ctx),
            },
            {
              ASSET_NAMESPACE: env.__STATIC_CONTENT,
              ASSET_MANIFEST: __STATIC_CONTENT_MANIFEST,
            }
          );
        } catch (e) {
          // If index.html is not found, return a 404
          return new Response('Index HTML not found in bucket', { status: 404 });
        }
      }

      // If it was a file and not found, return a 404
      return new Response('Asset not found', { status: 404 });
    }

    // Special case: if the original request is exactly the subpath root, serve /index.html
    if (url.pathname === SUBPATH_PREFIX || url.pathname === SUBPATH_PREFIX + '/') {
      try {
        const indexUrl = new URL(request.url);
        indexUrl.pathname = '/index.html';
        const indexRequest = new Request(indexUrl.toString(), request);
        return await getAssetFromKV(
          {
            request: indexRequest,
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: __STATIC_CONTENT_MANIFEST,
          }
        );
      } catch (e) {
        return new Response('Index HTML not found at root', { status: 404 });
      }
    }
  },
};
