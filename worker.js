// Worker script for SPA routing and static asset serving
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    // Try to fetch the static asset first
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) {
      return assetResponse;
    }
    // If not found, serve index.html for SPA routing
    if (request.method === 'GET' && !url.pathname.startsWith('/api/')) {
      const indexRequest = new Request(url.origin + '/index.html', request);
      return await env.ASSETS.fetch(indexRequest);
    }
    // Otherwise, return the original 404
    return assetResponse;
  }
};
