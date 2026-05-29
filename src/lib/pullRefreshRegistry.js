const handlers = new Map()

export function registerPullRefresh(pageId, handler) {
  handlers.set(pageId, handler)
}

export function unregisterPullRefresh(pageId) {
  handlers.delete(pageId)
}

export async function runPullRefresh(pageId) {
  const handler = handlers.get(pageId)
  if (handler) {
    await handler()
  }
}
