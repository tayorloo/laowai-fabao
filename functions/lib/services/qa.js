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
Object.defineProperty(exports, "__esModule", { value: true });
exports.smartQa = smartQa;
const admin = __importStar(require("firebase-admin"));
const translation_1 = require("./translation");
async function smartQa(question, userLang) {
    const qEN = userLang === 'en' ? question : await (0, translation_1.translateText)(question, userLang, 'en');
    const tokens = qEN.toLowerCase().split(/\W+/).filter(Boolean);
    const db = admin.firestore();
    const snapshot = await db.collection('faqs').limit(200).get();
    let best = null;
    let bestScore = -1;
    snapshot.forEach(doc => {
        const d = doc.data();
        const hay = `${d.question_en || ''} ${d.answer_en || ''} ${(d.keywords || []).join(' ')}`.toLowerCase();
        const score = tokens.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0);
        if (score > bestScore) {
            bestScore = score;
            best = { id: doc.id, ...d };
        }
    });
    const answerEN = best?.answer_en || 'No answer found.';
    const answerLocalized = userLang === 'en' ? answerEN : await (0, translation_1.translateText)(answerEN, 'en', userLang);
    return { answerEN, answerLocalized, sourceId: best?.id || null };
}
