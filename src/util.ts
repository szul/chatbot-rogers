import * as nlup from 'ibm-watson/natural-language-understanding/v1.js';
import { EmotionScore } from "./schema";

export function getEmotions(result: nlup.EntitiesResult | nlup.KeywordsResult): nlup.EmotionScores {
    if(result.emotion !== undefined) {
        return result.emotion;
    }
}

export function topEmotion(emotionScores: nlup.EmotionScores): string {
    const sortedEmotions: string[] = Object.keys(emotionScores).sort((a: string, b: string) => emotionScores[a] - emotionScores[b]);
    return sortedEmotions[0];
}

export function topEmotionScore(emotionResult: nlup.EmotionScores): EmotionScore {
    const sortedEmotions: string[] = Object.keys(emotionResult).sort((a: string, b: string) => emotionResult[a] - emotionResult[b]);
    return emotionResult[sortedEmotions[0]];
}
