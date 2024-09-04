importScripts("/static/service-worker-utility.js");

// GLOBALS
var allSignals = [];
var signalTimestamps = {};

/**
 * Fetches the attack usable signals from the adblocker config file
 * @param {string} adblocker - the adblocker to fetch the signals for
 * @returns {Array} Array of signals
 */
async function getAllSignals(adblocker) {
  const response = await fetch(`/data/${adblocker}.json`);
  const data = await response.json();

  let _all = [];

  // all image requests
  _all = _all.concat(
    data['image-alt']["generic-network"].filter((signal) => signal.resource == "image")
  );

  return _all;
}

/**
 * Creates the fingerprint details from the signals
 * @returns {string} JSON string of the fingerprint
 */
function generateFingerprint() {
  const blocked = Object.keys(signalTimestamps);

  const fingerprint = allSignals.filter(function (signal) {
    return blocked.includes(`${signal.id}`);
  });

  const negativeLists = allSignals
    .filter((signal) => !blocked.includes(`${signal.id}`))
    .flatMap((signal) => Object.keys(signal.info));

  const resp = {
    signals: fingerprint.map((signal) => signal.id).join(", "),
    filterlists: formatSignals(fingerprint, negativeLists),
    fingerprint: formatFingerprint(fingerprint),
  };

  return JSON.stringify(resp);
}

/**
 * SERVICE WORKER REQUEST HANDLER
 */

async function handleSignalRequest(event) {
  const id = event.request.url.split("/").pop().split(".")[0];
  const requestTimestamp = Date.now();

  console.log(`Signal ${id} received at ${requestTimestamp}`);

  signalTimestamps[id] = requestTimestamp;

  return nonCachedImageResponse();
}

async function handleReset(event) {
  const getParams = new URLSearchParams(event.request.url.split("?")[1]);
  const postBody = await getParams.get("adblocker");
  const adblocker = postBody;
  allSignals = await getAllSignals(adblocker);

  signalTimestamps = {};

  return nonCachedImageResponse();
}

async function handleFingerprintRequest(event) {
  const fingerprint = generateFingerprint();

  return new Response(fingerprint);
}

// intercepting fetch requests
self.addEventListener("fetch", async function (event) {
  // reset the signals for a new page
  if (event.request.url.includes("image-alt-reset")) {
    return event.respondWith(handleReset(event));
  }

  // handle signals
  if (event.request.url.includes("image-alt-signal/")) {
    return event.respondWith(handleSignalRequest(event));
  }

  // handle fingerprint request
  if (event.request.url.includes("image-alt-fingerprint.json")) {
    return event.respondWith(handleFingerprintRequest(event));
  }
});
