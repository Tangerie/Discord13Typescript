import dotenv from 'dotenv';
import fs from "fs";

import { Client, CommandInteraction, Intents, Interaction } from 'discord.js';
import { RegisterCommandsForAllGuilds, RegisterCommandsForGuild, UpdatePermissionsForGuild } from './util/deploycommands';
import Command from './models/command';
import DiscordEvent from './models/discordevent';

//Load .env file
dotenv.config();

//#region Token Checks
if(process.env.DISCORD_TOKEN == undefined || process.env.DISCORD_TOKEN == "") {
    console.error("No Discord Token in .env");
    process.exit();
}
//#endregion

const client = new Client({intents: [Intents.FLAGS.GUILDS] });

//Ensure commands are always updated and such
client.on("roleUpdate", x => {UpdatePermissionsForGuild(x.guild)});
client.on("roleCreate", x => {UpdatePermissionsForGuild(x.guild)});
client.on("roleDelete", x => {UpdatePermissionsForGuild(x.guild)});
client.on("guildCreate", guild => {RegisterCommandsForGuild(guild)});

function RegisterEvents() {
    const files = fs.readdirSync(`${__dirname}/events/discord`).filter(file => file.endsWith(".js"));

    for (const file of files) {
        const event = require(`${__dirname}/events/discord/${file}`) as DiscordEvent;
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}

RegisterEvents();

client.login(process.env.DISCORD_TOKEN);