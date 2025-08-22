self.addEventListener("install", event => {
  console.log("Service worker installed.");
});

self.addEventListener("fetch", event => {
  // For now, just let requests pass through
});
