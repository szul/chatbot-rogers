export interface Emotion {
    name: string;
    score: number;
}

export interface EmotionCollection {
    none: string[];
    unsure: string[];
    anger: string[];
    disgust: string[];
    fear: string[];
    joy: string[];
    sadness: string[];
}

export const RESPONSES: EmotionCollection = {
    none: [
        "Is there anything else you want to talk about?",
        "Tell me something else? What's really on your mind?",
        "Is there more to it?"
    ],
    unsure: [
        "You seem conflicted. Why is this?",
        "I sense some uncertainty. What more can you tell me?",
        "I see you're uneasy. Is there more to it?"
    ],
    anger: [
        "When such feelings get the best of you, how have you responded in the past?",
        "What do you think the root of this anger is?",
        "How do you feel after the anger subsides?"
    ],
    disgust: [
        "Why do you think you have such a strong reaction?",
        "Tell me some ways in which you've tried to improve this.",
        "If this environment changes, does that change your reaction?"
    ],
    fear: [
        "Where do you think these fears arise from? Is there something more?",
        "What else do you feel when you fear this?",
        "Tell me about a time when you weren't afraid of this."
    ],
    joy: [
        "Can you tell me what makes you most happy in all of that?",
        "Joy can be infectious. How have others responded?",
        "This is good news. Tell me more about the things that make you happy."
    ],
    sadness: [
        "How do you normally cope with such feelings?",
        "Has such sadness ever been beneficial to you in the past?",
        "Tell me about a time in your life where you've overcome such feelings?"
    ]
};

export const EXIT: string[] = [
    "goodbye",
    "bye",
    "im tired",
    "i'm tired",
    "exit"
];
