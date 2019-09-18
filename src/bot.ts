import { TurnContext, ActivityTypes, ConversationState } from "botbuilder";
import { DialogSet, DialogContext, WaterfallDialog, WaterfallStepContext } from "botbuilder-dialogs";
import { topEmotion, topEmotionResult } from "./util";

export class RogersBot {
    public state: ConversationState;
    public dialogs: DialogSet;
    public constructor(state, dialogs) {
        this.state = state;
        this.dialogs = dialogs;
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
}
