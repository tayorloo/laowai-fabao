import * as admin from 'firebase-admin';
import { translateText } from './translation';

export async function smartQa(question: string, userLang: string) {
  const qEN = userLang === 'en' ? question : await translateText(question, userLang, 'en');
  const tokens = qEN.toLowerCase().split(/\W+/).filter(Boolean);
  const db = admin.firestore();
  const snapshot = await db.collection('faqs').limit(200).get();
  let best: any = null;
  let bestScore = -1;
  snapshot.forEach(doc => {
    const d = doc.data();
    const hay = `${d.question_en || ''} ${d.answer_en || ''} ${(d.keywords || []).join(' ')}`.toLowerCase();
    const score = tokens.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0);
    if (score > bestScore) { bestScore = score; best = { id: doc.id, ...d }; }
  });
  const answerEN = best?.answer_en || 'No answer found.';
  const answerLocalized = userLang === 'en' ? answerEN : await translateText(answerEN, 'en', userLang);
  return { answerEN, answerLocalized, sourceId: best?.id || null };
}