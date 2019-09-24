import { BotFrameworkAdapter, TurnContext, MemoryStorage, ConversationState } from "botbuilder";
import { DialogSet } from "botbuilder-dialogs";
import * as restify from "restify";
import { EmotionDetection } from "@botbuildercommunity/middleware-watson-nlu";
import { config } from "dotenv";
import { RogersBot } from "./bot";

config();

const server: restify.Server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

const adapter: BotFrameworkAdapter = new BotFrameworkAdapter({ 
    appId: process.env.MICROSOFT_APP_ID, 
    appPassword: process.env.MICROSOFT_APP_PASSWORD 
});

adapter.onTurnError = async (context: TurnContext, error: Error): Promise<void> => {
    console.error(`Sorry, an error has occurred: ${error}`);
    context.sendActivity("Sorry, an error has occurred.");
};

/*
 * This pulls specifically from emotion detection, but you could using entity extraction as well,
 * and pass the emotion scores to the emotion utility methods.
 */
adapter.use(new EmotionDetection(process.env.WATSON_API_KEY, process.env.WATSON_ENDPOINT));

const conversationState: ConversationState = new ConversationState(new MemoryStorage());
const dialogs: DialogSet = new DialogSet(conversationState.createProperty("dialogState"));

const rogers: RogersBot = new RogersBot(conversationState, dialogs);

server.post("/api/messages", (req: restify.Request, res: restify.Response): void => {
    adapter.processActivity(req, res, async (context: TurnContext): Promise<void> => {
        await rogers.onTurn(context);
    });
});
