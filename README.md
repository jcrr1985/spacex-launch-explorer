# SpaceX Launch Explorer

Angular 21 app to browse past SpaceX launches, with a details view and
favorites kept in an NgRx store.

## Requirements

- Node `^20.19.0 || ^22.12.0 || >=24.0.0`
- npm 8 or newer

## Install and run

```bash
npm install
npm start
```

Open http://localhost:4200. The dev server runs the `development`
configuration, which swaps in `src/environments/environment.development.ts`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | dev server on port 4200 |
| `npm run build` | production build into `dist/spaceX_kata/browser` |
| `npm test` | runs the unit tests once (vitest) |
| `npm run lint` | eslint over the TypeScript and the templates |
| `npm run format` | prettier over the repo |

## Docker

```bash
docker build -t spacex-explorer .
docker run --rm -p 8080:80 spacex-explorer
```

Then open http://localhost:8080. The image builds the app with Node and
serves the output with nginx, so it does not ship `node_modules`. The nginx
config falls back to `index.html`, so a direct visit to `/launch/5` works
instead of returning a 404.

## About the data

The public SpaceX API is down, so the app reads `public/launches.json`, a
local copy of the payload.

Worth knowing: that file is a **v3** payload (`mission_name`,
`launch_success`, `links.mission_patch_small`) while the assessment points at
the **v4** list endpoint, which renames those fields to `name`, `success` and
`links.patch.small`. Pointing production at v4 compiles fine and then renders
an empty list, so both environments read the bundled mock. The url that
matches this shape is `https://api.spacexdata.com/v3/launches/past`, and it is
noted in `src/environments/environment.ts`.

Swapping to a live API means changing `apiUrl` there. `SpacexService` is the
only place that touches HTTP.

## Structure

```
src/
  app/
    core/                     shared across features
      models/                 the Launch interface
      services/               SpacexService
    features/
      launches/
        pages/                launches-list, launch-details
        state/                actions, effects, reducer, selectors
        launches.routes.ts    lazy loaded routes
  environments/
  styles/                     scss variables and mixins
  testing/                    fixtures for the specs
```

Imports use the `@/*` alias, which points at `src/`.

## How it works

The list dispatches `loadLaunches`. `LaunchEffects` picks it up, calls
`SpacexService` and dispatches success or failure. Components never call HTTP
directly, they read from the store through memoized selectors converted to
signals with `toSignal`, so there are no manual subscriptions to clean up.

Favorites live in the store as a list of `flight_number`s, which is what makes
them survive going back and forth between the list and the details page. The
`:id` route param reaches `LaunchDetails` as an input signal through
`withComponentInputBinding()`.

## Tests

```bash
npm test
```

25 specs covering the reducer (including that it never mutates the previous
state), the service against `HttpTestingController`, both pages, and
`favorites.spec.ts`, which mounts the list and the details page against the
same store to check a favorite set in one shows up in the other.
