export function getNowMs(req) {
  if (process.env.TEST_MODE === "1") {
    const headerTime = req.header("x-test-now-ms");
    if (headerTime) {
      const parsed = Number(headerTime);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }
  return Date.now();
}
