# MediaPipe Hand Landmarker

This directory should contain the MediaPipe Hand Landmarker task model:

```
public/mediapipe/hand_landmarker.task
```

Download it from the official MediaPipe models:

https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task

The app loads it at runtime via `@mediapipe/tasks-vision`. The WASM
runtime files are resolved from the npm package automatically when
using `FilesetResolver.forVisionTasks('/mediapipe')`.

If the file is missing, the hand tracker will report an error in the UI
and the rest of the app remains usable.
