import { TurnContext, ActivityTypes, ConversationState } from "botbuilder";
import { DialogSet, DialogContext, WaterfallDialog, WaterfallStepContext, TextPrompt } from "botbuilder-dialogs";
import { topEmotionScore } from "./util";
import { EmotionScore } from "./schema";

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
            await context.sendActivity(`You said "${context.activity.text}"`);
        }
    }
    private addHelloDialogs(): void {
        this.dialogs.add(new WaterfallDialog("hello", [
            async (step: WaterfallStepContext) => {
                return await step.prompt("textPrompt", "Hello. How are you doing today?");
            },
            async (step: WaterfallStepContext) => {
                const emotion: EmotionScore = step.context.turnState.get("emotionDetection");
                const emotionScore: EmotionScore = topEmotionScore(emotion);
                switch(emotionScore.name) {
                    default:
                        break;
                }
                return await step.endDialog();
            }
        ]));
        this.dialogs.add(new TextPrompt("textPrompt"));
    }
}
