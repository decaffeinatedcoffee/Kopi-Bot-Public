const { SlashCommandBuilder } = require('@discordjs/builders');
const Markov = require('js-markov');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('markovsettings')
        .setDescription('Configure markov chains function (!mv).')
        .addStringOption(option =>
            option
                .setName('action')
                .setDescription('What action do you wanna make?')
                .setRequired(true)
                .setChoices({ name: "Enable", value: "e" }, { name: "Disable", value: "d" }, { name: "Clear", value: "c" })
        ),
    async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
        let a = interaction.options.getString('action').toLowerCase();
        let g = await guilds.get(interaction.guild.id);
        if (interaction.member.permissions.has(["MANAGE_ROLES", "BAN_MEMBERS"])) {
            if (g) {
                g = JSON.parse(g);
                if (a == "e") {
                    if (g.markovEnabled == true) {
                        interaction.reply({ content: "Markov function is already enabled.", ephemeral: true });
                    } else {
                        g.markovEnabled = true;
                        interaction.reply("The markov function was enabled successfully.");
                    }
                } else if (a == "d") {
                    if (g.markovEnabled == false) {
                        interaction.reply({ content: "Markov function is already disabled.", ephemeral: true });
                    } else {
                        g.markovEnabled = false;
                        interaction.reply("The markov function was disabled successfully.");
                    }
                } else if (a == "c") {
                    g.markovDB = []
                    interaction.reply("The markov function words list was cleared successfully.")
                }
                guilds.set(interaction.guild.id, JSON.stringify(g));
            } else {
                interaction.reply({ content: "This guild is not registered yet.", ephemeral: true });
            }
        } else {
            interaction.reply("You do not have permission to use this.")
        }
    },
};
