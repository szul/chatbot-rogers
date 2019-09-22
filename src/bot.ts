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
        this.addPsychotherapyDialogs();
        this.addPrompts();
    }
    async onTurn(context: TurnContext): Promise<void> {
        const dialogContext: DialogContext = await this.dialogs.createContext(context);
        await dialogContext.continueDialog();
        if (context.activity.type === ActivityTypes.Message) {
            if(!context.responded) {
                if (context.activity.text === "hello") {
                    await dialogContext.beginDialog("hello");
                }
                else {
                    await dialogContext.beginDialog("psychotherapy");
                }
            }
        }
        await this.state.saveChanges(context);
    }
    private handleEmotion(emotionState: nlup.EmotionScores): string {
        const emotion: Emotion = topEmotionScore(emotionState);
        if(emotion.score === 0) {
            return "You seem uncertain. Why don't you tell me about how your morning started?";
        }
        /*
         * The switch/case could route to different concepts, categories, or entities depending on
         * what other middleware is used. Also, you could route to different NLP apps to gather emotion/intent
         * combinations.
         */
        switch(emotion.name) {
            case "anger":
                break;
            case "disgust":
                break;
            case "fear":
                break;
            case "joy":
                break;
            case "sadness":
                break;
            default:
                break;
        }
        return null;
    }
    private async loopDialog(step: WaterfallStepContext): Promise<DialogTurnResult> {
        if(step.result != null && EXIT.indexOf((<string>step.result).toLocaleLowerCase().trim()) !== -1) {
            return await step.endDialog();
        }
        const response: string = this.handleEmotion(step.context.turnState.get("emotionDetection"));
        if(response != null) {
            return await step.prompt("textPrompt", response);
        }
        return await step.prompt("textPrompt", "Tell me more.");
    }
    private addHelloDialogs(): void {
        this.dialogs.add(new WaterfallDialog("hello", [
            async (step: WaterfallStepContext): Promise<DialogTurnResult> => {
                return await step.prompt("textPrompt", "Hello. How are you doing today?");
            },
            async (step: WaterfallStepContext): Promise<DialogTurnResult> => {
                return await this.loopDialog(step);
            }
        ]));
    }
    private addPsychotherapyDialogs(): void {
        this.dialogs.add(new WaterfallDialog("psychotherapy", [
            async (step: WaterfallStepContext): Promise<DialogTurnResult> => {
                return await this.loopDialog(step);
            }
        ]));
    }
    private addPrompts(): void {
        this.dialogs.add(new TextPrompt("textPrompt"));
    }
}
