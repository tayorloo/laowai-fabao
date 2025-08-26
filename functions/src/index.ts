import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import corsLib from 'cors';
import { translateText } from './services/translation';
import { runSpeechToText, runTextToSpeech } from './services/speech';
import { computePronunciationScore } from './services/pronounce';
import { smartQa } from './services/qa';

const cors = corsLib({ origin: true });

if (!admin.apps.length) {
  admin.initializeApp();
}

function withCors(handler: (req: functions.https.Request, res: functions.Response) => Promise<any> | any) {
  return (req: functions.https.Request, res: functions.Response) => {
    cors(req, res, async () => {
      if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.status(204).send('');
      }
      return handler(req, res);
    });
  };
}

export const translate = functions.https.onRequest(withCors(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { text, sourceLang, targetLang } = req.body || {};
  if (!text || !targetLang) return res.status(400).json({ error: 'Missing text or targetLang' });
  try {
    const result = await translateText(String(text), String(sourceLang || ''), String(targetLang));
    return res.json({ result });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Translation failed' });
  }
}));

export const stt = functions.https.onRequest(withCors(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { storagePath, languageCode } = req.body || {};
  if (!storagePath) return res.status(400).json({ error: 'Missing storagePath' });
  try {
    const transcript = await runSpeechToText(String(storagePath), String(languageCode || 'en-US'));
    return res.json(transcript);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'STT failed' });
  }
}));

export const tts = functions.https.onRequest(withCors(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { text, languageCode, voice } = req.body || {};
  if (!text) return res.status(400).json({ error: 'Missing text' });
  try {
    const result = await runTextToSpeech(String(text), String(languageCode || 'en-US'), String(voice || 'standard'));
    return res.json(result);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'TTS failed' });
  }
}));

export const pronounceScore = functions.https.onRequest(withCors(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { storagePath, targetText, languageCode } = req.body || {};
  if (!storagePath || !targetText) return res.status(400).json({ error: 'Missing storagePath or targetText' });
  try {
    const transcript = await runSpeechToText(String(storagePath), String(languageCode || 'zh-CN'));
    const result = computePronunciationScore(String(targetText), transcript.text, transcript.confidence ?? 0.75);
    return res.json(result);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Pronunciation scoring failed' });
  }
}));

export const smartQaFn = functions.https.onRequest(withCors(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { question, userLang } = req.body || {};
  if (!question) return res.status(400).json({ error: 'Missing question' });
  try {
    const result = await smartQa(String(question), String(userLang || 'en'));
    return res.json(result);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Smart QA failed' });
  }
}));

export const feedbackNotify = functions.https.onRequest(withCors(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { feedbackId } = req.body || {};
  if (!feedbackId) return res.status(400).json({ error: 'Missing feedbackId' });
  try {
    // Template: send email or webhook to admin channel
    console.log(`Feedback notify for id=${feedbackId}`);
    return res.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Feedback notify failed' });
  }
}));

export const sendDailyLearningReminders = functions.pubsub.schedule('0 8 * * *').timeZone('Asia/Shanghai').onRun(async () => {
  const messaging = admin.messaging();
  try {
    await messaging.send({
      topic: 'daily_learning',
      notification: {
        title: 'Daily Mandarin Practice',
        body: 'Your word of the day is ready. Tap to practice!'
      }
    });
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
});