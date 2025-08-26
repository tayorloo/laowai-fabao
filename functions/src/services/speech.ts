export async function runSpeechToText(storagePath: string, languageCode: string): Promise<{ text: string; confidence?: number; } > {
  // TODO: Wire Google Cloud Speech-to-Text using storagePath
  console.log(`STT called storagePath=${storagePath} lang=${languageCode}`);
  return { text: 'placeholder transcript', confidence: 0.8 };
}

export async function runTextToSpeech(text: string, languageCode: string, voice: string): Promise<{ url: string; } > {
  // TODO: Wire Google Cloud Text-to-Speech and upload result to Storage
  console.log(`TTS called text=${text.slice(0, 16)}... lang=${languageCode} voice=${voice}`);
  return { url: 'https://storage.googleapis.com/your-bucket/audio/placeholder.mp3' };
}