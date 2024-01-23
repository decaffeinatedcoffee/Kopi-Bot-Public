const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guildtaxes')
        .setDescription('Set guild work taxes.')
        .addNumberOption(option =>
            option
                .setName('percent')
                .setDescription('The amount from 0 to 100 you want to tax.')
                .setMaxValue(100)
                .setMinValue(0)
                .setRequired(true)
        ),
    async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
        let g = await guilds.get(interaction.guild.id);
        if (g) {
            if (interaction.member.permissions.has(["MANAGE_ROLES", "BAN_MEMBERS"])) {
                g = JSON.parse(g);
                g.tax = interaction.options.getNumber('percent');
                guilds.set(interaction.guild.id, JSON.stringify(g));
                interaction.reply(`The guild taxes were setted to ${interaction.options.getNumber('percent')}% successfully!`)
            } else {
                interaction.reply({ content: "Hey, you can not use this!", ephemeral: true })
            }
        }
        else {
            interaction.reply({ content: "This guild does not have an account.", ephemeral: true })
        }
    },
};