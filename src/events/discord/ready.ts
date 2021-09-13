import { Client } from "discord.js";
import { RegisterCommandsForAllGuilds } from "../../util/deploycommands";

export const name = 'ready';
export const once = true;
export function execute(client : Client) {
    console.log("Bot Ready");
    
    RegisterCommandsForAllGuilds(client);
}