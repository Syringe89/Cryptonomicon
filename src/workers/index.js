const initSharedWorker = (onSuccess) => {
  const sharedWorker = new SharedWorker("./shared-worker.js", {
    name: "shared-worker-example",
    type: "module",
  });
  sharedWorker.port.onmessage = function (event) {
    onSuccess(event.data);
  };
  sharedWorker.port.postMessage("Hello world");
  return sharedWorker;
};

export { initSharedWorker };
