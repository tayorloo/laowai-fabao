"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateText = translateText;
const axios_1 = __importDefault(require("axios"));
const DEEPL_API_KEY = process.env.DEEPL_API_KEY || '';
const ALIBABA_ACCESS_KEY_ID = process.env.ALIBABA_ACCESS_KEY_ID || '';
const ALIBABA_ACCESS_KEY_SECRET = process.env.ALIBABA_ACCESS_KEY_SECRET || '';
async function translateText(text, sourceLang, targetLang) {
    const provider = (process.env.TRANSLATION_PROVIDER || 'deepl').toLowerCase();
    if (provider === 'alibaba') {
        return alibabaTranslate(text, sourceLang, targetLang);
    }
    return deeplTranslate(text, sourceLang, targetLang);
}
async function deeplTranslate(text, sourceLang, targetLang) {
    if (!DEEPL_API_KEY) {
        console.warn('DEEPL_API_KEY missing; returning original text');
        return text;
    }
    const url = 'https://api-free.deepl.com/v2/translate';
    const params = new URLSearchParams();
    params.set('auth_key', DEEPL_API_KEY);
    params.set('text', text);
    if (sourceLang)
        params.set('source_lang', sourceLang.toUpperCase());
    params.set('target_lang', targetLang.toUpperCase());
    const { data } = await axios_1.default.post(url, params);
    const translations = data?.translations;
    return translations?.[0]?.text ?? text;
}
async function alibabaTranslate(text, sourceLang, targetLang) {
    if (!ALIBABA_ACCESS_KEY_ID || !ALIBABA_ACCESS_KEY_SECRET) {
        console.warn('Alibaba credentials missing; returning original text');
        return text;
    }
    // Placeholder: Implement using Alibaba Cloud Translate API
    // For template purposes, echo text
    return text;
}
