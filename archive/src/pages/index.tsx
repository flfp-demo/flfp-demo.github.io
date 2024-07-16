import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";

const IndexPage: React.FC<PageProps> = () => {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-4xl font-bold">Choose an attack technique</h2>
      <a
        href="/attacks/lazy-image-loading/"
        className="p-4 rounded text-green-800 bg-green-300"
      >
        Lazy Image Loading
      </a>
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => {
  return <title>Home Page</title>;
};
