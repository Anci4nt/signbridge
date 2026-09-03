import * as tf from '@tensorflow/tfjs';
import type { ClassifierStatus } from '@/types/sign';
import { LABELS, NUM_CLASSES } from './labels';

const MODEL_URL = '/models/sign-classifier/model.json';

export interface LoadedModel {
  model: tf.LayersModel;
  status: ClassifierStatus;
}

/**
 * Load the trained TensorFlow.js model bundled with the application.
 * Loading errors are surfaced to the UI; this application never substitutes
 * an untrained model for real recognition.
 */
export async function loadModel(): Promise<LoadedModel> {
  const model = await tf.loadLayersModel(MODEL_URL);
  const outputShape = model.outputs[0]?.shape;
  const classCount = outputShape?.[outputShape.length - 1];
  if (classCount !== NUM_CLASSES) {
    model.dispose();
    throw new Error(
      `Model has ${classCount ?? 'an unknown number of'} classes, but the app expects ${NUM_CLASSES}. Run preprocess.py, train.py, and export.py after adding signs.`,
    );
  }
  return { model, status: 'ready' };
}

export { LABELS };
