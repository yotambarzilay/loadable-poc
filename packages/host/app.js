const express = require("express");
const path = require("path");
const fs = require("fs");
const ssr = require("./dist/server/server");
const templatePath = path.resolve("./dist/client/index.ejs");
const template = fs.readFileSync(templatePath).toString();

const app = express();
app.use(express.static(__dirname));

/*
  Require both stat.json files and create ChunksExtractors for each.
  Then, create an wrapper that uses both extractors.
  */
const { ChunkExtractor } = require("@loadable/server")
const statsFile = path.resolve('./dist/client/loadable-stats.json')
const extractor = new ChunkExtractor({ statsFile })
const compsLibStatsFile = path.resolve('../comps-lib/dist/client/loadable-stats.json')
const compsLibExtractor = new ChunkExtractor({ statsFile: compsLibStatsFile, entrypoints: ['client'], namespace: 'compsLib' })
const allExtractors = [extractor, compsLibExtractor]
const extractorWrapper = {
  addChunk: (chunk) => allExtractors.forEach(ext => {
    if (ext.stats.namedChunkGroups[chunk]) {
      ext.addChunk(chunk)
    }
  })
}

const getHtml = ({ content, scriptTags }) => {
  const renderedHtml = `<div id="container">${content}</div>
${scriptTags}
`;

  return template.replace('<div id="container"></div>', renderedHtml);
};

app.get("/", async (req, res) => {
  // Render the SSR rendered HTML using the extractorWrapper
  const { content } = await ssr.render({extractor: extractorWrapper});
  // Get the script tags of the rendered comps and
  // the loadable serialized hydration-data
  const scriptTags = allExtractors.reduce((acc, ext) => acc + '\n' + ext.getScriptTags(), '')
  const response = getHtml({ content, scriptTags });
  res.send(response);
});

// start the server
app.listen(3000, () => console.log('SSR listening on localhost:3000'));