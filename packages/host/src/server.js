import React from "react";
import ReactDOMServer from "react-dom/server";
import { ChunkExtractorManager } from "@loadable/server";

import App from "./components/App";
import { loadComps } from "./loadComps";

export const render = async ({ extractor }) => {
  const comps = await loadComps();

  const jsx = (
    <ChunkExtractorManager extractor={extractor}>
      <App comps={comps} />
    </ChunkExtractorManager>
  );
  const content = ReactDOMServer.renderToString(jsx);

  /*
    Get all component script tags with async attribute.
    In addition, there will be a script tag with @loadable's
    serialized information needed by the client hydration process
    to preload used components
  */


  return { content };
};
