import { RESPONSES } from "./schema";

/*
 * The getResponse() function could route to different concepts, categories, or entities depending on
 * what other middleware is used. Also, you could route to different NLP apps to gather emotion/intent
 * combinations.
 * 
 * This function limits the ability to respond about specifics, but gets the point across.
 */
export function getResponse(emotion: string): string {
    const e: string[] = RESPONSES[emotion];
    if(e == null) {
        return null;
    }
    const random: number = Math.trunc(Math.random() * e.length);
    return e[random];
}
