import * as nlup from 'ibm-watson/natural-language-understanding/v1.js';

export function topEmotion(emotionResult: nlup.EmotionResult[]): string {
    const sortedEmotions: string[] = Object.keys(emotionResult).sort((a: string, b: string) => emotionResult[a] - emotionResult[b]);
    return sortedEmotions[0];
}

export function topEmotionResult(emotionResult: nlup.EmotionResult[]): nlup.EmotionResult {
    const sortedEmotions: string[] = Object.keys(emotionResult).sort((a: string, b: string) => emotionResult[a] - emotionResult[b]);
    return emotionResult[sortedEmotions[0]];
}
