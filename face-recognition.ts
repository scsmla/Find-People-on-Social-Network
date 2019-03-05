import '@tensorflow/tfjs-node';

import path = require('path');

// implements nodejs wrappers for HTMLCanvasElement, HTMLImageElement, ImageData
import * as canvas from 'canvas';

import * as faceapi from 'face-api.js';

import fetch from 'node-fetch';

const MODELS_URL = path.join(__dirname, './models');

// Make face-api.js use that fetch implementation
// faceapi.env.monkeyPatch({ fetch: fetch });

// patch nodejs environment, we need to provide an implementation of
// HTMLCanvasElement and HTMLImageElement, additionally an implementation
// of ImageData is required, in case you want to use the MTCNN
const { Canvas, Image, ImageData } = canvas

faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

async function loadModel() {
	await faceapi.loadSsdMobilenetv1Model(MODELS_URL)
	return faceapi.nets
}
let model = loadModel()
model.then(result => console.log(result))
