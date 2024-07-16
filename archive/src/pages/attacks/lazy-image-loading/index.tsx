import * as React from "react";

const HEIGHTS = {
  ARC: 1251,
  FIREFOX: 1000,
};

const getBrowser = (userAgent: string) => {
  if (userAgent.includes("Chrome")) {
    return "CHROME";
  }

  if (userAgent.includes("Firefox")) {
    return "FIREFOX";
  }

  if (userAgent.includes("Safari")) {
    return "SAFARI";
  }

  if (userAgent.includes("Edge")) {
    return "EDGE";
  }

  return "UNKNOWN";
};

export default function LazyImageLoading() {
  // random session
  const session = Math.random().toString(36).substring(7);

  // get the browser name
  const browser = getBrowser(navigator.userAgent);

  return (
    <main className="w-full flex flex-col items-center justify-center gap-4">
      {/* <div style={{height: "2467px"}}></div> */}
      <table className="table-auto border-collapse border border-gray-800">
        <tbody>
          <tr>
            <td>Session</td>
            <td>{session}</td>
          </tr>
          <tr>
            <td>Browser</td>
            <td>{browser}</td>
          </tr>
          <tr>
            <td>Height</td>
            <td>{HEIGHTS[browser] || 0}</td>
          </tr>
        </tbody>
      </table>
      <img
        src={`/api/attacks/lazy-image-loading/images/${session}/1.jpg`}
        alt="placeholder"
        loading="lazy"
        className={`fixed -bottom-[1251px]`}
      />
    </main>
  );
}