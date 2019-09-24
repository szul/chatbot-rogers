import * as nlup from 'ibm-watson/natural-language-understanding/v1.js';
import { Emotion } from "./schema";

export function getEmotions(result: nlup.EntitiesResult | nlup.KeywordsResult): nlup.EmotionScores {
    if(result.emotion !== undefined) {
        return result.emotion;
    }
}

export function rankEmotionKeys(emotionScores: nlup.EmotionScores): string[] {
    return Object.keys(emotionScores).sort((a: string, b: string) => emotionScores[b] - emotionScores[a]);
}

export function rankEmotions(emotionScores: nlup.EmotionScores): Emotion[] {
    const result: Emotion[] = [ ];
    const rankedEmotions: string[] = rankEmotionKeys(emotionScores);
    rankedEmotions.forEach((v: string): any => result.push({ name: v, score: emotionScores[v] }));
    return result;
}

export function topEmotion(emotionScores: nlup.EmotionScores): string {
    const rankedEmotions: string[] = rankEmotionKeys(emotionScores);
    return rankedEmotions[0];
}

export function topEmotionScore(emotionScores: nlup.EmotionScores): Emotion {
    const rankedEmotions: string[] = rankEmotionKeys(emotionScores);
    return {
        name: rankedEmotions[0],
        score: emotionScores[rankedEmotions[0]]
    }
}

export function calculateDifference(emotionScores: nlup.EmotionScores, firstEmotion?: string, secondEmotion?: string): number {
    if(firstEmotion != null && secondEmotion == null || firstEmotion == null && secondEmotion != null) {
        throw new Error("You must supply both the first and second emotion to calculate a difference between the two. Otherwise, supply neither to get the difference between the top two.");
    }
    if(firstEmotion == null && secondEmotion == null) {
        const rankedEmotions: Emotion[] = rankEmotions(emotionScores);
        return Math.abs(rankedEmotions[0].score - rankedEmotions[1].score);
    }
    return Math.abs(parseFloat(emotionScores[firstEmotion]) - parseFloat(emotionScores[secondEmotion]));
}

export function calculateVariance(): number {
    return 0;
}
