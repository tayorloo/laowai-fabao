"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSpeechToText = runSpeechToText;
exports.runTextToSpeech = runTextToSpeech;
async function runSpeechToText(storagePath, languageCode) {
    // TODO: Wire Google Cloud Speech-to-Text using storagePath
    console.log(`STT called storagePath=${storagePath} lang=${languageCode}`);
    return { text: 'placeholder transcript', confidence: 0.8 };
}
async function runTextToSpeech(text, languageCode, voice) {
    // TODO: Wire Google Cloud Text-to-Speech and upload result to Storage
    console.log(`TTS called text=${text.slice(0, 16)}... lang=${languageCode} voice=${voice}`);
    return { url: 'https://storage.googleapis.com/your-bucket/audio/placeholder.mp3' };
}
