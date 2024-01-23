const fs = require('fs');
const { MessageActionRow, MessageButton, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const path = require("path");
const commands = [];
const commandFolders = fs.readdirSync('../src/commands');

module.exports = {
    async load(client) {
        client.commands = new Collection();
        for (const folder of commandFolders) {
            var commandFiles;
            commandFiles = fs.readdirSync(`../src/commands/${folder}`).filter((file) => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../src/commands/${folder}/${file}`);
                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                    commands.push(command.data.toJSON());
                } else {
                    console.log(`[WARNING] The command at ${folder}/${file} is missing a required "data" or "execute" property.`);
                }
            }
        }
        const rest = new REST({ version: '10' }).setToken(process.env.DISC);
        (async () => {
            try {
                console.log(`[SYS] Started loading ${commands.length} commands.`);
                await rest.put(
                    Routes.applicationCommands(process.env.BOTID),
                    { body: commands },
                );
                console.log(`[SYS] Successfully loaded ${commands.length} commands.`);
            } catch (error) {
                console.error(error);
            }
        })();
    }
};