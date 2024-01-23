const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Claim daily coins.'),
    async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
        let u = await users.get(interaction.user.id);
        if (u) {
            u = JSON.parse(u);
            var currentTime = new Date().getTime();
            var last = new Date(u.lastDaily).getTime();
            var r = last - currentTime;
            var h = Math.floor((r % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var m = Math.floor((r % (1000 * 60 * 60)) / (1000 * 60));
            var s = Math.floor((r % (1000 * 60)) / 1000);
            if ((h <= 0 && m <= 0 && s <= 0) || u.lastDaily == null) {
                u.coins = parseInt(u.coins) + 1000;
                u.lastDaily = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).getTime();
                users.set(interaction.user.id, JSON.stringify(u));
                interaction.reply(`You have received 1000 daily coins.`)
            } else {
                interaction.reply(`You have already received today's coins, come back in ${h} hours ${m} minutes and ${s} seconds.`)
            }
        } else {
            interaction.reply({ content: "You need to have an account to use this.", ephemeral: true })
        }
    },
};
