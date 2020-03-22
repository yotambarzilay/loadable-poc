# @loadable POC

## Goals
1. FOUC - all SSR rendered components should have corresponding link tags (for css) and async script tags (for js)
2. Components split-chunks - conditionally load and render components, but be able to render them synchronously in SSR and during client hydration

## Concerns
1. We have separate GA-able builds (e.g. thunderbolt, editor-elements, OOI components) that should all use the same mechanism
2. Each build produces its own stats file, which then need to be correctly used during SSR to determine where to get chunks from
3. In the client, we need to pre-fetch those SSR rendered component from all different GA-ables before hydrating

## POC Setup

A monorepo that contains 2 packages, that serve as 2 separate component sources, each with its own webpack bundle

#### `host`
Mimics thunderbolt. it renders the app, handles SSR, and integrates FOUC for all other GA-ables. It also has its own components,
all of which are dynamically loaded according to what is needed in the site (for this POC, all components are always loaded).
It requires the `dist` output of `comps-lib`

#### `comps-lib`
Mimics editor-elements. exports component loaders to be dynamically loaded by the host.

## Installing + Running the POC
```zsh
 $ yarn install
 $ cd packages/comps-lib && yarn start
 $ cd packages/host && yarn start
```

This will:
1. Compile comps-lib into server & client libraries, and start a static server on `localhost:4000`
2. Compile host into server & client apps, and start the SSR server on `localhost:3000`

Navigate to http://localhost:3000 to view the "site".

## `@loadable` integration

### Dev-time

Component entries expose a `@loadable` component instead of a function that dynamically imports the chunk.
This will allow "public components" (e.g. components whose componentType is saved in the page json in the editor) to be preloaded both before hydration, but also before client-side "second" navigation.
> See [packages/host/src/components/loader.js](packages/host/src/components/loader.js)

Components that wish to split their logic into dynamically-loaded components can create additional `@loadable` components
> See [packages/host/src/components/Gallery.jsx](packages/host/src/components/Gallery.jsx)

### Build-time

`@loadable`'s `babel` plugin makes some transformations to include extra-meta data on the dynamic imports (and also adds webpackChunkName magic comments)

`@loadable`'s `webpack` plugin generate a loadable-stats.json

### Render-time (request time)

#### `host` SSR
- requires the host's and the comps-lib's **client** `loadable-stats.json` files and creates a `ChunksExtractor` for each of them. Then, creates a ChunksExtractor wrapper that wraps both Extractors into one.
> See [packages/host/app.js#L11-L27](packages/host/app.js#L11-L27)

- Wraps the rendered `<App />` with a provider, to which loadable components will report to when they will be rendered to string

    - The provider uses a `ChunksExtractor` wrapper, that distributes each collected chunk to the correct extractor (`host` components chunks to the `host`'s `ChunksExtractor`, `comps-lib` components chunks to the `comps-lib` 's `ChunkExtractor`)
> See [packages/host/src/server.js#L12-L14](packages/host/src/server.js#L12-L14)

- `ReactDOM.renderToString()` is called, and outputs html that contains the render result of all dynamically imported loadable components

- After `renderToString()`, the host's and comps-lib's `ChunksExtractor`s are used to get all relevant script tags for the rendered components.

> See [packages/host/app.js#L42](packages/host/app.js#L42)

- The script tags also contain some serialized `@loadable` information, that will be used before hydration in the client (see client-side section below).
Since we have 2 separate extractors, each extractor has its own serialized data. This requires separate `namespaces` to be used.
> See [packages/host/app.js#L19](packages/host/app.js#L19)



#### Client-side
- Before hydration, `@loadable`'s `loadableReady` method is called, which waits for all components that were rendered in SSR to load in the browser before React hydration.
    - `loadableReady` is called once per library, with the relevant `namespace` option
> See [packages/host/src/client.js#L15](packages/host/src/client.js#L15)
