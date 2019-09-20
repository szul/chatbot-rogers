import { TurnContext, ActivityTypes, ConversationState } from "botbuilder";
import { DialogSet, DialogContext, WaterfallDialog, WaterfallStepContext, TextPrompt, DialogTurnResult } from "botbuilder-dialogs";
import * as nlup from 'ibm-watson/natural-language-understanding/v1.js';
import { topEmotionScore } from "./util";
import { Emotion, EXIT } from "./schema";

export class RogersBot {
    public state: ConversationState;
    public dialogs: DialogSet;
    public constructor(state: ConversationState, dialogs: DialogSet) {
        this.state = state;
        this.dialogs = dialogs;
        this.addHelloDialogs();
    }
    async onTurn(context: TurnContext): Promise<void> {
        const dialogContext: DialogContext = await this.dialogs.createContext(context);
        await dialogContext.continueDialog();
        if (context.activity.type === ActivityTypes.Message) {
            if (context.activity.text === "hello") {
                await dialogContext.beginDialog("hello");
            }
            if (context.activity.text === "help") {
                await dialogContext.beginDialog("help");
            }
        }
        await this.state.saveChanges(context);
    }
    private addHelloDialogs(): void {
        this.dialogs.add(new WaterfallDialog("hello", [
            async (step: WaterfallStepContext): Promise<DialogTurnResult> => {
                const opts = step.options;
                if(opts["repeat"] !== undefined) {
                    return await step.next();
                }
                return await step.prompt("textPrompt", "Hello. How are you doing today?");
            },
            async (step: WaterfallStepContext): Promise<DialogTurnResult> => {
                if(EXIT.indexOf((<string>step.result).toLocaleLowerCase().trim()) !== -1) {
                    return await step.endDialog();
                }
                const emotionScores: nlup.EmotionScores = step.context.turnState.get("emotionDetection");
                const emotion: Emotion = topEmotionScore(emotionScores);
                if(emotion.score === 0) {
                    await step.prompt("textPrompt", "You seem uncertain. Why don't you tell me about how your morning started?");
                }
                switch(emotion.name) {
                    default:
                        break;
                }
                return await step.prompt("textPrompt", "Tell me more.");
            }
        ]));
        this.dialogs.add(new TextPrompt("textPrompt"));
    }
}
