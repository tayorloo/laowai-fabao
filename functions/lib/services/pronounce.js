"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computePronunciationScore = computePronunciationScore;
function levenshteinDistance(a, b) {
    const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++)
        dp[i][0] = i;
    for (let j = 0; j <= b.length; j++)
        dp[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
        }
    }
    return dp[a.length][b.length];
}
function similarityRatio(a, b) {
    const aNorm = a.trim().toLowerCase();
    const bNorm = b.trim().toLowerCase();
    if (aNorm.length === 0 && bNorm.length === 0)
        return 1;
    const dist = levenshteinDistance(aNorm, bNorm);
    const maxLen = Math.max(aNorm.length, bNorm.length) || 1;
    return 1 - dist / maxLen;
}
function computePronunciationScore(targetText, recognizedText, confidence) {
    const base = similarityRatio(targetText, recognizedText);
    const weighted = Math.round(0.7 * (base * 100) + 0.3 * (confidence * 100));
    const score = Math.max(0, Math.min(100, weighted));
    let feedback = 'Good effort! Keep practicing the pronunciation.';
    if (score >= 85)
        feedback = 'Excellent pronunciation!';
    else if (score >= 70)
        feedback = 'Strong pronunciation with minor differences.';
    else if (score >= 50)
        feedback = 'Understandable, but practice tone and syllables.';
    else
        feedback = 'Try again. Focus on tone and clear syllables.';
    return { score, recognizedText, feedback };
}
