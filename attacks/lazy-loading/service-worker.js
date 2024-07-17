// service worker

const BATCH_DURATION_MAX_MS = 50;

var signalTimestamps = {};

function generateFingerprint() {
  // only take the signals within +/- 500ms of the 'leader' signal

  const leaderTimestamp = signalTimestamps["leader"];

  if (!leaderTimestamp) {
    return {
      leaderTimestamp: null,
    }
  }

  const fingerprint = Object.keys(signalTimestamps).filter(function (key) {
    return (
      Math.abs(signalTimestamps[key] - leaderTimestamp) <
        BATCH_DURATION_MAX_MS && key !== "leader"
    );
  });

  const resp = {
    signals: fingerprint,
    leaderTimestamp: leaderTimestamp,
  };

  return JSON.stringify(resp);
}

// intercepting fetch requests
self.addEventListener("fetch", function (event) {
  // if the request is to the domain evil.com
  if (event.request.url.includes("lazy-loading-signal/")) {
    // respond with the file cedar.png

    const id = event.request.url.split("/").pop().split(".")[0];
    const requestTimestamp = Date.now();

    signalTimestamps[id] = requestTimestamp;

    console.log("Signal received: ", id, requestTimestamp)

    event.respondWith(fetch("/data/images/cedar.png"));
  }

  // if the request is asking for the fingerprint
  if (event.request.url.includes("lazy-loading-fingerprint.json")) {
    // respond with the fingerprint

    const fingerprint = generateFingerprint();

    event.respondWith(new Response(fingerprint));
  }

  // if the request resets the page
  if (event.request.url.includes("lazy-loading-reset.png")) {
    // respond with the fingerprint

    signalTimestamps = {};

    event.respondWith(fetch("/data/images/cedar.png"));
  }
});

// on load
self.addEventListener("install", function (event) {
  console.log("LL Service worker installed");
});

// on activate
self.addEventListener("activate", function (event) {
  console.log(event);
  console.log("LL Service worker activated");
});

// // on page load
self.addEventListener("load", function (event) {
  console.log("LL Service worker loaded");
});
