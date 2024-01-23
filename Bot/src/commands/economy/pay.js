const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Send coins to someone.')
        .addNumberOption(option =>
            option
                .setName('amount')
                .setDescription('How much money you wanna send?')
                .setMinValue(1)
                .setMaxValue(10000)
                .setRequired(true)
        )
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user you want to send money.')
                .setRequired(true)
        ),
    async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
        if (interaction.options.getUser('user').id == interaction.user.id) {
            interaction.reply({ content: "You can not send money to yourself." })
        } else {
            let u = await users.get(interaction.user.id);
            let u2 = await users.get(interaction.options.getUser('user').id);
            if (u) {
                if (u2) {
                    u = JSON.parse(u);
                    u2 = JSON.parse(u2);
                    u.coins = parseInt(u.coins) - parseInt(interaction.options.getNumber('amount'));
                    u2.coins = parseInt(u2.coins) + parseInt(interaction.options.getNumber('amount'));
                    users.set(interaction.user.id, JSON.stringify(u));
                    users.set(interaction.options.getUser('user').id, JSON.stringify(u2));
                    interaction.reply(`You paid ${interaction.options.getNumber('amount')} coins to <@${interaction.options.getUser('user').id}> successfully!`)
                } else {
                    interaction.reply({ content: "This user does not have an account yet.", ephemeral: true })
                }
            } else {
                interaction.reply({ content: "You should have an account to use this.", ephemeral: true })
            }
        }

    },
};