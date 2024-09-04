importScripts("/static/service-worker-utility.js");

// CONSTANTS
const BATCH_DURATION_MAX_MS = 4; // the maximum time difference between the leader signal and the other signals

// GLOBALS
var allSignals = [];
var signalTimestamps = {};

/**
 * Fetches the attack usable signals from the adblocker config file
 * @param {string} adblocker - the adblocker to fetch the signals for
 * @returns {Array} Array of signals
 * */
async function getAllSignals(adblocker) {
  const response = await fetch(`/data/${adblocker}.json`);
  const data = await response.json();

  let _all = [];

  // all image requests
  _all = _all.concat(data["lazy-image-and-animation"]["generic-network"]);

  // all cosmetic filters
  _all = _all.concat(data["lazy-image-and-animation"]["generic-cosmetic"]);
  
  // remove all signals where "lazy_loading" in .ignore
  _all = _all.filter((signal) => !(signal.ignore?.includes("lazy_loading")));

  _all = _all.sort((a, b) => a.id - b.id);

  return _all;
}

function processFingerprintFromChunk(chunkTimestamps) {
  // only take the signals within +/- 500ms of the 'leader' signal
  const leaderTimestamp = chunkTimestamps["leader"];

  // if there is no leader signal, return null
  if (!leaderTimestamp) {
    return [];
  }

  // get the signals that are within the time window
  const fingerprint = allSignals.filter(function (signal) {
    return (
      chunkTimestamps[`${signal.id}`] &&
      Math.abs(chunkTimestamps[`${signal.id}`] - leaderTimestamp) <
        BATCH_DURATION_MAX_MS
    );
  });

  // print the durations
  const durations = Object.keys(chunkTimestamps).map((key) => {
    return `${key}: ${chunkTimestamps[key] - leaderTimestamp}`;
  });

  console.log(`Leader: ${leaderTimestamp}`);
  console.log(durations);

  return fingerprint;
}

/**
 * Creates the fingerprint details from the signals
 * @returns {string} JSON string of the fingerprint
 * */
function generateFingerprint() {
  const fingerprint = Object.keys(signalTimestamps).flatMap((chunk_id) => {
    return processFingerprintFromChunk(signalTimestamps[chunk_id]);
  });

  const negativeLists = allSignals
    .filter((signal) => {
      return !fingerprint.map((signal) => signal.id).includes(signal.id);
    })
    .flatMap((signal) => Object.keys(signal.info));
  

  // sort the fingerprint by the signal id
  fingerprint.sort((a, b) => a.id - b.id);


  const resp = {
    signals: fingerprint.map((signal) => signal.id).join(", "),
    filterlists: formatSignals(fingerprint, negativeLists),
    fingerprint: formatFingerprint(fingerprint),
  };

  return JSON.stringify(resp);
}

async function handleReset(event) {
  const getParams = new URLSearchParams(event.request.url.split("?")[1]);
  const postBody = await getParams.get("adblocker");
  const adblocker = postBody;
  allSignals = await getAllSignals(adblocker);

  signalTimestamps = {};

  return new Response("console.log('Reset successful')");
}

async function handleSignal(event) {
  const segments = event.request.url.split("/");
  const id = segments.pop().split(".")[0];
  const chunk_id = segments.pop();
  const requestTimestamp = Date.now();

  if (!signalTimestamps[chunk_id]) {
    signalTimestamps[chunk_id] = {};
  }

  signalTimestamps[chunk_id][id] = requestTimestamp;

  return nonCachedImageResponse();
}

async function handleFingerprint(event) {
  const fingerprint = generateFingerprint();

  return new Response(fingerprint);
}

/**
 * SERVICE WORKER REQUEST HANDLER
 */

self.addEventListener("fetch", function (event) {
  // handle signals
  if (event.request.url.includes("lazy-loading-signal/")) {
    event.respondWith(handleSignal(event));
  }

  // handle fingerprint request
  if (event.request.url.includes("lazy-loading-fingerprint.json")) {
    return event.respondWith(handleFingerprint(event));
  }

  // handle reset when a new page is loaded
  if (event.request.url.includes("/reset")) {
    return event.respondWith(handleReset(event));
  }
});
