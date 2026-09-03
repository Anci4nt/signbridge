# SignBridge AI — Model Directory

Place a trained **TensorFlow.js LayersModel** here:

```
public/models/sign-classifier/
├── model.json
└── group1-shard1of1.bin   (weights)
```

## How to produce it

1. Collect landmark samples with `training/collect.py` (uses MediaPipe via webcam).
2. Preprocess with `training/preprocess.py`.
3. Train a Keras classifier with `training/train.py`.
4. Evaluate with `training/evaluate.py`.
5. Export to TensorFlow.js with `training/export.py` — this writes the files above.

The app requires these trained model files for recognition. If they are
missing or cannot be loaded, it shows a model-load error instead of making
untrained predictions.
