# Exercise GIFs

This folder still supports the legacy convention of naming GIF files by exercise id
(for example `supino-reto.gif` or `agachamento.gif`).

The app now also supports an explicit correspondence table in
`src/data/exercise-gif-map.ts`, which points each `exerciseId` to any original GIF
filename stored under `public/gif-catalog`.

If no mapped or legacy GIF is found, `<ExerciseMedia/>` renders the ZYROX fallback
placeholder automatically.
