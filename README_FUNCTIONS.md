# Laowai Fabao — Firebase Functions

## Setup
1. cd functions
2. Copy .env.example to .env (or use Firebase Functions config vars)
3. npm install
4. npm run build
5. Deploy with Firebase CLI: `firebase deploy --only functions` (after initializing project)

## Endpoints
- POST /translate { text, sourceLang, targetLang }
- POST /stt { storagePath, languageCode }
- POST /tts { text, languageCode, voice }
- POST /pronounceScore { storagePath, targetText, languageCode }
- POST /smartQaFn { question, userLang }
- POST /feedbackNotify { feedbackId }
- CRON: sendDailyLearningReminders (08:00 Asia/Shanghai)

## Notes
- Translation provider via TRANSLATION_PROVIDER=deepl|alibaba
- STT/TTS are stubs; wire Google Cloud clients and credentials.
- Ensure Firestore and Storage rules are deployed.