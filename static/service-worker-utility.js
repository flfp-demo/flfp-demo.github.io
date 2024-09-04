function basicHash(str) {
  var hash = 0,
    i,
    chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }

  return (hash >>> 0).toString(16);
}

/**
 * Format the signal info into a string
 * @param {Object} signalInfo
 * @returns {string} formatted signal info
 */
function formatSignalInfo(signalInfo, negativeLists) {
  let out = [];

  for (const key of Object.keys(signalInfo)) {
    if (negativeLists && negativeLists.includes(key)) {
      continue;
    }

    if (signalInfo[key]) out.push(key);
    else out.push(`NOT ${key}`);
  }

  if (out.length == 0) {
    console.log("signalInfo", signalInfo);
  }

  out = out.join(" OR ");

  return out;
}

/**
 * Format the signals into a string
 * @param {Array} signals
 * @returns {string} formatted signals
 */
function formatSignals(signals, negativeLists) {
  let out = [];

  for (const signal of signals) {
    const f = `(${formatSignalInfo(signal.info, negativeLists)})`;
    if (out.includes(f)) {
      continue;
    }
    out.push(f);
  }

  if (out.length > 0) {
    return out.join(" AND ");
  }

  return "No Filter List Detected";
}

/**
 * Format the fingerprint ID (hash)
 * @param {Array} signals
 * @returns {string} formatted fingerprint
 */
function formatFingerprint(signals) {
  // create a hash of the signal infos
  const hash = signals
    .map((signal) => {
      return Object.keys(signal.info)
        .map((key) => {
          return signal.info[key] ? key : `NOT ${key}`;
        })
        .join(" OR ");
    })
    .join(" AND ");

  return basicHash(hash);
}

const nonCachedImageResponse = async () => {
  let resp = await fetch("/data/images/cedar.png");

  // randomize file name
  const random = Math.random().toString(36).substring(7);

  const headers = new Headers(resp.headers);
  headers.append("Cache-Control", "no-store");
  headers.append("Pragma", "no-cache");
  headers.append("Expires", "0");

  resp = new Response(resp.body, {
    status: resp.status,
    statusText: resp.statusText,
    headers: headers,
  });

  return resp;
};
