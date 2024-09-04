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
    data["lazy-image-and-animation"]["generic-network"].filter(
      (signal) => signal.resource == "image"
    )
  );

  // all ifrmae requests
  _all = _all.concat(
    data["lazy-image-and-animation"]["generic-network"].filter(
      (signal) => signal.resource == "iframe"
    )
  );

  // css
  _all = _all.concat(
    data["lazy-image-and-animation"]["generic-cosmetic"].filter(
      (signal) => signal.by == "class" || signal.by == "id"
    )
  );

  _all = _all.sort((a, b) => a.id - b.id);

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

async function handleLocalSignals(event) {
  if (
    allSignals.some(
      (signal) => signal.local == true && event.request.url.includes(signal.url)
    )
  ) {
    {
      return event.respondWith(nonCachedImageResponse());
    }
  }
}
async function handleReset(event) {
  const getParams = new URLSearchParams(event.request.url.split("?")[1]);
  const postBody = await getParams.get("adblocker");

  allSignals = await getAllSignals(postBody);

  signalTimestamps = {};
  return new Response("console.log('reset successful')");
}

async function handleSignal(event) {
  const id = event.request.url.split("/").pop().split(".")[0];
  const requestTimestamp = Date.now();

  signalTimestamps[id] = requestTimestamp;

  return nonCachedImageResponse();
}

async function handleFingerprint(event) {
  const fingerprint = generateFingerprint();

  return new Response(fingerprint);
}

// intercepting fetch requests
self.addEventListener("fetch", function (event) {
  // reset the signals for a new page
  if (event.request.url.includes("reset")) {
    event.respondWith(handleReset(event));
  }

  // handle signals
  if (event.request.url.includes("signal/")) {
    event.respondWith(handleSignal(event));
  }

  // handle fingerprint request
  if (event.request.url.includes("demo-fingerprint.json")) {
    event.respondWith(handleFingerprint(event));
  }

  // handle local signals
  handleLocalSignals(event);
});
