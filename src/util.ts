import * as nlup from 'ibm-watson/natural-language-understanding/v1.js';
import { Emotion } from "./schema";

export function getEmotions(result: nlup.EntitiesResult | nlup.KeywordsResult): nlup.EmotionScores {
    if(result.emotion !== undefined) {
        return result.emotion;
    }
}

export function topEmotion(emotionScores: nlup.EmotionScores): string {
    const sortedEmotions: string[] = Object.keys(emotionScores).sort((a: string, b: string) => emotionScores[b] - emotionScores[a]);
    return sortedEmotions[0];
}

export function topEmotionScore(emotionScores: nlup.EmotionScores): Emotion {
    const sortedEmotions: string[] = Object.keys(emotionScores).sort((a: string, b: string) => emotionScores[b] - emotionScores[a]);
    return {
        name: sortedEmotions[0],
        score: emotionScores[sortedEmotions[0]]
    }
}
