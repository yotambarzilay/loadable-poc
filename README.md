# @loadable POC

## Goals
1. FOUC - all SSR rendered components should have corresponding link tags (for css) and async script tags (for js)
2. Components split-chunks - conditionally load and render components, but be able to render them synchronously in SSR and during client hydration

## Concerns
1. We have separate GA-able builds (e.g. thunderbolt, editor-elements, OOI components) that should all use the same mechanism
2. Each build produces its own stats file, which then need to be correctly used during SSR to determine where to get chunks from
3. In the client, we need to pre-fetch those SSR rendered component from all different GA-ables before hydrating

## POC Setup

Monorepo that contains 2 packages:

#### `host`
Mimics thunderbolt. it renders the app, handles SSR, and integrates FOUC for all other GA-ables. It also has its own components,
all of which are dynamically loaded according to what is needed in the site (for this POC, all components are always loaded)

#### `comps-lib`
Mimics editor-elements. exports component loaders to be dynamically loaded by the host as needed

## `@loadable` integration

### Dev-time

Component entries expose a `@loadable` component instead of a function that dynamically imports the chunk.
This will allow "public components" (e.g. components whose componentType is saved in the page json in the editor).
> See [packages/host/src/components/loader.js](packages/host/src/components/loader.js)

Components that wish to split their logic into dynamically-loaded components can create additional `@loadable` components
> See [packages/host/src/components/Gallery.jsx](packages/host/src/components/Gallery.jsx)

### Build-time

`@loadable`'s `babel` plugin makes some transformations to include extra-meta data on the dynamic imports (and also adds webpackChunkName magic comments)

`@loadable`'s `webpack` plugin generate a loadable-stats.json

### Render-time

#### SSR
- requires the **client's** `loadable-stats.json` and creates a `ChunksExtractor`

- Wraps the rendered `<App />` with a provider, to which loadable components will report to when they will be rendered to string

- After `ReactDOMServer.renderToString()`, uses the ChunksExtractor to collect link tags and script tags of the rendered component's client chunks.
The script tags also contain some serialized `@loadable` information, that will be used before hydration in the client

> See [packages/host/src/server.js](packages/host/src/server.js)

#### Client-side
- Before hydration, `@loadable`'s `loadableReady` method is called, which makes sure that all all components that were rendered in SSR are loaded in the client before hydration

> See [packages/host/src/client.js](packages/host/src/client.js)