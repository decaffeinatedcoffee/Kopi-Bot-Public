const { SlashCommandBuilder } = require('@discordjs/builders');
const Keyv = require('keyv');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Works.'),
    async execute(interaction, client, embedColor, users, guilds, months, days, startTimestamp) {
        let u = await users.get(interaction.user.id);
        let g = await guilds.get(interaction.guild.id);
        if (g) {
            g = JSON.parse(g);
        }
        else {
            g = { tax: 0, coins: 0}
        }
        if (u) {
            u = JSON.parse(u);
            var currentTime = new Date().getTime();
            var last = new Date(u.lastWork).getTime();
            var r = last - currentTime;
            var h = Math.floor((r % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var m = Math.floor((r % (1000 * 60 * 60)) / (1000 * 60));
            var s = Math.floor((r % (1000 * 60)) / 1000);
            if ((m <= 0 && s <= 0) || u.lastWork == null) {
                var RandomValue = Math.floor(Math.random() * 100);
                var serverEarns = (g.tax / 100) * RandomValue;
                var userEarns = RandomValue - serverEarns;
                u.coins = parseInt(u.coins) + Math.round(parseInt(userEarns));
                u.lastWork = new Date(new Date().getTime() + 1 * 60 * 60 * 1000).getTime();
                g.coins = parseInt(g.coins) + Math.round(parseInt(serverEarns));
                users.set(interaction.user.id, JSON.stringify(u));
                if(await guilds.get(interaction.guild.id)){
                guilds.set(interaction.guild.id, JSON.stringify(g));
                }
                interaction.reply(`You have worked and earned ${Math.round(RandomValue)} coins, you paid ${g.tax}% of server taxes; ${userEarns} coins were added to your account.`)
            } else {
                interaction.reply(`You are already working, come back in ${m} minutes and ${s} seconds.`)
            }
        } else {
            interaction.reply({ content: "You need to have an account to use this.", ephemeral: true })
        }
    },
};
