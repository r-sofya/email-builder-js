// worker.js
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

export default {
  async fetch(request, env, ctx) {
    try {
      // Try to serve the static asset first
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: __STATIC_CONTENT_MANIFEST,
        }
      );
    } catch (e) {
      // If the asset is not found, serve index.html for SPA routing
      const pathname = new URL(request.url).pathname;

      // Check if the request is for a file type that should exist (e.g., .js, .css, .png)
      // If it is, and it wasn't found, return a 404.
      // Otherwise, assume it's a route and serve index.html.
      const isAsset = /\.\w+$/.test(pathname);

      if (isAsset) {
         // If it looks like an asset but wasn't found, return the original error response (likely 404)
         return new Response(e.message || 'Asset not found', { status: 404 });
      } else {
        // For non-asset paths, serve the index.html for SPA routing
        try {
          const indexRequest = new Request(`${new URL(request.url).origin}/email-builder-js/index.html`, request);
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
           return new Response(e.message || 'Index HTML not found', { status: 404 });
        }
      }
    }
  },
};
