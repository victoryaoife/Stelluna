export async function onRequest(context) {
  const url = new URL(context.request.url);
  const workerUrl = 'https://stelluna.victoryaoife.workers.dev' + url.pathname + url.search;
  
  const response = await fetch(workerUrl, {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.method !== 'GET' ? context.request.body : undefined,
  });

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}
