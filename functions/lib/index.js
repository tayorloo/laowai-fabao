"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendDailyLearningReminders = exports.feedbackNotify = exports.smartQaFn = exports.pronounceScore = exports.tts = exports.stt = exports.translate = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const cors_1 = __importDefault(require("cors"));
const translation_1 = require("./services/translation");
const speech_1 = require("./services/speech");
const pronounce_1 = require("./services/pronounce");
const qa_1 = require("./services/qa");
const cors = (0, cors_1.default)({ origin: true });
if (!admin.apps.length) {
    admin.initializeApp();
}
function withCors(handler) {
    return (req, res) => {
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
exports.translate = functions.https.onRequest(withCors(async (req, res) => {
    if (req.method !== 'POST')
        return res.status(405).json({ error: 'Method not allowed' });
    const { text, sourceLang, targetLang } = req.body || {};
    if (!text || !targetLang)
        return res.status(400).json({ error: 'Missing text or targetLang' });
    try {
        const result = await (0, translation_1.translateText)(String(text), String(sourceLang || ''), String(targetLang));
        return res.json({ result });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Translation failed' });
    }
}));
exports.stt = functions.https.onRequest(withCors(async (req, res) => {
    if (req.method !== 'POST')
        return res.status(405).json({ error: 'Method not allowed' });
    const { storagePath, languageCode } = req.body || {};
    if (!storagePath)
        return res.status(400).json({ error: 'Missing storagePath' });
    try {
        const transcript = await (0, speech_1.runSpeechToText)(String(storagePath), String(languageCode || 'en-US'));
        return res.json(transcript);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'STT failed' });
    }
}));
exports.tts = functions.https.onRequest(withCors(async (req, res) => {
    if (req.method !== 'POST')
        return res.status(405).json({ error: 'Method not allowed' });
    const { text, languageCode, voice } = req.body || {};
    if (!text)
        return res.status(400).json({ error: 'Missing text' });
    try {
        const result = await (0, speech_1.runTextToSpeech)(String(text), String(languageCode || 'en-US'), String(voice || 'standard'));
        return res.json(result);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'TTS failed' });
    }
}));
exports.pronounceScore = functions.https.onRequest(withCors(async (req, res) => {
    if (req.method !== 'POST')
        return res.status(405).json({ error: 'Method not allowed' });
    const { storagePath, targetText, languageCode } = req.body || {};
    if (!storagePath || !targetText)
        return res.status(400).json({ error: 'Missing storagePath or targetText' });
    try {
        const transcript = await (0, speech_1.runSpeechToText)(String(storagePath), String(languageCode || 'zh-CN'));
        const result = (0, pronounce_1.computePronunciationScore)(String(targetText), transcript.text, transcript.confidence ?? 0.75);
        return res.json(result);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Pronunciation scoring failed' });
    }
}));
exports.smartQaFn = functions.https.onRequest(withCors(async (req, res) => {
    if (req.method !== 'POST')
        return res.status(405).json({ error: 'Method not allowed' });
    const { question, userLang } = req.body || {};
    if (!question)
        return res.status(400).json({ error: 'Missing question' });
    try {
        const result = await (0, qa_1.smartQa)(String(question), String(userLang || 'en'));
        return res.json(result);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Smart QA failed' });
    }
}));
exports.feedbackNotify = functions.https.onRequest(withCors(async (req, res) => {
    if (req.method !== 'POST')
        return res.status(405).json({ error: 'Method not allowed' });
    const { feedbackId } = req.body || {};
    if (!feedbackId)
        return res.status(400).json({ error: 'Missing feedbackId' });
    try {
        // Template: send email or webhook to admin channel
        console.log(`Feedback notify for id=${feedbackId}`);
        return res.json({ ok: true });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Feedback notify failed' });
    }
}));
exports.sendDailyLearningReminders = functions.pubsub.schedule('0 8 * * *').timeZone('Asia/Shanghai').onRun(async () => {
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
    }
    catch (err) {
        console.error(err);
        return null;
    }
});
