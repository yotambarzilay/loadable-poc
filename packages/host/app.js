const express = require("express");
const path = require("path");
const fs = require("fs");

const ssr = require("./dist/server/server");
const { ChunkExtractor } = require("@loadable/server")
// This is the stats file generated by webpack loadable plugin
const statsFile = path.resolve('./dist/client/loadable-stats.json')
const extractor = new ChunkExtractor({ statsFile })
const compsLibStatsFile = path.resolve('../comps-lib/dist/client/loadable-stats.json')
// We create an extractor from the statsFile
const compsLibExtractor = new ChunkExtractor({ statsFile: compsLibStatsFile, entrypoints: ['client'], namespace: 'compsLib' })

const extractors = [extractor, compsLibExtractor]
const extractorAdapter = {
  addChunk: (chunk) => extractors.forEach(ext => {
    if (ext.stats.namedChunkGroups[chunk]) {
      ext.addChunk(chunk)
    }
  })
}
const templatePath = path.resolve("./dist/client/index.ejs");
const template = fs.readFileSync(templatePath).toString();

const app = express();

// Serving static files
app.use(express.static(__dirname));

const getHtml = ({ content, scriptTags }) => {
  const renderedHtml = `<div id="container">${content}</div>
${scriptTags}
`;

  return template.replace('<div id="container"></div>', renderedHtml);
};

// server rendered home page
app.get("/", async (req, res) => {
  const { content } = await ssr.render({extractor: extractorAdapter});
  const scriptTags = extractors.reduce((acc, ext) => acc + '\n' + ext.getScriptTags(), '')
  const response = getHtml({ content, scriptTags });
  res.setHeader("Cache-Control", "assets, max-age=604800");
  res.send(response);
});

// start the server
app.listen(process.env.PORT || 3000, () => console.log(`SSR listening on localhost:${process.env.PORT || 3000}`));